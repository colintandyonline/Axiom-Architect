import type { Metadata } from "next";
import Link from "next/link";
import { loadClientPortalData } from "../../../lib/axiom-client-portal-data";
import {
  formatProposalCurrency,
  getProposalNextAction,
  loadClientProposals,
  proposalStatusLabel,
} from "../../../lib/axiom-client-proposals";
import {
  hasVisibleProposalPaymentDocument,
  loadProposalPaymentDocuments,
  type ProposalPaymentDocument,
} from "../../../lib/axiom-proposal-payment-history";
import { getProposalPaymentTerms, getProposalPricing } from "../../../lib/axiom-proposal-drafts";

type BillingProposal = Awaited<ReturnType<typeof loadClientProposals>>[number];

export const metadata: Metadata = {
  title: "Billing | Axiom Architect Client Portal",
  description: "Client billing dashboard for proposal payments, invoices, receipts, and payment status.",
};

export const dynamic = "force-dynamic";

function label(value: string | null | undefined) {
  return value ? value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) : "Not set";
}

function date(value: string | null | undefined) {
  if (!value) return "Not recorded";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function invoiceMoney(amount: number | null | undefined, currency: string | null | undefined) {
  if (amount === null || amount === undefined) return "Not set";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency || "USD" }).format(amount / 100);
}

function paymentStateText(value: string | null | undefined) {
  switch (value) {
    case "deposit_paid":
      return "Deposit received";
    case "final_balance_due":
      return "Final balance due";
    case "paid_complete":
      return "Payment complete";
    case "cancelled":
      return "Payment cancelled";
    case "refunded":
      return "Refunded";
    case "deposit_pending":
      return "Deposit pending";
    default:
      return "Awaiting payment";
  }
}

function paymentStateNote(value: string | null | undefined) {
  switch (value) {
    case "deposit_paid":
      return "Deposit has been received. The final balance is not currently due.";
    case "final_balance_due":
      return "The deposit has been received and the final balance is now due.";
    case "paid_complete":
      return "All recorded proposal payments are complete.";
    case "cancelled":
      return "This payment record is currently marked as cancelled.";
    case "refunded":
      return "This payment record is currently marked as refunded.";
    default:
      return "Payment will become available after the proposal is accepted and a payment link is provided.";
  }
}

function documentStatusText(document: ProposalPaymentDocument) {
  if (document.status === "paid") {
    return "Paid";
  }

  if (document.status === "pending") {
    return "Invoice issued";
  }

  return "Not issued";
}

function proposalPaymentState(proposal: BillingProposal) {
  if (proposal.payment_status === "cancelled" || proposal.payment_status === "refunded") {
    return proposal.payment_status;
  }

  if (proposal.final_balance_paid_at) {
    return "paid_complete";
  }

  if (proposal.deposit_paid_at && (proposal.payment_status === "final_balance_due" || proposal.final_balance_requested_at)) {
    return "final_balance_due";
  }

  if (proposal.deposit_paid_at) {
    return "deposit_paid";
  }

  if (proposal.payment_status === "deposit_pending") {
    return "deposit_pending";
  }

  return "unpaid";
}

export default async function ClientPortalBillingPage() {
  const [data, proposals] = await Promise.all([
    loadClientPortalData("/client/billing"),
    loadClientProposals(),
  ]);

  const invoices = data.invoices;
  const proposalDocumentGroups = await Promise.all(
    proposals.map(async (proposal) => ({
      proposal,
      documents: (await loadProposalPaymentDocuments(proposal)).filter(hasVisibleProposalPaymentDocument),
    })),
  );
  const proposalDocuments = proposalDocumentGroups.flatMap((group) =>
    group.documents.map((document) => ({ proposal: group.proposal, document })),
  );
  const latestProposal = proposals[0] ?? null;
  const latestInvoice = invoices[0] ?? null;
  const paidInvoices = invoices.filter((invoice) => invoice.status === "paid");
  const depositReceivedCount = proposals.filter((proposal) => Boolean(proposal.deposit_paid_at)).length;
  const finalBalanceDueCount = proposals.filter((proposal) => proposalPaymentState(proposal) === "final_balance_due").length;
  const paymentCompleteCount = proposals.filter((proposal) => Boolean(proposal.final_balance_paid_at)).length;
  const latestProposalPricing = latestProposal ? getProposalPricing(latestProposal.pricing_json) : null;

  const stats = [
    ["Active proposals", String(proposals.length), "Attached"],
    ["Deposit received", String(depositReceivedCount), "Paid to start"],
    ["Final balance due", String(finalBalanceDueCount), "Awaiting balance"],
    ["Payment complete", String(paymentCompleteCount), "Fully paid"],
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden border-b border-[#9ed39f]/20 bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.16),#031007_34%,#000_78%)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.1)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="relative mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[0.9fr_0.48fr] lg:items-end">
          <div>
            <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">Billing</p>
            <h1 className="mt-6 text-[clamp(2.8rem,5.6vw,5.8rem)] font-black uppercase leading-[0.88] tracking-[-0.08em] text-white">Billing.</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[#e6f6e7]/74 sm:text-lg">
              Proposal payments, invoice history, receipts, and current payment status.
            </p>
          </div>
          <aside className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5">
            <div className="mb-5 flex h-10 w-10 items-center justify-center border border-[#9ed39f] text-[#9ed39f]">$</div>
            <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">
              {latestProposal ? "Current proposal" : "Latest invoice"}
            </p>
            <p className="mt-3 text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-white">
              {latestProposal?.business_name || latestProposal?.workspace_name || latestInvoice?.invoice_number || latestInvoice?.title || "None yet"}
            </p>
            <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72">
              {latestProposal && latestProposalPricing
                ? `${paymentStateText(proposalPaymentState(latestProposal))} · ${formatProposalCurrency(latestProposalPricing.final_total)}`
                : latestInvoice
                  ? `${label(latestInvoice.status)} · ${invoiceMoney(latestInvoice.amount_due, latestInvoice.currency)}`
                  : "No payment is due right now."}
            </p>
          </aside>
        </div>
      </section>

      <section className="bg-[#020904] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(([name, value, text]) => (
            <article key={name} className="border border-[#9ed39f]/30 bg-black p-5">
              <span className="mb-5 flex h-9 w-9 items-center justify-center border border-[#9ed39f]/60 text-[#9ed39f]">▣</span>
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">{name}</p>
              <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.05em] text-white">{value}</h2>
              <p className="mt-4 text-sm leading-6 text-[#e6f6e7]/72">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-black px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-5 border-b border-[#9ed39f]/20 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">Proposal payments</p>
              <h2 className="mt-5 text-[clamp(2rem,4vw,4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">
                {proposals.length ? "Current payment state." : "No proposal payments yet."}
              </h2>
            </div>
            <Link href="/client/proposals" className="inline-flex min-h-12 items-center justify-center border border-[#9ed39f] px-5 text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black">View proposals</Link>
          </div>

          <div className="mt-8 grid gap-4">
            {proposals.length ? proposals.map((proposal) => {
              const pricing = getProposalPricing(proposal.pricing_json);
              const paymentTerms = getProposalPaymentTerms(proposal.payment_terms_json);
              const nextAction = getProposalNextAction(proposal);
              const accepted = proposal.status === "accepted" || Boolean(proposal.accepted_at);
              const paymentState = proposalPaymentState(proposal);
              const isFinalBalanceDue = paymentState === "final_balance_due";
              const isPaymentComplete = paymentState === "paid_complete";

              return (
                <article key={proposal.id} className="grid gap-5 border border-[#9ed39f]/24 bg-[#030804] p-5 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div>
                    <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">{proposalStatusLabel(proposal.status)} · {paymentStateText(paymentState)}</p>
                    <h3 className="mt-3 text-2xl font-black uppercase tracking-[-0.05em] text-white">{proposal.business_name || proposal.workspace_name || "Axiom proposal"}</h3>
                    <div className="mt-4 grid gap-2 text-sm leading-7 text-[#e6f6e7]/70 md:grid-cols-3">
                      <p><strong className="text-[#9ed39f]">Total:</strong> {formatProposalCurrency(pricing.final_total)}</p>
                      <p><strong className="text-[#9ed39f]">Deposit:</strong> {formatProposalCurrency(pricing.deposit_required)}</p>
                      <p><strong className="text-[#9ed39f]">Balance:</strong> {formatProposalCurrency(pricing.balance_amount)}</p>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/62">{paymentStateNote(paymentState)}</p>
                    {proposal.deposit_paid_at ? <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-[#e6f6e7]/56">Deposit received {date(proposal.deposit_paid_at)}</p> : null}
                    {proposal.final_balance_requested_at ? <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-[#e6f6e7]/56">Final balance requested {date(proposal.final_balance_requested_at)}</p> : null}
                    {proposal.final_balance_paid_at ? <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-[#e6f6e7]/56">Final balance paid {date(proposal.final_balance_paid_at)}</p> : null}
                    {paymentTerms.payment_instructions ? <p className="mt-3 border border-[#9ed39f]/16 bg-black/40 p-3 text-sm leading-7 text-[#e6f6e7]/68">{paymentTerms.payment_instructions}</p> : null}
                  </div>
                  <div className="flex flex-col gap-3 lg:min-w-64">
                    <Link href={`/client/proposals/${proposal.id}`} className="inline-flex min-h-11 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-4 text-[0.68rem] font-black uppercase tracking-[0.16em] text-black transition hover:bg-white">View proposal</Link>
                    {accepted && nextAction.external ? (
                      <a href={nextAction.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-4 text-[0.68rem] font-black uppercase tracking-[0.16em] text-black transition hover:bg-white">{nextAction.label}</a>
                    ) : null}
                    {isFinalBalanceDue && !paymentTerms.final_payment_url ? (
                      <p className="text-xs font-semibold leading-6 text-[#e6f6e7]/55">Final balance is due. Payment instructions will be provided separately.</p>
                    ) : null}
                    {isPaymentComplete ? (
                      <p className="border border-[#9ed39f]/20 bg-[#9ed39f]/10 p-3 text-xs font-black uppercase tracking-[0.14em] text-[#9ed39f]">Payment complete</p>
                    ) : null}
                  </div>
                </article>
              );
            }) : (
              <article className="border border-[#9ed39f]/24 bg-[#030804] p-6">
                <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white">No proposal payment is attached yet.</h3>
                <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72">When Axiom sends a proposal to this account, deposit, balance, and payment status will appear here.</p>
              </article>
            )}
          </div>
        </div>
      </section>

      <section className="bg-[#020904] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-5 border-b border-[#9ed39f]/20 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">Invoice and receipt history</p>
              <h2 className="mt-5 text-[clamp(2rem,4vw,4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">{proposalDocuments.length || invoices.length ? "Billing history." : "No invoices or receipts yet."}</h2>
            </div>
            <Link href="/client/deliverables" className="inline-flex min-h-12 items-center justify-center border border-[#9ed39f] px-5 text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black">View deliverables</Link>
          </div>

          <div className="mt-8 grid gap-4">
            {proposalDocuments.map(({ proposal, document }) => (
              <article key={`${proposal.id}-${document.stage}`} className="grid gap-4 border border-[#9ed39f]/24 bg-[#030804] p-5 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">
                    Proposal payment · {documentStatusText(document)} · {formatProposalCurrency(document.amount)}
                  </p>
                  <h3 className="mt-3 text-2xl font-black uppercase tracking-[-0.05em] text-white">
                    {proposal.business_name || proposal.workspace_name || "Axiom proposal"} · {document.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[#e6f6e7]/72">
                    {proposal.proposal_reference || proposal.id}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {document.invoiceUrl ? (
                      <a href={document.invoiceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center justify-center border border-[#9ed39f]/35 px-4 text-[0.66rem] font-black uppercase tracking-[0.14em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black">Open invoice</a>
                    ) : null}
                    {document.invoicePdfUrl ? (
                      <a href={document.invoicePdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center justify-center border border-[#9ed39f]/35 px-4 text-[0.66rem] font-black uppercase tracking-[0.14em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black">Invoice PDF</a>
                    ) : null}
                    {document.receiptUrl ? (
                      <a href={document.receiptUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-4 text-[0.66rem] font-black uppercase tracking-[0.14em] text-black transition hover:bg-white">Receipt</a>
                    ) : null}
                  </div>
                </div>
                <div className="text-left text-xs font-bold uppercase tracking-[0.14em] text-[#e6f6e7]/58 lg:text-right">
                  <p>Stage {document.stage === "deposit" ? "Deposit" : "Final balance"}</p>
                  <p className="mt-2">Issued {date(document.requestedAt)}</p>
                  {document.paidAt ? <p className="mt-2">Paid {date(document.paidAt)}</p> : null}
                </div>
              </article>
            ))}

            {invoices.length ? invoices.map((invoice) => (
              <article key={invoice.id} className="grid gap-4 border border-[#9ed39f]/24 bg-[#030804] p-5 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">{label(invoice.status)} · {invoiceMoney(invoice.amount_due, invoice.currency)}</p>
                  <h3 className="mt-3 text-2xl font-black uppercase tracking-[-0.05em] text-white">{invoice.invoice_number || invoice.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#e6f6e7]/72">{invoice.description || "Billing item for this workspace."}</p>
                </div>
                <div className="text-left text-xs font-bold uppercase tracking-[0.14em] text-[#e6f6e7]/58 lg:text-right">
                  <p>Issued {date(invoice.created_at)}</p>
                  <p className="mt-2">Due {date(invoice.due_at)}</p>
                  {invoice.paid_at && <p className="mt-2">Paid {date(invoice.paid_at)}</p>}
                </div>
              </article>
            )) : null}

            {!proposalDocuments.length && !invoices.length ? (
              <article className="border border-[#9ed39f]/24 bg-[#030804] p-6">
                <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white">No invoices or receipts attached.</h3>
                <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72">Stripe proposal invoices and receipts will appear here after proposal payments are created or received.</p>
              </article>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
