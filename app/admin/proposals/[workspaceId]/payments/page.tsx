import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAxiomAdmin } from "../../../../../lib/axiom-admin";
import { formatDate, label } from "../../../../../lib/axiom-admin-dashboard";
import { AdminSection, AdminShell, buttonClass, primaryButtonClass, statusPill } from "../../../../../components/admin/AdminShell";
import {
  formatProposalMoney,
  getProposalPaymentTerms,
  getProposalPricing,
  type ProposalDraftRecord,
} from "../../../../../lib/axiom-proposal-drafts";

export const metadata: Metadata = {
  title: "Proposal Payments | Axiom Architect Admin",
  description: "Create Stripe invoices for Axiom Architect proposals.",
};

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ workspaceId: string }>;
  searchParams?: Promise<{ proposal_action?: string | string[]; result?: string | string[]; message?: string | string[] }>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && serviceRoleKey ? { url: url.replace(/\/$/, ""), serviceRoleKey } : null;
}

async function supabaseFetch<T>(path: string): Promise<T | null> {
  const config = getSupabaseConfig();
  if (!config) return null;

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    cache: "no-store",
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": "application/json",
    },
  });

  const responseText = await response.text();
  if (!response.ok) {
    console.error("Admin proposal payment Supabase request failed", path, responseText);
    return null;
  }

  return responseText ? (JSON.parse(responseText) as T) : ([] as T);
}

async function getProposalDraft(proposalId: string) {
  const records = await supabaseFetch<ProposalDraftRecord[]>(
    `axiom_proposals?select=*&id=eq.${encodeURIComponent(proposalId)}&limit=1`,
  );

  return records?.[0] || null;
}

function ActionBanner({ result, action, message }: { result?: string; action?: string; message?: string }) {
  if (!result) return null;
  const success = result === "success";

  return (
    <section className={`${success ? "border-[#9ed39f]/35 bg-[#9ed39f]/12 text-[#e6f6e7]" : "border-red-400/45 bg-red-950/30 text-red-100"} border p-4 text-sm leading-7`}>
      <strong className="uppercase tracking-[0.12em]">{success ? "Action completed" : "Action failed"}</strong>
      <span className="ml-2">{label(action)}</span>
      {message ? <span className="ml-2">- {message}</span> : null}
    </section>
  );
}

function DetailLine({ labelText, value }: { labelText: string; value: string | null | undefined }) {
  return <p className="text-sm leading-7 text-white/68"><strong className="text-[#9ed39f]">{labelText}:</strong> {value || "—"}</p>;
}

function ProposalActionForm({
  proposalId,
  action,
  labelText,
  primary = false,
  disabled = false,
}: {
  proposalId: string;
  action: string;
  labelText: string;
  primary?: boolean;
  disabled?: boolean;
}) {
  return (
    <form action="/api/admin/proposals/action" method="post">
      <input type="hidden" name="proposal_id" value={proposalId} />
      <input type="hidden" name="action" value={action} />
      <input type="hidden" name="return_to" value={`/admin/proposals/${proposalId}/payments`} />
      <button
        type="submit"
        disabled={disabled}
        className={`${primary ? primaryButtonClass : buttonClass} disabled:cursor-not-allowed disabled:border-white/15 disabled:bg-black disabled:text-white/30`}
      >
        {labelText}
      </button>
    </form>
  );
}

function stripeLinkLabel(url: string) {
  return url ? "Open Stripe invoice" : "No Stripe invoice URL saved";
}

export default async function AdminProposalPaymentsPage({ params, searchParams }: PageProps) {
  const { adminEmail } = await requireAxiomAdmin();
  const { workspaceId } = await params;
  const query = searchParams ? await searchParams : {};
  const proposal = await getProposalDraft(workspaceId);

  if (!proposal) {
    notFound();
  }

  const pricing = getProposalPricing(proposal.pricing_json);
  const paymentTerms = getProposalPaymentTerms(proposal.payment_terms_json);
  const paymentStatus = proposal.payment_status || "unpaid";
  const hasAxiomDepositInvoice = Boolean(proposal.stripe_deposit_invoice_id);
  const hasAxiomFinalInvoice = Boolean(proposal.stripe_final_invoice_id);
  const hasAnyDepositLink = Boolean(proposal.stripe_deposit_invoice_id || paymentTerms.deposit_payment_url);
  const hasAnyFinalLink = Boolean(proposal.stripe_final_invoice_id || paymentTerms.final_payment_url);
  const depositIsRecordedPaid = Boolean(proposal.deposit_paid_at);
  const finalBalanceIsRecordedPaid = Boolean(proposal.final_balance_paid_at);
  const proposalAccepted = proposal.status === "accepted" || Boolean(proposal.accepted_at);
  const canCreateDepositInvoice = proposalAccepted && !depositIsRecordedPaid && !["cancelled", "refunded"].includes(paymentStatus);
  const canCreateFinalInvoice = depositIsRecordedPaid && !finalBalanceIsRecordedPaid && !["cancelled", "refunded"].includes(paymentStatus);

  return (
    <AdminShell
      adminEmail={adminEmail}
      eyebrow="Proposal payments"
      title={proposal.business_name || proposal.workspace_name || proposal.proposal_reference || "Proposal payment setup"}
      intro="Create Stripe invoices from Axiom so proposal metadata is attached automatically and payment webhooks can sync billing state."
      activePath="/admin/proposals"
    >
      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-8">
          <ActionBanner result={firstParam(query.result)} action={firstParam(query.proposal_action)} message={firstParam(query.message)} />

          <div className="flex flex-wrap gap-3">
            <Link href={`/admin/proposals/${proposal.id}`} className={buttonClass}>Back to proposal</Link>
            <Link href="/admin/proposals" className={buttonClass}>Proposal list</Link>
          </div>

          <AdminSection eyebrow="Stripe invoice creation" title="Create payment links automatically">
            <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
              <div className="grid gap-4 text-sm leading-7 text-white/68 sm:grid-cols-2 xl:grid-cols-4">
                <DetailLine labelText="Client" value={proposal.client_name || proposal.client_email} />
                <DetailLine labelText="Business" value={proposal.business_name} />
                <DetailLine labelText="Proposal ID" value={proposal.id} />
                <DetailLine labelText="Customer ID" value={proposal.customer_id} />
                <DetailLine labelText="Final total" value={formatProposalMoney(pricing.final_total)} />
                <DetailLine labelText="Deposit" value={formatProposalMoney(pricing.deposit_required)} />
                <DetailLine labelText="Balance" value={formatProposalMoney(pricing.balance_amount)} />
                <DetailLine labelText="Current status" value={label(paymentStatus)} />
              </div>
              <div className="flex flex-wrap gap-3 lg:max-w-[34rem] lg:justify-end">
                <ProposalActionForm
                  proposalId={proposal.id}
                  action="create_deposit_invoice"
                  labelText={hasAxiomDepositInvoice ? "Replace deposit invoice" : "Create deposit invoice"}
                  primary={canCreateDepositInvoice}
                  disabled={!canCreateDepositInvoice}
                />
                <ProposalActionForm
                  proposalId={proposal.id}
                  action="create_final_invoice"
                  labelText={hasAxiomFinalInvoice ? "Replace final invoice" : "Create final invoice"}
                  primary={canCreateFinalInvoice}
                  disabled={!canCreateFinalInvoice}
                />
              </div>
            </div>
            <p className="mt-5 border border-[#9ed39f]/18 bg-black/34 p-4 text-sm leading-7 text-white/66">
              These buttons create Stripe invoices from Axiom with metadata attached automatically: axiom_proposal_id, axiom_payment_stage, axiom_customer_id, and proposal reference. Existing unpaid links can be replaced when they were created manually or before metadata sync existed. Void old unpaid Stripe invoices manually in Stripe if you no longer want them payable.
            </p>
          </AdminSection>

          <AdminSection eyebrow="Stripe sync state" title="Stored invoice data">
            <div className="grid gap-4 text-sm leading-7 text-white/68 sm:grid-cols-2 xl:grid-cols-4">
              <DetailLine labelText="Stripe customer" value={proposal.stripe_customer_id} />
              <DetailLine labelText="Deposit invoice" value={proposal.stripe_deposit_invoice_id} />
              <DetailLine labelText="Final invoice" value={proposal.stripe_final_invoice_id} />
              <DetailLine labelText="Latest event" value={proposal.stripe_latest_event_type} />
              <DetailLine labelText="Synced at" value={formatDate(proposal.stripe_payment_synced_at)} />
              <DetailLine labelText="Stripe error" value={proposal.stripe_last_error || "No Stripe error"} />
              <DetailLine labelText="Deposit paid" value={formatDate(proposal.deposit_paid_at)} />
              <DetailLine labelText="Final paid" value={formatDate(proposal.final_balance_paid_at)} />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {paymentTerms.deposit_payment_url ? (
                <a href={paymentTerms.deposit_payment_url} target="_blank" rel="noopener noreferrer" className={primaryButtonClass}>{stripeLinkLabel(paymentTerms.deposit_payment_url)}</a>
              ) : null}
              {paymentTerms.final_payment_url ? (
                <a href={paymentTerms.final_payment_url} target="_blank" rel="noopener noreferrer" className={buttonClass}>Open final invoice</a>
              ) : null}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {statusPill(paymentStatus)}
              {statusPill(hasAnyDepositLink ? "deposit link exists" : "deposit link missing")}
              {statusPill(hasAxiomDepositInvoice ? "axiom deposit invoice" : "manual/no deposit invoice")}
              {statusPill(depositIsRecordedPaid ? "deposit recorded paid" : "deposit not recorded")}
              {statusPill(hasAnyFinalLink ? "final link exists" : "final link missing")}
            </div>
          </AdminSection>
        </div>
      </section>
    </AdminShell>
  );
}
