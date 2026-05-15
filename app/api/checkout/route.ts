import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getAxiomAuthContext } from "../../../lib/axiom-auth";

export const runtime = "nodejs";

type TierSlug = "workflow-audit" | "workflow-blueprint" | "custom-operating-pack";

const tierConfig: Record<
  TierSlug,
  {
    name: string;
    priceEnv: string;
  }
> = {
  "workflow-audit": {
    name: "Workflow Audit",
    priceEnv: "STRIPE_PRICE_WORKFLOW_AUDIT",
  },
  "workflow-blueprint": {
    name: "Workflow Blueprint",
    priceEnv: "STRIPE_PRICE_WORKFLOW_BLUEPRINT",
  },
  "custom-operating-pack": {
    name: "Custom Operating Pack",
    priceEnv: "STRIPE_PRICE_CUSTOM_OPERATING_PACK",
  },
};

function isTierSlug(value: FormDataEntryValue | string | null): value is TierSlug {
  return (
    value === "workflow-audit" ||
    value === "workflow-blueprint" ||
    value === "custom-operating-pack"
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

function getPriceId(tier: TierSlug) {
  const envName = tierConfig[tier].priceEnv;
  const priceId = process.env[envName];

  if (!priceId) {
    throw new Error(`Missing ${envName}`);
  }

  return priceId;
}

function redirectToSignup(request: Request, tier: TierSlug, reason: string) {
  const appUrl = getAppUrl(request);
  return NextResponse.redirect(`${appUrl}/signup?tier=${tier}&account=${reason}`, 303);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const tierValue = formData.get("tier");
  const tier: TierSlug = isTierSlug(tierValue) ? tierValue : "workflow-blueprint";
  const selectedTier = tierConfig[tier];
  const appUrl = getAppUrl(request);
  const { user, customer } = await getAxiomAuthContext();

  if (!user) {
    return redirectToSignup(request, tier, "required");
  }

  if (!customer) {
    return redirectToSignup(request, tier, "customer-required");
  }

  if (!customer.email) {
    return redirectToSignup(request, tier, "email-required");
  }

  try {
    const stripe = getStripeClient();
    const priceId = getPriceId(tier);

    const metadata = {
      tier,
      service_name: selectedTier.name,
      auth_user_id: user.id,
      axiom_customer_id: customer.id,
      customer_name: customer.full_name || user.email || "",
      customer_email: customer.email,
      business_name: customer.business_name || "",
    };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customer.email,
      customer_creation: "always",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata,
      payment_intent_data: {
        metadata,
      },
      success_url: `${appUrl}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/audit?tier=${tier}&checkout=cancelled#tiers`,
      custom_text: {
        submit: {
          message:
            "After payment, your dashboard opens so you can submit your workflow.",
        },
      },
    });

    if (!session.url) {
      throw new Error("Stripe did not return a checkout URL");
    }

    return NextResponse.redirect(session.url, 303);
  } catch (error) {
    console.error("Checkout session creation failed", error);

    return NextResponse.redirect(
      `${appUrl}/audit?tier=${tier}&error=checkout#tiers`,
      303,
    );
  }
}

export function GET(request: Request) {
  const appUrl = getAppUrl(request);

  return NextResponse.redirect(`${appUrl}/pricing`, 303);
}
