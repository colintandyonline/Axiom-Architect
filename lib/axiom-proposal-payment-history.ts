import type Stripe from "stripe";
import type { ProposalDraftRecord } from "./axiom-proposal-drafts";
import { getProposalPaymentTerms, getProposalPricing } from "./axiom-proposal-drafts";
import { getStripeServerClient } from "./axiom-stripe-proposal-sync.server";

export type ProposalPaymentStage = "deposit" | "final";

export type ProposalPaymentDocument = {
  stage: ProposalPaymentStage;
  title: string;
  amount: number;
  status: "pending" | "paid" | "not_created";
  invoiceId: string | null;
  paymentIntentId: string | null;
  invoiceUrl: string;
  invoicePdfUrl: string;
  receiptUrl: string;
  requestedAt: string | null;
  paidAt: string | null;
};

type StripeInvoiceLookup = {
  hostedInvoiceUrl?: string;
  invoicePdfUrl?: string;
  receiptUrl?: string;
  paymentIntentId?: string | null;
};

function objectRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function stringField(value: unknown) {
  return typeof value === "string" ? value : "";
}

function firstStripeId(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  const record = objectRecord(value);
  return record && typeof record.id === "string" ? record.id : null;
}

function receiptFromCharge(value: unknown) {
  const record = objectRecord(value);
  return record ? stringField(record.receipt_url) : "";
}

function receiptFromPaymentIntent(value: unknown) {
  const record = objectRecord(value);
  return record ? receiptFromCharge(record.latest_charge) : "";
}

async function fetchReceiptFromPaymentIntent(
  stripe: Stripe,
  paymentIntentId?: string | null,
) {
  if (!paymentIntentId) {
    return "";
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
    expand: ["latest_charge"],
  });

  return receiptFromPaymentIntent(paymentIntent);
}

async function fetchStripeInvoiceLookup(
  invoiceId?: string | null,
  paymentIntentId?: string | null,
): Promise<StripeInvoiceLookup> {
  if (!invoiceId && !paymentIntentId) {
    return {};
  }

  try {
    const stripe = getStripeServerClient();
    let invoicePaymentIntentId = paymentIntentId || null;
    let hostedInvoiceUrl = "";
    let invoicePdfUrl = "";
    let receiptUrl = "";

    if (invoiceId) {
      const invoice = await stripe.invoices.retrieve(invoiceId, {
        expand: ["payment_intent"],
      });
      const invoiceRecord = invoice as unknown as Record<string, unknown>;
      const invoicePaymentIntent = invoiceRecord.payment_intent;

      hostedInvoiceUrl = stringField(invoiceRecord.hosted_invoice_url);
      invoicePdfUrl = stringField(invoiceRecord.invoice_pdf);
      receiptUrl = receiptFromPaymentIntent(invoicePaymentIntent);
      invoicePaymentIntentId = invoicePaymentIntentId || firstStripeId(invoicePaymentIntent);

      if (!receiptUrl) {
        receiptUrl = receiptFromCharge(invoiceRecord.charge);
      }
    }

    if (!receiptUrl) {
      receiptUrl = await fetchReceiptFromPaymentIntent(stripe, invoicePaymentIntentId);
    }

    return {
      hostedInvoiceUrl,
      invoicePdfUrl,
      receiptUrl,
      paymentIntentId: invoicePaymentIntentId,
    };
  } catch (error) {
    console.warn("Proposal Stripe invoice lookup skipped", {
      invoiceId,
      paymentIntentId,
      error: error instanceof Error ? error.message : "Unknown Stripe lookup error",
    });
    return {};
  }
}

export async function loadProposalPaymentDocuments(
  proposal: ProposalDraftRecord,
): Promise<ProposalPaymentDocument[]> {
  const pricing = getProposalPricing(proposal.pricing_json);
  const paymentTerms = getProposalPaymentTerms(proposal.payment_terms_json);
  const depositLookup = await fetchStripeInvoiceLookup(
    proposal.stripe_deposit_invoice_id,
    proposal.stripe_deposit_payment_intent_id,
  );
  const finalLookup = await fetchStripeInvoiceLookup(
    proposal.stripe_final_invoice_id,
    proposal.stripe_final_payment_intent_id,
  );

  return [
    {
      stage: "deposit",
      title: "Deposit payment",
      amount: pricing.deposit_required,
      status: proposal.deposit_paid_at ? "paid" : proposal.stripe_deposit_invoice_id || paymentTerms.deposit_payment_url ? "pending" : "not_created",
      invoiceId: proposal.stripe_deposit_invoice_id,
      paymentIntentId: proposal.stripe_deposit_payment_intent_id || depositLookup.paymentIntentId || null,
      invoiceUrl: paymentTerms.deposit_payment_url || depositLookup.hostedInvoiceUrl || "",
      invoicePdfUrl: paymentTerms.deposit_invoice_pdf || depositLookup.invoicePdfUrl || "",
      receiptUrl: paymentTerms.deposit_receipt_url || depositLookup.receiptUrl || "",
      requestedAt: proposal.accepted_at,
      paidAt: proposal.deposit_paid_at,
    },
    {
      stage: "final",
      title: "Final balance",
      amount: pricing.balance_amount,
      status: proposal.final_balance_paid_at ? "paid" : proposal.stripe_final_invoice_id || paymentTerms.final_payment_url ? "pending" : "not_created",
      invoiceId: proposal.stripe_final_invoice_id,
      paymentIntentId: proposal.stripe_final_payment_intent_id || finalLookup.paymentIntentId || null,
      invoiceUrl: paymentTerms.final_payment_url || finalLookup.hostedInvoiceUrl || "",
      invoicePdfUrl: paymentTerms.final_invoice_pdf || finalLookup.invoicePdfUrl || "",
      receiptUrl: paymentTerms.final_receipt_url || finalLookup.receiptUrl || "",
      requestedAt: proposal.final_balance_requested_at,
      paidAt: proposal.final_balance_paid_at,
    },
  ];
}

export function hasVisibleProposalPaymentDocument(document: ProposalPaymentDocument) {
  return Boolean(document.invoiceUrl || document.invoicePdfUrl || document.receiptUrl || document.invoiceId);
}
