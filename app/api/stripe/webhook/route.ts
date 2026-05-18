import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

type ProductSlug =
  | "workflow-audit"
  | "workflow-blueprint"
  | "custom-operating-pack"
  | "workflow-stewardship"
  | "departmental-ecosystem"
  | "architect-residency";

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

function isProductSlug(value: string | null | undefined): value is ProductSlug {
  return (
    value === "workflow-audit" ||
    value === "workflow-blueprint" ||
    value === "custom-operating-pack" ||
    value === "workflow-stewardship" ||
    value === "departmental-ecosystem" ||
    value === "architect-residency"
  );
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

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Database request failed: ${response.status} ${errorText}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
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

  return isProductSlug(tier) ? tier : null;
}

function isAxiomCheckoutSession(session: Stripe.Checkout.Session) {
  const metadata = session.metadata ?? {};
  const productSlug = getCheckoutProductSlug(session);

  return Boolean(
    productSlug &&
      (metadata.tier ||
        metadata.product_slug ||
        metadata.auth_user_id ||
        metadata.axiom_customer_id ||
        metadata.customer_email ||
        metadata.service_name),
  );
}

async function getProductBySlug(slug: ProductSlug) {
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
}: {
  session: Stripe.Checkout.Session;
  customerId: string;
  product: ProductRecord;
}) {
  const serviceName = getMetadataValue(session, "service_name", product.name);
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

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") {
    return;
  }

  const tier = getCheckoutProductSlug(session);

  if (!tier) {
    throw new Error("Checkout session is missing a valid Axiom product slug");
  }

  const product = await getProductBySlug(tier);
  const schema = await getActiveIntakeSchema(product.id);
  const customer = await upsertCustomer(session);
  const order = await upsertOrder({
    session,
    customerId: customer.id,
    product,
  });

  await createWorkflowSlot({
    customerId: customer.id,
    orderId: order.id,
    product,
    schema,
  });
}

export async function POST(request: Request) {
  const stripe = getStripeClient();
  const webhookSecret = getWebhookSecret();
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
    console.error("Stripe webhook handling failed", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
