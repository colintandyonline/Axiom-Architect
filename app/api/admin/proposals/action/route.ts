import { NextResponse } from "next/server";
import { requireAxiomAdmin } from "../../../../../lib/axiom-admin";
import {
  generateProposalAccessToken,
  hashProposalAccessToken,
  proposalReviewUrl,
} from "../../../../../lib/axiom-proposal-client-access";
import { generateAxiomProposalPdf } from "../../../../../lib/axiom-proposal-pdf.server";
import type { ProposalDraftRecord } from "../../../../../lib/axiom-proposal-drafts";
import { getProposalPaymentTerms } from "../../../../../lib/axiom-proposal-drafts";
import { createStripeProposalInvoice } from "../../../../../lib/axiom-stripe-proposal-invoices.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ProposalAction =
  | "generate_pdf"
  | "regenerate_pdf"
  | "mark_ready_to_send"
  | "mark_internal_review"
  | "send_to_client"
  | "create_deposit_invoice"
  | "create_final_invoice"
  | "mark_deposit_paid"
  | "mark_final_balance_due"
  | "mark_final_balance_paid"
  | "mark_payment_cancelled";

const allowedActions = new Set<ProposalAction>([
  "generate_pdf",
  "regenerate_pdf",
  "mark_ready_to_send",
  "mark_internal_review",
  "send_to_client",
  "create_deposit_invoice",
  "create_final_invoice",
  "mark_deposit_paid",
  "mark_final_balance_due",
  "mark_final_balance_paid",
  "mark_payment_cancelled",
]);
const proposalPdfStorageBucket = "axiom-client-deliverables";

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Missing database environment variables.");
  }

  return {
    url: url.replace(/\/$/, ""),
    serviceRoleKey,
  };
}

function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY environment variable.");
  }

  if (!fromEmail) {
    throw new Error("Missing RESEND_FROM_EMAIL environment variable.");
  }

  return {
    apiKey,
    fromEmail,
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

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (options.prefer) {
    headers.set("Prefer", options.prefer);
  }

  const response = await fetch(`${url}/rest/v1/${path}`, {
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

async function getProposal(proposalId: string) {
  const proposals = await supabaseFetch<ProposalDraftRecord[]>(
    `axiom_proposals?select=*&id=eq.${encodeURIComponent(proposalId)}&limit=1`,
  );

  return proposals[0] ?? null;
}

async function patchProposal(proposalId: string, payload: Record<string, unknown>) {
  await supabaseFetch(`axiom_proposals?id=eq.${encodeURIComponent(proposalId)}`, {
    method: "PATCH",
    prefer: "return=minimal",
    body: JSON.stringify(payload),
  });
}

function storageObjectUrl(objectPath: string) {
  const { url } = getSupabaseConfig();
  const encodedPath = objectPath.split("/").map(encodeURIComponent).join("/");
  return `${url}/storage/v1/object/${proposalPdfStorageBucket}/${encodedPath}`;
}

async function uploadPdfToStorage(pdfBuffer: Buffer, objectPath: string) {
  const { serviceRoleKey } = getSupabaseConfig();
  const response = await fetch(storageObjectUrl(objectPath), {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/pdf",
      "x-upsert": "true",
    },
    body: new Uint8Array(pdfBuffer),
  });
  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`Proposal PDF storage upload failed: ${response.status} ${responseText}`);
  }
}

function cleanInput(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function safeReturnPath(value: string, proposalId: string) {
  const fallback = proposalId ? `/admin/proposals/${proposalId}` : "/admin/proposals";

  if (!value || !value.startsWith("/") || value.startsWith("//") || !value.startsWith("/admin/proposals")) {
    return fallback;
  }

  return value;
}

function redirectBack(request: Request, returnPath: string, action: string, result: "success" | "error", message?: string) {
  const url = new URL(returnPath, request.url);
  url.searchParams.set("proposal_action", action);
  url.searchParams.set("result", result);

  if (message) {
    url.searchParams.set("message", message.slice(0, 180));
  }

  return NextResponse.redirect(url, 303);
}

function appUrl(request: Request) {
  const configuredUrl = process.env.APP_URL?.trim() || process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  return new URL(request.url).origin.replace(/\/$/, "");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function safeFilename(value?: string | null) {
  const baseName = (value || "proposal")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return `${baseName || "proposal"}-proposal.pdf`;
}

function proposalTitle(proposal: ProposalDraftRecord) {
  return proposal.business_name || proposal.workspace_name || proposal.proposal_reference || "Axiom Architect proposal";
}

async function sendProposalDeliveryEmail({
  proposal,
  reviewUrl,
}: {
  proposal: ProposalDraftRecord;
  reviewUrl: string;
}) {
  const { apiKey, fromEmail } = getResendConfig();
  const clientEmail = proposal.client_email?.trim();

  if (!clientEmail) {
    throw new Error("Cannot send proposal because the client email is missing.");
  }

  const title = proposalTitle(proposal);
  const clientName = proposal.client_name?.trim() || proposal.business_name?.trim() || "there";
  const escapedName = escapeHtml(clientName);
  const escapedTitle = escapeHtml(title);
  const escapedReviewUrl = escapeHtml(reviewUrl);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [clientEmail],
      subject: `Axiom Architect proposal: ${title}`,
      html: `
        <div style="font-family:Arial,sans-serif;background:#050805;color:#ffffff;padding:32px;line-height:1.6;">
          <div style="max-width:680px;margin:0 auto;border:1px solid rgba(158,211,159,0.35);padding:28px;background:#030804;">
            <p style="margin:0 0 16px;color:#9ed39f;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">Axiom Architect</p>
            <h1 style="margin:0 0 18px;font-size:30px;line-height:1.05;text-transform:uppercase;letter-spacing:-0.04em;">Your proposal is ready to review.</h1>
            <p style="margin:0 0 18px;color:#dfeee0;">Hi ${escapedName},</p>
            <p style="margin:0 0 18px;color:#dfeee0;">Your Axiom Architect proposal for <strong style="color:#9ed39f;">${escapedTitle}</strong> is ready to review in your secure proposal workspace.</p>
            <p style="margin:0 0 24px;color:#dfeee0;">You can view the proposal summary, download the PDF, confirm acceptance, or request changes. Deposit and payment instructions are shown inside the proposal page where applicable.</p>
            <p style="margin:0 0 24px;">
              <a href="${escapedReviewUrl}" style="display:inline-block;background:#9ed39f;color:#000000;text-decoration:none;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;font-size:12px;padding:14px 18px;">Review proposal</a>
            </p>
            <p style="margin:0;color:#aebbae;font-size:13px;">If the button does not work, copy this secure link into your browser:<br>${escapedReviewUrl}</p>
          </div>
        </div>
      `,
      text: `Hi ${clientName},\n\nYour Axiom Architect proposal for ${title} is ready to review.\n\nOpen your secure proposal page here: ${reviewUrl}\n\nYou can view the summary, download the PDF, accept the proposal, or request changes. Deposit and payment instructions are shown inside the proposal page where applicable.`,
    }),
  });
  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`Resend delivery failed: ${response.status} ${responseText}`);
  }
}

async function generateProposalPdf(proposalId: string) {
  const proposal = await getProposal(proposalId);

  if (!proposal) {
    throw new Error("Proposal draft not found.");
  }

  const now = new Date().toISOString();
  const customerId = proposal.customer_id || "unassigned";
  const pdfBuffer = await generateAxiomProposalPdf(proposal);
  const objectPath = `proposals/${customerId}/${proposal.id}/${Date.now()}-${safeFilename(proposal.workspace_name)}`;

  await uploadPdfToStorage(pdfBuffer, objectPath);

  await patchProposal(proposal.id, {
    pdf_file_path: objectPath,
    pdf_ready: true,
    pdf_generated_at: now,
    proposal_json: {
      generated_from: "admin_proposal_draft",
      pdf_generated_at: now,
      proposal_reference: proposal.proposal_reference,
      workspace_name: proposal.workspace_name,
      recommended_service_route: proposal.recommended_service_route,
      valid_until: proposal.valid_until,
      pricing_json: {
        ...(proposal.pricing_json && typeof proposal.pricing_json === "object" && !Array.isArray(proposal.pricing_json)
          ? proposal.pricing_json
          : {}),
        currency: "USD",
      },
    },
    updated_at: now,
  });
}

async function sendProposalToClient(request: Request, proposalId: string) {
  const proposal = await getProposal(proposalId);

  if (!proposal) {
    throw new Error("Proposal draft not found.");
  }

  if (proposal.status !== "ready_to_send") {
    throw new Error("Only ready-to-send proposals can be sent to clients.");
  }

  if (proposal.pdf_ready !== true || !proposal.pdf_file_path) {
    throw new Error("Generate the proposal PDF before sending it to the client.");
  }

  if (!proposal.client_email?.trim()) {
    throw new Error("Add a client email before sending the proposal.");
  }

  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const token = generateProposalAccessToken();
  const tokenHash = hashProposalAccessToken(token);
  const reviewUrl = proposalReviewUrl({
    appUrl: appUrl(request),
    proposalId: proposal.id,
    token,
  });

  await patchProposal(proposal.id, {
    client_access_token_hash: tokenHash,
    client_access_token_created_at: now,
    client_access_token_last_used_at: null,
    client_access_expires_at: expiresAt,
    status: "sent",
    sent_at: now,
    updated_at: now,
  });

  try {
    await sendProposalDeliveryEmail({
      proposal,
      reviewUrl,
    });
  } catch (error) {
    await patchProposal(proposal.id, {
      client_access_token_hash: null,
      client_access_token_created_at: null,
      client_access_token_last_used_at: null,
      client_access_expires_at: null,
      status: "ready_to_send",
      sent_at: null,
      updated_at: new Date().toISOString(),
    });
    throw error;
  }
}

async function createProposalInvoice(proposalId: string, stage: "deposit" | "final") {
  const proposal = await getProposal(proposalId);

  if (!proposal) {
    throw new Error("Proposal draft not found.");
  }

  const paymentStatus = proposal.payment_status || "unpaid";
  const accepted = proposal.status === "accepted" || Boolean(proposal.accepted_at);

  if (paymentStatus === "cancelled" || paymentStatus === "refunded") {
    throw new Error("Cannot create a Stripe invoice for a cancelled or refunded proposal.");
  }

  if (stage === "deposit") {
    if (!accepted) {
      throw new Error("The proposal must be accepted before creating a deposit invoice.");
    }

    if (proposal.deposit_paid_at) {
      throw new Error("The deposit is already recorded as paid.");
    }
  }

  if (stage === "final") {
    if (!proposal.deposit_paid_at) {
      throw new Error("Record the deposit payment before creating a final balance invoice.");
    }

    if (proposal.final_balance_paid_at) {
      throw new Error("The final balance is already recorded as paid.");
    }
  }

  const invoice = await createStripeProposalInvoice(proposal, stage);
  const now = new Date().toISOString();
  const paymentTerms = getProposalPaymentTerms(proposal.payment_terms_json);
  const paymentTermsJson = {
    ...(proposal.payment_terms_json && typeof proposal.payment_terms_json === "object" && !Array.isArray(proposal.payment_terms_json)
      ? proposal.payment_terms_json
      : {}),
    deposit_payment_url: stage === "deposit" ? invoice.hosted_invoice_url : paymentTerms.deposit_payment_url,
    final_payment_url: stage === "final" ? invoice.hosted_invoice_url : paymentTerms.final_payment_url,
    payment_instructions: paymentTerms.payment_instructions,
    payment_schedule: paymentTerms.payment_schedule,
    deposit_required: paymentTerms.deposit_required,
    payment_status_note: stage === "deposit"
      ? "Deposit invoice created by Axiom Architect. Stripe will update payment status when paid."
      : "Final balance invoice created by Axiom Architect. Stripe will update payment status when paid.",
  };

  await patchProposal(proposal.id, {
    stripe_customer_id: invoice.stripe_customer_id,
    stripe_deposit_invoice_id: stage === "deposit" ? invoice.stripe_invoice_id : proposal.stripe_deposit_invoice_id,
    stripe_final_invoice_id: stage === "final" ? invoice.stripe_invoice_id : proposal.stripe_final_invoice_id,
    payment_status: stage === "deposit" ? "deposit_pending" : "final_balance_due",
    final_balance_requested_at: stage === "final" ? now : proposal.final_balance_requested_at,
    payment_terms_json: paymentTermsJson,
    stripe_last_error: null,
    updated_at: now,
  });
}

export async function POST(request: Request) {
  await requireAxiomAdmin();

  const formData = await request.formData();
  const proposalId = cleanInput(formData.get("proposal_id"));
  const action = cleanInput(formData.get("action"));
  const returnPath = safeReturnPath(cleanInput(formData.get("return_to")), proposalId);

  if (!proposalId || !allowedActions.has(action as ProposalAction)) {
    return redirectBack(request, returnPath, action || "unknown", "error", "Invalid proposal action.");
  }

  try {
    const now = new Date().toISOString();

    if (action === "generate_pdf" || action === "regenerate_pdf") {
      await generateProposalPdf(proposalId);
      return redirectBack(request, returnPath, action, "success", "Proposal PDF generated.");
    }

    if (action === "mark_internal_review") {
      await patchProposal(proposalId, {
        status: "internal_review",
        updated_at: now,
      });
      return redirectBack(request, returnPath, action, "success", "Proposal moved to internal review.");
    }

    if (action === "mark_ready_to_send") {
      const proposal = await getProposal(proposalId);

      if (!proposal?.pdf_ready) {
        throw new Error("Generate the proposal PDF before marking it ready to send.");
      }

      await patchProposal(proposalId, {
        status: "ready_to_send",
        updated_at: now,
      });
      return redirectBack(request, returnPath, action, "success", "Proposal marked ready to send.");
    }

    if (action === "send_to_client") {
      await sendProposalToClient(request, proposalId);
      return redirectBack(request, returnPath, action, "success", "Proposal sent to the client.");
    }

    if (action === "create_deposit_invoice") {
      await createProposalInvoice(proposalId, "deposit");
      return redirectBack(request, returnPath, action, "success", "Stripe deposit invoice created and attached.");
    }

    if (action === "create_final_invoice") {
      await createProposalInvoice(proposalId, "final");
      return redirectBack(request, returnPath, action, "success", "Stripe final balance invoice created and attached.");
    }

    if (action === "mark_deposit_paid") {
      await patchProposal(proposalId, {
        deposit_paid_at: now,
        payment_status: "deposit_paid",
        updated_at: now,
      });
      return redirectBack(request, returnPath, action, "success", "Deposit marked as paid.");
    }

    if (action === "mark_final_balance_due") {
      await patchProposal(proposalId, {
        final_balance_requested_at: now,
        payment_status: "final_balance_due",
        updated_at: now,
      });
      return redirectBack(request, returnPath, action, "success", "Final balance marked as due.");
    }

    if (action === "mark_final_balance_paid") {
      await patchProposal(proposalId, {
        final_balance_paid_at: now,
        payment_status: "paid_complete",
        updated_at: now,
      });
      return redirectBack(request, returnPath, action, "success", "Final balance marked as paid.");
    }

    if (action === "mark_payment_cancelled") {
      await patchProposal(proposalId, {
        payment_status: "cancelled",
        updated_at: now,
      });
      return redirectBack(request, returnPath, action, "success", "Payment marked as cancelled.");
    }

    return redirectBack(request, returnPath, action, "error", "Unsupported proposal action.");
  } catch (error) {
    console.error("Admin proposal action failed", error);
    return redirectBack(
      request,
      returnPath,
      action,
      "error",
      error instanceof Error ? error.message : "Unknown proposal action error.",
    );
  }
}

export function GET(request: Request) {
  return NextResponse.redirect(new URL("/admin/proposals", request.url), 303);
}
