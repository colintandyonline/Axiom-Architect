import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAxiomAuthContext } from "../../lib/axiom-auth";
import { isAxiomAdminEmail } from "../../lib/axiom-admin";

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
  tier_slug: string | null;
  service_name: string | null;
  amount_total: number | null;
  currency: string | null;
  payment_status: string | null;
  status: string | null;
  stripe_checkout_session_id: string | null;
};

type AxiomWorkflowSubmission = {
  id: string;
  customer_id: string | null;
  order_id: string | null;
  workflow_title: string | null;
  status: string | null;
  tier_slug: string | null;
};

type AxiomAuditReport = {
  status: string | null;
  updated_at: string | null;
};

type DashboardRecord = {
  order: AxiomOrder | null;
  workflow: AxiomWorkflowSubmission | null;
  report: AxiomAuditReport | null;
};

const stewardshipClientInputs = [
  "What changed in the workflow since the last review.",
  "Errors, delays, exceptions, or recurring bottlenecks noticed this month.",
  "Any tool, AI model, automation, team, customer, or operating-rule changes.",
  "Metrics or examples available: screenshots, logs, volumes, failed handoffs, support notes, or manual overrides.",
  "Decisions you want Axiom to review before the next workflow update.",
];

const stewardshipReviewAreas = [
  "Workflow drift and recurring friction.",
  "Automation suitability and human review boundaries.",
  "AI/tool changes that may affect the workflow.",
  "Risk controls, exception handling, and approval gates.",
  "Next 7-day and 30-day action priorities.",
];

const stewardshipCycle = [
  {
    label: "01",
    title: "Client update window",
    text: "You submit monthly changes, issues, examples, metrics, and decisions that need review.",
  },
  {
    label: "02",
    title: "Axiom review",
    text: "Axiom compares the new evidence against the last report, current workflow risks, and relevant AI/tool changes.",
  },
  {
    label: "03",
    title: "Stewardship brief",
    text: "Your dashboard is updated with the current priorities, safe automation boundaries, and next actions.",
  },
  {
    label: "04",
    title: "Stored history",
    text: "Each review cycle should build a retained history of what changed, what was decided, and what improved.",
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
    console.error("Dashboard customer record request failed", await response.text());
    return null;
  }

  return (await response.json()) as T;
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

async function getRecordBySession(sessionId?: string): Promise<DashboardRecord | null> {
  if (!sessionId) {
    return null;
  }

  const orders = await supabaseFetch<AxiomOrder[]>(
    `axiom_orders?select=id,customer_id,tier_slug,service_name,amount_total,currency,payment_status,status,stripe_checkout_session_id&stripe_checkout_session_id=eq.${encodeURIComponent(sessionId)}&limit=1`,
  );
  const order = orders?.[0] ?? null;

  if (!order) {
    return null;
  }

  const workflows = await supabaseFetch<AxiomWorkflowSubmission[]>(
    `axiom_workflow_submissions?select=id,customer_id,order_id,workflow_title,status,tier_slug&order_id=eq.${encodeURIComponent(order.id)}&limit=1`,
  );
  const workflow = workflows?.[0] ?? null;

  return {
    order,
    workflow,
    report: await getReport(workflow?.id),
  };
}

async function getRecordBySubmission(customerId: string, submissionId?: string): Promise<DashboardRecord | null> {
  if (!submissionId) {
    return null;
  }

  const workflows = await supabaseFetch<AxiomWorkflowSubmission[]>(
    `axiom_workflow_submissions?select=id,customer_id,order_id,workflow_title,status,tier_slug&id=eq.${encodeURIComponent(submissionId)}&customer_id=eq.${encodeURIComponent(customerId)}&limit=1`,
  );
  const workflow = workflows?.[0] ?? null;

  if (!workflow) {
    return null;
  }

  const orders = workflow.order_id
    ? await supabaseFetch<AxiomOrder[]>(
        `axiom_orders?select=id,customer_id,tier_slug,service_name,amount_total,currency,payment_status,status,stripe_checkout_session_id&id=eq.${encodeURIComponent(workflow.order_id)}&customer_id=eq.${encodeURIComponent(customerId)}&limit=1`,
      )
    : null;

  return {
    order: orders?.[0] ?? null,
    workflow,
    report: await getReport(workflow.id),
  };
}

async function getRecordByCustomer(customerId: string): Promise<DashboardRecord> {
  const orders = await supabaseFetch<AxiomOrder[]>(
    `axiom_orders?select=id,customer_id,tier_slug,service_name,amount_total,currency,payment_status,status,stripe_checkout_session_id&customer_id=eq.${encodeURIComponent(customerId)}&limit=1`,
  );
  const order = orders?.[0] ?? null;

  const workflows = order
    ? await supabaseFetch<AxiomWorkflowSubmission[]>(
        `axiom_workflow_submissions?select=id,customer_id,order_id,workflow_title,status,tier_slug&order_id=eq.${encodeURIComponent(order.id)}&limit=1`,
      )
    : await supabaseFetch<AxiomWorkflowSubmission[]>(
        `axiom_workflow_submissions?select=id,customer_id,order_id,workflow_title,status,tier_slug&customer_id=eq.${encodeURIComponent(customerId)}&limit=1`,
      );

  const workflow = workflows?.[0] ?? null;

  return {
    order,
    workflow,
    report: await getReport(workflow?.id),
  };
}

function formatCurrency(amount: number | null, currency: string | null) {
  if (amount === null || !currency) {
    return "Not paid yet";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

function labelFromStatus(status?: string | null) {
  if (!status) {
    return "pending";
  }

  return status.replace(/_/g, " ");
}

function StewardshipServicePlan({ intakeHref, reportHref }: { intakeHref: string; reportHref: string }) {
  return (
    <section className="bg-black px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
      <div className="mx-auto max-w-[1440px] rounded-[2rem] border border-[#9ed39f]/34 bg-[#030804] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div>
            <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
              Stewardship plan
            </p>
            <h2 className="mt-5 text-[clamp(2.1rem,4vw,4.1rem)] font-black uppercase leading-[0.92] tracking-[-0.06em] text-white">
              Your monthly workflow review cycle.
            </h2>
            <p className="mt-5 text-base leading-8 text-[#e6f6e7]/78 sm:text-lg">
              Workflow Stewardship is an ongoing review service. Each month, you provide workflow updates and evidence. Axiom reviews what changed, checks risks and automation boundaries, and returns updated guidance so your workflow keeps improving instead of going stale.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href={intakeHref}
                className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white sm:min-w-64"
              >
                Submit monthly update
              </a>
              <a
                href={reportHref}
                className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f]/45 bg-black px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black sm:min-w-56"
              >
                View latest brief
              </a>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="grid gap-4 md:grid-cols-2">
              {stewardshipCycle.map((step) => (
                <article key={step.label} className="border border-[#9ed39f]/22 bg-black/38 p-5">
                  <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">{step.label}</p>
                  <h3 className="mt-3 text-xl font-black uppercase tracking-[-0.04em] text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72">{step.text}</p>
                </article>
              ))}
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <article className="border border-[#9ed39f]/22 bg-black/38 p-5">
                <h3 className="text-xl font-black uppercase tracking-[-0.04em] text-white">What you provide each month</h3>
                <div className="mt-4 grid gap-3">
                  {stewardshipClientInputs.map((item) => (
                    <p key={item} className="m-0 flex gap-3 text-sm leading-7 text-[#e6f6e7]/74">
                      <span className="mt-2 h-2 w-2 shrink-0 bg-[#9ed39f]" />
                      <span>{item}</span>
                    </p>
                  ))}
                </div>
              </article>

              <article className="border border-[#9ed39f]/22 bg-black/38 p-5">
                <h3 className="text-xl font-black uppercase tracking-[-0.04em] text-white">What Axiom reviews</h3>
                <div className="mt-4 grid gap-3">
                  {stewardshipReviewAreas.map((item) => (
                    <p key={item} className="m-0 flex gap-3 text-sm leading-7 text-[#e6f6e7]/74">
                      <span className="mt-2 h-2 w-2 shrink-0 bg-[#9ed39f]" />
                      <span>{item}</span>
                    </p>
                  ))}
                </div>
              </article>
            </div>

            <article className="border border-[#9ed39f]/22 bg-[#9ed39f]/10 p-5">
              <h3 className="text-xl font-black uppercase tracking-[-0.04em] text-white">Data and review history</h3>
              <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/76 sm:text-base">
                The next backend phase should store each monthly stewardship cycle separately: client update, evidence supplied, Axiom review notes, revised action brief, report version, delivery status, and cycle dates. That gives the client a retained service history instead of a one-off report archive.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { user, customer } = await getAxiomAuthContext();

  if (!user) {
    redirect("/login?redirect=/dashboard");
  }

  if (!customer) {
    redirect("/signup?account=required");
  }

  const record =
    (await getRecordBySubmission(customer.id, params.submission_id)) ??
    (await getRecordBySession(params.session_id)) ??
    (await getRecordByCustomer(customer.id));

  const hasOrder = Boolean(record.order);
  const checkoutPending = params.checkout === "success" && !hasOrder;
  const hasWorkflow = Boolean(record.workflow);
  const hasSubmittedIntake = Boolean(record.workflow?.id && record.workflow.status !== "draft");
  const isAdmin = isAxiomAdminEmail(user.email) || isAxiomAdminEmail(customer.email);
  const isStewardship = record.order?.tier_slug === "workflow-stewardship" || record.workflow?.tier_slug === "workflow-stewardship";
  const paymentAmount = formatCurrency(record.order?.amount_total ?? null, record.order?.currency ?? null);
  const paymentStatus = labelFromStatus(record.order?.payment_status || (params.checkout === "success" ? "paid" : null));
  const workflowStatus = labelFromStatus(record.workflow?.status || "not started");
  const reportStatus = labelFromStatus(record.report?.status || (hasSubmittedIntake ? "queued" : "pending"));
  const serviceName = record.order?.service_name || record.workflow?.tier_slug || "No package selected yet";
  const workflowTitle = record.workflow?.workflow_title || "Workflow intake not started";
  const businessName = customer.business_name || "Your business";
  const customerName = customer.full_name || customer.email || "Your";
  const intakeHref = record.workflow?.id
    ? `/dashboard/intake?submission_id=${record.workflow.id}`
    : "/dashboard/intake";
  const reportHref = record.workflow?.id
    ? `/dashboard/report?submission_id=${record.workflow.id}`
    : "/dashboard/report";

  const cards = [
    {
      label: "Selected package",
      text: hasOrder
        ? serviceName
        : checkoutPending
          ? "Payment received. Preparing your selected package."
          : "Choose a package from the pricing page to begin.",
    },
    {
      label: "Payment",
      text: hasOrder
        ? `${paymentAmount} · ${paymentStatus}`
        : checkoutPending
          ? "Paid · confirmation syncing"
          : "No payment is attached to this account yet.",
    },
    {
      label: "Workflow intake",
      text: hasWorkflow
        ? `${workflowTitle} · ${workflowStatus}`
        : checkoutPending
          ? "Your intake workspace is being prepared."
          : "Your workflow intake will appear here after checkout.",
    },
    {
      label: isStewardship ? "Stewardship" : "Report status",
      text: isStewardship
        ? "Monthly review cycle active after the baseline intake is submitted."
        : hasWorkflow
          ? reportStatus
          : checkoutPending
            ? "Workspace preparing."
            : "A report record is created after your intake is submitted.",
    },
  ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <section className="relative overflow-hidden border-b border-[#9ed39f]/20 bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_36%,#000_78%)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto max-w-[1440px]">
          <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
            Client dashboard
          </p>

          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <h1 className="max-w-5xl text-[clamp(2.65rem,6vw,5.8rem)] font-black uppercase leading-[0.9] tracking-[-0.075em] text-white">
                {hasOrder
                  ? `${customerName}, your audit workspace is ready.`
                  : checkoutPending
                    ? `${customerName}, your payment is being confirmed.`
                    : `${customerName}, your account is ready.`}
              </h1>
            </div>
            <div className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5 text-base leading-8 text-[#e6f6e7]/78 sm:text-lg">
              {hasOrder ? (
                <div className="grid gap-3">
                  <p className="m-0 text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-white">
                    {serviceName}
                  </p>
                  <p className="m-0">
                    {isStewardship
                      ? `${businessName} is set up for monthly workflow stewardship. Submit the baseline intake first; after that, each monthly cycle asks for changes, issues, examples, and decisions that need review.`
                      : hasSubmittedIntake
                        ? `${businessName} is set up. Your workflow intake has been submitted and the report status is ${reportStatus}.`
                        : hasWorkflow
                          ? `${businessName} is set up. Continue the workflow intake from this dashboard.`
                          : `${businessName} is set up. Your order is attached to this account.`}
                  </p>
                  {isAdmin && (
                    <a
                      href="/admin"
                      className="mt-3 inline-flex w-fit border border-[#9ed39f] bg-[#9ed39f] px-4 py-3 text-[0.68rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white"
                    >
                      Open admin console
                    </a>
                  )}
                </div>
              ) : checkoutPending ? (
                <div className="grid gap-4">
                  <p className="m-0 text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-white">
                    Payment received
                  </p>
                  <p className="m-0">
                    Stripe has returned a successful checkout. Your workspace is being prepared and should appear shortly. Refresh this dashboard if the intake button has not appeared yet.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  <p className="m-0">
                    This account has no paid audit package attached yet. Choose a package to create the order and open the intake workspace.
                  </p>
                  {isAdmin && (
                    <a
                      href="/admin"
                      className="inline-flex w-fit border border-[#9ed39f] bg-[#9ed39f] px-4 py-3 text-[0.68rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white"
                    >
                      Open admin console
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#9ed39f] px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-5 lg:grid-cols-4">
          {cards.map((card) => (
            <article key={card.label} className="rounded-[1.25rem] border border-black bg-[#061009] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.26)]">
              <span className="mb-5 block h-2 w-2 bg-[#9ed39f]" />
              <h2 className="text-lg font-black uppercase tracking-[0.02em] text-[#9ed39f]">
                {card.label}
              </h2>
              <p className="mt-4 text-sm leading-6 text-white/78">{card.text}</p>
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
                <strong className="block text-[0.68rem] uppercase tracking-[0.16em] text-[#9ed39f]">Package</strong>
                {checkoutPending ? "Preparing package" : serviceName}
              </p>
              <p className="m-0 border border-[#9ed39f]/24 bg-[#9ed39f]/8 p-4">
                <strong className="block text-[0.68rem] uppercase tracking-[0.16em] text-[#9ed39f]">Business</strong>
                {businessName}
              </p>
              <p className="m-0 border border-[#9ed39f]/24 bg-[#9ed39f]/8 p-4">
                <strong className="block text-[0.68rem] uppercase tracking-[0.16em] text-[#9ed39f]">Intake</strong>
                {checkoutPending ? "preparing" : workflowStatus}
              </p>
              <p className="m-0 border border-[#9ed39f]/24 bg-[#9ed39f]/8 p-4">
                <strong className="block text-[0.68rem] uppercase tracking-[0.16em] text-[#9ed39f]">{isStewardship ? "Cycle" : "Report"}</strong>
                {checkoutPending ? "Workspace preparing" : isStewardship ? "Monthly stewardship" : reportStatus}
              </p>
            </div>
          </article>

          <article className="rounded-[2rem] border border-[#9ed39f]/34 bg-[#030804] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-8">
            <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
              Next step
            </p>
            <h2 className="mt-5 text-[clamp(2.1rem,4vw,3.7rem)] font-black uppercase leading-[0.92] tracking-[-0.06em] text-white">
              {hasOrder
                ? isStewardship
                  ? hasSubmittedIntake
                    ? "Prepare this month’s workflow update."
                    : "Submit the baseline workflow first."
                  : hasSubmittedIntake
                    ? "View your report status."
                    : hasWorkflow
                      ? "Continue your workflow intake."
                      : "Start your workflow intake."
                : checkoutPending
                  ? "Preparing your intake workspace."
                  : "Choose a package to begin."}
            </h2>
            <p className="mt-5 text-base leading-8 text-[#e6f6e7]/78 sm:text-lg">
              {hasOrder
                ? isStewardship
                  ? hasSubmittedIntake
                    ? "Your baseline is in place. Use the monthly update flow to send changes, issues, examples, and decisions that need review before the next stewardship brief."
                    : "The baseline intake gives Axiom the source material for your monthly stewardship cycle. After it is submitted, each monthly review can build on the previous one."
                  : hasSubmittedIntake
                    ? "Your workflow intake is locked and the report has moved into the status queue. Use the report page to track the next stage."
                    : "The intake form is the source material for your diagnostic report. The stronger the workflow details, the stronger the report."
                : checkoutPending
                  ? "Stripe has returned a successful checkout. The order and intake workspace can take a short moment to sync through the webhook. Refresh this dashboard shortly if the workspace is not visible yet."
                  : "Your account is ready. Select a package, complete checkout, and your intake workspace will appear here."}
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              {hasOrder ? (
                <a
                  href={hasSubmittedIntake && !isStewardship ? reportHref : intakeHref}
                  className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white sm:min-w-72"
                >
                  {isStewardship
                    ? hasSubmittedIntake
                      ? "Submit monthly update"
                      : "Start baseline intake"
                    : hasSubmittedIntake
                      ? "View report status"
                      : "Start workflow intake"}
                </a>
              ) : checkoutPending ? (
                <a
                  href="/dashboard"
                  className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white sm:min-w-72"
                >
                  Refresh dashboard
                </a>
              ) : (
                <a
                  href="/pricing"
                  className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white sm:min-w-72"
                >
                  View packages
                </a>
              )}
              {isAdmin ? (
                <a
                  href="/admin"
                  className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f]/45 bg-black px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black sm:min-w-56"
                >
                  Admin console
                </a>
              ) : hasSubmittedIntake ? (
                <a
                  href={isStewardship ? reportHref : intakeHref}
                  className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f]/45 bg-black px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black sm:min-w-56"
                >
                  {isStewardship ? "View latest brief" : "Review intake"}
                </a>
              ) : (
                <a
                  href="/logout"
                  className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f]/45 bg-black px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black sm:min-w-44"
                >
                  Log out
                </a>
              )}
            </div>
          </article>
        </div>
      </section>

      {isStewardship && <StewardshipServicePlan intakeHref={intakeHref} reportHref={reportHref} />}
    </main>
  );
}
