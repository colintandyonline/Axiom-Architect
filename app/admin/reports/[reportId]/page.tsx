import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { requireAxiomAdmin } from "../../../../lib/axiom-admin";
import type { AxiomReportJson } from "../../../../lib/axiom-report-types";

export const metadata: Metadata = {
  title: "Admin Report Review | Axiom Architect",
  description:
    "Internal Axiom Architect report review page for workflow intake, generated report JSON, quality status, and admin controls.",
};

export const dynamic = "force-dynamic";

type SearchParamValue = string | string[] | undefined;

type PageProps = {
  params: Promise<{ reportId: string }>;
  searchParams: Promise<{
    report_action?: SearchParamValue;
    result?: SearchParamValue;
    message?: SearchParamValue;
  }>;
};

type IntakePayload = {
  fields?: Record<string, unknown>;
};

type CustomerRecord = {
  id: string;
  email: string | null;
  full_name: string | null;
  business_name: string | null;
  account_status: string | null;
  created_at: string | null;
};

type OrderRecord = {
  id: string;
  customer_id: string | null;
  tier_slug: string | null;
  service_name: string | null;
  amount_total: number | null;
  currency: string | null;
  payment_status: string | null;
  status: string | null;
  created_at: string | null;
};

type WorkflowRecord = {
  id: string;
  customer_id: string | null;
  order_id: string | null;
  tier_slug: string | null;
  workflow_title: string | null;
  status: string | null;
  intake_payload: IntakePayload | null;
  created_at: string | null;
  updated_at: string | null;
  submitted_at?: string | null;
  [key: string]: unknown;
};

type ReportJson = Partial<AxiomReportJson>;

type ReportRecord = {
  id: string;
  submission_id: string | null;
  customer_id: string | null;
  order_id: string | null;
  tier_slug: string | null;
  status: string | null;
  quality_score: number | null;
  quality_status: string | null;
  client_summary: string | null;
  report_json: ReportJson | null;
  generated_at: string | null;
  updated_at: string | null;
  created_at?: string | null;
  [key: string]: unknown;
};

type AdminReportContext = {
  report: ReportRecord;
  workflow: WorkflowRecord | null;
  customer: CustomerRecord | null;
  order: OrderRecord | null;
};

const panelClass = "rounded-[1.5rem] border border-[#9ed39f]/30 bg-[#030804] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.24)] sm:p-7";
const eyebrowClass = "text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]";
const bodyClass = "text-sm leading-7 text-[#e6f6e7]/75 sm:text-base";
const buttonClass = "inline-flex min-h-11 items-center justify-center border border-[#9ed39f]/35 bg-black px-4 text-center text-[0.64rem] font-black uppercase tracking-[0.14em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black";
const primaryButtonClass = "inline-flex min-h-11 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-4 text-center text-[0.64rem] font-black uppercase tracking-[0.14em] text-black transition hover:bg-white";

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
    console.error("Admin report review Supabase request failed", path, await response.text());
    return null;
  }

  return (await response.json()) as T;
}

async function getSingleRecord<T>(table: string, id?: string | null) {
  if (!id) {
    return null;
  }

  const records = await supabaseFetch<T[]>(`${table}?select=*&id=eq.${encodeURIComponent(id)}&limit=1`);
  return records?.[0] ?? null;
}

async function getAdminReportContext(reportId: string): Promise<AdminReportContext | null> {
  const report = await getSingleRecord<ReportRecord>("axiom_audit_reports", reportId);

  if (!report) {
    return null;
  }

  const workflow = await getSingleRecord<WorkflowRecord>("axiom_workflow_submissions", report.submission_id);
  const customerId = report.customer_id || workflow?.customer_id || null;
  const orderId = report.order_id || workflow?.order_id || null;

  const [customer, order] = await Promise.all([
    getSingleRecord<CustomerRecord>("axiom_customers", customerId),
    getSingleRecord<OrderRecord>("axiom_orders", orderId),
  ]);

  return {
    report,
    workflow,
    customer,
    order,
  };
}

function firstParam(value: SearchParamValue) {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
}

function formatDate(value?: string | null) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatCurrency(cents?: number | null, currency = "usd") {
  if (typeof cents !== "number") {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

function label(value?: string | null) {
  if (!value) {
    return "—";
  }

  return value.replace(/_/g, " ");
}

function formatKey(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function statusPill(status?: string | null) {
  return (
    <span className="inline-flex w-fit border border-[#9ed39f]/35 px-2 py-1 text-[0.62rem] font-black uppercase tracking-[0.14em] text-[#9ed39f]">
      {label(status)}
    </span>
  );
}

function canGenerate(status?: string | null) {
  return ["queued", "failed", "revision_requested"].includes(status || "");
}

function canRegenerate(status?: string | null) {
  return ["generated", "needs_review", "approved", "delivered"].includes(status || "");
}

function canApprove(status?: string | null) {
  return ["generated", "needs_review"].includes(status || "");
}

function workflowDisplayTitle(workflow?: WorkflowRecord | null, report?: ReportRecord | null) {
  return (
    workflow?.workflow_title ||
    report?.report_json?.submission?.workflow_title ||
    "Untitled workflow report"
  );
}

function renderValue(value: unknown): ReactNode {
  if (value === null || typeof value === "undefined" || value === "") {
    return <span className="text-white/42">—</span>;
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value === "string") {
    return <span className="whitespace-pre-wrap break-words">{value}</span>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="text-white/42">—</span>;
    }

    return (
      <ul className="grid gap-2">
        {value.map((item, index) => (
          <li key={index} className="flex gap-3">
            <span className="mt-2 h-2 w-2 shrink-0 bg-[#9ed39f]" />
            <span>{renderValue(item)}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <pre className="max-h-[28rem] overflow-auto whitespace-pre-wrap break-words border border-[#9ed39f]/16 bg-black/46 p-4 text-xs leading-6 text-[#e6f6e7]/72">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

function getIntakeEntries(workflow?: WorkflowRecord | null) {
  if (!workflow) {
    return [];
  }

  const entries = new Map<string, unknown>();

  entries.set("workflow_title", workflow.workflow_title);
  entries.set("status", workflow.status);
  entries.set("tier_slug", workflow.tier_slug);
  entries.set("submitted_at", workflow.submitted_at || workflow.updated_at);

  const fields = workflow.intake_payload?.fields;

  if (isRecord(fields)) {
    Object.entries(fields).forEach(([key, value]) => {
      entries.set(key, value);
    });
  }

  return Array.from(entries.entries()).filter(([, value]) => {
    if (value === null || typeof value === "undefined") {
      return false;
    }

    if (typeof value === "string" && value.trim() === "") {
      return false;
    }

    return true;
  });
}

function getReviewerNotes(report?: ReportRecord | null) {
  const notes = report?.report_json?.quality_control?.reviewer_notes;
  return Array.isArray(notes) ? notes : [];
}

function DetailCard({ labelText, value }: { labelText: string; value: ReactNode }) {
  return (
    <article className="border border-[#9ed39f]/18 bg-black/34 p-4">
      <p className={eyebrowClass}>{labelText}</p>
      <div className="mt-3 text-sm leading-7 text-[#e6f6e7]/78">{value}</div>
    </article>
  );
}

function SectionShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
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

function ReportActionForm({
  reportId,
  action,
  labelText,
  primary = false,
}: {
  reportId: string;
  action: string;
  labelText: string;
  primary?: boolean;
}) {
  return (
    <form action="/api/admin/reports/action" method="post">
      <input type="hidden" name="report_id" value={reportId} />
      <input type="hidden" name="action" value={action} />
      <input type="hidden" name="return_to" value={`/admin/reports/${reportId}`} />
      <button type="submit" className={primary ? primaryButtonClass : buttonClass}>
        {labelText}
      </button>
    </form>
  );
}

function ActionBanner({
  result,
  action,
  message,
}: {
  result: string;
  action: string;
  message: string;
}) {
  if (!result) {
    return null;
  }

  const isSuccess = result === "success";

  return (
    <div className={`border p-4 text-sm leading-7 ${isSuccess ? "border-[#9ed39f]/35 bg-[#9ed39f]/12 text-[#e6f6e7]/82" : "border-red-400/45 bg-red-950/30 text-red-100"}`}>
      <strong className="uppercase tracking-[0.12em]">
        {isSuccess ? "Action completed" : "Action failed"}
      </strong>
      <span className="ml-2">{label(action)}</span>
      {message ? <span className="ml-2">— {message}</span> : null}
    </div>
  );
}

export default async function AdminReportReviewPage({ params, searchParams }: PageProps) {
  const [{ reportId }, query] = await Promise.all([params, searchParams]);
  const { adminEmail } = await requireAxiomAdmin();
  const context = await getAdminReportContext(reportId);

  if (!context) {
    notFound();
  }

  const { report, workflow, customer, order } = context;
  const workflowTitle = workflowDisplayTitle(workflow, report);
  const reportJsonText = report.report_json ? JSON.stringify(report.report_json, null, 2) : "No report JSON has been saved for this report yet.";
  const intakeEntries = getIntakeEntries(workflow);
  const reviewerNotes = getReviewerNotes(report);
  const actionResult = firstParam(query.result);
  const actionName = firstParam(query.report_action);
  const actionMessage = firstParam(query.message);

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <section className="relative overflow-hidden border-b border-[#9ed39f]/20 bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_36%,#000_78%)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto max-w-[1440px]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
              Internal report review
            </p>
            <a href="/admin#reports" className={buttonClass}>
              Back to admin
            </a>
          </div>
          <div className="mt-6 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <h1 className="max-w-5xl text-[clamp(2.55rem,6vw,5.8rem)] font-black uppercase leading-[0.9] tracking-[-0.075em] text-white">
                Review workflow report.
              </h1>
            </div>
            <div className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5 text-base leading-8 text-[#e6f6e7]/78 sm:text-lg">
              <p className="m-0 text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-white">
                {workflowTitle}
              </p>
              <p className="mb-0 mt-3">
                Signed in as {adminEmail}. Review the linked intake, customer, order, generated JSON, quality notes, and operational controls before delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#9ed39f] px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-6">
          {[
            ["Report", label(report.status)],
            ["Quality", report.quality_score ?? "—"],
            ["Review", label(report.quality_status)],
            ["Service", order?.service_name || label(report.tier_slug)],
            ["Payment", label(order?.payment_status)],
            ["Updated", formatDate(report.generated_at || report.updated_at)],
          ].map(([labelText, value]) => (
            <article key={labelText} className="rounded-[1.25rem] border border-black bg-[#061009] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.26)]">
              <span className="mb-5 block h-2 w-2 bg-[#9ed39f]" />
              <h2 className="text-lg font-black uppercase tracking-[0.02em] text-[#9ed39f]">
                {labelText}
              </h2>
              <p className="mt-4 text-sm leading-6 text-white/78">{value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-8">
          <ActionBanner result={actionResult} action={actionName} message={actionMessage} />

          <SectionShell eyebrow="Admin controls" title="Report actions">
            <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
              <div className="grid gap-4 text-sm leading-7 text-[#e6f6e7]/74 sm:grid-cols-2 lg:grid-cols-4">
                <DetailCard labelText="Report ID" value={report.id} />
                <DetailCard labelText="Submission ID" value={report.submission_id || "—"} />
                <DetailCard labelText="Generated" value={formatDate(report.generated_at)} />
                <DetailCard labelText="Last update" value={formatDate(report.updated_at)} />
              </div>
              <div className="flex flex-wrap gap-3 lg:max-w-[28rem] lg:justify-end">
                {canGenerate(report.status) && (
                  <ReportActionForm reportId={report.id} action="generate" labelText="Generate" primary />
                )}
                {canRegenerate(report.status) && (
                  <ReportActionForm reportId={report.id} action="regenerate" labelText="Regenerate" />
                )}
                {canApprove(report.status) && (
                  <ReportActionForm reportId={report.id} action="approve" labelText="Approve" primary />
                )}
                <ReportActionForm reportId={report.id} action="needs_revision" labelText="Needs revision" />
                <ReportActionForm reportId={report.id} action="queue" labelText="Requeue" />
              </div>
            </div>
          </SectionShell>

          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <SectionShell eyebrow="Linked client" title="Customer and order context">
              <div className="grid gap-4 sm:grid-cols-2">
                <DetailCard labelText="Client" value={customer?.full_name || "—"} />
                <DetailCard labelText="Email" value={customer?.email || "—"} />
                <DetailCard labelText="Business" value={customer?.business_name || "—"} />
                <DetailCard labelText="Account" value={statusPill(customer?.account_status)} />
                <DetailCard labelText="Order" value={order?.service_name || "—"} />
                <DetailCard labelText="Amount" value={formatCurrency(order?.amount_total, order?.currency || "usd")} />
              </div>
            </SectionShell>

            <SectionShell eyebrow="Review notes" title="Quality control notes">
              {reviewerNotes.length > 0 ? (
                <ul className="grid gap-3">
                  {reviewerNotes.map((note, index) => (
                    <li key={`${note}-${index}`} className="flex gap-3 text-sm leading-7 text-[#e6f6e7]/76 sm:text-base">
                      <span className="mt-2 h-2 w-2 shrink-0 bg-[#9ed39f]" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={bodyClass}>No reviewer notes are stored in the report JSON yet.</p>
              )}
              <p className="mt-6 border border-[#9ed39f]/18 bg-black/34 p-4 text-sm leading-7 text-[#e6f6e7]/72">
                <strong className="text-[#9ed39f]">Client summary:</strong> {report.client_summary || "No client summary has been saved yet."}
              </p>
            </SectionShell>
          </div>

          <SectionShell eyebrow="Workflow intake" title="Full intake answers">
            {intakeEntries.length > 0 ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {intakeEntries.map(([key, value]) => (
                  <article key={key} className="border border-[#9ed39f]/18 bg-black/34 p-4">
                    <p className={eyebrowClass}>{formatKey(key)}</p>
                    <div className="mt-3 text-sm leading-7 text-[#e6f6e7]/78">{renderValue(value)}</div>
                  </article>
                ))}
              </div>
            ) : (
              <p className={bodyClass}>No linked workflow intake answers were found for this report.</p>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              {workflow?.id && (
                <a href={`/dashboard/intake?submission_id=${workflow.id}`} className={buttonClass}>
                  View client intake
                </a>
              )}
              {workflow?.id && (
                <a href={`/dashboard/report?submission_id=${workflow.id}`} className={buttonClass}>
                  View client report
                </a>
              )}
            </div>
          </SectionShell>

          <SectionShell eyebrow="Generated report" title="Report JSON payload">
            <pre className="max-h-[44rem] overflow-auto whitespace-pre-wrap break-words border border-[#9ed39f]/18 bg-black/46 p-4 text-xs leading-6 text-[#e6f6e7]/72 sm:p-5">
              {reportJsonText}
            </pre>
          </SectionShell>
        </div>
      </section>
    </main>
  );
}
