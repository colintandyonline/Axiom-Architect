import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getAxiomAuthContext } from "../../../lib/axiom-auth";

export const runtime = "nodejs";

type ProductSlug =
  | "workflow-audit"
  | "workflow-blueprint"
  | "custom-operating-pack"
  | "workflow-stewardship"
  | "departmental-ecosystem"
  | "architect-residency";

const productConfig: Record<
  ProductSlug,
  {
    name: string;
    priceEnv: string;
    mode: "payment" | "subscription";
  }
> = {
  "workflow-audit": {
    name: "Workflow Audit",
    priceEnv: "STRIPE_PRICE_WORKFLOW_AUDIT",
    mode: "payment",
  },
  "workflow-blueprint": {
    name: "Workflow Blueprint",
    priceEnv: "STRIPE_PRICE_WORKFLOW_BLUEPRINT",
    mode: "payment",
  },
  "custom-operating-pack": {
    name: "Custom Operating Pack",
    priceEnv: "STRIPE_PRICE_CUSTOM_OPERATING_PACK",
    mode: "payment",
  },
  "workflow-stewardship": {
    name: "Workflow Stewardship",
    priceEnv: "STRIPE_PRICE_WORKFLOW_STEWARDSHIP",
    mode: "subscription",
  },
  "departmental-ecosystem": {
    name: "Departmental Ecosystem",
    priceEnv: "STRIPE_PRICE_DEPARTMENTAL_ECOSYSTEM",
    mode: "payment",
  },
  "architect-residency": {
    name: "Axiom Enterprise Architecture System",
    priceEnv: "STRIPE_PRICE_ARCHITECT_RESIDENCY",
    mode: "payment",
  },
};

function isProductSlug(value: FormDataEntryValue | string | null): value is ProductSlug {
  return (
    value === "workflow-audit" ||
    value === "workflow-blueprint" ||
    value === "custom-operating-pack" ||
    value === "workflow-stewardship" ||
    value === "departmental-ecosystem" ||
    value === "architect-residency"
  );
}

function getAppUrl(request: Request) {
  return (
    process.env.APP_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    new URL(request.url).origin
  );
}

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }

  return new Stripe(secretKey);
}

function getPriceId(product: ProductSlug) {
  const envName = productConfig[product].priceEnv;
  const priceId = process.env[envName];

  if (!priceId) {
    throw new Error(`Missing ${envName}`);
  }

  return priceId;
}

function redirectToSignup(request: Request, product: ProductSlug, reason: string) {
  const appUrl = getAppUrl(request);
  return NextResponse.redirect(`${appUrl}/signup?tier=${product}&account=${reason}`, 303);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const tierValue = formData.get("tier");
  const product: ProductSlug = isProductSlug(tierValue) ? tierValue : "workflow-blueprint";
  const selectedProduct = productConfig[product];
  const appUrl = getAppUrl(request);
  const { user, customer } = await getAxiomAuthContext();

  if (!user) {
    return redirectToSignup(request, product, "required");
  }

  if (!customer) {
    return redirectToSignup(request, product, "customer-required");
  }

  if (!customer.email) {
    return redirectToSignup(request, product, "email-required");
  }

  try {
    const stripe = getStripeClient();
    const priceId = getPriceId(product);

    const metadata = {
      tier: product,
      product_slug: product,
      service_name: selectedProduct.name,
      auth_user_id: user.id,
      axiom_customer_id: customer.id,
      customer_name: customer.full_name || user.email || "",
      customer_email: customer.email,
      business_name: customer.business_name || "",
    };

    const baseSessionConfig = {
      mode: selectedProduct.mode,
      customer_email: customer.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata,
      success_url: `${appUrl}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing?tier=${product}&checkout=cancelled`,
      custom_text: {
        submit: {
          message:
            "After checkout, your dashboard opens so you can submit your workflow.",
        },
      },
    } satisfies Stripe.Checkout.SessionCreateParams;

    const session = await stripe.checkout.sessions.create(
      selectedProduct.mode === "subscription"
        ? {
            ...baseSessionConfig,
            mode: "subscription",
            subscription_data: {
              metadata,
            },
          }
        : {
            ...baseSessionConfig,
            mode: "payment",
            customer_creation: "always",
            payment_intent_data: {
              metadata,
            },
          },
    );

    if (!session.url) {
      throw new Error("Stripe did not return a checkout URL");
    }

    return NextResponse.redirect(session.url, 303);
  } catch (error) {
    console.error("Checkout session creation failed", error);

    return NextResponse.redirect(
      `${appUrl}/pricing?tier=${product}&error=checkout`,
      303,
    );
  }
}

export function GET(request: Request) {
  const appUrl = getAppUrl(request);

  return NextResponse.redirect(`${appUrl}/pricing`, 303);
}
