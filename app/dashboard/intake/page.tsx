import type { Metadata } from "next";
import {
  getEnterpriseArchitectureIntakeSchema,
  isEnterpriseArchitectureSlug,
} from "../../../lib/axiom-enterprise-intake";
import {
  formatStewardshipDate,
  getStewardshipCycleState,
} from "../../../lib/axiom-stewardship";

export const metadata: Metadata = {
  title: "Workflow Intake | Axiom Architect",
  description:
    "Submit the workflow details needed for your Axiom Architect report.",
};

export const dynamic = "force-dynamic";

type SearchParams = {
  submission_id?: string;
  submitted?: string;
  error?: string;
  not_found?: string;
  locked?: string;
};

type IntakePayload = {
  fields?: Record<string, unknown>;
};

type IntakeRecord = {
  id: string;
  product_id: string | null;
  intake_schema_id: string | null;
  intake_schema_version: number | null;
  tier_slug: string | null;
  workflow_title: string | null;
  status: string;
  updated_at: string | null;
  intake_payload: IntakePayload | null;
  [key: string]: unknown;
};

type OrderRecord = {
  service_name: string | null;
  amount_total: number | null;
  currency: string | null;
};

type CustomerRecord = {
  full_name: string | null;
  business_name: string | null;
  email: string | null;
};

type AuditReportRecord = {
  id: string;
  status: string | null;
  updated_at: string | null;
  generated_at: string | null;
};

type SchemaField = {
  key: string;
  label: string;
  type?: "input" | "textarea";
  placeholder?: string;
  required?: boolean;
};

type SchemaStage = {
  number: string;
  title: string;
  description?: string;
  fields: SchemaField[];
};

type IntakeSchemaRecord = {
  id: string;
  schema_key: string;
  version: number;
  title: string;
  description: string | null;
  schema_json: {
    stages?: SchemaStage[];
  } | null;
};

type IntakeContext = {
  intake: IntakeRecord;
  order: OrderRecord | null;
  customer: CustomerRecord | null;
  schema: IntakeSchemaRecord | null;
  report: AuditReportRecord | null;
};

const universalWorkflowTitleField: SchemaField = {
  key: "workflow_title",
  label: "Workflow name",
  type: "input",
  placeholder: "Example: Seller verification workflow, monthly reporting process, customer onboarding sequence",
  required: true,
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
    console.error("Intake record request failed", await response.text());
    return null;
  }

  return (await response.json()) as T;
}

async function getActiveSchemaByProduct(productId?: string | null) {
  if (!productId) {
    return null;
  }

  const schemas = await supabaseFetch<IntakeSchemaRecord[]>(
    `axiom_product_intake_schemas?select=id,schema_key,version,title,description,schema_json&product_id=eq.${encodeURIComponent(productId)}&active=eq.true&limit=1`,
  );

  return schemas?.[0] ?? null;
}

async function getSchemaById(schemaId?: string | null) {
  if (!schemaId) {
    return null;
  }

  const schemas = await supabaseFetch<IntakeSchemaRecord[]>(
    `axiom_product_intake_schemas?select=id,schema_key,version,title,description,schema_json&id=eq.${encodeURIComponent(schemaId)}&limit=1`,
  );

  return schemas?.[0] ?? null;
}

async function getSchemaForIntake(intake: IntakeRecord): Promise<IntakeSchemaRecord | null> {
  const storedSchema = (await getSchemaById(intake.intake_schema_id)) || (await getActiveSchemaByProduct(intake.product_id));

  if (isEnterpriseArchitectureSlug(intake.tier_slug)) {
    return getEnterpriseArchitectureIntakeSchema(storedSchema) as IntakeSchemaRecord;
  }

  return storedSchema;
}

async function getReportForIntake(submissionId: string) {
  const reports = await supabaseFetch<AuditReportRecord[]>(
    `axiom_audit_reports?select=id,status,updated_at,generated_at&submission_id=eq.${encodeURIComponent(submissionId)}&order=updated_at.desc&limit=1`,
  );

  return reports?.[0] ?? null;
}

async function getIntakeContext(submissionId?: string): Promise<IntakeContext | null> {
  if (!submissionId) {
    return null;
  }

  const records = await supabaseFetch<
    Array<
      IntakeRecord & {
        axiom_orders: OrderRecord | null;
        axiom_customers: CustomerRecord | null;
      }
    >
  >(
    `axiom_workflow_submissions?select=*,axiom_orders(service_name,amount_total,currency),axiom_customers(full_name,business_name,email)&id=eq.${encodeURIComponent(submissionId)}&limit=1`,
  );

  const record = records?.[0];

  if (!record) {
    return null;
  }

  return {
    intake: record,
    order: record.axiom_orders,
    customer: record.axiom_customers,
    schema: await getSchemaForIntake(record),
    report: await getReportForIntake(record.id),
  };
}

function schemaHasWorkflowTitle(schema?: IntakeSchemaRecord | null) {
  const stages = schema?.schema_json?.stages;

  if (!Array.isArray(stages)) {
    return false;
  }

  return stages.some((stage) =>
    Array.isArray(stage.fields)
      ? stage.fields.some((field) => field.key === universalWorkflowTitleField.key)
      : false,
  );
}

function getSchemaStages(schema?: IntakeSchemaRecord | null): SchemaStage[] {
  const stages = schema?.schema_json?.stages;

  if (!Array.isArray(stages)) {
    return [];
  }

  const shouldInjectWorkflowTitle = !schemaHasWorkflowTitle(schema);

  return stages
    .map((stage, index) => {
      const fields = Array.isArray(stage.fields)
        ? stage.fields.filter((field) => Boolean(field.key && field.label))
        : [];
      const stageFields = shouldInjectWorkflowTitle && index === 0
        ? [universalWorkflowTitleField, ...fields]
        : fields;

      return {
        number: stage.number || String(index + 1).padStart(2, "0"),
        title: stage.title || `Stage ${index + 1}`,
        description: stage.description || "Complete the fields for this stage.",
        fields: stageFields,
      };
    })
    .filter((stage) => stage.fields.length > 0);
}

function payloadFieldValue(record: IntakeRecord, fieldKey: string) {
  const value = record.intake_payload?.fields?.[fieldKey];
  return typeof value === "string" ? value : "";
}

function fieldValue(record: IntakeRecord, fieldKey: string) {
  const directValue = record[fieldKey];

  if (typeof directValue === "string") {
    return directValue;
  }

  return payloadFieldValue(record, fieldKey);
}

function renderField(field: SchemaField, record: IntakeRecord, locked: boolean) {
  const commonClasses = `mt-2 w-full border border-[#9ed39f]/28 bg-black/55 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/32 focus:border-[#9ed39f] ${locked ? "opacity-70" : ""}`;
  const value = fieldValue(record, field.key);

  return (
    <label key={field.key} className="block">
      <span className="text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">
        {field.label}
        {field.required ? <span className="ml-1 text-white/70">*</span> : null}
      </span>
      {field.type === "input" ? (
        <input
          name={field.key}
          defaultValue={value}
          placeholder={field.placeholder}
          readOnly={locked}
          required={!locked && field.required}
          className={commonClasses}
        />
      ) : (
        <textarea
          name={field.key}
          defaultValue={value}
          placeholder={field.placeholder}
          rows={5}
          readOnly={locked}
          required={!locked && field.required}
          className={`${commonClasses} min-h-36 resize-y`}
        />
      )}
    </label>
  );
}

function formatStatus(status: string) {
  return status.replace(/_/g, " ");
}

export default async function WorkflowIntakePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const context = await getIntakeContext(params.submission_id);
  const stages = getSchemaStages(context?.schema);
  const isSubmitted = params.submitted === "1";
  const hasError = params.error === "1";
  const notFound = params.not_found === "1" || (!!params.submission_id && !context);
  const schemaMissing = Boolean(context && stages.length === 0);
  const stewardshipCycle = context
    ? getStewardshipCycleState({
        tierSlug: context.intake.tier_slug,
        workflowStatus: context.intake.status,
        workflowUpdatedAt: context.intake.updated_at,
        reportUpdatedAt: context.report?.generated_at || context.report?.updated_at,
      })
    : null;
  const isStewardship = Boolean(stewardshipCycle);
  const isEnterprise = Boolean(context && isEnterpriseArchitectureSlug(context.intake.tier_slug));
  const isLocked = Boolean(
    context &&
      context.intake.status !== "draft" &&
      (!stewardshipCycle || !stewardshipCycle.canSubmitUpdate),
  );
  const canSubmitMonthlyUpdate = Boolean(stewardshipCycle?.baselineSubmitted && stewardshipCycle.canSubmitUpdate);
  const reportHref = context ? `/dashboard/report?submission_id=${context.intake.id}` : "/dashboard/report";
  const reviewStageNumber = String(stages.length + 1).padStart(2, "0");
  const schemaTitle = context?.schema?.title || "Workflow intake";
  const nextOpenDate = formatStewardshipDate(stewardshipCycle?.nextSubmissionOpensAt);

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <section className="relative overflow-hidden border-b border-[#9ed39f]/20 bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_36%,#000_78%)] px-4 py-12 sm:px-6 lg:px-8 lg:py-18">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto max-w-[1320px]">
          <a
            href="/dashboard"
            className="inline-flex border border-[#9ed39f]/45 bg-black px-4 py-3 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black"
          >
            Back to dashboard
          </a>

          <p className="mt-10 inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
            {schemaTitle}
          </p>

          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_0.75fr] lg:items-end">
            <div>
              <h1 className="max-w-5xl text-[clamp(2.65rem,6vw,5.7rem)] font-black uppercase leading-[0.9] tracking-[-0.075em] text-white">
                {isEnterprise
                  ? isLocked
                    ? "Review submitted enterprise intake."
                    : "Submit your enterprise architecture intake."
                  : isStewardship
                    ? stewardshipCycle?.baselineSubmitted
                      ? stewardshipCycle.canSubmitUpdate
                        ? "Submit this month’s stewardship update."
                        : "Monthly update window locked."
                      : "Submit your baseline workflow."
                    : isLocked
                      ? "Review submitted workflow."
                      : "Submit your workflow for diagnosis."}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[#e6f6e7]/75 sm:text-lg">
                {isEnterprise
                  ? "Use this form to give Axiom the full operating context for your enterprise architecture report: workflow scope, people, tools, dependencies, risk points, automation goals, and desired outcome."
                  : isStewardship
                    ? stewardshipCycle?.guidance
                    : isLocked
                      ? "This workflow intake has already been submitted. Use the report page to track progress."
                      : context?.schema?.description ||
                        "Work through each stage carefully. Your answers help Axiom prepare a clearer workflow report and practical next-step guidance."}
              </p>
            </div>

            <aside className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5">
              <p className="m-0 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">
                {isEnterprise ? "Enterprise intake" : isStewardship ? "Stewardship context" : "Workflow context"}
              </p>
              <div className="mt-5 grid gap-3 text-sm leading-6 text-[#e6f6e7]/78">
                <p className="m-0">
                  <strong className="text-white">Package:</strong> {context?.order?.service_name || context?.intake.tier_slug || "Workflow audit"}
                </p>
                <p className="m-0">
                  <strong className="text-white">Form:</strong> {context?.schema ? `v${context.schema.version}` : "Not loaded"}
                </p>
                <p className="m-0">
                  <strong className="text-white">Business:</strong> {context?.customer?.business_name || "Not loaded"}
                </p>
                <p className="m-0">
                  <strong className="text-white">Status:</strong> {stewardshipCycle?.label || (context ? formatStatus(context.intake.status) : "Missing intake")}
                </p>
                {isStewardship && stewardshipCycle?.baselineSubmitted ? (
                  <p className="m-0">
                    <strong className="text-white">Next update opens:</strong> {nextOpenDate}
                  </p>
                ) : null}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-black px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-[1320px]">
          {isSubmitted && (
            <div className="mb-8 border border-[#9ed39f] bg-[#9ed39f] p-5 text-black">
              <p className="m-0 text-lg font-black uppercase tracking-[-0.02em]">
                {isEnterprise
                  ? "Your enterprise architecture intake has been received."
                  : isStewardship
                    ? "Your stewardship update has been received."
                    : "Your workflow intake has been received."}
              </p>
              <p className="mb-0 mt-2 text-sm leading-6 text-black/72">
                {isEnterprise
                  ? "Axiom will use your answers to prepare the enterprise architecture report in your dashboard."
                  : isStewardship
                    ? "Axiom will use this update to prepare the next monthly stewardship brief."
                    : "Your intake has been received. The next stage is your Axiom review."}
              </p>
            </div>
          )}

          {params.locked === "1" && (
            <div className="mb-8 border border-[#9ed39f]/45 bg-[#9ed39f]/10 p-5 text-[#e6f6e7]/84">
              <p className="m-0 text-lg font-black uppercase tracking-[-0.02em] text-white">
                Monthly update not open yet
              </p>
              <p className="mb-0 mt-2 text-sm leading-6 text-[#e6f6e7]/72">
                This monthly update cannot be submitted yet because the next review window has not opened.
              </p>
            </div>
          )}

          {isLocked && (
            <div className="mb-8 border border-[#9ed39f]/45 bg-[#9ed39f]/10 p-5 text-[#e6f6e7]/84">
              <p className="m-0 text-lg font-black uppercase tracking-[-0.02em] text-white">
                {isStewardship ? "Stewardship update locked" : "Intake submitted"}
              </p>
              <p className="mb-0 mt-2 text-sm leading-6 text-[#e6f6e7]/72">
                {isStewardship
                  ? `Your next monthly update window opens on ${nextOpenDate}. Until then, collect workflow changes, errors, examples, metrics, and decisions for the next review.`
                  : "This intake has already been submitted. Use the report page to follow the next stage."}
              </p>
              <a
                href={reportHref}
                className="mt-5 inline-flex min-h-12 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-6 text-center text-[0.72rem] font-black uppercase tracking-[0.16em] text-black transition hover:bg-white"
              >
                {isStewardship ? "View latest brief" : "View report status"}
              </a>
            </div>
          )}

          {canSubmitMonthlyUpdate && (
            <div className="mb-8 border border-[#9ed39f] bg-[#9ed39f] p-5 text-black">
              <p className="m-0 text-lg font-black uppercase tracking-[-0.02em]">
                Monthly update window open
              </p>
              <p className="mb-0 mt-2 text-sm leading-6 text-black/72">
                Submit the changes, errors, examples, metrics, tool updates, and decisions you want reviewed in this month’s Stewardship brief.
              </p>
            </div>
          )}

          {hasError && (
            <div className="mb-8 border border-red-400 bg-red-950/45 p-5 text-red-100">
              <p className="m-0 font-bold">The intake could not be saved. Please check the form and try again.</p>
            </div>
          )}

          {notFound && (
            <div className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-6">
              <h2 className="m-0 text-2xl font-black uppercase tracking-[-0.04em] text-white">
                Intake not found
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#e6f6e7]/75">
                This page needs a valid workflow intake link. Return to the dashboard and open the intake from your workspace.
              </p>
              <a
                href="/dashboard"
                className="mt-6 inline-flex min-h-12 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-6 text-center text-[0.72rem] font-black uppercase tracking-[0.16em] text-black transition hover:bg-white"
              >
                Return to dashboard
              </a>
            </div>
          )}

          {schemaMissing && (
            <div className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-6">
              <h2 className="m-0 text-2xl font-black uppercase tracking-[-0.04em] text-white">
                Intake form not available
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#e6f6e7]/75">
                This intake form is not available yet. Return to your dashboard and contact Axiom if this continues.
              </p>
            </div>
          )}

          {context && !schemaMissing && (
            <form action="/api/intake" method="post" className="grid gap-8">
              <input type="hidden" name="submission_id" value={context.intake.id} />

              {stages.map((stage) => (
                <section
                  key={stage.number}
                  className="grid gap-6 border border-[#9ed39f]/28 bg-[#030804] p-5 sm:p-7 lg:grid-cols-[0.36fr_1fr] lg:p-8"
                >
                  <div>
                    <p className="m-0 text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">
                      Stage {stage.number}
                    </p>
                    <h2 className="mt-4 text-[clamp(1.65rem,3vw,2.8rem)] font-black uppercase leading-[0.95] tracking-[-0.06em] text-white">
                      {stage.title}
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-[#e6f6e7]/66">
                      {stage.description}
                    </p>
                  </div>
                  <div className="grid gap-5">
                    {stage.fields.map((field) => renderField(field, context.intake, isLocked))}
                  </div>
                </section>
              ))}

              <section className="grid gap-6 border border-[#9ed39f]/34 bg-[#030804] p-5 text-white sm:p-7 lg:grid-cols-[0.55fr_1fr] lg:p-8">
                <div>
                  <p className="m-0 text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">
                    Stage {reviewStageNumber}
                  </p>
                  <h2 className="mt-4 text-[clamp(1.65rem,3vw,2.8rem)] font-black uppercase leading-[0.95] tracking-[-0.06em] text-white">
                    {isStewardship ? "Review and submit update" : "Review and submit"}
                  </h2>
                </div>
                <div className="grid gap-4 text-sm leading-7 text-[#e6f6e7]/78">
                  <p className="m-0">
                    <strong className="text-white">Package:</strong> {context.order?.service_name || context.intake.tier_slug}
                  </p>
                  <p className="m-0">
                    <strong className="text-white">Workflow title:</strong> {context.intake.workflow_title || fieldValue(context.intake, "workflow_title") || "Entered above and saved for your report."}
                  </p>
                  <p className="m-0">
                    <strong className="text-white">What happens next:</strong> {isEnterprise ? "Axiom prepares your enterprise architecture report after the intake is submitted." : isStewardship ? "Axiom prepares your monthly stewardship brief after the update is submitted." : "Axiom begins preparing your report after the intake is submitted."}
                  </p>
                  {isLocked ? (
                    <a
                      href={reportHref}
                      className="mt-4 inline-flex min-h-14 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white sm:w-fit"
                    >
                      {isStewardship ? "View latest brief" : "View report status"}
                    </a>
                  ) : (
                    <button
                      type="submit"
                      className="mt-4 inline-flex min-h-14 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white sm:w-fit"
                    >
                      {isEnterprise
                        ? "Submit enterprise intake"
                        : isStewardship
                          ? canSubmitMonthlyUpdate
                            ? "Submit monthly update"
                            : "Submit baseline intake"
                          : "Submit workflow intake"}
                    </button>
                  )}
                </div>
              </section>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
