import type { Metadata } from "next";
import Link from "next/link";
import { loadClientPortalData } from "../../../lib/axiom-client-portal-data";

export const metadata: Metadata = {
  title: "Operations | Axiom Architect Client Portal",
  description:
    "Your Axiom Architect operations page for the current stage, priorities, approvals, and next action.",
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
    return "No update yet";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function ClientPortalOperationsPage() {
  const liveData = await loadClientPortalData("/client/operations");
  const workspace = liveData.workspace;
  const latestActivity = liveData.latestActivity;
  const openApprovals = liveData.approvalGates.filter((gate) => gate.status === "open");
  const recentMessages = liveData.messages.slice(0, 3);

  const stageCards = [
    {
      label: "Current stage",
      value: workspace ? formatLabel(workspace.current_phase) : "Not started",
      text: workspace?.current_priority || "The working focus will appear here once the engagement starts.",
    },
    {
      label: "Next action",
      value: workspace?.next_client_action ? "Set" : "None",
      text: workspace?.next_client_action || "No action is needed from you right now.",
    },
    {
      label: "Approvals",
      value: String(openApprovals.length),
      text: openApprovals.length === 1 ? "One approval is waiting." : "Open approval requests.",
    },
    {
      label: "Latest update",
      value: latestActivity ? formatLabel(latestActivity.activity_type) : "Waiting",
      text: latestActivity?.title || "Updates will appear here as the work moves forward.",
    },
  ];

  const workingStages = [
    {
      label: "1",
      title: "Discovery",
      text: "Understand the workflow, business goal, tools, constraints, and current pain points.",
      active: workspace?.current_phase === "discovery",
    },
    {
      label: "2",
      title: "Mapping",
      text: "Break the workflow into stages, handoffs, decisions, delays, and risk points.",
      active: workspace?.current_phase === "workflow_mapping",
    },
    {
      label: "3",
      title: "Design",
      text: "Shape the future workflow and define where AI, automation, or human review belongs.",
      active: workspace?.current_phase === "architecture_design",
    },
    {
      label: "4",
      title: "Plan",
      text: "Turn the agreed direction into actions, outputs, responsibilities, and checkpoints.",
      active: workspace?.current_phase === "implementation_blueprint",
    },
  ];

  return (
    <main className="bg-black text-white">
      <section className="relative overflow-hidden border-b border-[#9ed39f]/20 bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_34%,#000_78%)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto max-w-[1440px]">
          <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
            Operations
          </p>

          <div className="mt-6 grid gap-8 lg:grid-cols-[0.95fr_0.55fr] lg:items-end">
            <div>
              <h1 className="max-w-5xl text-[clamp(3rem,6vw,6.5rem)] font-black uppercase leading-[0.86] tracking-[-0.08em] text-white">
                Work in motion.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[#e6f6e7]/78 sm:text-lg">
                Follow the current stage, what Axiom is focused on, what needs your attention, and where approvals are waiting.
              </p>
            </div>

            <aside className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5">
              <p className="m-0 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">
                Current focus
              </p>
              <p className="mt-4 text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-white">
                {workspace?.current_priority || "Proposal review"}
              </p>
              <p className="mb-0 mt-3 text-sm leading-7 text-[#e6f6e7]/72">
                {workspace?.next_client_action || "No action is needed from you right now."}
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-[#9ed39f] px-4 py-12 text-black sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-6 lg:grid-cols-[0.42fr_1fr] lg:items-end">
          <div>
            <p className="inline-flex border border-black bg-black px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-[#9ed39f]">
              Stage
            </p>
            <h2 className="mt-5 text-[clamp(2.1rem,4vw,4.4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-black">
              {workspace ? formatLabel(workspace.current_phase) : "Not started"}
            </h2>
          </div>
          <p className="max-w-4xl text-base leading-8 text-black/76 sm:text-lg">
            {workspace?.axiom_review_focus ||
              "Axiom is reviewing the proposal details and shaping the right route before any implementation work begins."}
          </p>
        </div>
      </section>

      <section className="bg-[#020904] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stageCards.map((card) => (
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
                Flow
              </p>
              <h2 className="mt-5 text-[clamp(2.1rem,4vw,4.4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">
                How the work moves.
              </h2>
            </div>
            <p className="max-w-3xl text-base leading-8 text-[#e6f6e7]/75 sm:text-lg">
              Custom work moves in clear stages so the scope stays controlled and every important decision has a place.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {workingStages.map((stage) => (
              <article key={stage.title} className={`border p-5 ${stage.active ? "border-[#9ed39f] bg-[#9ed39f] text-black" : "border-[#9ed39f]/24 bg-[#030804] text-white"}`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className={`text-[0.66rem] font-black uppercase tracking-[0.18em] ${stage.active ? "text-black" : "text-[#9ed39f]"}`}>{stage.label}</span>
                  <span className={`h-2 w-2 ${stage.active ? "bg-black" : "bg-[#9ed39f]"}`} />
                </div>
                <h3 className="mt-4 text-2xl font-black uppercase leading-tight tracking-[-0.05em]">
                  {stage.title}
                </h3>
                <p className={`mt-3 text-sm leading-7 ${stage.active ? "text-black/76" : "text-[#e6f6e7]/72"}`}>{stage.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#020904] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[0.42fr_1fr]">
          <div>
            <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
              Decisions
            </p>
            <h2 className="mt-5 text-[clamp(2.1rem,4vw,4.4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">
              What needs attention.
            </h2>
          </div>

          <div className="grid gap-3">
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-black p-4 md:grid-cols-[0.32fr_1fr] md:items-center">
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Next action</p>
              <p className="text-sm font-semibold leading-7 text-white md:text-base">{workspace?.next_client_action || "No action is needed from you right now."}</p>
            </div>
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-black p-4 md:grid-cols-[0.32fr_1fr] md:items-center">
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Approvals</p>
              <p className="text-sm font-semibold leading-7 text-white md:text-base">{openApprovals.length > 0 ? `${openApprovals.length} waiting` : "No approvals waiting"}</p>
            </div>
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-black p-4 md:grid-cols-[0.32fr_1fr] md:items-center">
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Latest update</p>
              <p className="text-sm font-semibold leading-7 text-white md:text-base">{latestActivity?.title || "No update yet"}</p>
            </div>
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-black p-4 md:grid-cols-[0.32fr_1fr] md:items-start">
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Updated</p>
              <p className="text-sm font-semibold leading-7 text-white md:text-base">{formatDate(latestActivity?.created_at)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-8 lg:grid-cols-[0.42fr_1fr] lg:items-end">
            <div>
              <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
                Messages
              </p>
              <h2 className="mt-5 text-[clamp(2.1rem,4vw,4.4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">
                Recent notes.
              </h2>
            </div>
            <p className="max-w-3xl text-base leading-8 text-[#e6f6e7]/75 sm:text-lg">
              Important notes and updates will appear here as the engagement progresses.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {recentMessages.length > 0 ? (
              recentMessages.map((message) => (
                <article key={message.id} className="border border-[#9ed39f]/24 bg-[#030804] p-5">
                  <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">{formatDate(message.created_at)}</p>
                  <h3 className="mt-4 text-2xl font-black uppercase tracking-[-0.05em] text-white">{message.subject || "Workspace note"}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72">{message.body}</p>
                </article>
              ))
            ) : (
              <article className="border border-[#9ed39f]/24 bg-[#030804] p-5 lg:col-span-3">
                <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white">No messages yet.</h3>
                <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72">
                  Notes will appear here when there is something specific to review.
                </p>
              </article>
            )}
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
            <Link href="/client/documents" className="group border border-[#9ed39f]/24 bg-black p-5 transition hover:border-[#9ed39f] hover:bg-[#9ed39f]">
              <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white group-hover:text-black">Documents</h3>
              <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72 group-hover:text-black/72">Check files and requests.</p>
            </Link>
            <Link href="/client/deliverables" className="group border border-[#9ed39f]/24 bg-black p-5 transition hover:border-[#9ed39f] hover:bg-[#9ed39f]">
              <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white group-hover:text-black">Deliverables</h3>
              <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72 group-hover:text-black/72">See where outputs will appear.</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
