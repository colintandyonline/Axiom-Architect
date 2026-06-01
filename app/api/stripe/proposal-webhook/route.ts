import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  getProposalSyncMetadataFromEvent,
  getStripeObjectIdsFromEvent,
  getStripeServerClient,
  getStripeWebhookSecret,
  markStripePaymentFailed,
  markStripePaymentSucceeded,
} from "../../../../lib/axiom-stripe-proposal-sync.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const successEventTypes = new Set([
  "invoice.paid",
  "invoice.payment_succeeded",
  "checkout.session.completed",
  "payment_intent.succeeded",
]);

const failureEventTypes = new Set([
  "invoice.payment_failed",
  "payment_intent.payment_failed",
]);

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status });
}

function eventErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unable to process Stripe proposal event.";
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature") || "";
  const webhookSecret = getStripeWebhookSecret();

  if (!webhookSecret) {
    return json({ received: false, error: "Stripe proposal webhook secret is not configured." }, 500);
  }

  let event: Stripe.Event;

  try {
    const rawBody = await request.text();
    event = getStripeServerClient().webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    return json({ received: false, error: eventErrorMessage(error) }, 400);
  }

  const { proposalId, paymentStage } = getProposalSyncMetadataFromEvent(event);

  if (!proposalId || !paymentStage) {
    return json({ received: true, ignored: true, reason: "missing_proposal_metadata" });
  }

  const objectIds = getStripeObjectIdsFromEvent(event);

  try {
    if (successEventTypes.has(event.type)) {
      await markStripePaymentSucceeded({
        proposalId,
        paymentStage,
        eventId: event.id,
        eventType: event.type,
        ...objectIds,
        payload: event.data.object,
      });

      return json({ received: true, processed: true, proposalId, paymentStage });
    }

    if (failureEventTypes.has(event.type)) {
      await markStripePaymentFailed({
        proposalId,
        paymentStage,
        eventId: event.id,
        eventType: event.type,
        ...objectIds,
        payload: event.data.object,
      });

      return json({ received: true, processed: true, proposalId, paymentStage });
    }
  } catch (error) {
    console.error("Axiom proposal Stripe event failed", error);
    return json({ received: false, error: eventErrorMessage(error) }, 500);
  }

  return json({ received: true, ignored: true, eventType: event.type });
}
