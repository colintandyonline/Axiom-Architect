import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workflow Intake | Axiom Architect",
  description:
    "Submit the staged workflow details needed for your Axiom Architect audit report.",
};

export const dynamic = "force-dynamic";

type SearchParams = {
  submission_id?: string;
  submitted?: string;
  error?: string;
  not_found?: string;
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

async function getSchemaForIntake(intake: IntakeRecord) {
  return (await getSchemaById(intake.intake_schema_id)) || (await getActiveSchemaByProduct(intake.product_id));
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
  };
}

function getSchemaStages(schema?: IntakeSchemaRecord | null): SchemaStage[] {
  const stages = schema?.schema_json?.stages;

  if (!Array.isArray(stages)) {
    return [];
  }

  return stages
    .map((stage, index) => ({
      number: stage.number || String(index + 1).padStart(2, "0"),
      title: stage.title || `Stage ${index + 1}`,
      description: stage.description || "Complete the fields for this stage.",
      fields: Array.isArray(stage.fields)
        ? stage.fields.filter((field) => Boolean(field.key && field.label))
        : [],
    }))
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
  const isLocked = Boolean(context && context.intake.status !== "draft");
  const reportHref = context ? `/dashboard/report?submission_id=${context.intake.id}` : "/dashboard/report";
  const reviewStageNumber = String(stages.length + 1).padStart(2, "0");
  const schemaTitle = context?.schema?.title || "Workflow intake";

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
                {isLocked ? "Review submitted workflow." : "Submit your workflow for diagnosis."}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[#e6f6e7]/75 sm:text-lg">
                {isLocked
                  ? "This workflow intake has already been submitted and is now locked. Use the report status page to track the diagnostic report."
                  : context?.schema?.description ||
                    "Work through each stage carefully. This intake becomes the source material for your report, recommendations, and future workflow blueprint."}
              </p>
            </div>

            <aside className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5">
              <p className="m-0 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">
                Audit context
              </p>
              <div className="mt-5 grid gap-3 text-sm leading-6 text-[#e6f6e7]/78">
                <p className="m-0">
                  <strong className="text-white">Product:</strong> {context?.order?.service_name || context?.intake.tier_slug || "Workflow audit"}
                </p>
                <p className="m-0">
                  <strong className="text-white">Schema:</strong> {context?.schema ? `v${context.schema.version}` : "Not loaded"}
                </p>
                <p className="m-0">
                  <strong className="text-white">Business:</strong> {context?.customer?.business_name || "Not loaded"}
                </p>
                <p className="m-0">
                  <strong className="text-white">Status:</strong> {context ? formatStatus(context.intake.status) : "Missing submission"}
                </p>
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
                Your workflow audit has been received.
              </p>
              <p className="mb-0 mt-2 text-sm leading-6 text-black/72">
                The submission status is now set to submitted. The next stage is report processing.
              </p>
            </div>
          )}

          {isLocked && (
            <div className="mb-8 border border-[#9ed39f]/45 bg-[#9ed39f]/10 p-5 text-[#e6f6e7]/84">
              <p className="m-0 text-lg font-black uppercase tracking-[-0.02em] text-white">
                Intake locked
              </p>
              <p className="mb-0 mt-2 text-sm leading-6 text-[#e6f6e7]/72">
                This workflow has already been submitted. New submissions are disabled so the report source material remains stable.
              </p>
              <a
                href={reportHref}
                className="mt-5 inline-flex min-h-12 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-6 text-center text-[0.72rem] font-black uppercase tracking-[0.16em] text-black transition hover:bg-white"
              >
                View report status
              </a>
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
                Submission not found
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#e6f6e7]/75">
                This page needs a valid paid workflow submission ID. Return to the dashboard and open the intake from your audit card.
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
                Intake schema not found
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#e6f6e7]/75">
                This submission is missing its product intake schema. The product record needs an active intake schema before the form can be displayed.
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
                    Review and submit
                  </h2>
                </div>
                <div className="grid gap-4 text-sm leading-7 text-[#e6f6e7]/78">
                  <p className="m-0">
                    <strong className="text-white">Product purchased:</strong> {context.order?.service_name || context.intake.tier_slug}
                  </p>
                  <p className="m-0">
                    <strong className="text-white">Workflow title:</strong> {context.intake.workflow_title || fieldValue(context.intake, "workflow_title") || "Entered above and saved into the audit record."}
                  </p>
                  <p className="m-0">
                    <strong className="text-white">Delivery expectation:</strong> Report generation begins after the intake is submitted.
                  </p>
                  {isLocked ? (
                    <a
                      href={reportHref}
                      className="mt-4 inline-flex min-h-14 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white sm:w-fit"
                    >
                      View report status
                    </a>
                  ) : (
                    <button
                      type="submit"
                      className="mt-4 inline-flex min-h-14 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white sm:w-fit"
                    >
                      Submit workflow intake
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
