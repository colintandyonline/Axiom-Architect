import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getAxiomAuthContext } from "../../../lib/axiom-auth";
import {
  axiomCheckoutProductSlugs,
  getAxiomPackageByCheckoutSlug,
  type AxiomCheckoutProductSlug,
} from "../../../lib/axiom-package-model";

export const runtime = "nodejs";

const checkoutConfig: Record<
  AxiomCheckoutProductSlug,
  {
    priceEnv: string;
    mode: "payment" | "subscription";
  }
> = {
  "workflow-audit": {
    priceEnv: "STRIPE_PRICE_WORKFLOW_AUDIT",
    mode: "payment",
  },
  "workflow-blueprint": {
    priceEnv: "STRIPE_PRICE_WORKFLOW_BLUEPRINT",
    mode: "payment",
  },
  "custom-operating-pack": {
    priceEnv: "STRIPE_PRICE_CUSTOM_OPERATING_PACK",
    mode: "payment",
  },
  "workflow-stewardship": {
    priceEnv: "STRIPE_PRICE_WORKFLOW_STEWARDSHIP",
    mode: "subscription",
  },
  "departmental-ecosystem": {
    priceEnv: "STRIPE_PRICE_DEPARTMENTAL_ECOSYSTEM",
    mode: "payment",
  },
  "architect-residency": {
    priceEnv: "STRIPE_PRICE_ENTERPRISE_ARCHITECTURE_SYSTEM",
    mode: "payment",
  },
};

function isCheckoutProductSlug(value: FormDataEntryValue | string | null): value is AxiomCheckoutProductSlug {
  return typeof value === "string" && (axiomCheckoutProductSlugs as readonly string[]).includes(value);
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

function getPriceId(product: AxiomCheckoutProductSlug) {
  const envName = checkoutConfig[product].priceEnv;
  const priceId = process.env[envName];

  if (!priceId) {
    throw new Error(`Missing ${envName}`);
  }

  return priceId;
}

function redirectToSignup(request: Request, product: AxiomCheckoutProductSlug, reason: string) {
  const appUrl = getAppUrl(request);
  return NextResponse.redirect(`${appUrl}/signup?tier=${product}&account=${reason}`, 303);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const tierValue = formData.get("tier");
  const product: AxiomCheckoutProductSlug = isCheckoutProductSlug(tierValue) ? tierValue : "workflow-blueprint";
  const selectedCheckout = checkoutConfig[product];
  const selectedPackage = getAxiomPackageByCheckoutSlug(product);
  const appUrl = getAppUrl(request);
  const { user, customer } = await getAxiomAuthContext();

  if (!selectedPackage) {
    return NextResponse.redirect(`${appUrl}/pricing?tier=${product}&error=unknown-package`, 303);
  }

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
      package_key: selectedPackage.key,
      public_slug: selectedPackage.publicSlug,
      report_type: selectedPackage.reportType,
      service_route: selectedPackage.serviceRoute,
      service_name: selectedPackage.name,
      auth_user_id: user.id,
      axiom_customer_id: customer.id,
      customer_name: customer.full_name || user.email || "",
      customer_email: customer.email,
      business_name: customer.business_name || "",
    };

    const baseSessionConfig = {
      mode: selectedCheckout.mode,
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
      selectedCheckout.mode === "subscription"
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
