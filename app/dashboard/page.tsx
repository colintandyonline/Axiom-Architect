import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Axiom Architect",
  description:
    "Access your Axiom Architect workflow intake, report status, payment details, and account settings.",
};

export const dynamic = "force-dynamic";

type SearchParams = {
  checkout?: string;
  session_id?: string;
  submission_id?: string;
};

type AxiomOrder = {
  id: string;
  customer_id: string | null;
  tier_slug: string;
  service_name: string;
  amount_total: number | null;
  currency: string | null;
  payment_status: string;
  status: string;
  stripe_checkout_session_id: string;
};

type AxiomCustomer = {
  email: string | null;
  full_name: string | null;
  business_name: string | null;
};

type AxiomWorkflowSubmission = {
  id: string;
  customer_id: string | null;
  order_id: string | null;
  workflow_title: string;
  status: string;
  tier_slug: string;
};

type AxiomAuditReport = {
  status: string;
  updated_at: string | null;
};

type DashboardRecord = {
  order: AxiomOrder | null;
  customer: AxiomCustomer | null;
  workflow: AxiomWorkflowSubmission | null;
  report: AxiomAuditReport | null;
};

const fallbackTabs = [
  {
    label: "Workflow intake",
    text: "Submit the workflow details needed to generate your audit report.",
  },
  {
    label: "Report status",
    text: "Track progress from intake submitted to report ready.",
  },
  {
    label: "Payment details",
    text: "View your selected audit tier and checkout confirmation.",
  },
  {
    label: "Account settings",
    text: "Manage the email and business details connected to your audit.",
  },
];

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
    console.error("Dashboard Supabase request failed", await response.text());
    return null;
  }

  return (await response.json()) as T;
}

async function getCustomer(customerId?: string | null) {
  if (!customerId) {
    return null;
  }

  const customers = await supabaseFetch<AxiomCustomer[]>(
    `axiom_customers?select=email,full_name,business_name&id=eq.${encodeURIComponent(customerId)}&limit=1`,
  );

  return customers?.[0] ?? null;
}

async function getReport(submissionId?: string | null) {
  if (!submissionId) {
    return null;
  }

  const reports = await supabaseFetch<AxiomAuditReport[]>(
    `axiom_audit_reports?select=status,updated_at&submission_id=eq.${encodeURIComponent(submissionId)}&limit=1`,
  );

  return reports?.[0] ?? null;
}

async function getDashboardRecordBySession(sessionId?: string): Promise<DashboardRecord | null> {
  if (!sessionId) {
    return null;
  }

  const encodedSessionId = encodeURIComponent(sessionId);
  const orders = await supabaseFetch<AxiomOrder[]>(
    `axiom_orders?select=id,customer_id,tier_slug,service_name,amount_total,currency,payment_status,status,stripe_checkout_session_id&stripe_checkout_session_id=eq.${encodedSessionId}&limit=1`,
  );
  const order = orders?.[0];

  if (!order) {
    return null;
  }

  const workflows = await supabaseFetch<AxiomWorkflowSubmission[]>(
    `axiom_workflow_submissions?select=id,customer_id,order_id,workflow_title,status,tier_slug&order_id=eq.${encodeURIComponent(order.id)}&limit=1`,
  );
  const workflow = workflows?.[0] ?? null;

  const [customer, report] = await Promise.all([
    getCustomer(order.customer_id),
    getReport(workflow?.id),
  ]);

  return {
    order,
    customer,
    workflow,
    report,
  };
}

async function getDashboardRecordBySubmission(submissionId?: string): Promise<DashboardRecord | null> {
  if (!submissionId) {
    return null;
  }

  const workflows = await supabaseFetch<AxiomWorkflowSubmission[]>(
    `axiom_workflow_submissions?select=id,customer_id,order_id,workflow_title,status,tier_slug&id=eq.${encodeURIComponent(submissionId)}&limit=1`,
  );
  const workflow = workflows?.[0];

  if (!workflow) {
    return null;
  }

  const [orders, customer, report] = await Promise.all([
    workflow.order_id
      ? supabaseFetch<AxiomOrder[]>(
          `axiom_orders?select=id,customer_id,tier_slug,service_name,amount_total,currency,payment_status,status,stripe_checkout_session_id&id=eq.${encodeURIComponent(workflow.order_id)}&limit=1`,
        )
      : Promise.resolve(null),
    getCustomer(workflow.customer_id),
    getReport(workflow.id),
  ]);

  return {
    order: orders?.[0] ?? null,
    customer,
    workflow,
    report,
  };
}

function formatCurrency(amount: number | null, currency: string | null) {
  if (amount === null || !currency) {
    return "Confirmed";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

function labelFromStatus(status?: string | null) {
  if (!status) {
    return "Ready";
  }

  return status.replace(/_/g, " ");
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const isCheckoutSuccess = params.checkout === "success";
  const record =
    (await getDashboardRecordBySubmission(params.submission_id)) ??
    (await getDashboardRecordBySession(params.session_id));
  const customerName = record?.customer?.full_name || "Your audit";
  const businessName = record?.customer?.business_name || "Workflow project";
  const serviceName = record?.order?.service_name || record?.workflow?.tier_slug || "Workflow Blueprint";
  const workflowStatus = labelFromStatus(record?.workflow?.status || "draft");
  const reportStatus = labelFromStatus(record?.report?.status || (record?.workflow?.status === "submitted" ? "queued" : "pending"));
  const paymentStatus = labelFromStatus(record?.order?.payment_status || (isCheckoutSuccess ? "paid" : "pending"));
  const paymentAmount = formatCurrency(
    record?.order?.amount_total ?? null,
    record?.order?.currency ?? null,
  );
  const workflowTitle = record?.workflow?.workflow_title || "Untitled workflow";
  const intakeHref = record?.workflow?.id
    ? `/dashboard/intake?submission_id=${record.workflow.id}`
    : "/dashboard/intake";
  const receivedHref = record?.workflow?.id
    ? `/dashboard/intake/received?submission_id=${record.workflow.id}`
    : "/dashboard";
  const hasSubmittedIntake = !!record?.workflow?.id && record.workflow.status !== "draft";
  const hasQueuedReport = reportStatus !== "pending";
  const isReportReady = ["ready", "delivered"].includes(record?.report?.status || "");

  const dashboardTabs = record
    ? [
        {
          label: "Workflow intake",
          text: hasSubmittedIntake
            ? `${workflowTitle} has been submitted and is ready for review.`
            : `${serviceName} is ready for ${businessName}. Status: ${workflowStatus}.`,
        },
        {
          label: "Report status",
          text: `Report status: ${reportStatus}.`,
        },
        {
          label: "Payment details",
          text: `${paymentAmount} · ${paymentStatus}.`,
        },
        {
          label: "Account settings",
          text: record.customer?.email
            ? `Dashboard access is connected to ${record.customer.email}.`
            : "Manage the details connected to this audit.",
        },
      ]
    : fallbackTabs;

  const statusSteps = [
    {
      number: "01",
      title: "Payment confirmed",
      text: `${paymentAmount} · ${paymentStatus}.`,
      state: record?.order ? "complete" : "pending",
    },
    {
      number: "02",
      title: hasSubmittedIntake ? "Intake submitted" : "Intake required",
      text: hasSubmittedIntake
        ? `${workflowTitle} has been saved as structured source material.`
        : "Complete the staged workflow intake to begin report processing.",
      state: hasSubmittedIntake ? "complete" : "active",
    },
    {
      number: "03",
      title: hasQueuedReport ? `Report ${reportStatus}` : "Report pending",
      text: hasQueuedReport
        ? "The report record is queued and ready for review or generation."
        : "A report record is created once the intake is submitted.",
      state: hasQueuedReport ? "active" : "pending",
    },
    {
      number: "04",
      title: isReportReady ? "Report ready" : "Delivery pending",
      text: isReportReady
        ? "Your report output is ready for delivery."
        : "The dashboard will show a delivery link when the report is ready.",
      state: isReportReady ? "complete" : "pending",
    },
  ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <section className="relative overflow-hidden border-b border-[#9ed39f]/20 bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_36%,#000_78%)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto max-w-[1440px]">
          <a
            href="/"
            className="inline-flex border border-[#9ed39f]/45 bg-black px-4 py-3 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black"
          >
            Axiom Architect
          </a>

          {isCheckoutSuccess ? (
            <p className="mt-10 inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
              Payment confirmed
            </p>
          ) : (
            <p className="mt-10 inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
              Client dashboard
            </p>
          )}

          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <h1 className="max-w-5xl text-[clamp(2.65rem,6vw,5.8rem)] font-black uppercase leading-[0.9] tracking-[-0.075em] text-white">
                {record ? `${customerName}, your audit workspace is ready.` : "Your audit workspace is ready."}
              </h1>
            </div>
            <div className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5 text-base leading-8 text-[#e6f6e7]/78 sm:text-lg">
              {record ? (
                <div className="grid gap-3">
                  <p className="m-0 text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-white">
                    {serviceName}
                  </p>
                  <p className="m-0">
                    {hasSubmittedIntake
                      ? `${workflowTitle} is submitted. The report record is ${reportStatus}.`
                      : `${businessName} is set up. Start the workflow intake to generate the report from your submitted details.`}
                  </p>
                </div>
              ) : (
                <p className="m-0">
                  Start by completing the workflow intake. Your report is generated from the details you provide there.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#9ed39f] px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-5 lg:grid-cols-4">
          {dashboardTabs.map((tab) => (
            <article key={tab.label} className="rounded-[1.25rem] border border-black bg-[#061009] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.26)]">
              <span className="mb-5 block h-2 w-2 bg-[#9ed39f]" />
              <h2 className="text-lg font-black uppercase tracking-[0.02em] text-[#9ed39f]">
                {tab.label}
              </h2>
              <p className="mt-4 text-sm leading-6 text-white/78">{tab.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[0.82fr_1fr]">
          <article className="rounded-[2rem] border border-[#9ed39f]/34 bg-[#030804] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-8">
            <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
              My audit
            </p>
            <h2 className="mt-5 text-[clamp(2.1rem,4vw,4.1rem)] font-black uppercase leading-[0.92] tracking-[-0.06em] text-white">
              {workflowTitle}
            </h2>
            <div className="mt-8 grid gap-4 text-sm leading-7 text-[#e6f6e7]/78 sm:grid-cols-2">
              <p className="m-0 border border-[#9ed39f]/24 bg-[#9ed39f]/8 p-4">
                <strong className="block text-[0.68rem] uppercase tracking-[0.16em] text-[#9ed39f]">Tier</strong>
                {serviceName}
              </p>
              <p className="m-0 border border-[#9ed39f]/24 bg-[#9ed39f]/8 p-4">
                <strong className="block text-[0.68rem] uppercase tracking-[0.16em] text-[#9ed39f]">Business</strong>
                {businessName}
              </p>
              <p className="m-0 border border-[#9ed39f]/24 bg-[#9ed39f]/8 p-4">
                <strong className="block text-[0.68rem] uppercase tracking-[0.16em] text-[#9ed39f]">Intake</strong>
                {workflowStatus}
              </p>
              <p className="m-0 border border-[#9ed39f]/24 bg-[#9ed39f]/8 p-4">
                <strong className="block text-[0.68rem] uppercase tracking-[0.16em] text-[#9ed39f]">Report</strong>
                {reportStatus}
              </p>
            </div>
          </article>

          <div className="grid gap-4">
            {statusSteps.map((step) => (
              <article
                key={step.number}
                className={`grid gap-4 rounded-[1.25rem] border p-5 shadow-[0_18px_40px_rgba(0,0,0,0.18)] sm:grid-cols-[4.5rem_1fr_auto] sm:items-center ${
                  step.state === "complete"
                    ? "border-[#9ed39f]/42 bg-[#061009]"
                    : step.state === "active"
                      ? "border-[#9ed39f] bg-[#0a180c]"
                      : "border-[#9ed39f]/20 bg-[#020503]"
                }`}
              >
                <span className="text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">
                  {step.number}
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

        <div className="mx-auto mt-8 grid max-w-[1440px] grid-cols-1 gap-8 rounded-[2rem] border border-[#9ed39f]/34 bg-[#030804] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
              {hasSubmittedIntake ? "Submitted intake" : "Next step"}
            </p>
            <h2 className="mt-5 max-w-4xl text-[clamp(2.1rem,4vw,3.7rem)] font-black uppercase leading-[0.92] tracking-[-0.06em] text-white">
              {hasSubmittedIntake ? "Review your submitted workflow." : "Submit your first workflow."}
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[#e6f6e7]/78 sm:text-lg">
              {hasSubmittedIntake
                ? "Your intake has been received and the report record is queued. You can reopen the submitted intake from here whenever you need to review it."
                : "The intake form is the source material for your diagnostic report. The stronger the workflow details, the stronger the report."}
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
            <a
              href={intakeHref}
              className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white sm:min-w-72"
            >
              {hasSubmittedIntake ? "Review submitted intake" : "Start workflow intake"}
            </a>
            {hasSubmittedIntake && (
              <a
                href={receivedHref}
                className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f]/45 bg-black px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black sm:min-w-72"
              >
                View confirmation
              </a>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
