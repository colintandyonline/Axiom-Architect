import { NextResponse } from "next/server";
import Stripe from "stripe";

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

function isTierSlug(value: FormDataEntryValue | null): value is TierSlug {
  return (
    value === "workflow-audit" ||
    value === "workflow-blueprint" ||
    value === "custom-operating-pack"
  );
}

function cleanField(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
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

export async function POST(request: Request) {
  const formData = await request.formData();
  const tierValue = formData.get("tier");
  const tier: TierSlug = isTierSlug(tierValue) ? tierValue : "workflow-blueprint";
  const selectedTier = tierConfig[tier];
  const name = cleanField(formData.get("name"));
  const email = cleanField(formData.get("email"));
  const business = cleanField(formData.get("business"));
  const appUrl = getAppUrl(request);

  if (!email) {
    return NextResponse.redirect(
      `${appUrl}/signup?tier=${tier}&error=missing-email`,
      303,
    );
  }

  try {
    const stripe = getStripeClient();
    const priceId = getPriceId(tier);

    const metadata = {
      tier,
      service_name: selectedTier.name,
      customer_name: name,
      customer_email: email,
      business_name: business,
    };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
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
      cancel_url: `${appUrl}/signup?tier=${tier}&checkout=cancelled`,
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
      `${appUrl}/signup?tier=${tier}&error=checkout`,
      303,
    );
  }
}

export function GET(request: Request) {
  const appUrl = getAppUrl(request);

  return NextResponse.redirect(`${appUrl}/audit#tiers`, 303);
}
