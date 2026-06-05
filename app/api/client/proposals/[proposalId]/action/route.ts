import { NextResponse } from "next/server";
import {
  patchClientProposal,
  validateProposalClientOrAuthenticatedAccess,
} from "../../../../../../lib/axiom-proposal-client.server";
import { getProposalPaymentTerms, getProposalPricing, type ProposalDraftRecord } from "../../../../../../lib/axiom-proposal-drafts";
import { createStripeProposalInvoice } from "../../../../../../lib/axiom-stripe-proposal-invoices.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cleanInput(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function redirectToProposal(request: Request, proposalId: string, token: string, status: string) {
  const url = new URL(`/client/proposals/${encodeURIComponent(proposalId)}`, request.url);

  if (token) {
    url.searchParams.set("token", token);
  }

  url.searchParams.set("proposal", status);
  return NextResponse.redirect(url, 303);
}

function hasDepositInvoice(proposal: ProposalDraftRecord) {
  const paymentTerms = getProposalPaymentTerms(proposal.payment_terms_json);
  return Boolean(proposal.stripe_deposit_invoice_id || paymentTerms.deposit_payment_url);
}

function shouldCreateDepositInvoice(proposal: ProposalDraftRecord) {
  const pricing = getProposalPricing(proposal.pricing_json);
  const status = proposal.payment_status || "unpaid";

  return pricing.deposit_required > 0 &&
    !hasDepositInvoice(proposal) &&
    !["deposit_paid", "final_balance_due", "paid_complete", "cancelled", "refunded"].includes(status);
}

function paymentTermsWithDepositInvoice(proposal: ProposalDraftRecord, depositPaymentUrl: string) {
  const paymentTerms = getProposalPaymentTerms(proposal.payment_terms_json);
  const existingTerms = proposal.payment_terms_json && typeof proposal.payment_terms_json === "object" && !Array.isArray(proposal.payment_terms_json)
    ? proposal.payment_terms_json
    : {};

  return {
    ...existingTerms,
    payment_schedule: paymentTerms.payment_schedule,
    deposit_required: paymentTerms.deposit_required,
    deposit_payment_url: depositPaymentUrl,
    final_payment_url: paymentTerms.final_payment_url,
    payment_instructions: paymentTerms.payment_instructions,
    payment_status_note: "Deposit invoice created automatically after proposal acceptance.",
  };
}

async function acceptProposal(proposal: ProposalDraftRecord, now: string) {
  const payload: Record<string, unknown> = {
    accepted_at: proposal.accepted_at || now,
    status: "accepted",
    updated_at: now,
  };

  if (shouldCreateDepositInvoice(proposal)) {
    const invoice = await createStripeProposalInvoice(proposal, "deposit");
    payload.stripe_customer_id = invoice.stripe_customer_id;
    payload.stripe_deposit_invoice_id = invoice.stripe_invoice_id;
    payload.payment_status = "deposit_pending";
    payload.payment_terms_json = paymentTermsWithDepositInvoice(proposal, invoice.hosted_invoice_url);
    payload.stripe_last_error = null;
  }

  await patchClientProposal(proposal.id, payload);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ proposalId: string }> },
) {
  const { proposalId } = await context.params;
  const formData = await request.formData();
  const token = cleanInput(formData.get("token"));
  const action = cleanInput(formData.get("action"));
  const access = await validateProposalClientOrAuthenticatedAccess(proposalId, token);

  if (access.ok === false) {
    return new NextResponse(access.message, { status: access.status });
  }

  const now = new Date().toISOString();

  if (action === "accept_proposal") {
    await acceptProposal(access.proposal, now);
    return redirectToProposal(request, access.proposal.id, token, "accepted");
  }

  if (action === "request_changes") {
    const message = cleanInput(formData.get("message"));

    if (!message) {
      return redirectToProposal(request, access.proposal.id, token, "missing-message");
    }

    await patchClientProposal(access.proposal.id, {
      changes_requested_at: now,
      change_request_message: message.slice(0, 5000),
      status: "changes_requested",
      updated_at: now,
    });
    return redirectToProposal(request, access.proposal.id, token, "changes-requested");
  }

  return new NextResponse("Unsupported proposal action", { status: 400 });
}
