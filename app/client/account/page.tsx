import type { Metadata } from "next";
import Link from "next/link";
import { loadClientPortalData } from "../../../lib/axiom-client-portal-data";

export const metadata: Metadata = {
  title: "Account | Axiom Architect Client Portal",
  description: "Client account dashboard for contact, business, and workspace status.",
};

export const dynamic = "force-dynamic";

function label(value: string | null | undefined) {
  return value ? value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) : "Not set";
}

function date(value: string | null | undefined) {
  if (!value) return "Not recorded";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

export default async function ClientPortalAccountPage() {
  const data = await loadClientPortalData("/client/account");
  const customer = data.customer;
  const user = data.user;
  const workspace = data.workspace;
  const request = data.serviceRequest;
  const email = customer.email || user.email || "Not set";
  const name = customer.full_name || user.email || "Not set";
  const business = customer.business_name || "Not set";

  const stats = [
    ["Name", name, "Primary contact"],
    ["Email", email, "Login and updates"],
    ["Business", business, "Workspace owner"],
    ["Status", label(customer.account_status), "Account state"],
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden border-b border-[#9ed39f]/20 bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.16),#031007_34%,#000_78%)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.1)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="relative mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[0.9fr_0.48fr] lg:items-end">
          <div>
            <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">Account</p>
            <h1 className="mt-6 text-[clamp(2.8rem,5.6vw,5.8rem)] font-black uppercase leading-[0.88] tracking-[-0.08em] text-white">Your details.</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[#e6f6e7]/74 sm:text-lg">Contact, business, workspace, and proposal status.</p>
          </div>
          <aside className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5">
            <div className="mb-5 flex h-10 w-10 items-center justify-center border border-[#9ed39f] text-[#9ed39f]">◎</div>
            <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Signed in</p>
            <p className="mt-3 break-words text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-white">{name}</p>
            <p className="mt-3 break-words text-sm leading-7 text-[#e6f6e7]/72">{email}</p>
          </aside>
        </div>
      </section>

      <section className="bg-[#020904] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(([statLabel, value, text]) => (
            <article key={statLabel} className="border border-[#9ed39f]/30 bg-black p-5">
              <span className="mb-5 flex h-9 w-9 items-center justify-center border border-[#9ed39f]/60 text-[#9ed39f]">▣</span>
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">{statLabel}</p>
              <h2 className="mt-3 break-words text-2xl font-black uppercase tracking-[-0.05em] text-white">{value}</h2>
              <p className="mt-4 text-sm leading-6 text-[#e6f6e7]/72">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-black px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[0.42fr_1fr]">
          <div>
            <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">Workspace</p>
            <h2 className="mt-5 text-[clamp(2rem,4vw,4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">Linked work.</h2>
          </div>
          <div className="grid gap-3">
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-[#030804] p-4 md:grid-cols-[0.28fr_1fr] md:items-center"><p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Workspace</p><p className="text-sm font-semibold leading-7 text-white md:text-base">{workspace?.workspace_name || "No workspace yet"}</p></div>
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-[#030804] p-4 md:grid-cols-[0.28fr_1fr] md:items-center"><p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Stage</p><p className="text-sm font-semibold leading-7 text-white md:text-base">{workspace ? label(workspace.current_phase) : "Not started"}</p></div>
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-[#030804] p-4 md:grid-cols-[0.28fr_1fr] md:items-center"><p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Proposal</p><p className="text-sm font-semibold leading-7 text-white md:text-base">{request ? label(request.proposal_status) : "Not prepared"}</p></div>
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-[#030804] p-4 md:grid-cols-[0.28fr_1fr] md:items-center"><p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Opened</p><p className="text-sm font-semibold leading-7 text-white md:text-base">{date(workspace?.opened_at || workspace?.created_at)}</p></div>
          </div>
        </div>
      </section>

      <section className="bg-[#020904] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-4 border-b border-[#9ed39f]/20 pb-6 md:flex-row md:items-end md:justify-between">
            <div><p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">Actions</p><h2 className="mt-5 text-[clamp(2rem,4vw,4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">Manage workspace.</h2></div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Link href="/client" className="border border-[#9ed39f]/24 bg-black p-5 transition hover:bg-[#9ed39f] hover:text-black"><h3 className="text-2xl font-black uppercase tracking-[-0.05em]">Overview</h3><p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72 group-hover:text-black/70">Workspace summary.</p></Link>
            <Link href="/client/billing" className="border border-[#9ed39f]/24 bg-black p-5 transition hover:bg-[#9ed39f] hover:text-black"><h3 className="text-2xl font-black uppercase tracking-[-0.05em]">Billing</h3><p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72 group-hover:text-black/70">Invoice status.</p></Link>
            <Link href="/client/proposal" className="border border-[#9ed39f]/24 bg-black p-5 transition hover:bg-[#9ed39f] hover:text-black"><h3 className="text-2xl font-black uppercase tracking-[-0.05em]">Proposal</h3><p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72 group-hover:text-black/70">Proposal intake.</p></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
