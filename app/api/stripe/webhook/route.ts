import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

type CustomerRecord = {
  id: string;
};

type OrderRecord = {
  id: string;
};

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
    throw new Error(`Supabase request failed: ${response.status} ${errorText}`);
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

  const customers = await supabaseFetch<CustomerRecord[]>("customers?select=id", {
    method: "POST",
    prefer: "resolution=merge-duplicates,return=representation",
    body: JSON.stringify({
      email,
      full_name: fullName,
      business_name: businessName,
      stripe_customer_id: stripeCustomerId,
      updated_at: new Date().toISOString(),
    }),
  });

  const customer = customers[0];

  if (!customer?.id) {
    throw new Error("Customer upsert did not return an id");
  }

  return customer;
}

async function upsertOrder(session: Stripe.Checkout.Session, customerId: string) {
  const tier = getMetadataValue(session, "tier", "workflow-blueprint");
  const serviceName = getMetadataValue(session, "service_name", "Workflow Blueprint");
  const stripeCustomerId = getSessionString(session, "customer");
  const stripePaymentIntentId = getSessionString(session, "payment_intent");

  const orders = await supabaseFetch<OrderRecord[]>("orders?select=id", {
    method: "POST",
    prefer: "resolution=merge-duplicates,return=representation",
    body: JSON.stringify({
      customer_id: customerId,
      stripe_checkout_session_id: session.id,
      stripe_customer_id: stripeCustomerId,
      stripe_payment_intent_id: stripePaymentIntentId,
      tier_slug: tier,
      service_name: serviceName,
      amount_total: session.amount_total,
      currency: session.currency,
      payment_status: session.payment_status || "paid",
      status: "paid",
      updated_at: new Date().toISOString(),
    }),
  });

  const order = orders[0];

  if (!order?.id) {
    throw new Error("Order upsert did not return an id");
  }

  return {
    order,
    tier,
  };
}

async function createWorkflowSlot({
  customerId,
  orderId,
  tier,
}: {
  customerId: string;
  orderId: string;
  tier: string;
}) {
  await supabaseFetch("workflow_submissions", {
    method: "POST",
    prefer: "resolution=merge-duplicates,return=minimal",
    body: JSON.stringify({
      customer_id: customerId,
      order_id: orderId,
      tier_slug: tier,
      status: "draft",
      updated_at: new Date().toISOString(),
    }),
  });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") {
    return;
  }

  const customer = await upsertCustomer(session);
  const { order, tier } = await upsertOrder(session, customer.id);

  await createWorkflowSlot({
    customerId: customer.id,
    orderId: order.id,
    tier,
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
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook handling failed", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
