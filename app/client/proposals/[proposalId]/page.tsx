import type { Metadata } from "next";
import Link from "next/link";
import {
  formatProposalMoney,
  getProposalPaymentTerms,
  getProposalPricing,
  jsonListToText,
  type ProposalDraftRecord,
} from "../../../../lib/axiom-proposal-drafts";
import {
  recordProposalClientView,
  validateProposalClientOrAuthenticatedAccess,
} from "../../../../lib/axiom-proposal-client.server";

export const metadata: Metadata = {
  title: "Proposal Review | Axiom Architect",
  description: "Secure Axiom Architect proposal review workspace.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ proposalId: string }>;
  searchParams?: Promise<{ token?: string | string[]; proposal?: string | string[] }>;
};

const buttonClass = "inline-flex min-h-11 items-center justify-center border border-[#9ed39f]/35 bg-black px-4 text-center text-[0.7rem] font-black uppercase tracking-[0.14em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black";
const primaryButtonClass = "inline-flex min-h-11 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-4 text-center text-[0.7rem] font-black uppercase tracking-[0.14em] text-black transition hover:bg-white";

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function formatDate(value?: string | null) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function routeLabel(value?: string | null) {
  return value ? value.replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) : "Axiom Architect service";
}

function compactText(value?: string | null, fallback = "The proposal summary is included in the PDF."): string {
  const cleaned = (value || "").replace(/\s+/g, " ").trim();

  if (!cleaned) {
    return fallback;
  }

  return cleaned.length > 420 ? `${cleaned.slice(0, 417).trim()}...` : cleaned;
}

function listItems(value: unknown, limit = 5) {
  return jsonListToText(value)
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, limit);
}

function noticeMessage(value?: string) {
  switch (value) {
    case "accepted":
      return "Proposal accepted. Deposit payment will appear once the Stripe invoice is ready.";
    case "changes-requested":
      return "Change request sent. Axiom Architect will review your note.";
    case "missing-message":
      return "Please add a short message before requesting changes.";
    default:
      return null;
  }
}

function UnavailableProposal({ message }: { message: string }) {
  return (
    <main className="min-h-screen bg-[#050805] px-4 py-16 text-white sm:px-6 lg:px-8">
      <section className="mx-auto max-w-3xl border border-[#9ed39f]/24 bg-black/40 p-8">
        <p className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-[#9ed39f]">Axiom Architect</p>
        <h1 className="mt-4 text-4xl font-black uppercase leading-none tracking-[-0.06em]">Proposal unavailable.</h1>
        <p className="mt-5 text-sm leading-7 text-white/68">{message}</p>
        <p className="mt-5 text-sm leading-7 text-white/58">
          If you expected access, return to the client workspace or reply to your Axiom Architect email thread.
        </p>
      </section>
    </main>
  );
}

function ProposalActionForms({
  proposal,
  token,
}: {
  proposal: ProposalDraftRecord;
  token: string;
}) {
  const accepted = proposal.status === "accepted" || Boolean(proposal.accepted_at);

  return (
    <section className="grid gap-4 border border-[#9ed39f]/20 bg-black/36 p-5">
      <div>
        <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">Decision</p>
        <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.05em] text-white">Confirm next step</h2>
      </div>
      {accepted ? (
        <p className="border border-[#9ed39f]/22 bg-[#9ed39f]/10 p-4 text-sm leading-7 text-white/72">
          This proposal has been accepted. Use the payment section below to complete the next payment when required.
        </p>
      ) : (
        <div className="flex flex-wrap gap-3">
          <form action={`/api/client/proposals/${proposal.id}/action`} method="post">
            <input type="hidden" name="token" value={token} />
            <input type="hidden" name="action" value="accept_proposal" />
            <button type="submit" className={primaryButtonClass}>Accept proposal</button>
          </form>
        </div>
      )}
      <form action={`/api/client/proposals/${proposal.id}/action`} method="post" className="grid gap-3">
        <input type="hidden" name="token" value={token} />
        <input type="hidden" name="action" value="request_changes" />
        <label className="grid gap-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">
          Request changes
          <textarea
            name="message"
            rows={4}
            placeholder="Tell us what needs changing before you accept."
            className="min-h-28 border border-[#9ed39f]/30 bg-black px-3 py-3 text-sm font-semibold leading-7 text-white outline-none placeholder:text-white/30 focus:border-[#9ed39f]"
          />
        </label>
        <button type="submit" className={buttonClass}>Send change request</button>
      </form>
    </section>
  );
}

export default async function ClientProposalPage({ params, searchParams }: PageProps) {
  const { proposalId } = await params;
  const query = searchParams ? await searchParams : {};
  const token = firstParam(query.token) || "";
  const access = await validateProposalClientOrAuthenticatedAccess(proposalId, token);

  if (access.ok === false) {
    return <UnavailableProposal message={access.message} />;
  }

  await recordProposalClientView(access.proposal);

  const proposal = access.proposal;
  const pricing = getProposalPricing(proposal.pricing_json);
  const paymentTerms = getProposalPaymentTerms(proposal.payment_terms_json);
  const accepted = proposal.status === "accepted" || Boolean(proposal.accepted_at);
  const paymentStatus = proposal.payment_status || "unpaid";
  const depositReceived = ["deposit_paid", "final_balance_due", "paid_complete"].includes(paymentStatus);
  const finalBalanceDue = paymentStatus === "final_balance_due";
  const paymentComplete = paymentStatus === "paid_complete";
  const paymentCancelled = paymentStatus === "cancelled";
  const deliverables = listItems(proposal.deliverables_json, 5);
  const notice = noticeMessage(firstParam(query.proposal));
  const pdfUrl = token
    ? `/api/client/proposals/${encodeURIComponent(proposal.id)}/pdf?token=${encodeURIComponent(token)}`
    : `/api/client/proposals/${encodeURIComponent(proposal.id)}/pdf`;

  return (
    <main className="min-h-screen bg-[#050805] text-white">
      <section className="border-b border-[#9ed39f]/18 bg-[linear-gradient(135deg,#050805_0%,#081008_58%,#112013_100%)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <p className="text-[0.68rem] font-black uppercase tracking-[0.24em] text-[#9ed39f]">Axiom Architect</p>
            <h1 className="mt-4 text-4xl font-black uppercase leading-none tracking-[-0.07em] sm:text-6xl">
              Proposal review.
            </h1>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-white/70">
              Review the proposed scope, download the PDF, then accept or request changes from this secure workspace.
            </p>
          </div>
          <aside className="border border-[#9ed39f]/24 bg-black/40 p-5">
            <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Proposal</p>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.05em] text-white">
              {proposal.business_name || proposal.workspace_name || "Client proposal"}
            </h2>
            <div className="mt-4 grid gap-2 text-sm leading-7 text-white/68">
              <p><strong className="text-[#9ed39f]">Reference:</strong> {proposal.proposal_reference || "Not set"}</p>
              <p><strong className="text-[#9ed39f]">Prepared for:</strong> {proposal.client_name || proposal.client_email || "Client"}</p>
              <p><strong className="text-[#9ed39f]">Valid until:</strong> {formatDate(proposal.valid_until)}</p>
            </div>
            <Link href="/client" className={`${buttonClass} mt-5 w-full`}>Back to workspace</Link>
          </aside>
        </div>
      </section>

      {notice ? (
        <section className="bg-[#9ed39f] px-4 py-4 text-black sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl text-sm font-bold">{notice}</div>
        </section>
      ) : null}

      <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr_0.65fr]">
          <div className="grid gap-6">
            <section className="border border-[#9ed39f]/20 bg-black/36 p-5">
              <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">Summary</p>
              <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.05em] text-white">
                {proposal.workspace_name || routeLabel(proposal.recommended_service_route)}
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/72">
                {compactText(proposal.client_summary || proposal.current_problem_summary || proposal.scope_summary)}
              </p>
              <div className="mt-5 grid gap-3 text-sm leading-7 text-white/68 md:grid-cols-2">
                <p><strong className="text-[#9ed39f]">Recommended route:</strong> {routeLabel(proposal.recommended_service_route)}</p>
                <p><strong className="text-[#9ed39f]">Business:</strong> {proposal.business_name || "Not set"}</p>
                <p><strong className="text-[#9ed39f]">Final total:</strong> {formatProposalMoney(pricing.final_total)}</p>
                <p><strong className="text-[#9ed39f]">Deposit:</strong> {formatProposalMoney(pricing.deposit_required)}</p>
              </div>
            </section>

            <section className="border border-[#9ed39f]/20 bg-black/36 p-5">
              <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">Scope</p>
              <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.05em] text-white">What is included</h2>
              <p className="mt-4 text-sm leading-7 text-white/72">{compactText(proposal.scope_summary, "Scope details are included in the proposal PDF.")}</p>
              {deliverables.length > 0 ? (
                <ul className="mt-5 grid gap-3">
                  {deliverables.map((item) => (
                    <li key={item} className="border border-[#9ed39f]/16 bg-[#030804] p-3 text-sm leading-7 text-white/70">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>

            <ProposalActionForms proposal={proposal} token={token} />
          </div>

          <aside className="grid gap-6 self-start">
            <section className="border border-[#9ed39f]/22 bg-[#9ed39f]/10 p-5">
              <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">Proposal PDF</p>
              <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.05em] text-white">Download the document</h2>
              <p className="mt-3 text-sm leading-7 text-white/68">
                The PDF contains the concise proposal summary, scope, deliverables, payment terms, and next step.
              </p>
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className={`${primaryButtonClass} mt-5 w-full`}>
                Download proposal PDF
              </a>
            </section>

            <section className="border border-[#9ed39f]/20 bg-black/36 p-5">
              <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">Payment</p>
              <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.05em] text-white">Deposit and balance</h2>
              <div className="mt-4 grid gap-3 text-sm leading-7 text-white/68">
                <p><strong className="text-[#9ed39f]">Final total:</strong> {formatProposalMoney(pricing.final_total)}</p>
                <p><strong className="text-[#9ed39f]">Deposit required:</strong> {formatProposalMoney(pricing.deposit_required)}</p>
                <p><strong className="text-[#9ed39f]">Balance:</strong> {formatProposalMoney(pricing.balance_amount)}</p>
              </div>
              {paymentTerms.payment_instructions ? (
                <p className="mt-4 border border-[#9ed39f]/16 bg-black/30 p-4 text-sm leading-7 text-white/70">
                  {paymentTerms.payment_instructions}
                </p>
              ) : null}
              {accepted && paymentTerms.deposit_payment_url && !depositReceived && !paymentComplete && !paymentCancelled ? (
                <a href={paymentTerms.deposit_payment_url} className={`${primaryButtonClass} mt-5 w-full`} rel="noopener noreferrer">
                  Pay deposit
                </a>
              ) : null}
              {accepted && !paymentTerms.deposit_payment_url && !depositReceived && !paymentComplete && !paymentCancelled ? (
                <p className="mt-4 border border-[#9ed39f]/18 bg-black/30 p-4 text-sm leading-7 text-white/62">
                  Deposit invoice is being prepared. Refresh this page shortly or check your email for the Stripe invoice.
                </p>
              ) : null}
              {depositReceived && !paymentComplete && !paymentCancelled ? (
                <p className="mt-4 border border-[#9ed39f]/22 bg-[#9ed39f]/10 p-4 text-sm font-bold leading-7 text-white/78">
                  Deposit received.
                </p>
              ) : null}
              {paymentComplete ? (
                <p className="mt-4 border border-[#9ed39f]/22 bg-[#9ed39f]/10 p-4 text-sm font-bold leading-7 text-white/78">
                  Payment complete.
                </p>
              ) : null}
              {paymentCancelled ? (
                <p className="mt-4 border border-white/15 bg-black/30 p-4 text-sm leading-7 text-white/60">
                  Payment is currently marked as cancelled. Contact Axiom Architect if this looks incorrect.
                </p>
              ) : null}
              {accepted && finalBalanceDue && paymentTerms.final_payment_url ? (
                <a href={paymentTerms.final_payment_url} className={`${buttonClass} mt-3 w-full`} rel="noopener noreferrer">
                  Pay final balance
                </a>
              ) : null}
              {!accepted ? (
                <p className="mt-4 text-xs leading-6 text-white/50">
                  Payment buttons become available after the proposal is accepted.
                </p>
              ) : null}
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}

