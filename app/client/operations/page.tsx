import type { Metadata } from "next";
import Link from "next/link";
import { loadClientPortalData } from "../../../lib/axiom-client-portal-data";

export const metadata: Metadata = {
  title: "Operations | Axiom Architect Client Portal",
  description: "Client operations dashboard for current status, actions, approvals, and messages.",
};

export const dynamic = "force-dynamic";

function label(value: string | null | undefined) {
  return value ? value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) : "Not set";
}

function date(value: string | null | undefined) {
  if (!value) return "No update yet";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

export default async function ClientPortalOperationsPage() {
  const data = await loadClientPortalData("/client/operations");
  const workspace = data.workspace;
  const latest = data.latestActivity;
  const approvals = data.approvalGates.filter((gate) => gate.status === "open");
  const messages = data.messages.slice(0, 4);

  const stats = [
    ["Stage", workspace ? label(workspace.current_phase) : "Not started", workspace?.current_priority || "Current focus will appear here."],
    ["Action", workspace?.next_client_action ? "Set" : "None", workspace?.next_client_action || "No action is needed from you right now."],
    ["Approvals", String(approvals.length), approvals.length ? "Waiting for review." : "Nothing waiting."],
    ["Latest", latest ? label(latest.activity_type) : "Waiting", latest?.title || "No update yet."],
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden border-b border-[#9ed39f]/20 bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.16),#031007_34%,#000_78%)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.1)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="relative mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[0.9fr_0.48fr] lg:items-end">
          <div>
            <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">Operations</p>
            <h1 className="mt-6 text-[clamp(2.8rem,5.6vw,5.8rem)] font-black uppercase leading-[0.88] tracking-[-0.08em] text-white">Current work.</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[#e6f6e7]/74 sm:text-lg">Status, actions, approvals, and messages for this workspace.</p>
          </div>
          <aside className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5">
            <div className="mb-5 flex h-10 w-10 items-center justify-center border border-[#9ed39f] text-[#9ed39f]">⌁</div>
            <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Focus</p>
            <p className="mt-3 text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-white">{workspace?.current_priority || "Proposal review"}</p>
            <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72">{workspace?.next_client_action || "No action is needed from you right now."}</p>
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
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[0.42fr_1fr]">
          <div>
            <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">Status</p>
            <h2 className="mt-5 text-[clamp(2rem,4vw,4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">At a glance.</h2>
          </div>
          <div className="grid gap-3">
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-[#030804] p-4 md:grid-cols-[0.28fr_1fr] md:items-center"><p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Workspace</p><p className="text-sm font-semibold leading-7 text-white md:text-base">{workspace?.workspace_name || "No workspace yet"}</p></div>
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-[#030804] p-4 md:grid-cols-[0.28fr_1fr] md:items-center"><p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Stage</p><p className="text-sm font-semibold leading-7 text-white md:text-base">{workspace ? label(workspace.current_phase) : "Not started"}</p></div>
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-[#030804] p-4 md:grid-cols-[0.28fr_1fr] md:items-center"><p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Next action</p><p className="text-sm font-semibold leading-7 text-white md:text-base">{workspace?.next_client_action || "No action is needed from you right now."}</p></div>
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-[#030804] p-4 md:grid-cols-[0.28fr_1fr] md:items-center"><p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Updated</p><p className="text-sm font-semibold leading-7 text-white md:text-base">{date(latest?.created_at)}</p></div>
          </div>
        </div>
      </section>

      <section className="bg-[#020904] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-5 border-b border-[#9ed39f]/20 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">Messages</p>
              <h2 className="mt-5 text-[clamp(2rem,4vw,4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">{messages.length ? "Recent notes." : "No messages yet."}</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/client/documents" className="inline-flex min-h-12 items-center justify-center border border-[#9ed39f]/56 px-5 text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] hover:bg-[#9ed39f] hover:text-black">Documents</Link>
              <Link href="/client/deliverables" className="inline-flex min-h-12 items-center justify-center border border-[#9ed39f]/56 px-5 text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] hover:bg-[#9ed39f] hover:text-black">Deliverables</Link>
            </div>
          </div>
          <div className="mt-8 grid gap-4">
            {messages.length ? messages.map((message) => (
              <article key={message.id} className="grid gap-4 border border-[#9ed39f]/24 bg-black p-5 lg:grid-cols-[1fr_auto] lg:items-center">
                <div><p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">{date(message.created_at)}</p><h3 className="mt-3 text-2xl font-black uppercase tracking-[-0.05em] text-white">{message.subject || "Workspace note"}</h3><p className="mt-2 text-sm leading-7 text-[#e6f6e7]/72">{message.body}</p></div>
              </article>
            )) : <article className="border border-[#9ed39f]/24 bg-black p-6"><h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white">No messages.</h3><p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72">Nothing has been added here yet.</p></article>}
          </div>
        </div>
      </section>
    </main>
  );
}
