import Stripe from "stripe";
import { getProposalPricing } from "./axiom-proposal-drafts";

const proposalPaymentStatuses = new Set([
  "unpaid",
  "deposit_pending",
  "deposit_paid",
  "final_balance_due",
  "paid_complete",
  "refunded",
  "cancelled",
]);

type StripeProposalStage = "deposit" | "final";

type ProposalSyncInput = {
  proposalId: string;
  paymentStage: StripeProposalStage;
  eventId: string;
  eventType: string;
  stripeCustomerId?: string | null;
  stripeInvoiceId?: string | null;
  stripePaymentIntentId?: string | null;
  payload?: unknown;
};

type ProposalPaymentRecord = {
  payment_status: string | null;
  pricing_json: unknown;
};

function getSupabaseServiceConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Missing Supabase service environment variables.");
  }

  return {
    url: url.replace(/\/$/, ""),
    serviceRoleKey,
  };
}

function getStripeSecretKey() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY.");
  }

  return secretKey;
}

export function getStripeWebhookSecret() {
  return process.env.STRIPE_WEBHOOK_SECRET || "";
}

export function getStripeServerClient() {
  return new Stripe(getStripeSecretKey());
}

async function supabaseServiceFetch<T>(
  path: string,
  options: RequestInit & { prefer?: string } = {},
): Promise<T> {
  const config = getSupabaseServiceConfig();
  const headers = new Headers(options.headers);

  headers.set("apikey", config.serviceRoleKey);
  headers.set("Authorization", `Bearer ${config.serviceRoleKey}`);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (options.prefer) {
    headers.set("Prefer", options.prefer);
  }

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...options,
    cache: "no-store",
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

function cleanMetadataValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function firstString(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object" && "id" in value && typeof value.id === "string") {
    return value.id;
  }

  return null;
}

function normalisePaymentStage(value: string): StripeProposalStage | null {
  if (value === "deposit" || value === "final") {
    return value;
  }

  if (value === "balance" || value === "final_balance") {
    return "final";
  }

  return null;
}

function metadataFromObject(object: Stripe.Event.Data.Object): Record<string, string> {
  const metadata = "metadata" in object && object.metadata && typeof object.metadata === "object"
    ? object.metadata
    : {};

  return metadata as Record<string, string>;
}

function stripeObjectField(object: Stripe.Event.Data.Object, key: "id" | "payment_intent" | "customer") {
  if (key in object) {
    return firstString(object[key as keyof typeof object]);
  }

  return null;
}

export function getProposalSyncMetadataFromEvent(event: Stripe.Event) {
  const object = event.data.object;
  const metadata = metadataFromObject(object);
  const proposalId = cleanMetadataValue(metadata.axiom_proposal_id);
  const paymentStage = normalisePaymentStage(cleanMetadataValue(metadata.axiom_payment_stage));

  return {
    proposalId,
    paymentStage,
  };
}

export function getStripeObjectIdsFromEvent(event: Stripe.Event) {
  const object = event.data.object;
  const objectId = stripeObjectField(object, "id");
  const paymentIntentId = stripeObjectField(object, "payment_intent");
  const customerId = stripeObjectField(object, "customer");

  return {
    stripeInvoiceId: event.type.startsWith("invoice.") ? objectId : null,
    stripePaymentIntentId: paymentIntentId || (event.type.startsWith("payment_intent.") ? objectId : null),
    stripeCustomerId: customerId,
  };
}

export async function recordStripeEvent(input: ProposalSyncInput) {
  await supabaseServiceFetch("axiom_stripe_events", {
    method: "POST",
    prefer: "resolution=ignore-duplicates,return=minimal",
    body: JSON.stringify({
      id: input.eventId,
      event_type: input.eventType,
      proposal_id: input.proposalId,
      payment_stage: input.paymentStage,
      payload: input.payload || null,
    }),
  });
}

async function getProposalPaymentStatus(proposalId: string) {
  const records = await supabaseServiceFetch<Array<ProposalPaymentRecord>>(
    `axiom_proposals?select=payment_status,pricing_json&id=eq.${encodeURIComponent(proposalId)}&limit=1`,
  );

  return records[0] || null;
}

function expectedAmountCents(proposal: ProposalPaymentRecord | null, paymentStage: StripeProposalStage) {
  if (!proposal) {
    return 0;
  }

  const pricing = getProposalPricing(proposal.pricing_json);
  const amount = paymentStage === "deposit" ? pricing.deposit_required : pricing.balance_amount;

  return Math.round(Number(amount || 0) * 100);
}

function numericField(record: Record<string, unknown>, key: string) {
  const value = record[key];

  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function observedStripeAmountCents(payload: unknown) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return 0;
  }

  const record = payload as Record<string, unknown>;
  const candidateAmounts = [
    numericField(record, "amount_paid"),
    numericField(record, "amount_received"),
    numericField(record, "amount_total"),
    numericField(record, "total"),
    numericField(record, "amount_due"),
    numericField(record, "amount"),
  ];

  return Math.max(...candidateAmounts);
}

async function markStripePaymentIgnored(input: ProposalSyncInput & { errorMessage: string }) {
  const now = new Date().toISOString();

  await supabaseServiceFetch(`axiom_proposals?id=eq.${encodeURIComponent(input.proposalId)}`, {
    method: "PATCH",
    prefer: "return=minimal",
    body: JSON.stringify({
      stripe_customer_id: input.stripeCustomerId || undefined,
      stripe_latest_event_id: input.eventId,
      stripe_latest_event_type: input.eventType,
      stripe_payment_synced_at: now,
      stripe_last_error: input.errorMessage,
      updated_at: now,
    }),
  });
}

export async function markStripePaymentSucceeded(input: ProposalSyncInput) {
  await recordStripeEvent(input);

  const now = new Date().toISOString();
  const proposalPayment = await getProposalPaymentStatus(input.proposalId);
  const expectedAmount = expectedAmountCents(proposalPayment, input.paymentStage);
  const observedAmount = observedStripeAmountCents(input.payload);

  if (expectedAmount <= 0) {
    await markStripePaymentIgnored({
      ...input,
      errorMessage: "Stripe payment event ignored because the proposal expected amount is zero or missing.",
    });
    return;
  }

  if (observedAmount < expectedAmount) {
    await markStripePaymentIgnored({
      ...input,
      errorMessage: "Stripe payment event ignored because the paid amount was lower than the proposal payment amount.",
    });
    return;
  }

  const currentPaymentStatus = proposalPayment?.payment_status || null;
  const payload: Record<string, unknown> = {
    stripe_customer_id: input.stripeCustomerId || undefined,
    stripe_latest_event_id: input.eventId,
    stripe_latest_event_type: input.eventType,
    stripe_payment_synced_at: now,
    stripe_last_error: null,
    updated_at: now,
  };

  if (input.paymentStage === "deposit") {
    payload.deposit_paid_at = now;
    payload.payment_status = currentPaymentStatus === "final_balance_due" || currentPaymentStatus === "paid_complete"
      ? currentPaymentStatus
      : "deposit_paid";
    payload.stripe_deposit_invoice_id = input.stripeInvoiceId || undefined;
    payload.stripe_deposit_payment_intent_id = input.stripePaymentIntentId || undefined;
  }

  if (input.paymentStage === "final") {
    payload.final_balance_paid_at = now;
    payload.payment_status = "paid_complete";
    payload.stripe_final_invoice_id = input.stripeInvoiceId || undefined;
    payload.stripe_final_payment_intent_id = input.stripePaymentIntentId || undefined;
  }

  await supabaseServiceFetch(`axiom_proposals?id=eq.${encodeURIComponent(input.proposalId)}`, {
    method: "PATCH",
    prefer: "return=minimal",
    body: JSON.stringify(payload),
  });
}

export async function markStripePaymentFailed(input: ProposalSyncInput & { errorMessage?: string }) {
  await recordStripeEvent(input);

  const now = new Date().toISOString();
  const paymentStatus = input.paymentStage === "deposit" ? "deposit_pending" : "final_balance_due";

  if (!proposalPaymentStatuses.has(paymentStatus)) {
    return;
  }

  await supabaseServiceFetch(`axiom_proposals?id=eq.${encodeURIComponent(input.proposalId)}`, {
    method: "PATCH",
    prefer: "return=minimal",
    body: JSON.stringify({
      payment_status: paymentStatus,
      stripe_customer_id: input.stripeCustomerId || undefined,
      stripe_latest_event_id: input.eventId,
      stripe_latest_event_type: input.eventType,
      stripe_payment_synced_at: now,
      stripe_last_error: input.errorMessage || "Stripe reported an unsuccessful payment event.",
      updated_at: now,
    }),
  });
}
