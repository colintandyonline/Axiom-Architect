import type { Metadata } from "next";
import Link from "next/link";
import {
  formatProposalCurrency,
  getProposalNextAction,
  loadClientProposals,
  proposalPaymentLabel,
  proposalStatusLabel,
} from "../../../lib/axiom-client-proposals";
import { getProposalPaymentTerms, getProposalPricing } from "../../../lib/axiom-proposal-drafts";

export const metadata: Metadata = {
  title: "Proposals | Axiom Architect Client Portal",
  description: "Client proposal review, payment status, and proposal PDF access.",
};

export const dynamic = "force-dynamic";

function formatDate(value: string | null | undefined) {
  if (!value) return "Not recorded";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

export default async function ClientProposalsPage() {
  const proposals = await loadClientProposals();
  const latest = proposals[0] ?? null;

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden border-b border-[#9ed39f]/20 bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.16),#031007_34%,#000_78%)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.1)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="relative mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[0.9fr_0.48fr] lg:items-end">
          <div>
            <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">Proposals</p>
            <h1 className="mt-6 text-[clamp(2.8rem,5.6vw,5.8rem)] font-black uppercase leading-[0.88] tracking-[-0.08em] text-white">Proposal workspace.</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[#e6f6e7]/74 sm:text-lg">
              Review active proposals, download proposal PDFs, and follow the next payment or decision step.
            </p>
          </div>
          <aside className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Latest proposal</p>
            <p className="mt-3 text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-white">
              {latest?.business_name || latest?.workspace_name || "None yet"}
            </p>
            <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72">
              {latest ? `${proposalStatusLabel(latest.status)} · ${proposalPaymentLabel(latest.payment_status)}` : "No sent proposals are attached to this account yet."}
            </p>
          </aside>
        </div>
      </section>

      <section className="bg-[#020904] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="border border-[#9ed39f]/30 bg-black p-5">
            <span className="mb-5 flex h-9 w-9 items-center justify-center border border-[#9ed39f]/60 text-[#9ed39f]">▣</span>
            <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Proposals</p>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.05em] text-white">{proposals.length}</h2>
            <p className="mt-4 text-sm leading-6 text-[#e6f6e7]/72">Attached</p>
          </article>
          <article className="border border-[#9ed39f]/30 bg-black p-5">
            <span className="mb-5 flex h-9 w-9 items-center justify-center border border-[#9ed39f]/60 text-[#9ed39f]">▣</span>
            <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Accepted</p>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.05em] text-white">{proposals.filter((proposal) => proposal.status === "accepted" || proposal.accepted_at).length}</h2>
            <p className="mt-4 text-sm leading-6 text-[#e6f6e7]/72">Confirmed</p>
          </article>
          <article className="border border-[#9ed39f]/30 bg-black p-5">
            <span className="mb-5 flex h-9 w-9 items-center justify-center border border-[#9ed39f]/60 text-[#9ed39f]">▣</span>
            <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Deposit</p>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.05em] text-white">{proposals.filter((proposal) => ["deposit_paid", "final_balance_due", "paid_complete"].includes(proposal.payment_status || "")).length}</h2>
            <p className="mt-4 text-sm leading-6 text-[#e6f6e7]/72">Received</p>
          </article>
          <article className="border border-[#9ed39f]/30 bg-black p-5">
            <span className="mb-5 flex h-9 w-9 items-center justify-center border border-[#9ed39f]/60 text-[#9ed39f]">▣</span>
            <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Payment</p>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.05em] text-white">{proposals.filter((proposal) => proposal.payment_status === "paid_complete").length}</h2>
            <p className="mt-4 text-sm leading-6 text-[#e6f6e7]/72">Complete</p>
          </article>
        </div>
      </section>

      <section className="bg-black px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-5 border-b border-[#9ed39f]/20 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">Proposal list</p>
              <h2 className="mt-5 text-[clamp(2rem,4vw,4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">{proposals.length ? "Active proposals." : "No proposals yet."}</h2>
            </div>
            <Link href="/client/billing" className="inline-flex min-h-12 items-center justify-center border border-[#9ed39f] px-5 text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black">View billing</Link>
          </div>

          <div className="mt-8 grid gap-4">
            {proposals.length ? proposals.map((proposal) => {
              const pricing = getProposalPricing(proposal.pricing_json);
              const paymentTerms = getProposalPaymentTerms(proposal.payment_terms_json);
              const nextAction = getProposalNextAction(proposal);
              const accepted = proposal.status === "accepted" || Boolean(proposal.accepted_at);
              const pdfHref = `/api/client/proposals/${proposal.id}/pdf`;

              return (
                <article key={proposal.id} className="grid gap-5 border border-[#9ed39f]/24 bg-[#030804] p-5 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div>
                    <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">{proposalStatusLabel(proposal.status)} · {proposalPaymentLabel(proposal.payment_status)}</p>
                    <h3 className="mt-3 text-2xl font-black uppercase tracking-[-0.05em] text-white">{proposal.business_name || proposal.workspace_name || "Axiom proposal"}</h3>
                    <p className="mt-2 text-sm leading-7 text-[#e6f6e7]/72">{proposal.workspace_name || proposal.recommended_service_route || "Proposal details"}</p>
                    <div className="mt-4 grid gap-2 text-sm leading-7 text-[#e6f6e7]/70 md:grid-cols-3">
                      <p><strong className="text-[#9ed39f]">Total:</strong> {formatProposalCurrency(pricing.final_total)}</p>
                      <p><strong className="text-[#9ed39f]">Deposit:</strong> {formatProposalCurrency(pricing.deposit_required)}</p>
                      <p><strong className="text-[#9ed39f]">Balance:</strong> {formatProposalCurrency(pricing.balance_amount)}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 lg:min-w-64">
                    <Link href={`/client/proposals/${proposal.id}`} className="inline-flex min-h-11 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-4 text-[0.68rem] font-black uppercase tracking-[0.16em] text-black transition hover:bg-white">View proposal</Link>
                    <a href={pdfHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center border border-[#9ed39f]/40 px-4 text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black">Download PDF</a>
                    {accepted && nextAction.external ? (
                      <a href={nextAction.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-4 text-[0.68rem] font-black uppercase tracking-[0.16em] text-black transition hover:bg-white">{nextAction.label}</a>
                    ) : null}
                    {accepted && !paymentTerms.deposit_payment_url && !paymentTerms.final_payment_url ? (
                      <p className="text-xs font-semibold leading-6 text-[#e6f6e7]/55">Payment instructions will be provided separately.</p>
                    ) : null}
                    <p className="text-xs font-semibold leading-6 text-[#e6f6e7]/55">Valid until {formatDate(proposal.valid_until)}</p>
                  </div>
                </article>
              );
            }) : (
              <article className="border border-[#9ed39f]/24 bg-[#030804] p-6">
                <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white">No proposal is attached yet.</h3>
                <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72">When Axiom sends a proposal to this account, it will appear here with the PDF, payment status, and next action.</p>
              </article>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
