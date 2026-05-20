import type { ClientPortalPageContent } from "../lib/axiom-client-portal";
import { clientPortalNav } from "../lib/axiom-client-portal";
import type { ClientPortalLiveData } from "../lib/axiom-client-portal-data";

type ClientPortalPageProps = {
  content: ClientPortalPageContent;
  activePath: string;
  liveData?: ClientPortalLiveData;
};

function getActiveNavItem(activePath: string) {
  return clientPortalNav.find((item) => item.href === activePath) || clientPortalNav[0];
}

function formatLabel(value: string | null | undefined) {
  if (!value) {
    return "Not set";
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

function formatMoney(amount: number | null, currency: string | null | undefined) {
  if (amount === null || amount === undefined) {
    return "Not set";
  }

  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency || "GBP",
  }).format(amount / 100);
}

function getLiveMetrics(liveData?: ClientPortalLiveData) {
  if (!liveData) {
    return [];
  }

  return [
    {
      label: "Workspace",
      value: liveData.workspace ? formatLabel(liveData.workspace.status) : "Not open",
      text: liveData.workspace?.workspace_name || "Your workspace will appear here once your proposal is received.",
    },
    {
      label: "Phase",
      value: liveData.workspace ? formatLabel(liveData.workspace.current_phase) : "Not started",
      text: liveData.workspace?.current_priority || "The current focus will appear here when review begins.",
    },
    {
      label: "Proposal",
      value: liveData.serviceRequest ? formatLabel(liveData.serviceRequest.proposal_status) : "Not submitted",
      text: liveData.serviceRequest ? formatLabel(liveData.serviceRequest.status) : "Submit a proposal to begin review.",
    },
    {
      label: "Latest update",
      value: liveData.latestActivity ? formatLabel(liveData.latestActivity.activity_type) : "No update yet",
      text: liveData.latestActivity?.title || "Updates from Axiom will appear here.",
    },
  ];
}

function getPageRecordRows(activePath: string, liveData?: ClientPortalLiveData) {
  if (!liveData) {
    return [];
  }

  if (activePath === "/client/operations") {
    return [
      { label: "Current phase", value: formatLabel(liveData.workspace?.current_phase) },
      { label: "Current focus", value: liveData.workspace?.current_priority || "Not set" },
      { label: "Next action", value: liveData.workspace?.next_client_action || "No action currently assigned" },
      { label: "Axiom focus", value: liveData.workspace?.axiom_review_focus || "Not set" },
      { label: "Open approvals", value: String(liveData.approvalGates.filter((gate) => gate.status === "open").length) },
      { label: "Latest update", value: liveData.latestActivity?.title || "No update yet" },
    ];
  }

  if (activePath === "/client/documents") {
    return [
      { label: "Files received", value: String(liveData.documents.length) },
      { label: "Under review", value: String(liveData.documents.filter((document) => document.review_status === "under_review").length) },
      { label: "Needs clarification", value: String(liveData.documents.filter((document) => document.review_status === "needs_clarification").length) },
      { label: "Latest file", value: liveData.documents[0]?.title || liveData.documents[0]?.original_filename || "No files yet" },
    ];
  }

  if (activePath === "/client/deliverables") {
    return [
      { label: "Outputs", value: String(liveData.deliverables.length) },
      { label: "Ready for review", value: String(liveData.deliverables.filter((deliverable) => deliverable.status === "ready_for_review").length) },
      { label: "Approved", value: String(liveData.deliverables.filter((deliverable) => deliverable.status === "approved").length) },
      { label: "Latest output", value: liveData.deliverables[0]?.title || "No outputs yet" },
    ];
  }

  if (activePath === "/client/billing") {
    const latestInvoice = liveData.invoices[0];

    return [
      { label: "Invoices", value: String(liveData.invoices.length) },
      { label: "Latest invoice", value: latestInvoice?.invoice_number || latestInvoice?.title || "No invoices yet" },
      { label: "Latest amount", value: latestInvoice ? formatMoney(latestInvoice.amount_due, latestInvoice.currency) : "Not set" },
      { label: "Payment status", value: latestInvoice ? formatLabel(latestInvoice.status) : "No payment due" },
    ];
  }

  if (activePath === "/client/account") {
    return [
      { label: "Name", value: liveData.customer.full_name || liveData.user.email || "Not set" },
      { label: "Email", value: liveData.customer.email || liveData.user.email || "Not set" },
      { label: "Business", value: liveData.customer.business_name || "Not set" },
      { label: "Status", value: formatLabel(liveData.customer.account_status) },
    ];
  }

  return [
    { label: "Workspace", value: liveData.workspace?.workspace_name || "No workspace yet" },
    { label: "Review status", value: liveData.serviceRequest ? formatLabel(liveData.serviceRequest.status) : "No proposal yet" },
    { label: "Proposal", value: liveData.serviceRequest ? formatLabel(liveData.serviceRequest.proposal_status) : "Not prepared" },
    { label: "Next action", value: liveData.workspace?.next_client_action || "Submit a proposal or wait for Axiom review." },
    { label: "Latest update", value: liveData.latestActivity?.title || "No update yet" },
    { label: "Updated", value: formatDate(liveData.latestActivity?.created_at) },
  ];
}

export function ClientPortalPage({ content, activePath, liveData }: ClientPortalPageProps) {
  const activeNavItem = getActiveNavItem(activePath);
  const liveMetrics = getLiveMetrics(liveData);
  const pageRecordRows = getPageRecordRows(activePath, liveData);
  const showStaticMetrics = liveMetrics.length === 0;

  return (
    <>
      <section className="relative overflow-hidden border-b border-[#9ed39f]/20 bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_34%,#000_78%)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto max-w-[1440px]">
          <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
            {content.eyebrow}
          </p>

          <div className="mt-6 grid gap-8 lg:grid-cols-[0.92fr_0.72fr] lg:items-end">
            <div>
              <h1 className="max-w-6xl text-[clamp(2.75rem,6vw,6.2rem)] font-black uppercase leading-[0.88] tracking-[-0.08em] text-white">
                {content.title}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[#e6f6e7]/76 sm:text-lg">
                {content.intro}
              </p>
            </div>

            <aside className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5">
              <p className="m-0 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">
                Portal area
              </p>
              <p className="mt-4 text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-white">
                {activeNavItem.label}
              </p>
              <p className="mb-0 mt-3 text-sm leading-7 text-[#e6f6e7]/72">
                {activeNavItem.description}
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-[#9ed39f] px-4 py-12 text-black sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-6 lg:grid-cols-[0.42fr_1fr] lg:items-end">
          <div>
            <p className="inline-flex border border-black bg-black px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-[#9ed39f]">
              {content.summaryLabel}
            </p>
            <h2 className="mt-5 text-[clamp(2.1rem,4vw,4.4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-black">
              {content.summaryTitle}
            </h2>
          </div>
          <p className="max-w-4xl text-base leading-8 text-black/76 sm:text-lg">
            {content.summaryText}
          </p>
        </div>
      </section>

      {liveMetrics.length > 0 && (
        <section className="bg-[#020904] px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {liveMetrics.map((metric) => (
                <article key={`${metric.label}-${metric.value}`} className="rounded-[1.25rem] border border-[#9ed39f]/30 bg-black p-5 shadow-[0_18px_40px_rgba(0,0,0,0.3)]">
                  <span className="mb-5 block h-2 w-2 bg-[#9ed39f]" />
                  <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">{metric.label}</p>
                  <h2 className="mt-3 text-2xl font-black uppercase leading-tight tracking-[-0.05em] text-white">{metric.value}</h2>
                  <p className="mt-4 text-sm leading-6 text-[#e6f6e7]/72">{metric.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {pageRecordRows.length > 0 && (
        <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[0.45fr_1fr]">
            <div>
              <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
                Workspace snapshot
              </p>
              <h2 className="mt-5 text-[clamp(2.1rem,4vw,4.4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">
                Your current position.
              </h2>
              <p className="mt-5 text-sm leading-7 text-[#e6f6e7]/70">
                The latest status, next action, and workspace details for this engagement.
              </p>
            </div>

            <div className="grid gap-3">
              {pageRecordRows.map((row) => (
                <div key={`${row.label}-${row.value}`} className="grid gap-2 border border-[#9ed39f]/20 bg-[#030804] p-4 md:grid-cols-[0.32fr_1fr] md:items-center">
                  <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">{row.label}</p>
                  <p className="text-sm font-semibold leading-7 text-white md:text-base">{row.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {showStaticMetrics && (
        <section className="bg-black px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-[1440px] gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {content.metrics.map((metric) => (
              <article key={`${metric.label}-${metric.value}`} className="rounded-[1.25rem] border border-[#9ed39f]/24 bg-[#030804] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.26)]">
                <span className="mb-5 block h-2 w-2 bg-[#9ed39f]" />
                <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">{metric.label}</p>
                <h2 className="mt-3 text-2xl font-black uppercase leading-tight tracking-[-0.05em] text-white">{metric.value}</h2>
                <p className="mt-4 text-sm leading-6 text-[#e6f6e7]/72">{metric.text}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {content.sections.map((section) => (
        <section key={`${section.eyebrow}-${section.title}`} className="bg-[#020904] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid gap-8 lg:grid-cols-[0.45fr_1fr] lg:items-end">
              <div>
                <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
                  {section.eyebrow}
                </p>
                <h2 className="mt-5 text-[clamp(2.1rem,4vw,4.4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">
                  {section.title}
                </h2>
              </div>
              <p className="max-w-3xl text-base leading-8 text-[#e6f6e7]/75 sm:text-lg">
                {section.intro}
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {section.items.map((item) => (
                <article key={`${section.title}-${item.label}-${item.title}`} className="border border-[#9ed39f]/24 bg-black p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">
                      {item.label}
                    </span>
                    <span className="h-2 w-2 bg-[#9ed39f]" />
                  </div>
                  <h3 className="mt-4 text-2xl font-black uppercase leading-tight tracking-[-0.05em] text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      {content.actions && content.actions.length > 0 && (
        <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid gap-8 lg:grid-cols-[0.55fr_1fr] lg:items-end">
              <div>
                <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
                  Next steps
                </p>
                <h2 className="mt-5 text-[clamp(2.1rem,4vw,4.4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">
                  Continue from here.
                </h2>
              </div>
              <p className="max-w-3xl text-base leading-8 text-[#e6f6e7]/75 sm:text-lg">
                Use these shortcuts to continue the engagement, review progress, or check the material connected to your workspace.
              </p>
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {content.actions.map((action) => (
                <a key={action.href} href={action.href} className="group border border-[#9ed39f]/24 bg-[#030804] p-5 transition hover:border-[#9ed39f] hover:bg-[#9ed39f]">
                  <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white group-hover:text-black">
                    {action.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72 group-hover:text-black/72">
                    {action.text}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
