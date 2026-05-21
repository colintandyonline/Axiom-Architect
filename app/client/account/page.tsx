import type { Metadata } from "next";
import Link from "next/link";
import { loadClientPortalData } from "../../../lib/axiom-client-portal-data";

export const metadata: Metadata = {
  title: "Account | Axiom Architect Client Portal",
  description:
    "Your Axiom Architect account page for contact details, business profile, workspace access, and service communication.",
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

export default async function ClientPortalAccountPage() {
  const liveData = await loadClientPortalData("/client/account");
  const customer = liveData.customer;
  const user = liveData.user;
  const workspace = liveData.workspace;
  const serviceRequest = liveData.serviceRequest;
  const primaryEmail = customer.email || user.email || "Not set";
  const contactName = customer.full_name || user.email || "Not set";
  const businessName = customer.business_name || "Not set";

  const profileCards = [
    {
      label: "Name",
      value: contactName,
      text: "Primary contact for this workspace.",
    },
    {
      label: "Email",
      value: primaryEmail,
      text: "Used for sign-in and important updates.",
    },
    {
      label: "Business",
      value: businessName,
      text: "Attached to proposals, billing, and workspace activity.",
    },
    {
      label: "Status",
      value: formatLabel(customer.account_status),
      text: "Current account standing.",
    },
  ];

  const safetyItems = [
    {
      label: "Keep private",
      title: "Access details",
      text: "Never share passwords, recovery phrases, private keys, or one-time codes through proposal forms or documents.",
    },
    {
      label: "Use email",
      title: "Service updates",
      text: "Axiom uses your account email for important updates about proposals, billing, and delivery.",
    },
    {
      label: "Check details",
      title: "Business identity",
      text: "Make sure the correct business name is attached before proposal and billing work continues.",
    },
  ];

  return (
    <main className="bg-black text-white">
      <section className="relative overflow-hidden border-b border-[#9ed39f]/20 bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_34%,#000_78%)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto max-w-[1440px]">
          <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
            Account
          </p>

          <div className="mt-6 grid gap-8 lg:grid-cols-[0.95fr_0.55fr] lg:items-end">
            <div>
              <h1 className="max-w-5xl text-[clamp(3rem,6vw,6.5rem)] font-black uppercase leading-[0.86] tracking-[-0.08em] text-white">
                Your details.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[#e6f6e7]/78 sm:text-lg">
                Check the contact and business details connected to this Axiom Architect workspace.
              </p>
            </div>

            <aside className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5">
              <p className="m-0 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">
                Signed in as
              </p>
              <p className="mt-4 text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-white">
                {contactName}
              </p>
              <p className="mb-0 mt-3 text-sm leading-7 text-[#e6f6e7]/72">
                {primaryEmail}
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-[#9ed39f] px-4 py-12 text-black sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-6 lg:grid-cols-[0.42fr_1fr] lg:items-end">
          <div>
            <p className="inline-flex border border-black bg-black px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-[#9ed39f]">
              Profile
            </p>
            <h2 className="mt-5 text-[clamp(2.1rem,4vw,4.4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-black">
              Details connected.
            </h2>
          </div>
          <p className="max-w-4xl text-base leading-8 text-black/76 sm:text-lg">
            These details are used for proposal review, billing, updates, and access to this workspace.
          </p>
        </div>
      </section>

      <section className="bg-[#020904] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {profileCards.map((card) => (
            <article key={card.label} className="rounded-[1.25rem] border border-[#9ed39f]/30 bg-black p-5 shadow-[0_18px_40px_rgba(0,0,0,0.3)]">
              <span className="mb-5 block h-2 w-2 bg-[#9ed39f]" />
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">{card.label}</p>
              <h2 className="mt-3 break-words text-2xl font-black uppercase leading-tight tracking-[-0.05em] text-white">{card.value}</h2>
              <p className="mt-4 text-sm leading-6 text-[#e6f6e7]/72">{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[0.42fr_1fr]">
          <div>
            <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
              Workspace
            </p>
            <h2 className="mt-5 text-[clamp(2.1rem,4vw,4.4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">
              Linked work.
            </h2>
          </div>

          <div className="grid gap-3">
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-[#030804] p-4 md:grid-cols-[0.28fr_1fr] md:items-center">
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Workspace</p>
              <p className="text-sm font-semibold leading-7 text-white md:text-base">{workspace?.workspace_name || "No workspace yet"}</p>
            </div>
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-[#030804] p-4 md:grid-cols-[0.28fr_1fr] md:items-center">
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Stage</p>
              <p className="text-sm font-semibold leading-7 text-white md:text-base">{workspace ? formatLabel(workspace.current_phase) : "Not started"}</p>
            </div>
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-[#030804] p-4 md:grid-cols-[0.28fr_1fr] md:items-center">
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Proposal</p>
              <p className="text-sm font-semibold leading-7 text-white md:text-base">{serviceRequest ? formatLabel(serviceRequest.proposal_status) : "Not prepared"}</p>
            </div>
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-[#030804] p-4 md:grid-cols-[0.28fr_1fr] md:items-start">
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Next action</p>
              <p className="text-sm font-semibold leading-7 text-white md:text-base">{workspace?.next_client_action || "No action is needed from you right now."}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#020904] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-8 lg:grid-cols-[0.42fr_1fr] lg:items-end">
            <div>
              <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
                Access
              </p>
              <h2 className="mt-5 text-[clamp(2.1rem,4vw,4.4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">
                Keep it private.
              </h2>
            </div>
            <p className="max-w-3xl text-base leading-8 text-[#e6f6e7]/75 sm:text-lg">
              This workspace is private to the signed-in client account. Keep sensitive information out of forms and files unless Axiom specifically asks for it.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {safetyItems.map((item) => (
              <article key={item.title} className="border border-[#9ed39f]/24 bg-black p-5">
                <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">{item.label}</p>
                <h3 className="mt-4 text-2xl font-black uppercase tracking-[-0.05em] text-white">{item.title}</h3>
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
              Timeline
            </p>
            <h2 className="mt-5 text-[clamp(2.1rem,4vw,4.4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">
              Recent dates.
            </h2>
          </div>

          <div className="grid gap-3">
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-[#030804] p-4 md:grid-cols-[0.28fr_1fr] md:items-center">
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Workspace opened</p>
              <p className="text-sm font-semibold leading-7 text-white md:text-base">{formatDate(workspace?.opened_at || workspace?.created_at)}</p>
            </div>
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-[#030804] p-4 md:grid-cols-[0.28fr_1fr] md:items-center">
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Proposal sent</p>
              <p className="text-sm font-semibold leading-7 text-white md:text-base">{formatDate(serviceRequest?.created_at)}</p>
            </div>
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-[#030804] p-4 md:grid-cols-[0.28fr_1fr] md:items-center">
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Last update</p>
              <p className="text-sm font-semibold leading-7 text-white md:text-base">{formatDate(workspace?.last_activity_at || workspace?.updated_at)}</p>
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
            <Link href="/client/billing" className="group border border-[#9ed39f]/24 bg-black p-5 transition hover:border-[#9ed39f] hover:bg-[#9ed39f]">
              <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white group-hover:text-black">Billing</h3>
              <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72 group-hover:text-black/72">Review proposal and invoice status.</p>
            </Link>
            <Link href="/client/proposal" className="group border border-[#9ed39f]/24 bg-black p-5 transition hover:border-[#9ed39f] hover:bg-[#9ed39f]">
              <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white group-hover:text-black">Proposal</h3>
              <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72 group-hover:text-black/72">Open the proposal intake.</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
