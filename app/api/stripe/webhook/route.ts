import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  axiomCheckoutProductSlugs,
  getAxiomPackageByCheckoutSlug,
  type AxiomCheckoutProductSlug,
  type AxiomPackageModel,
} from "../../../../lib/axiom-package-model";
import {
  getProposalSyncMetadataFromEvent,
  getStripeObjectIdsFromEvent,
  markStripePaymentFailed,
  markStripePaymentSucceeded,
} from "../../../../lib/axiom-stripe-proposal-sync.server";

export const runtime = "nodejs";

type CustomerRecord = {
  id: string;
};

type ProductRecord = {
  id: string;
  slug: string;
  name: string;
};

type IntakeSchemaRecord = {
  id: string;
  version: number;
};

type OrderRecord = {
  id: string;
};

type WorkspaceRecord = {
  id: string;
};

const proposalPaymentSucceededEvents = new Set([
  "invoice.paid",
  "invoice.payment_succeeded",
  "checkout.session.completed",
  "payment_intent.succeeded",
]);

const proposalPaymentFailedEvents = new Set([
  "invoice.payment_failed",
  "payment_intent.payment_failed",
]);

function isCheckoutProductSlug(value: string | null | undefined): value is AxiomCheckoutProductSlug {
  return typeof value === "string" && (axiomCheckoutProductSlugs as readonly string[]).includes(value);
}

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }

  return new Stripe(secretKey);
}

function getWebhookSecret() {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error("Missing STRIPE_WEBHOOK_SECRET");
  }

  return webhookSecret;
}

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }

  return {
    url: url.replace(/\/$/, ""),
    serviceRoleKey,
  };
}

function classifyWebhookError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown webhook error";

  if (message.includes("Missing STRIPE_SECRET_KEY")) {
    return "missing_stripe_secret_key";
  }

  if (message.includes("Missing STRIPE_WEBHOOK_SECRET")) {
    return "missing_stripe_webhook_secret";
  }

  if (message.includes("Missing NEXT_PUBLIC_SUPABASE_URL")) {
    return "missing_supabase_url";
  }

  if (message.includes("Missing SUPABASE_SERVICE_ROLE_KEY")) {
    return "missing_supabase_service_role_key";
  }

  if (message.includes("No active product found")) {
    return "missing_active_product";
  }

  if (message.includes("No active intake schema found")) {
    return "missing_active_intake_schema";
  }

  if (message.includes("missing a valid Axiom product slug")) {
    return "missing_valid_product_slug";
  }

  if (message.includes("No canonical package found")) {
    return "missing_canonical_package";
  }

  if (message.includes("missing customer email")) {
    return "missing_customer_email";
  }

  if (message.includes("Customer upsert did not return")) {
    return "customer_upsert_failed";
  }

  if (message.includes("Order upsert did not return")) {
    return "order_upsert_failed";
  }

  if (message.includes("Database request failed")) {
    return "database_request_failed";
  }

  if (message.includes("Unexpected end of JSON input")) {
    return "empty_database_response";
  }

  return "webhook_handler_failed";
}

async function supabaseFetch<T>(
  path: string,
  options: RequestInit & { prefer?: string } = {},
): Promise<T> {
  const { url, serviceRoleKey } = getSupabaseConfig();
  const headers = new Headers(options.headers);

  headers.set("apikey", serviceRoleKey);
  headers.set("Authorization", `Bearer ${serviceRoleKey}`);
  headers.set("Content-Type", "application/json");

  if (options.prefer) {
    headers.set("Prefer", options.prefer);
  }

  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers,
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`Database request failed: ${response.status} ${responseText}`);
  }

  if (!responseText) {
    return undefined as T;
  }

  return JSON.parse(responseText) as T;
}

function getSessionString(
  session: Stripe.Checkout.Session,
  key: keyof Stripe.Checkout.Session,
) {
  const value = session[key];
  return typeof value === "string" ? value : null;
}

function getMetadataValue(
  session: Stripe.Checkout.Session,
  key: string,
  fallback = "",
) {
  const value = session.metadata?.[key];
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function getCheckoutProductSlug(session: Stripe.Checkout.Session) {
  const tier = getMetadataValue(session, "tier") || getMetadataValue(session, "product_slug");

  return isCheckoutProductSlug(tier) ? tier : null;
}

function isAxiomCheckoutSession(session: Stripe.Checkout.Session) {
  const metadata = session.metadata ?? {};
  const productSlug = getCheckoutProductSlug(session);

  return Boolean(
    productSlug &&
      (metadata.tier ||
        metadata.product_slug ||
        metadata.package_key ||
        metadata.public_slug ||
        metadata.report_type ||
        metadata.service_route ||
        metadata.auth_user_id ||
        metadata.axiom_customer_id ||
        metadata.customer_email ||
        metadata.service_name),
  );
}

async function getProductBySlug(slug: AxiomCheckoutProductSlug) {
  const products = await supabaseFetch<ProductRecord[]>(
    `axiom_products?select=id,slug,name&slug=eq.${encodeURIComponent(slug)}&active=eq.true&limit=1`,
  );

  const product = products[0];

  if (!product?.id) {
    throw new Error(`No active product found for slug: ${slug}`);
  }

  return product;
}

async function getActiveIntakeSchema(productId: string) {
  const schemas = await supabaseFetch<IntakeSchemaRecord[]>(
    `axiom_product_intake_schemas?select=id,version&product_id=eq.${encodeURIComponent(productId)}&active=eq.true&limit=1`,
  );

  const schema = schemas[0];

  if (!schema?.id) {
    throw new Error(`No active intake schema found for product: ${productId}`);
  }

  return schema;
}

async function upsertCustomer(session: Stripe.Checkout.Session) {
  const email =
    session.customer_details?.email ||
    getMetadataValue(session, "customer_email") ||
    session.customer_email ||
    "";

  if (!email) {
    throw new Error("Checkout session is missing customer email");
  }

  const fullName =
    session.customer_details?.name || getMetadataValue(session, "customer_name") || null;
  const businessName = getMetadataValue(session, "business_name") || null;
  const stripeCustomerId = getSessionString(session, "customer");

  const customers = await supabaseFetch<CustomerRecord[]>(
    "axiom_customers?select=id&on_conflict=email",
    {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=representation",
      body: JSON.stringify({
        email,
        full_name: fullName,
        business_name: businessName,
        stripe_customer_id: stripeCustomerId,
        updated_at: new Date().toISOString(),
      }),
    },
  );

  const customer = customers[0];

  if (!customer?.id) {
    throw new Error("Customer upsert did not return an id");
  }

  return customer;
}

async function upsertOrder({
  session,
  customerId,
  product,
  packageModel,
}: {
  session: Stripe.Checkout.Session;
  customerId: string;
  product: ProductRecord;
  packageModel: AxiomPackageModel;
}) {
  const serviceName = getMetadataValue(session, "service_name", packageModel.name || product.name);
  const stripeCustomerId = getSessionString(session, "customer");
  const stripePaymentIntentId = getSessionString(session, "payment_intent");

  const orders = await supabaseFetch<OrderRecord[]>(
    "axiom_orders?select=id&on_conflict=stripe_checkout_session_id",
    {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=representation",
      body: JSON.stringify({
        customer_id: customerId,
        product_id: product.id,
        stripe_checkout_session_id: session.id,
        stripe_customer_id: stripeCustomerId,
        stripe_payment_intent_id: stripePaymentIntentId,
        tier_slug: product.slug,
        service_name: serviceName,
        amount_total: session.amount_total,
        currency: session.currency,
        payment_status: session.payment_status || "paid",
        status: "paid",
        updated_at: new Date().toISOString(),
      }),
    },
  );

  const order = orders[0];

  if (!order?.id) {
    throw new Error("Order upsert did not return an id");
  }

  return order;
}

async function createWorkflowSlot({
  customerId,
  orderId,
  product,
  schema,
}: {
  customerId: string;
  orderId: string;
  product: ProductRecord;
  schema: IntakeSchemaRecord;
}) {
  await supabaseFetch("axiom_workflow_submissions?on_conflict=order_id", {
    method: "POST",
    prefer: "resolution=merge-duplicates,return=minimal",
    body: JSON.stringify({
      customer_id: customerId,
      order_id: orderId,
      product_id: product.id,
      intake_schema_id: schema.id,
      intake_schema_version: schema.version,
      tier_slug: product.slug,
      status: "draft",
      updated_at: new Date().toISOString(),
    }),
  });
}

async function createPackageWorkspaceBridge({
  customerId,
  orderId,
  packageModel,
}: {
  customerId: string;
  orderId: string;
  packageModel: AxiomPackageModel;
}) {
  try {
    const existingWorkspaces = await supabaseFetch<WorkspaceRecord[]>(
      `axiom_client_workspaces?select=id&order_id=eq.${encodeURIComponent(orderId)}&limit=1`,
    );

    if (existingWorkspaces[0]?.id) {
      return;
    }

    const now = new Date().toISOString();
    const workspaces = await supabaseFetch<WorkspaceRecord[]>(
      "axiom_client_workspaces?select=id",
      {
        method: "POST",
        prefer: "return=representation",
        body: JSON.stringify({
          customer_id: customerId,
          order_id: orderId,
          workspace_name: `${packageModel.name} workspace`,
          workspace_type: "package_client_portal",
          status: "active",
          current_phase: "discovery",
          current_priority: "Complete the workflow intake",
          next_client_action: "Complete your workflow intake so Axiom Architect can prepare the right output.",
          axiom_review_focus: packageModel.shortDescription,
          last_activity_at: now,
          updated_at: now,
        }),
      },
    );

    const workspace = workspaces[0];

    if (!workspace?.id) {
      return;
    }

    await supabaseFetch("axiom_workspace_activity", {
      method: "POST",
      prefer: "return=minimal",
      body: JSON.stringify({
        workspace_id: workspace.id,
        customer_id: customerId,
        actor_type: "system",
        actor_label: "Axiom Architect",
        activity_type: "package_workspace_created",
        title: `${packageModel.name} workspace opened`,
        body: "Your private workspace has been prepared for intake, updates, and deliverables.",
        metadata: {
          order_id: orderId,
          package_key: packageModel.key,
          checkout_slug: packageModel.checkoutSlug,
          public_slug: packageModel.publicSlug,
          report_type: packageModel.reportType,
          service_route: packageModel.serviceRoute,
        },
        is_client_visible: true,
      }),
    });
  } catch (error) {
    console.warn("Package workspace bridge skipped", {
      orderId,
      packageKey: packageModel.key,
      error,
    });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") {
    return;
  }

  const tier = getCheckoutProductSlug(session);

  if (!tier) {
    throw new Error("Checkout session is missing a valid Axiom product slug");
  }

  const packageModel = getAxiomPackageByCheckoutSlug(tier);

  if (!packageModel) {
    throw new Error(`No canonical package found for slug: ${tier}`);
  }

  const product = await getProductBySlug(tier);
  const schema = await getActiveIntakeSchema(product.id);
  const customer = await upsertCustomer(session);
  const order = await upsertOrder({
    session,
    customerId: customer.id,
    product,
    packageModel,
  });

  await createWorkflowSlot({
    customerId: customer.id,
    orderId: order.id,
    product,
    schema,
  });

  await createPackageWorkspaceBridge({
    customerId: customer.id,
    orderId: order.id,
    packageModel,
  });
}

async function handleProposalPaymentEvent(event: Stripe.Event) {
  const { proposalId, paymentStage } = getProposalSyncMetadataFromEvent(event);

  if (!proposalId || !paymentStage) {
    return false;
  }

  const objectIds = getStripeObjectIdsFromEvent(event);

  if (proposalPaymentSucceededEvents.has(event.type)) {
    await markStripePaymentSucceeded({
      proposalId,
      paymentStage,
      eventId: event.id,
      eventType: event.type,
      ...objectIds,
      payload: event.data.object,
    });
    return true;
  }

  if (proposalPaymentFailedEvents.has(event.type)) {
    await markStripePaymentFailed({
      proposalId,
      paymentStage,
      eventId: event.id,
      eventType: event.type,
      ...objectIds,
      payload: event.data.object,
    });
    return true;
  }

  return false;
}

export async function POST(request: Request) {
  let stripe: Stripe;
  let webhookSecret: string;

  try {
    stripe = getStripeClient();
    webhookSecret = getWebhookSecret();
  } catch (error) {
    const code = classifyWebhookError(error);

    console.error("Stripe webhook setup failed", { code, error });

    return NextResponse.json(
      {
        error: "Webhook setup failed",
        code,
      },
      { status: 500 },
    );
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    const proposalPaymentProcessed = await handleProposalPaymentEvent(event);

    if (proposalPaymentProcessed) {
      return NextResponse.json({ received: true, processed: "proposal_payment" });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      if (!isAxiomCheckoutSession(session)) {
        console.warn("Ignoring non-Axiom checkout.session.completed event", {
          eventId: event.id,
          sessionId: session.id,
        });

        return NextResponse.json({ received: true, ignored: true });
      }

      await handleCheckoutCompleted(session);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const code = classifyWebhookError(error);

    console.error("Stripe webhook handling failed", { code, error });

    return NextResponse.json(
      {
        error: "Webhook handler failed",
        code,
      },
      { status: 500 },
    );
  }
}
