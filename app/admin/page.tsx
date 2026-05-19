import type { Metadata } from "next";
import { requireAxiomAdmin } from "../../lib/axiom-admin";

export const metadata: Metadata = {
  title: "Admin Console | Axiom Architect",
  description:
    "Internal Axiom Architect operations console for clients, orders, workflow submissions, reports, and service performance.",
};

export const dynamic = "force-dynamic";

type CustomerRecord = {
  id: string;
  auth_user_id: string | null;
  email: string | null;
  full_name: string | null;
  business_name: string | null;
  account_status: string | null;
  created_at: string | null;
  last_login_at: string | null;
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
  updated_at: string | null;
};

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
  generated_at: string | null;
  updated_at: string | null;
};

type AdminStats = {
  customers: number;
  orders: number;
  paidOrders: number;
  submittedWorkflows: number;
  queuedReports: number;
  generatedReports: number;
  revenueCents: number;
};

const panelClass = "rounded-[1.5rem] border border-[#9ed39f]/30 bg-[#030804] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.24)] sm:p-7";
const eyebrowClass = "text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]";
const reportButtonClass = "inline-flex min-h-10 items-center justify-center border border-[#9ed39f]/35 bg-black px-3 text-center text-[0.62rem] font-black uppercase tracking-[0.14em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black";
const reportPrimaryButtonClass = "inline-flex min-h-10 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-3 text-center text-[0.62rem] font-black uppercase tracking-[0.14em] text-black transition hover:bg-white";

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
    console.error("Admin console Supabase request failed", path, await response.text());
    return null;
  }

  return (await response.json()) as T;
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

function formatCurrency(cents: number, currency = "usd") {
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

function workflowDisplayTitle(workflow?: WorkflowRecord | null) {
  if (!workflow) {
    return "Linked workflow not found";
  }

  return workflow.workflow_title || "Untitled draft workflow";
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="border border-[#9ed39f]/20 bg-black/36 p-5 text-sm leading-7 text-white/68">
      {text}
    </div>
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
      <button type="submit" className={primary ? reportPrimaryButtonClass : reportButtonClass}>
        {labelText}
      </button>
    </form>
  );
}

async function getAdminData() {
  const [customers, orders, workflows, reports] = await Promise.all([
    supabaseFetch<CustomerRecord[]>(
      "axiom_customers?select=id,auth_user_id,email,full_name,business_name,account_status,created_at,last_login_at&order=created_at.desc&limit=50",
    ),
    supabaseFetch<OrderRecord[]>(
      "axiom_orders?select=id,customer_id,tier_slug,service_name,amount_total,currency,payment_status,status,created_at&order=created_at.desc&limit=50",
    ),
    supabaseFetch<WorkflowRecord[]>(
      "axiom_workflow_submissions?select=id,customer_id,order_id,tier_slug,workflow_title,status,updated_at&order=updated_at.desc&limit=100",
    ),
    supabaseFetch<ReportRecord[]>(
      "axiom_audit_reports?select=id,submission_id,customer_id,order_id,tier_slug,status,quality_score,quality_status,client_summary,generated_at,updated_at&order=updated_at.desc&limit=50",
    ),
  ]);

  const customerRows = customers || [];
  const orderRows = orders || [];
  const workflowRows = workflows || [];
  const reportRows = reports || [];

  const stats: AdminStats = {
    customers: customerRows.length,
    orders: orderRows.length,
    paidOrders: orderRows.filter((order) => order.payment_status === "paid").length,
    submittedWorkflows: workflowRows.filter((workflow) => workflow.status && workflow.status !== "draft").length,
    queuedReports: reportRows.filter((report) => ["queued", "generating", "needs_review"].includes(report.status || "")).length,
    generatedReports: reportRows.filter((report) => ["generated", "approved", "delivered"].includes(report.status || "")).length,
    revenueCents: orderRows
      .filter((order) => order.payment_status === "paid")
      .reduce((sum, order) => sum + (order.amount_total || 0), 0),
  };

  return {
    customers: customerRows,
    orders: orderRows,
    workflows: workflowRows,
    reports: reportRows,
    stats,
  };
}

function StatCard({ labelText, value, helper }: { labelText: string; value: string; helper: string }) {
  return (
    <article className="rounded-[1.25rem] border border-black bg-[#061009] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.26)]">
      <span className="mb-5 block h-2 w-2 bg-[#9ed39f]" />
      <h2 className="text-lg font-black uppercase tracking-[0.02em] text-[#9ed39f]">
        {labelText}
      </h2>
      <p className="mt-4 text-3xl font-black uppercase tracking-[-0.055em] text-white">{value}</p>
      <p className="mt-3 text-sm leading-6 text-white/68">{helper}</p>
    </article>
  );
}

function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className={panelClass}>
      <p className={eyebrowClass}>{eyebrow}</p>
      <h2 className="mt-3 text-[clamp(1.8rem,3vw,3.1rem)] font-black uppercase leading-[0.94] tracking-[-0.06em] text-white">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default async function AdminDashboardPage() {
  const { adminEmail } = await requireAxiomAdmin();
  const data = await getAdminData();
  const workflowsById = new Map(data.workflows.map((workflow) => [workflow.id, workflow]));
  const reportsBySubmissionId = new Map(
    data.reports
      .filter((report) => report.submission_id)
      .map((report) => [report.submission_id as string, report]),
  );
  const submittedWorkflows = data.workflows.filter((workflow) => workflow.status && workflow.status !== "draft");
  const draftWorkflows = data.workflows.filter((workflow) => !workflow.status || workflow.status === "draft");

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <section className="relative overflow-hidden border-b border-[#9ed39f]/20 bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_36%,#000_78%)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto max-w-[1440px]">
          <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
            Internal console
          </p>
          <div className="mt-6 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <h1 className="max-w-5xl text-[clamp(2.65rem,6vw,5.8rem)] font-black uppercase leading-[0.9] tracking-[-0.075em] text-white">
                Axiom operations dashboard.
              </h1>
            </div>
            <div className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5 text-base leading-8 text-[#e6f6e7]/78 sm:text-lg">
              <p className="m-0 text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-white">
                Signed in as {adminEmail}
              </p>
              <p className="mb-0 mt-3">
                Monitor customers, orders, workflow submissions, report status, revenue, and operational readiness from one protected console.
              </p>
            </div>
          </div>
        </div>
      </section>

      <nav className="sticky top-0 z-20 border-b border-[#9ed39f]/20 bg-black/92 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1440px] gap-3 overflow-x-auto text-[0.68rem] font-black uppercase tracking-[0.16em]">
          {[
            ["Overview", "#overview"],
            ["Clients", "#clients"],
            ["Orders", "#orders"],
            ["Workflows", "#workflows"],
            ["Reports", "#reports"],
            ["Analytics", "#analytics"],
          ].map(([text, href]) => (
            <a key={href} href={href} className="shrink-0 border border-[#9ed39f]/30 px-4 py-3 text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black">
              {text}
            </a>
          ))}
        </div>
      </nav>

      <section id="overview" className="bg-[#9ed39f] px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-6">
          <StatCard labelText="Clients" value={String(data.stats.customers)} helper="Recent customer records" />
          <StatCard labelText="Orders" value={String(data.stats.orders)} helper="Recent order records" />
          <StatCard labelText="Paid" value={String(data.stats.paidOrders)} helper="Paid orders in view" />
          <StatCard labelText="Revenue" value={formatCurrency(data.stats.revenueCents)} helper="Paid revenue in view" />
          <StatCard labelText="Submissions" value={String(data.stats.submittedWorkflows)} helper="Submitted workflows" />
          <StatCard labelText="Reports" value={`${data.stats.generatedReports}/${data.stats.queuedReports}`} helper="Generated / active queue" />
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-8">
          <Section id="clients" eyebrow="Client records" title="Customers and account status">
            <div className="overflow-x-auto">
              <table className="min-w-[920px] w-full border-collapse text-left text-sm">
                <thead className="text-[0.68rem] uppercase tracking-[0.16em] text-[#9ed39f]">
                  <tr>{["Name", "Email", "Business", "Status", "Created", "Last login"].map((heading) => <th key={heading} className="border-b border-[#9ed39f]/20 p-3">{heading}</th>)}</tr>
                </thead>
                <tbody>
                  {data.customers.map((customer) => (
                    <tr key={customer.id} className="border-b border-[#9ed39f]/12 text-white/76">
                      <td className="p-3 font-bold text-white">{customer.full_name || "—"}</td>
                      <td className="p-3">{customer.email || "—"}</td>
                      <td className="p-3">{customer.business_name || "—"}</td>
                      <td className="p-3">{statusPill(customer.account_status)}</td>
                      <td className="p-3">{formatDate(customer.created_at)}</td>
                      <td className="p-3">{formatDate(customer.last_login_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section id="orders" eyebrow="Commercial overview" title="Orders and financial status">
            <div className="overflow-x-auto">
              <table className="min-w-[920px] w-full border-collapse text-left text-sm">
                <thead className="text-[0.68rem] uppercase tracking-[0.16em] text-[#9ed39f]">
                  <tr>{["Service", "Tier", "Amount", "Payment", "Order", "Created"].map((heading) => <th key={heading} className="border-b border-[#9ed39f]/20 p-3">{heading}</th>)}</tr>
                </thead>
                <tbody>
                  {data.orders.map((order) => (
                    <tr key={order.id} className="border-b border-[#9ed39f]/12 text-white/76">
                      <td className="p-3 font-bold text-white">{order.service_name || "—"}</td>
                      <td className="p-3">{label(order.tier_slug)}</td>
                      <td className="p-3">{formatCurrency(order.amount_total || 0, order.currency || "usd")}</td>
                      <td className="p-3">{statusPill(order.payment_status)}</td>
                      <td className="p-3">{statusPill(order.status)}</td>
                      <td className="p-3">{formatDate(order.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section id="workflows" eyebrow="Workflow estate" title="Submitted workflow intakes">
            {submittedWorkflows.length > 0 ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {submittedWorkflows.map((workflow) => {
                  const linkedReport = reportsBySubmissionId.get(workflow.id);

                  return (
                    <article key={workflow.id} className="border border-[#9ed39f]/20 bg-black/36 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className={eyebrowClass}>{label(workflow.tier_slug)}</p>
                        {statusPill(workflow.status)}
                      </div>
                      <h3 className="mt-3 text-xl font-black uppercase leading-tight tracking-[-0.04em] text-white">
                        {workflowDisplayTitle(workflow)}
                      </h3>
                      <div className="mt-4 grid gap-3 text-sm leading-7 text-white/68 sm:grid-cols-2">
                        <p><strong className="text-[#9ed39f]">Workflow updated:</strong> {formatDate(workflow.updated_at)}</p>
                        <p><strong className="text-[#9ed39f]">Linked report:</strong> {label(linkedReport?.status)}</p>
                      </div>
                      <div className="mt-5 flex flex-wrap gap-3">
                        <a href={`/dashboard/intake?submission_id=${workflow.id}`} className={reportButtonClass}>
                          View intake
                        </a>
                        {linkedReport && (
                          <>
                            <a href={`/dashboard/report?submission_id=${workflow.id}`} className={reportButtonClass}>
                              View report
                            </a>
                            <a href={`/admin/reports/${linkedReport.id}`} className={reportPrimaryButtonClass}>
                              Review report
                            </a>
                          </>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <EmptyState text="No submitted workflow intakes are currently in view." />
            )}

            {draftWorkflows.length > 0 && (
              <div className="mt-8 border-t border-[#9ed39f]/18 pt-6">
                <p className={eyebrowClass}>Draft intake records</p>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-white/64">
                  Drafts are incomplete intake records. They are shown separately so they are not confused with submitted client work.
                </p>
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  {draftWorkflows.map((workflow) => (
                    <article key={workflow.id} className="border border-[#9ed39f]/14 bg-black/24 p-5 opacity-75">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className={eyebrowClass}>{label(workflow.tier_slug)}</p>
                        {statusPill(workflow.status)}
                      </div>
                      <h3 className="mt-3 text-lg font-black uppercase leading-tight tracking-[-0.04em] text-white">
                        {workflowDisplayTitle(workflow)}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-white/62">Updated {formatDate(workflow.updated_at)}</p>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </Section>

          <Section id="reports" eyebrow="Report operations" title="Report queue linked to workflow intakes">
            <div className="grid gap-4 lg:grid-cols-2">
              {data.reports.map((report) => {
                const linkedWorkflow = report.submission_id ? workflowsById.get(report.submission_id) : null;
                const linkedWorkflowTitle = workflowDisplayTitle(linkedWorkflow);

                return (
                  <article key={report.id} className="border border-[#9ed39f]/20 bg-black/36 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className={eyebrowClass}>{label(report.tier_slug)}</p>
                      {statusPill(report.status)}
                    </div>
                    <h3 className="mt-3 text-xl font-black uppercase leading-tight tracking-[-0.04em] text-white">
                      {linkedWorkflowTitle}
                    </h3>
                    <p className="mt-4 border border-[#9ed39f]/16 bg-black/30 p-4 text-sm leading-7 text-white/70">
                      <strong className="text-[#9ed39f]">Report summary:</strong> {report.client_summary || "Report awaiting summary"}
                    </p>
                    <div className="mt-4 grid gap-3 text-sm leading-7 text-white/68 sm:grid-cols-3">
                      <p><strong className="text-[#9ed39f]">Quality:</strong> {report.quality_score ?? "—"}</p>
                      <p><strong className="text-[#9ed39f]">Review:</strong> {label(report.quality_status)}</p>
                      <p><strong className="text-[#9ed39f]">Updated:</strong> {formatDate(report.generated_at || report.updated_at)}</p>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <a href={`/admin/reports/${report.id}`} className={reportPrimaryButtonClass}>
                        Review report
                      </a>
                      {report.submission_id && (
                        <a href={`/dashboard/intake?submission_id=${report.submission_id}`} className={reportButtonClass}>
                          View intake
                        </a>
                      )}
                      {report.submission_id && (
                        <a href={`/dashboard/report?submission_id=${report.submission_id}`} className={reportButtonClass}>
                          View report
                        </a>
                      )}
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
                  </article>
                );
              })}
            </div>
          </Section>

          <Section id="analytics" eyebrow="Analytics" title="Tracking and performance overview">
            <div className="grid gap-5 lg:grid-cols-3">
              <article className="border border-[#9ed39f]/20 bg-black/36 p-5">
                <h3 className="text-xl font-black uppercase tracking-[-0.04em] text-white">Google Analytics</h3>
                <p className="mt-3 text-sm leading-7 text-white/70">
                  GA is currently installed on the public site. The next admin pass can connect the Google Analytics Data API to show sessions, conversions, and top pages here.
                </p>
              </article>
              <article className="border border-[#9ed39f]/20 bg-black/36 p-5">
                <h3 className="text-xl font-black uppercase tracking-[-0.04em] text-white">Financials</h3>
                <p className="mt-3 text-sm leading-7 text-white/70">
                  Stripe-backed order records are visible in the financial table. Later we can add month-to-date revenue, refunds, subscriptions, and product-level performance.
                </p>
              </article>
              <article className="border border-[#9ed39f]/20 bg-black/36 p-5">
                <h3 className="text-xl font-black uppercase tracking-[-0.04em] text-white">Report control</h3>
                <p className="mt-3 text-sm leading-7 text-white/70">
                  Admin controls are now available on report cards for generation, regeneration, approval, revision requests, and queue management.
                </p>
              </article>
            </div>
          </Section>
        </div>
      </section>
    </main>
  );
}
