import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workflow Received | Axiom Architect",
  description:
    "Confirmation page for submitted Axiom Architect workflow audits, enterprise architecture intakes, and stewardship updates.",
};

export const dynamic = "force-dynamic";

type SearchParams = {
  submission_id?: string;
};

type SubmissionRecord = {
  id: string;
  tier_slug: string | null;
  workflow_title: string | null;
  status: string;
  submitted_at: string | null;
  axiom_orders: {
    service_name: string;
    amount_total: number | null;
    currency: string | null;
  } | null;
  axiom_customers: {
    full_name: string | null;
    business_name: string | null;
    email: string | null;
  } | null;
  axiom_audit_reports: Array<{
    status: string;
    updated_at: string | null;
  }> | null;
};

type HandoffCopy = {
  eyebrow: string;
  headline: string;
  intro: string;
  nextHeading: string;
  nextText: string;
  secondaryAction: string;
  timeline: Array<[string, string, string]>;
  reviewAreas: string[];
};

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return {
    url: url.replace(/\/$/, ""),
    serviceRoleKey,
  };
}

async function supabaseFetch<T>(path: string): Promise<T | null> {
  const config = getSupabaseConfig();

  if (!config) {
    return null;
  }

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    cache: "no-store",
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("Received page Supabase request failed", await response.text());
    return null;
  }

  return (await response.json()) as T;
}

async function getSubmission(submissionId?: string) {
  if (!submissionId) {
    return null;
  }

  const records = await supabaseFetch<SubmissionRecord[]>(
    `axiom_workflow_submissions?select=id,tier_slug,workflow_title,status,submitted_at,axiom_orders(service_name,amount_total,currency),axiom_customers(full_name,business_name,email),axiom_audit_reports(status,updated_at)&id=eq.${encodeURIComponent(submissionId)}&limit=1`,
  );

  return records?.[0] ?? null;
}

function formatStatus(status?: string | null) {
  return status ? status.replace(/_/g, " ") : "pending";
}

function formatDate(value?: string | null) {
  if (!value) {
    return "Received";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Received";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getHandoffCopy(tierSlug?: string | null): HandoffCopy {
  if (tierSlug === "workflow-stewardship") {
    return {
      eyebrow: "Stewardship update received",
      headline: "Your workflow stewardship update has been received.",
      intro:
        "The update is now attached to your stewardship record. Axiom can review the new evidence against the previous workflow state, current risks, recurring friction, and the next improvement window.",
      nextHeading: "The next stewardship brief is queued.",
      nextText:
        "Your update has been saved as structured source material for the next monthly review. Axiom will use it to identify workflow drift, new bottlenecks, changed tools or responsibilities, and the safest next actions.",
      secondaryAction: "Review submitted update",
      timeline: [
        [
          "01",
          "Update received",
          "Your monthly workflow changes, issues, examples, and decisions have been saved against the stewardship record.",
        ],
        [
          "02",
          "Axiom review",
          "The update can now be reviewed against the previous brief, operating risks, tool changes, and current handoff issues.",
        ],
        [
          "03",
          "Brief delivery",
          "When the stewardship brief is ready, your dashboard will show the latest review status and delivery route.",
        ],
      ],
      reviewAreas: [
        "Workflow drift since the last review.",
        "New delays, errors, exceptions, or repeated friction.",
        "Changes in tools, responsibilities, data, volume, or handoffs.",
        "Safe next actions for the coming review window.",
      ],
    };
  }

  if (tierSlug === "architect-residency" || tierSlug === "enterprise-architecture-system") {
    return {
      eyebrow: "Enterprise intake received",
      headline: "Your enterprise architecture intake has been received.",
      intro:
        "The intake is now attached to your enterprise architecture record. Axiom can review the operating context, workflow dependencies, risk controls, team handoffs, and implementation priorities before preparing the architecture report.",
      nextHeading: "The enterprise architecture record is queued.",
      nextText:
        "Your answers have been saved as structured source material. Axiom can now assess how the workflows connect, where automation belongs, where human review must remain, and what the future operating system should look like.",
      secondaryAction: "Review submitted intake",
      timeline: [
        [
          "01",
          "Enterprise intake received",
          "Your scope, workflows, systems, dependencies, and operating constraints have been saved.",
        ],
        [
          "02",
          "Architecture review",
          "The queued record is ready for dependency mapping, risk review, tool-stack assessment, and implementation planning.",
        ],
        [
          "03",
          "Report delivery",
          "When the architecture report is ready, the dashboard will show the report status and delivery link.",
        ],
      ],
      reviewAreas: [
        "Current workflow and dependency structure.",
        "Operational risk points and review-gate requirements.",
        "Tool-stack, data-flow, and handoff suitability.",
        "Future-state architecture and implementation sequence.",
      ],
    };
  }

  return {
    eyebrow: "Workflow intake received",
    headline: "Your workflow intake has been received.",
    intro:
      "The intake is now locked into the report pipeline. Axiom can review the workflow steps, bottlenecks, handoffs, tool involvement, risks, and improvement goals before preparing the report output.",
    nextHeading: "The report record is now queued.",
    nextText:
      "Your intake has been saved as structured source material. Axiom Architect can now use that record to produce diagnostic findings, review gates, implementation recommendations, and the final report output.",
    secondaryAction: "Review submitted intake",
    timeline: [
      [
        "01",
        "Intake received",
        "Your workflow details have been saved against the paid service record.",
      ],
      [
        "02",
        "Report processing",
        "The queued report record is ready for review, generation, and quality control.",
      ],
      [
        "03",
        "Delivery",
        "When the report is ready, the dashboard will show the report status and delivery link.",
      ],
    ],
    reviewAreas: [
      "Workflow steps, delays, and repeated bottlenecks.",
      "Tools, documents, inboxes, dashboards, and systems involved.",
      "Human decisions, approval points, handoffs, and exception handling.",
      "Automation suitability, risk boundaries, and practical next steps.",
    ],
  };
}

const summaryCardClass =
  "rounded-[1.25rem] border border-black bg-[#061009] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.26)]";
const summaryHeadingClass = "text-lg font-black uppercase tracking-[0.02em] text-[#9ed39f]";
const summaryBodyClass = "mt-4 text-sm leading-6 text-white/78";

export default async function IntakeReceivedPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const submission = await getSubmission(params.submission_id);
  const reportStatus = submission?.axiom_audit_reports?.[0]?.status || "queued";
  const workflowTitle = submission?.workflow_title || "Submitted workflow";
  const serviceName = submission?.axiom_orders?.service_name || submission?.tier_slug || "Workflow Audit";
  const businessName = submission?.axiom_customers?.business_name || "Your business";
  const receivedAt = formatDate(submission?.submitted_at);
  const dashboardHref = params.submission_id
    ? `/dashboard?submission_id=${params.submission_id}`
    : "/dashboard";
  const handoff = getHandoffCopy(submission?.tier_slug);

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <section className="relative overflow-hidden border-b border-[#9ed39f]/20 bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_36%,#000_78%)] px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto max-w-[1220px]">
          <a
            href="/dashboard"
            className="inline-flex border border-[#9ed39f]/45 bg-black px-4 py-3 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black"
          >
            Axiom Architect
          </a>

          <p className="mt-10 inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
            {handoff.eyebrow}
          </p>

          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_0.72fr] lg:items-end">
            <div>
              <h1 className="max-w-5xl text-[clamp(2.65rem,6vw,5.9rem)] font-black uppercase leading-[0.9] tracking-[-0.075em] text-white">
                {handoff.headline}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[#e6f6e7]/75 sm:text-lg">
                {handoff.intro}
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href={dashboardHref}
                  className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white"
                >
                  View dashboard status
                </a>
                {params.submission_id && (
                  <a
                    href={`/dashboard/intake?submission_id=${params.submission_id}`}
                    className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f]/45 bg-black px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black"
                  >
                    {handoff.secondaryAction}
                  </a>
                )}
              </div>
            </div>

            <aside className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5">
              <p className="m-0 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">
                Confirmation record
              </p>
              <div className="mt-5 grid gap-3 text-sm leading-6 text-[#e6f6e7]/78">
                <p className="m-0">
                  <strong className="text-white">Submission ID:</strong> {params.submission_id || "Missing"}
                </p>
                <p className="m-0">
                  <strong className="text-white">Received:</strong> {receivedAt}
                </p>
                <p className="m-0">
                  <strong className="text-white">Report status:</strong> {formatStatus(reportStatus)}
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-[#9ed39f] px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1220px] grid-cols-1 gap-5 lg:grid-cols-4">
          <article className={summaryCardClass}>
            <span className="mb-5 block h-2 w-2 bg-[#9ed39f]" />
            <h2 className={summaryHeadingClass}>Selected service</h2>
            <p className={summaryBodyClass}>{serviceName}</p>
          </article>
          <article className={summaryCardClass}>
            <span className="mb-5 block h-2 w-2 bg-[#9ed39f]" />
            <h2 className={summaryHeadingClass}>Workflow</h2>
            <p className={summaryBodyClass}>{workflowTitle}</p>
          </article>
          <article className={summaryCardClass}>
            <span className="mb-5 block h-2 w-2 bg-[#9ed39f]" />
            <h2 className={summaryHeadingClass}>Business</h2>
            <p className={summaryBodyClass}>{businessName}</p>
          </article>
          <article className={summaryCardClass}>
            <span className="mb-5 block h-2 w-2 bg-[#9ed39f]" />
            <h2 className={summaryHeadingClass}>Status</h2>
            <p className={summaryBodyClass}>
              Intake {formatStatus(submission?.status)} · Report {formatStatus(reportStatus)}
            </p>
          </article>
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1220px] gap-8 lg:grid-cols-[0.78fr_1fr]">
          <div className="border border-[#9ed39f]/32 bg-[#030804] p-6 sm:p-8">
            <p className="m-0 text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">
              What happens next
            </p>
            <h2 className="mt-5 text-[clamp(2rem,4vw,3.7rem)] font-black uppercase leading-[0.92] tracking-[-0.06em] text-white">
              {handoff.nextHeading}
            </h2>
            <p className="mt-5 text-base leading-8 text-[#e6f6e7]/75">
              {handoff.nextText}
            </p>

            <div className="mt-8 border border-[#9ed39f]/22 bg-[#9ed39f]/10 p-5">
              <p className="m-0 text-[0.7rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">
                Axiom review focus
              </p>
              <div className="mt-4 grid gap-3">
                {handoff.reviewAreas.map((area) => (
                  <p key={area} className="m-0 flex gap-3 text-sm leading-7 text-[#e6f6e7]/75">
                    <span className="mt-2 h-2 w-2 shrink-0 bg-[#9ed39f]" />
                    <span>{area}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {handoff.timeline.map(([number, title, text]) => (
              <article key={number} className="grid gap-4 border border-[#9ed39f]/28 bg-[#030804] p-5 sm:grid-cols-[4rem_1fr]">
                <span className="text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">{number}</span>
                <div>
                  <h3 className="m-0 text-xl font-black uppercase tracking-[-0.04em] text-white">{title}</h3>
                  <p className="mb-0 mt-2 text-sm leading-7 text-[#e6f6e7]/70">{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-[1220px] flex-col gap-4 sm:flex-row">
          <a
            href={dashboardHref}
            className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white"
          >
            View dashboard status
          </a>
          {params.submission_id && (
            <a
              href={`/dashboard/intake?submission_id=${params.submission_id}`}
              className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f]/45 bg-black px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black"
            >
              {handoff.secondaryAction}
            </a>
          )}
        </div>
      </section>
    </main>
  );
}
