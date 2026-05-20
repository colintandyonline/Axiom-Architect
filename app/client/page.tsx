import type { Metadata } from "next";
import Link from "next/link";
import { loadClientPortalData } from "../../lib/axiom-client-portal-data";

export const metadata: Metadata = {
  title: "Client Workspace | Axiom Architect",
  description:
    "Your private Axiom Architect workspace for proposal progress, updates, files, outputs, billing, and account details.",
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

export default async function ClientPortalOverviewPage() {
  const liveData = await loadClientPortalData("/client");
  const workspace = liveData.workspace;
  const serviceRequest = liveData.serviceRequest;
  const latestActivity = liveData.latestActivity;
  const clientName = liveData.customer.full_name || liveData.user.email || "Client";
  const businessName = liveData.customer.business_name || "Your business";

  const statusCards = [
    {
      label: "Proposal",
      value: serviceRequest ? formatLabel(serviceRequest.status) : "Not submitted",
      text: serviceRequest?.proposal_status
        ? `Proposal: ${formatLabel(serviceRequest.proposal_status)}`
        : "Submit a proposal to start the review.",
    },
    {
      label: "Stage",
      value: workspace ? formatLabel(workspace.current_phase) : "Not started",
      text: workspace?.current_priority || "Your current focus will appear here.",
    },
    {
      label: "Next action",
      value: workspace?.next_client_action ? "Assigned" : "None",
      text: workspace?.next_client_action || "No action is needed from you right now.",
    },
    {
      label: "Latest update",
      value: latestActivity ? formatLabel(latestActivity.activity_type) : "Waiting",
      text: latestActivity?.title || "Updates will appear here as the work moves forward.",
    },
  ];

  const quickLinks = [
    {
      href: "/client/operations",
      title: "Operations",
      text: "See the current stage, priorities, decisions, and approvals.",
    },
    {
      href: "/client/documents",
      title: "Documents",
      text: "Check requested files, examples, and supporting material.",
    },
    {
      href: "/client/deliverables",
      title: "Deliverables",
      text: "View blueprints, reports, maps, protocols, and handoff files.",
    },
    {
      href: "/client/billing",
      title: "Billing",
      text: "Review proposal value, invoices, and payment status.",
    },
    {
      href: "/client/account",
      title: "Account",
      text: "Confirm your contact, business, and access details.",
    },
    {
      href: "/client/proposal",
      title: "Proposal intake",
      text: "Open the detailed proposal form for custom work.",
    },
  ];

  return (
    <main className="bg-black text-white">
      <section className="relative overflow-hidden border-b border-[#9ed39f]/20 bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_34%,#000_78%)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto max-w-[1440px]">
          <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
            Client workspace
          </p>

          <div className="mt-6 grid gap-8 lg:grid-cols-[0.95fr_0.55fr] lg:items-end">
            <div>
              <h1 className="max-w-5xl text-[clamp(3rem,6vw,6.5rem)] font-black uppercase leading-[0.86] tracking-[-0.08em] text-white">
                Welcome back.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[#e6f6e7]/78 sm:text-lg">
                {businessName} is set up inside your Axiom Architect workspace. Use this page to check the current position and jump straight to the area you need.
              </p>
            </div>

            <aside className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5">
              <p className="m-0 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">
                Signed in as
              </p>
              <p className="mt-4 text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-white">
                {clientName}
              </p>
              <p className="mb-0 mt-3 text-sm leading-7 text-[#e6f6e7]/72">
                {liveData.customer.email || liveData.user.email}
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-[#9ed39f] px-4 py-12 text-black sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-6 lg:grid-cols-[0.42fr_1fr] lg:items-end">
          <div>
            <p className="inline-flex border border-black bg-black px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-[#9ed39f]">
              Now
            </p>
            <h2 className="mt-5 text-[clamp(2.1rem,4vw,4.4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-black">
              {workspace ? formatLabel(workspace.current_phase) : "Ready when you are."}
            </h2>
          </div>
          <p className="max-w-4xl text-base leading-8 text-black/76 sm:text-lg">
            {workspace?.next_client_action ||
              "Submit a proposal intake when you are ready. Once it is received, the next action and review status will appear here."}
          </p>
        </div>
      </section>

      <section className="bg-[#020904] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {statusCards.map((card) => (
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
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[0.42fr_1fr]">
          <div>
            <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
              At a glance
            </p>
            <h2 className="mt-5 text-[clamp(2.1rem,4vw,4.4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">
              Current status.
            </h2>
          </div>

          <div className="grid gap-3">
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-[#030804] p-4 md:grid-cols-[0.32fr_1fr] md:items-center">
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Workspace</p>
              <p className="text-sm font-semibold leading-7 text-white md:text-base">{workspace?.workspace_name || "No workspace yet"}</p>
            </div>
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-[#030804] p-4 md:grid-cols-[0.32fr_1fr] md:items-center">
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Review</p>
              <p className="text-sm font-semibold leading-7 text-white md:text-base">{serviceRequest ? formatLabel(serviceRequest.status) : "No proposal yet"}</p>
            </div>
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-[#030804] p-4 md:grid-cols-[0.32fr_1fr] md:items-center">
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Updated</p>
              <p className="text-sm font-semibold leading-7 text-white md:text-base">{formatDate(latestActivity?.created_at)}</p>
            </div>
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-[#030804] p-4 md:grid-cols-[0.32fr_1fr] md:items-start">
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Latest</p>
              <p className="text-sm font-semibold leading-7 text-white md:text-base">{latestActivity?.body || latestActivity?.title || "No update yet"}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#020904] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-8 lg:grid-cols-[0.48fr_1fr] lg:items-end">
            <div>
              <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
                Next
              </p>
              <h2 className="mt-5 text-[clamp(2.1rem,4vw,4.4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">
                Go where you need.
              </h2>
            </div>
            <p className="max-w-3xl text-base leading-8 text-[#e6f6e7]/75 sm:text-lg">
              Each area has a clear job: progress, files, outputs, billing, account details, or proposal intake.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href} className="group border border-[#9ed39f]/24 bg-black p-5 transition hover:border-[#9ed39f] hover:bg-[#9ed39f]">
                <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white group-hover:text-black">
                  {link.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72 group-hover:text-black/72">
                  {link.text}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
