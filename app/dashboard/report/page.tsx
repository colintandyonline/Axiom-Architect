import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAxiomAuthContext } from "../../../lib/axiom-auth";

export const metadata: Metadata = {
  title: "Report Status | Axiom Architect",
  description:
    "View the status of your Axiom Architect workflow audit report.",
};

export const dynamic = "force-dynamic";

type SearchParams = {
  submission_id?: string;
};

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
  status: string | null;
  updated_at: string | null;
};

type ReportContext = {
  workflow: WorkflowRecord | null;
  order: OrderRecord | null;
  report: ReportRecord | null;
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
    `axiom_audit_reports?select=status,updated_at&submission_id=eq.${encodeURIComponent(submissionId)}&limit=1`,
  );

  return reports?.[0] ?? null;
}

async function getReportContext(customerId: string, submissionId?: string): Promise<ReportContext> {
  const workflowQuery = submissionId
    ? `axiom_workflow_submissions?select=id,customer_id,order_id,tier_slug,workflow_title,status&id=eq.${encodeURIComponent(submissionId)}&customer_id=eq.${encodeURIComponent(customerId)}&limit=1`
    : `axiom_workflow_submissions?select=id,customer_id,order_id,tier_slug,workflow_title,status&customer_id=eq.${encodeURIComponent(customerId)}&limit=1`;

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
  const workflowTitle = context.workflow?.workflow_title || "No workflow intake found";
  const serviceName = context.order?.service_name || context.workflow?.tier_slug || "Workflow audit";
  const intakeStatus = labelFromStatus(context.workflow?.status);
  const reportStatus = labelFromStatus(context.report?.status || (context.workflow ? "queued" : "pending"));
  const reportUpdated = formatDate(context.report?.updated_at);
  const hasWorkflow = Boolean(context.workflow);
  const intakeHref = context.workflow?.id
    ? `/dashboard/intake?submission_id=${context.workflow.id}`
    : "/dashboard/intake";

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
      title: "Report queued",
      text: context.report
        ? "The report record is queued for diagnostic generation and review."
        : "A report record is created after the intake is submitted.",
      state: context.report ? "active" : "pending",
    },
    {
      label: "03",
      title: "Blueprint preparation",
      text: "The finished report will organise findings, automation suitability, review gates, and implementation guidance.",
      state: ["ready", "delivered"].includes(context.report?.status || "") ? "complete" : "pending",
    },
  ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <section className="relative overflow-hidden border-b border-[#9ed39f]/20 bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_36%,#000_78%)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto max-w-[1280px]">
          <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
            Report status
          </p>
          <div className="mt-6 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <h1 className="max-w-5xl text-[clamp(2.55rem,6vw,5.8rem)] font-black uppercase leading-[0.9] tracking-[-0.075em] text-white">
                {hasWorkflow ? "Your workflow report is queued." : "No report is active yet."}
              </h1>
            </div>
            <div className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5 text-base leading-8 text-[#e6f6e7]/78 sm:text-lg">
              <p className="m-0 text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-white">
                {workflowTitle}
              </p>
              <p className="mb-0 mt-3">
                {hasWorkflow
                  ? "The intake has been received. This page now tracks the report record before the finished blueprint is delivered."
                  : "Complete the workflow intake first, then the report status will appear here."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#9ed39f] px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-5 lg:grid-cols-4">
          {[
            ["Package", serviceName],
            ["Intake", intakeStatus],
            ["Report", reportStatus],
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

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1280px] gap-8 lg:grid-cols-[0.82fr_1fr]">
          <article className="rounded-[2rem] border border-[#9ed39f]/34 bg-[#030804] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-8">
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
    </main>
  );
}
