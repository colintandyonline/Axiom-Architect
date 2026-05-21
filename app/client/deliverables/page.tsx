import type { Metadata } from "next";
import Link from "next/link";
import { loadClientPortalData } from "../../../lib/axiom-client-portal-data";

export const metadata: Metadata = {
  title: "Deliverables | Axiom Architect Client Portal",
  description:
    "Your Axiom Architect deliverables page for blueprints, reports, workflow maps, protocols, and final handoff material.",
};

export const dynamic = "force-dynamic";

function formatLabel(value: string | null | undefined, fallback = "Not set") {
  if (!value) {
    return fallback;
  }

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "Not recorded";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function ClientPortalDeliverablesPage() {
  const liveData = await loadClientPortalData("/client/deliverables");
  const deliverables = liveData.deliverables;
  const approvalGates = liveData.approvalGates;
  const latestDeliverable = deliverables[0];
  const readyForReviewCount = deliverables.filter((deliverable) => deliverable.status === "ready_for_review").length;
  const approvedCount = deliverables.filter((deliverable) => deliverable.status === "approved").length;
  const deliveredCount = deliverables.filter((deliverable) => deliverable.status === "delivered").length;
  const openApprovals = approvalGates.filter((gate) => gate.status === "open");

  const summaryCards = [
    {
      label: "Outputs",
      value: String(deliverables.length),
      text: deliverables.length === 1 ? "One output is attached to this workspace." : "Outputs attached to this workspace.",
    },
    {
      label: "For review",
      value: String(readyForReviewCount),
      text: "Outputs waiting for client review.",
    },
    {
      label: "Approved",
      value: String(approvedCount),
      text: "Outputs accepted as the working reference.",
    },
    {
      label: "Delivered",
      value: String(deliveredCount),
      text: "Final material ready to use or hand over.",
    },
  ];

  const outputTypes = [
    {
      label: "Blueprint",
      title: "System design",
      text: "The recommended structure for the improved workflow.",
    },
    {
      label: "Map",
      title: "Workflow sequence",
      text: "The stages, handoffs, decisions, and review points.",
    },
    {
      label: "Protocol",
      title: "AI rules",
      text: "Instructions, boundaries, and review gates for AI-supported work.",
    },
    {
      label: "Guide",
      title: "Implementation notes",
      text: "Practical steps for using the agreed approach.",
    },
  ];

  return (
    <main className="bg-black text-white">
      <section className="relative overflow-hidden border-b border-[#9ed39f]/20 bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_34%,#000_78%)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto max-w-[1440px]">
          <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
            Deliverables
          </p>

          <div className="mt-6 grid gap-8 lg:grid-cols-[0.95fr_0.55fr] lg:items-end">
            <div>
              <h1 className="max-w-5xl text-[clamp(3rem,6vw,6.5rem)] font-black uppercase leading-[0.86] tracking-[-0.08em] text-white">
                Outputs.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[#e6f6e7]/78 sm:text-lg">
                Reports, blueprints, workflow maps, protocols, and final handoff material will appear here as the engagement reaches delivery stages.
              </p>
            </div>

            <aside className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5">
              <p className="m-0 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">
                Latest output
              </p>
              <p className="mt-4 text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-white">
                {latestDeliverable?.title || "None yet"}
              </p>
              <p className="mb-0 mt-3 text-sm leading-7 text-[#e6f6e7]/72">
                {latestDeliverable
                  ? `${formatLabel(latestDeliverable.status)} · ${formatDate(latestDeliverable.created_at)}`
                  : "Outputs appear here once they are prepared."}
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-[#9ed39f] px-4 py-12 text-black sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-6 lg:grid-cols-[0.42fr_1fr] lg:items-end">
          <div>
            <p className="inline-flex border border-black bg-black px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-[#9ed39f]">
              Delivery
            </p>
            <h2 className="mt-5 text-[clamp(2.1rem,4vw,4.4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-black">
              {deliverables.length > 0 ? `${deliverables.length} in progress` : "No outputs released yet."}
            </h2>
          </div>
          <p className="max-w-4xl text-base leading-8 text-black/76 sm:text-lg">
            {deliverables.length > 0
              ? "Review the outputs below and check anything marked ready for review or waiting for approval."
              : "Deliverables appear here after the proposal is agreed and the work reaches the right stage."}
          </p>
        </div>
      </section>

      <section className="bg-[#020904] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <article key={card.label} className="rounded-[1.25rem] border border-[#9ed39f]/30 bg-black p-5 shadow-[0_18px_40px_rgba(0,0,0,0.3)]">
              <span className="mb-5 block h-2 w-2 bg-[#9ed39f]" />
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">{card.label}</p>
              <h2 className="mt-3 text-2xl font-black uppercase leading-tight tracking-[-0.05em] text-white">{card.value}</h2>
              <p className="mt-4 text-sm leading-6 text-[#e6f6e7]/72">{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-8 lg:grid-cols-[0.42fr_1fr] lg:items-end">
            <div>
              <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
                Output list
              </p>
              <h2 className="mt-5 text-[clamp(2.1rem,4vw,4.4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">
                Prepared material.
              </h2>
            </div>
            <p className="max-w-3xl text-base leading-8 text-[#e6f6e7]/75 sm:text-lg">
              This is where finished or review-ready material appears for the engagement.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {deliverables.length > 0 ? (
              deliverables.map((deliverable) => (
                <article key={deliverable.id} className="border border-[#9ed39f]/24 bg-[#030804] p-5">
                  <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">
                    {formatLabel(deliverable.status)} · {deliverable.version}
                  </p>
                  <h3 className="mt-4 text-2xl font-black uppercase tracking-[-0.05em] text-white">
                    {deliverable.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72">
                    {deliverable.description || formatLabel(deliverable.deliverable_type)}
                  </p>
                  <div className="mt-5 grid gap-2 border-t border-[#9ed39f]/16 pt-4 text-xs font-bold uppercase tracking-[0.14em] text-[#e6f6e7]/58">
                    <span>Created {formatDate(deliverable.created_at)}</span>
                    <span>{deliverable.approval_required ? "Approval required" : "No approval required"}</span>
                    {deliverable.delivered_at && <span>Delivered {formatDate(deliverable.delivered_at)}</span>}
                  </div>
                </article>
              ))
            ) : (
              <article className="border border-[#9ed39f]/24 bg-[#030804] p-5 lg:col-span-3">
                <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white">No outputs yet.</h3>
                <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72">
                  Nothing has been released for review yet. Outputs will appear here when the work reaches delivery.
                </p>
              </article>
            )}
          </div>
        </div>
      </section>

      <section className="bg-[#020904] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-8 lg:grid-cols-[0.42fr_1fr] lg:items-end">
            <div>
              <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
                Output types
              </p>
              <h2 className="mt-5 text-[clamp(2.1rem,4vw,4.4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">
                What may appear.
              </h2>
            </div>
            <p className="max-w-3xl text-base leading-8 text-[#e6f6e7]/75 sm:text-lg">
              The exact outputs depend on the approved proposal and the work required.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {outputTypes.map((item) => (
              <article key={item.title} className="border border-[#9ed39f]/24 bg-black p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">{item.label}</span>
                  <span className="h-2 w-2 bg-[#9ed39f]" />
                </div>
                <h3 className="mt-4 text-2xl font-black uppercase leading-tight tracking-[-0.05em] text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[0.42fr_1fr]">
          <div>
            <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
              Approvals
            </p>
            <h2 className="mt-5 text-[clamp(2.1rem,4vw,4.4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">
              Waiting on sign-off.
            </h2>
          </div>

          <div className="grid gap-3">
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-[#030804] p-4 md:grid-cols-[0.28fr_1fr] md:items-center">
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Open</p>
              <p className="text-sm font-semibold leading-7 text-white md:text-base">{openApprovals.length > 0 ? `${openApprovals.length} approval request${openApprovals.length === 1 ? "" : "s"}` : "No approvals waiting"}</p>
            </div>
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-[#030804] p-4 md:grid-cols-[0.28fr_1fr] md:items-start">
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Latest</p>
              <p className="text-sm font-semibold leading-7 text-white md:text-base">{openApprovals[0]?.title || "Nothing needs signing off right now."}</p>
            </div>
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-[#030804] p-4 md:grid-cols-[0.28fr_1fr] md:items-start">
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Note</p>
              <p className="text-sm font-semibold leading-7 text-white md:text-base">Outputs marked for review should be checked before they are treated as final.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#020904] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-8 lg:grid-cols-[0.42fr_1fr] lg:items-end">
            <div>
              <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
                Next
              </p>
              <h2 className="mt-5 text-[clamp(2.1rem,4vw,4.4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">
                Useful links.
              </h2>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <Link href="/client" className="group border border-[#9ed39f]/24 bg-black p-5 transition hover:border-[#9ed39f] hover:bg-[#9ed39f]">
              <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white group-hover:text-black">Overview</h3>
              <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72 group-hover:text-black/72">Return to the workspace summary.</p>
            </Link>
            <Link href="/client/operations" className="group border border-[#9ed39f]/24 bg-black p-5 transition hover:border-[#9ed39f] hover:bg-[#9ed39f]">
              <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white group-hover:text-black">Operations</h3>
              <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72 group-hover:text-black/72">Check the working plan.</p>
            </Link>
            <Link href="/client/billing" className="group border border-[#9ed39f]/24 bg-black p-5 transition hover:border-[#9ed39f] hover:bg-[#9ed39f]">
              <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white group-hover:text-black">Billing</h3>
              <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72 group-hover:text-black/72">Review proposal and invoice status.</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
