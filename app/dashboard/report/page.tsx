import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAxiomAuthContext } from "../../../lib/axiom-auth";
import type { AxiomReportJson } from "../../../lib/axiom-report-types";

export const metadata: Metadata = {
  title: "Report Status | Axiom Architect",
  description:
    "View the status of your Axiom Architect workflow audit report.",
};

export const dynamic = "force-dynamic";

type SearchParams = {
  submission_id?: string;
};

type DashboardReportJson = Partial<AxiomReportJson>;

type WorkflowRecord = {
  id: string;
  customer_id: string | null;
  order_id: string | null;
  tier_slug: string | null;
  workflow_title: string | null;
  status: string | null;
};

type OrderRecord = {
  service_name: string | null;
  payment_status: string | null;
  status: string | null;
};

type ReportRecord = {
  id: string;
  status: string | null;
  updated_at: string | null;
  generated_at: string | null;
  quality_score: number | null;
  quality_status: string | null;
  client_summary: string | null;
  report_json: DashboardReportJson | null;
};

type ReportContext = {
  workflow: WorkflowRecord | null;
  order: OrderRecord | null;
  report: ReportRecord | null;
};

const panelClass = "rounded-[1.5rem] border border-[#9ed39f]/30 bg-[#030804] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.24)] sm:p-7";
const eyebrowClass = "text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]";
const bodyClass = "text-sm leading-7 text-[#e6f6e7]/75 sm:text-base";

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
    console.error("Report status request failed", await response.text());
    return null;
  }

  return (await response.json()) as T;
}

async function getReport(submissionId?: string | null) {
  if (!submissionId) {
    return null;
  }

  const reports = await supabaseFetch<ReportRecord[]>(
    `axiom_audit_reports?select=id,status,updated_at,generated_at,quality_score,quality_status,client_summary,report_json&submission_id=eq.${encodeURIComponent(submissionId)}&limit=1`,
  );

  return reports?.[0] ?? null;
}

async function getReportContext(customerId: string, submissionId?: string): Promise<ReportContext> {
  const workflowQuery = submissionId
    ? `axiom_workflow_submissions?select=id,customer_id,order_id,tier_slug,workflow_title,status&id=eq.${encodeURIComponent(submissionId)}&customer_id=eq.${encodeURIComponent(customerId)}&limit=1`
    : `axiom_workflow_submissions?select=id,customer_id,order_id,tier_slug,workflow_title,status&customer_id=eq.${encodeURIComponent(customerId)}&order=updated_at.desc&limit=1`;

  const workflows = await supabaseFetch<WorkflowRecord[]>(workflowQuery);
  const workflow = workflows?.[0] ?? null;

  const orders = workflow?.order_id
    ? await supabaseFetch<OrderRecord[]>(
        `axiom_orders?select=service_name,payment_status,status&id=eq.${encodeURIComponent(workflow.order_id)}&customer_id=eq.${encodeURIComponent(customerId)}&limit=1`,
      )
    : null;

  return {
    workflow,
    order: orders?.[0] ?? null,
    report: await getReport(workflow?.id),
  };
}

function labelFromStatus(status?: string | null) {
  if (!status) {
    return "Pending";
  }

  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value?: string | null) {
  if (!value) {
    return "Not recorded yet";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function hasGeneratedReport(reportJson?: DashboardReportJson | null) {
  return Boolean(
    reportJson &&
      typeof reportJson === "object" &&
      reportJson.executive_summary &&
      reportJson.diagnosis &&
      reportJson.implementation_plan,
  );
}

function safeArray<T>(value?: T[] | null): T[] {
  return Array.isArray(value) ? value : [];
}

function SectionShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className={panelClass}>
      <p className={eyebrowClass}>{eyebrow}</p>
      <h2 className="mt-3 text-[clamp(1.8rem,3vw,3.1rem)] font-black uppercase leading-[0.94] tracking-[-0.06em] text-white">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function ListBlock({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <p className={bodyClass}>No items recorded.</p>;
  }

  return (
    <ul className="grid gap-3">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="flex gap-3 text-sm leading-7 text-[#e6f6e7]/76 sm:text-base">
          <span className="mt-2 h-2 w-2 shrink-0 bg-[#9ed39f]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ActionList({
  title,
  actions,
}: {
  title: string;
  actions: NonNullable<AxiomReportJson["implementation_plan"]>["immediate_actions"];
}) {
  return (
    <div className="rounded-[1.25rem] border border-[#9ed39f]/22 bg-black/40 p-5">
      <h3 className="text-lg font-black uppercase tracking-[-0.03em] text-white">{title}</h3>
      <div className="mt-4 grid gap-4">
        {safeArray(actions).map((action, index) => (
          <article key={`${action.title}-${index}`} className="border border-[#9ed39f]/18 bg-[#061009] p-4">
            <div className="flex flex-wrap gap-2">
              <span className="border border-[#9ed39f]/35 px-2 py-1 text-[0.62rem] font-black uppercase tracking-[0.14em] text-[#9ed39f]">
                {action.priority}
              </span>
              <span className="border border-white/15 px-2 py-1 text-[0.62rem] font-black uppercase tracking-[0.14em] text-white/62">
                {action.owner_type}
              </span>
            </div>
            <h4 className="mt-4 text-lg font-black uppercase leading-tight tracking-[-0.035em] text-white">
              {action.title}
            </h4>
            <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72">
              <strong className="text-[#9ed39f]">Expected outcome:</strong> {action.expected_outcome}
            </p>
            <p className="mt-2 text-sm leading-7 text-[#e6f6e7]/66">
              {action.implementation_note}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

function WaitingReportState({
  hasWorkflow,
  workflowTitle,
  intakeHref,
  reportStatus,
}: {
  hasWorkflow: boolean;
  workflowTitle: string;
  intakeHref: string;
  reportStatus: string;
}) {
  const steps = [
    {
      label: "01",
      title: "Workflow submitted",
      text: hasWorkflow
        ? `${workflowTitle} has been saved as the source material for the report.`
        : "Submit a workflow intake to start the diagnostic report process.",
      state: hasWorkflow ? "complete" : "pending",
    },
    {
      label: "02",
      title: "Report processing",
      text: `Current report status: ${reportStatus}.`,
      state: hasWorkflow ? "active" : "pending",
    },
    {
      label: "03",
      title: "Blueprint preparation",
      text: "The finished report will organise findings, automation suitability, review gates, and implementation guidance.",
      state: "pending",
    },
  ];

  return (
    <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-[1280px] gap-8 lg:grid-cols-[0.82fr_1fr]">
        <article className={panelClass}>
          <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
            Report output
          </p>
          <h2 className="mt-5 text-[clamp(2.1rem,4vw,3.7rem)] font-black uppercase leading-[0.92] tracking-[-0.06em] text-white">
            Diagnostic blueprint waiting for generation.
          </h2>
          <p className="mt-5 text-base leading-8 text-[#e6f6e7]/78 sm:text-lg">
            The finished report will contain the current workflow diagnosis, bottlenecks, automation suitability, assistant opportunities, review gates, and implementation sequence.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href="/dashboard"
              className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white sm:min-w-56"
            >
              Back to dashboard
            </a>
            <a
              href={intakeHref}
              className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f]/45 bg-black px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black sm:min-w-56"
            >
              Review intake
            </a>
          </div>
        </article>

        <div className="grid gap-4">
          {steps.map((step) => (
            <article key={step.label} className="grid gap-4 rounded-[1.25rem] border border-[#9ed39f]/34 bg-[#030804] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.18)] sm:grid-cols-[4.5rem_1fr_auto] sm:items-center">
              <span className="text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">
                {step.label}
              </span>
              <div>
                <h3 className="m-0 text-xl font-black uppercase tracking-[-0.04em] text-white">
                  {step.title}
                </h3>
                <p className="mb-0 mt-2 text-sm leading-7 text-[#e6f6e7]/70">
                  {step.text}
                </p>
              </div>
              <span className="w-fit border border-[#9ed39f]/45 px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">
                {step.state}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function RenderGeneratedReport({
  report,
  reportStatus,
}: {
  report: DashboardReportJson;
  reportStatus: string;
}) {
  const executive = report.executive_summary;
  const scorecard = report.scorecard;
  const currentState = report.current_state;
  const diagnosis = report.diagnosis;
  const automation = report.automation_suitability;
  const riskReview = report.risk_review;
  const futureState = report.future_state;
  const implementation = report.implementation_plan;
  const upgrade = report.upgrade_recommendation;
  const delivery = report.delivery;

  return (
    <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-[1280px] gap-8">
        {reportStatus === "Needs Review" && (
          <div className="rounded-[1.25rem] border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5 text-sm leading-7 text-[#e6f6e7]/78">
            This report has been generated and is marked for review before final delivery.
          </div>
        )}

        {executive && (
          <SectionShell eyebrow="Executive summary" title={executive.headline || "Workflow report summary"}>
            <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
              <p className="text-base leading-8 text-[#e6f6e7]/80 sm:text-lg">
                {executive.plain_english_summary}
              </p>
              <div className="grid gap-4">
                {[
                  ["Strongest opportunity", executive.strongest_opportunity],
                  ["Primary constraint", executive.primary_constraint],
                  ["Next best action", executive.next_best_action],
                ].map(([label, value]) => (
                  <div key={label} className="border border-[#9ed39f]/20 bg-black/38 p-4">
                    <p className={eyebrowClass}>{label}</p>
                    <p className="mt-2 text-sm leading-7 text-[#e6f6e7]/78">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </SectionShell>
        )}

        {scorecard && (
          <SectionShell eyebrow="Scorecard" title="Workflow readiness and report confidence">
            <div className="grid gap-5 lg:grid-cols-[0.38fr_1fr]">
              <div className="rounded-[1.25rem] border border-[#9ed39f]/24 bg-[#9ed39f] p-5 text-black">
                <p className="text-[0.7rem] font-black uppercase tracking-[0.18em] text-black/70">
                  Overall readiness
                </p>
                <p className="mt-5 text-6xl font-black tracking-[-0.08em]">
                  {scorecard.overall_readiness_score ?? "—"}
                </p>
                <p className="mt-2 text-lg font-black uppercase tracking-[-0.04em]">
                  {scorecard.overall_readiness_label || "Not labelled"}
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {safeArray(scorecard.scores).map((score, index) => (
                  <article key={`${score.label}-${index}`} className="border border-[#9ed39f]/20 bg-black/40 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg font-black uppercase leading-tight tracking-[-0.04em] text-white">
                        {score.label}
                      </h3>
                      <span className="text-3xl font-black text-[#9ed39f]">{score.score}</span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/70">{score.rationale}</p>
                    <p className="mt-3 text-sm leading-7 text-white/82">{score.client_meaning}</p>
                  </article>
                ))}
              </div>
            </div>
          </SectionShell>
        )}

        {currentState && (
          <SectionShell eyebrow="Current state" title="Workflow map and operating constraints">
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="border border-[#9ed39f]/20 bg-black/34 p-5">
                <h3 className="text-xl font-black uppercase tracking-[-0.04em] text-white">Workflow purpose</h3>
                <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/76 sm:text-base">{currentState.workflow_purpose}</p>
              </div>
              <div className="border border-[#9ed39f]/20 bg-black/34 p-5">
                <h3 className="text-xl font-black uppercase tracking-[-0.04em] text-white">Tools and systems</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {safeArray(currentState.tools_and_systems).map((tool, index) => (
                    <span key={`${tool}-${index}`} className="border border-[#9ed39f]/28 px-3 py-2 text-[0.7rem] font-black uppercase tracking-[0.12em] text-[#9ed39f]">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
              <div className="border border-[#9ed39f]/20 bg-black/34 p-5">
                <h3 className="text-xl font-black uppercase tracking-[-0.04em] text-white">Current workflow steps</h3>
                <div className="mt-4">
                  <ListBlock items={safeArray(currentState.current_workflow_map)} />
                </div>
              </div>
              <div className="border border-[#9ed39f]/20 bg-black/34 p-5">
                <h3 className="text-xl font-black uppercase tracking-[-0.04em] text-white">Known constraints</h3>
                <div className="mt-4">
                  <ListBlock items={safeArray(currentState.known_constraints)} />
                </div>
              </div>
            </div>
          </SectionShell>
        )}

        {diagnosis && (
          <SectionShell eyebrow="Diagnosis" title="Findings tied to intake evidence">
            <div className="grid gap-5">
              {safeArray(diagnosis.findings).map((finding, index) => (
                <article key={`${finding.title}-${index}`} className="rounded-[1.25rem] border border-[#9ed39f]/22 bg-black/40 p-5">
                  <p className={eyebrowClass}>Finding {String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-3 text-2xl font-black uppercase leading-tight tracking-[-0.05em] text-white">
                    {finding.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-[#e6f6e7]/76 sm:text-base">{finding.observation}</p>
                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <div>
                      <p className={eyebrowClass}>Evidence</p>
                      <div className="mt-3">
                        <ListBlock items={safeArray(finding.evidence)} />
                      </div>
                    </div>
                    <div className="grid gap-4">
                      <p className="text-sm leading-7 text-[#e6f6e7]/75">
                        <strong className="text-[#9ed39f]">Implication:</strong> {finding.implication}
                      </p>
                      <p className="text-sm leading-7 text-[#e6f6e7]/75">
                        <strong className="text-[#9ed39f]">Recommended response:</strong> {finding.recommended_response}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </SectionShell>
        )}

        {automation && (
          <SectionShell eyebrow="Automation suitability" title="What should automate, wait, or stay human-controlled">
            <p className="max-w-4xl text-base leading-8 text-[#e6f6e7]/80 sm:text-lg">{automation.summary}</p>
            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              <div className="border border-[#9ed39f]/22 bg-black/38 p-5">
                <h3 className="text-lg font-black uppercase tracking-[-0.04em] text-white">Suitable now</h3>
                <div className="mt-4"><ListBlock items={safeArray(automation.suitable_now)} /></div>
              </div>
              <div className="border border-[#9ed39f]/22 bg-black/38 p-5">
                <h3 className="text-lg font-black uppercase tracking-[-0.04em] text-white">Suitable later</h3>
                <div className="mt-4"><ListBlock items={safeArray(automation.suitable_later)} /></div>
              </div>
              <div className="border border-[#9ed39f]/22 bg-black/38 p-5">
                <h3 className="text-lg font-black uppercase tracking-[-0.04em] text-white">Not recommended</h3>
                <div className="mt-4"><ListBlock items={safeArray(automation.not_recommended)} /></div>
              </div>
            </div>
            <p className="mt-6 rounded-[1.25rem] border border-[#9ed39f]/25 bg-[#9ed39f]/10 p-5 text-sm leading-7 text-[#e6f6e7]/80 sm:text-base">
              <strong className="text-[#9ed39f]">Boundary:</strong> {automation.reasoned_boundary}
            </p>
          </SectionShell>
        )}

        {safeArray(report.assistant_opportunity_map).length > 0 && (
          <SectionShell eyebrow="Assistant opportunity map" title="Where AI can support the workflow safely">
            <div className="grid gap-5 lg:grid-cols-2">
              {safeArray(report.assistant_opportunity_map).map((opportunity, index) => (
                <article key={`${opportunity.workflow_step}-${index}`} className="rounded-[1.25rem] border border-[#9ed39f]/22 bg-black/40 p-5">
                  <p className={eyebrowClass}>{opportunity.assistant_role}</p>
                  <h3 className="mt-3 text-xl font-black uppercase leading-tight tracking-[-0.04em] text-white">
                    {opportunity.workflow_step}
                  </h3>
                  <div className="mt-5 grid gap-5">
                    <div>
                      <p className={eyebrowClass}>Suitable tasks</p>
                      <div className="mt-3"><ListBlock items={safeArray(opportunity.suitable_tasks)} /></div>
                    </div>
                    <div>
                      <p className={eyebrowClass}>Must not do</p>
                      <div className="mt-3"><ListBlock items={safeArray(opportunity.must_not_do)} /></div>
                    </div>
                    <p className="border border-[#9ed39f]/20 bg-[#061009] p-4 text-sm leading-7 text-[#e6f6e7]/78">
                      <strong className="text-[#9ed39f]">Review gate:</strong> {opportunity.review_gate}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </SectionShell>
        )}

        {riskReview && (
          <SectionShell eyebrow="Risk review" title="Human review gates and control points">
            <div className="mb-6 rounded-[1.25rem] border border-[#9ed39f]/25 bg-[#9ed39f]/10 p-5">
              <p className={eyebrowClass}>Human review level</p>
              <p className="mt-2 text-3xl font-black uppercase tracking-[-0.05em] text-white">
                {riskReview.human_review_level || "Not set"}
              </p>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {safeArray(riskReview.review_gates).map((gate, index) => (
                <article key={`${gate.risk}-${index}`} className="border border-[#9ed39f]/22 bg-black/40 p-5">
                  <span className="border border-[#9ed39f]/35 px-2 py-1 text-[0.62rem] font-black uppercase tracking-[0.14em] text-[#9ed39f]">
                    {gate.level}
                  </span>
                  <h3 className="mt-4 text-xl font-black uppercase leading-tight tracking-[-0.04em] text-white">
                    {gate.risk}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72">{gate.why_it_matters}</p>
                  <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/80">
                    <strong className="text-[#9ed39f]">Review gate:</strong> {gate.review_gate}
                  </p>
                </article>
              ))}
            </div>
          </SectionShell>
        )}

        {futureState && (
          <SectionShell eyebrow="Future state" title="Improved workflow shape">
            <p className="max-w-4xl text-base leading-8 text-[#e6f6e7]/80 sm:text-lg">{futureState.summary}</p>
            <div className="mt-6 grid gap-4">
              {safeArray(futureState.workflow_steps).map((step, index) => (
                <article key={`${step.step}-${index}`} className="grid gap-4 rounded-[1.25rem] border border-[#9ed39f]/22 bg-black/40 p-5 lg:grid-cols-[3rem_1fr]">
                  <span className="text-2xl font-black text-[#9ed39f]">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-xl font-black uppercase leading-tight tracking-[-0.04em] text-white">{step.step}</h3>
                    <div className="mt-4 grid gap-3 text-sm leading-7 text-[#e6f6e7]/72 md:grid-cols-2">
                      <p><strong className="text-[#9ed39f]">Owner:</strong> {step.owner}</p>
                      <p><strong className="text-[#9ed39f]">Output:</strong> {step.output}</p>
                      <p><strong className="text-[#9ed39f]">AI support:</strong> {step.ai_support}</p>
                      <p><strong className="text-[#9ed39f]">Human review:</strong> {step.human_review}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </SectionShell>
        )}

        {implementation && (
          <SectionShell eyebrow="Implementation plan" title="Prioritised next actions">
            <div className="grid gap-5 lg:grid-cols-3">
              <ActionList title="Immediate actions" actions={implementation.immediate_actions} />
              <ActionList title="Next 30 days" actions={implementation.next_30_days} />
              <ActionList title="Later actions" actions={implementation.later_actions} />
            </div>
          </SectionShell>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {upgrade && (
            <SectionShell eyebrow="Upgrade recommendation" title="Suggested next step">
              <p className="text-base leading-8 text-[#e6f6e7]/80 sm:text-lg">{upgrade.recommendation}</p>
              <p className="mt-4 text-sm leading-7 text-[#e6f6e7]/72">
                <strong className="text-[#9ed39f]">Why now or why not:</strong> {upgrade.why_now_or_why_not}
              </p>
              <div className="mt-5">
                <ListBlock items={safeArray(upgrade.evidence)} />
              </div>
              <p className="mt-5 inline-flex border border-[#9ed39f]/35 px-3 py-2 text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">
                {upgrade.recommended_product_slug}
              </p>
            </SectionShell>
          )}

          {diagnosis && (
            <SectionShell eyebrow="Transparency" title="Assumptions and missing information">
              <div className="grid gap-5">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-[-0.04em] text-white">Assumptions</h3>
                  <div className="mt-4"><ListBlock items={safeArray(diagnosis.assumptions)} /></div>
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-[-0.04em] text-white">Missing information</h3>
                  <div className="mt-4"><ListBlock items={safeArray(diagnosis.missing_information)} /></div>
                </div>
              </div>
            </SectionShell>
          )}
        </div>

        {delivery && (
          <section className="rounded-[1.5rem] border border-[#9ed39f]/35 bg-[#9ed39f] p-6 text-black sm:p-8">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-black/70">Delivery note</p>
            <h2 className="mt-3 text-[clamp(1.8rem,3vw,3rem)] font-black uppercase leading-[0.95] tracking-[-0.06em]">
              What this report means now
            </h2>
            <p className="mt-5 max-w-4xl text-base leading-8 text-black/76 sm:text-lg">
              {delivery.client_expectation_note || delivery.dashboard_summary}
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-[0.68rem] font-black uppercase tracking-[0.15em]">
              <span className="border border-black/25 px-3 py-2">PDF: {delivery.pdf_ready ? "Ready" : "Not ready"}</span>
              <span className="border border-black/25 px-3 py-2">Email: {delivery.email_ready ? "Ready" : "Not ready"}</span>
            </div>
          </section>
        )}
      </div>
    </section>
  );
}

export default async function ReportStatusPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { user, customer } = await getAxiomAuthContext();

  if (!user) {
    redirect("/login?redirect=/dashboard/report");
  }

  if (!customer) {
    redirect("/signup?account=required");
  }

  const context = await getReportContext(customer.id, params.submission_id);
  const reportJson = context.report?.report_json;
  const canRenderReport = hasGeneratedReport(reportJson);
  const workflowTitle = context.workflow?.workflow_title || reportJson?.submission?.workflow_title || "No workflow intake found";
  const serviceName = context.order?.service_name || context.workflow?.tier_slug || reportJson?.product_slug || "Workflow audit";
  const intakeStatus = labelFromStatus(context.workflow?.status);
  const reportStatus = labelFromStatus(context.report?.status || (context.workflow ? "queued" : "pending"));
  const reportUpdated = formatDate(context.report?.generated_at || context.report?.updated_at);
  const hasWorkflow = Boolean(context.workflow);
  const intakeHref = context.workflow?.id
    ? `/dashboard/intake?submission_id=${context.workflow.id}`
    : "/dashboard/intake";
  const heroTitle = canRenderReport
    ? "Your workflow report is ready."
    : hasWorkflow
      ? "Your workflow report is in progress."
      : "No report is active yet.";
  const heroCopy = canRenderReport
    ? context.report?.client_summary || reportJson?.delivery?.dashboard_summary || "Your generated report is available below."
    : hasWorkflow
      ? "The intake has been received. This page tracks the report record before the finished blueprint is delivered."
      : "Complete the workflow intake first, then the report status will appear here.";

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <section className="relative overflow-hidden border-b border-[#9ed39f]/20 bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_36%,#000_78%)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto max-w-[1280px]">
          <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
            Report dashboard
          </p>
          <div className="mt-6 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <h1 className="max-w-5xl text-[clamp(2.55rem,6vw,5.8rem)] font-black uppercase leading-[0.9] tracking-[-0.075em] text-white">
                {heroTitle}
              </h1>
            </div>
            <div className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5 text-base leading-8 text-[#e6f6e7]/78 sm:text-lg">
              <p className="m-0 text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-white">
                {workflowTitle}
              </p>
              <p className="mb-0 mt-3">{heroCopy}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#9ed39f] px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-5 lg:grid-cols-5">
          {[
            ["Package", serviceName],
            ["Intake", intakeStatus],
            ["Report", reportStatus],
            ["Quality", context.report?.quality_score !== null && context.report?.quality_score !== undefined ? `${context.report.quality_score}/12` : "Pending"],
            ["Updated", reportUpdated],
          ].map(([label, value]) => (
            <article key={label} className="rounded-[1.25rem] border border-black bg-[#061009] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.26)]">
              <span className="mb-5 block h-2 w-2 bg-[#9ed39f]" />
              <h2 className="text-lg font-black uppercase tracking-[0.02em] text-[#9ed39f]">
                {label}
              </h2>
              <p className="mt-4 text-sm leading-6 text-white/78">{value}</p>
            </article>
          ))}
        </div>
      </section>

      {canRenderReport && reportJson ? (
        <RenderGeneratedReport report={reportJson} reportStatus={reportStatus} />
      ) : (
        <WaitingReportState
          hasWorkflow={hasWorkflow}
          workflowTitle={workflowTitle}
          intakeHref={intakeHref}
          reportStatus={reportStatus}
        />
      )}
    </main>
  );
}
