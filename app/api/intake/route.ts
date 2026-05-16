import { NextResponse } from "next/server";

export const runtime = "nodejs";

type WorkflowRecord = {
  id: string;
  customer_id: string | null;
  order_id: string | null;
  product_id: string | null;
  intake_schema_id: string | null;
  intake_schema_version: number | null;
  tier_slug: string | null;
  status: string | null;
};

type SchemaField = {
  key: string;
  label?: string;
  type?: string;
  required?: boolean;
};

type SchemaStage = {
  number?: string;
  title?: string;
  fields?: SchemaField[];
};

type IntakeSchemaRecord = {
  id: string;
  version: number;
  schema_json: {
    stages?: SchemaStage[];
  } | null;
};

const legacyColumnNames = [
  "business_type",
  "user_role",
  "team_size",
  "industry",
  "business_description",
  "workflow_title",
  "workflow_goal",
  "people_involved",
  "workflow_frequency",
  "workflow_trigger",
  "current_process_steps",
  "tools_used",
  "inputs_needed",
  "outputs_produced",
  "handoffs",
  "information_storage",
  "workflow_slowdowns",
  "manual_repetition",
  "mistake_points",
  "delay_causes",
  "team_or_client_frustrations",
  "failure_impact",
  "human_approval_needed",
  "risk_areas",
  "protected_decisions",
  "ideal_workflow",
  "assistant_support_requested",
  "tools_open_to_using",
  "success_definition",
] as const;

const legacyColumnSet = new Set<string>(legacyColumnNames);

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Missing database environment variables");
  }

  return {
    url: url.replace(/\/$/, ""),
    serviceRoleKey,
  };
}

async function supabaseFetch<T>(
  path: string,
  options: RequestInit & { prefer?: string } = {},
): Promise<T> {
  const { url, serviceRoleKey } = getSupabaseConfig();
  const headers = new Headers(options.headers);

  headers.set("apikey", serviceRoleKey);
  headers.set("Authorization", `Bearer ${serviceRoleKey}`);
  headers.set("Content-Type", "application/json");

  if (options.prefer) {
    headers.set("Prefer", options.prefer);
  }

  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers,
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`Database request failed: ${response.status} ${responseText}`);
  }

  if (!responseText) {
    return undefined as T;
  }

  return JSON.parse(responseText) as T;
}

function cleanField(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function redirectToIntake(request: Request, submissionId: string, state: string) {
  const url = new URL("/dashboard/intake", request.url);
  url.searchParams.set("submission_id", submissionId);
  url.searchParams.set(state, "1");
  return NextResponse.redirect(url, 303);
}

function redirectToReceived(request: Request, submissionId: string) {
  const url = new URL("/dashboard/intake/received", request.url);
  url.searchParams.set("submission_id", submissionId);
  return NextResponse.redirect(url, 303);
}

async function getWorkflowSubmission(submissionId: string) {
  const records = await supabaseFetch<WorkflowRecord[]>(
    `axiom_workflow_submissions?select=id,customer_id,order_id,product_id,intake_schema_id,intake_schema_version,tier_slug,status&id=eq.${encodeURIComponent(submissionId)}&limit=1`,
  );

  return records[0] ?? null;
}

async function getSchemaById(schemaId?: string | null) {
  if (!schemaId) {
    return null;
  }

  const schemas = await supabaseFetch<IntakeSchemaRecord[]>(
    `axiom_product_intake_schemas?select=id,version,schema_json&id=eq.${encodeURIComponent(schemaId)}&limit=1`,
  );

  return schemas[0] ?? null;
}

async function getActiveSchemaByProduct(productId?: string | null) {
  if (!productId) {
    return null;
  }

  const schemas = await supabaseFetch<IntakeSchemaRecord[]>(
    `axiom_product_intake_schemas?select=id,version,schema_json&product_id=eq.${encodeURIComponent(productId)}&active=eq.true&limit=1`,
  );

  return schemas[0] ?? null;
}

async function getSchemaForWorkflow(workflow: WorkflowRecord) {
  return (await getSchemaById(workflow.intake_schema_id)) || (await getActiveSchemaByProduct(workflow.product_id));
}

function getSchemaFieldKeys(schema: IntakeSchemaRecord | null) {
  const stages = schema?.schema_json?.stages;

  if (!Array.isArray(stages)) {
    return [];
  }

  return Array.from(
    new Set(
      stages.flatMap((stage) =>
        Array.isArray(stage.fields)
          ? stage.fields
              .map((field) => field.key)
              .filter((key): key is string => typeof key === "string" && key.trim().length > 0)
          : [],
      ),
    ),
  );
}

function buildStagePayload(schema: IntakeSchemaRecord | null, fieldValues: Record<string, string>) {
  const stages = schema?.schema_json?.stages;

  if (!Array.isArray(stages)) {
    return [];
  }

  return stages.map((stage, index) => ({
    number: stage.number || String(index + 1).padStart(2, "0"),
    title: stage.title || `Stage ${index + 1}`,
    fields: Array.isArray(stage.fields)
      ? stage.fields.map((field) => ({
          key: field.key,
          label: field.label || field.key,
          type: field.type || "textarea",
          required: Boolean(field.required),
          value: fieldValues[field.key] || "",
        }))
      : [],
  }));
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const submissionId = cleanField(formData, "submission_id");

  if (!submissionId) {
    const url = new URL("/dashboard", request.url);
    url.searchParams.set("error", "missing-submission");
    return NextResponse.redirect(url, 303);
  }

  try {
    const workflow = await getWorkflowSubmission(submissionId);

    if (!workflow) {
      return redirectToIntake(request, submissionId, "not_found");
    }

    if (workflow.status && workflow.status !== "draft") {
      return redirectToIntake(request, submissionId, "locked");
    }

    const schema = await getSchemaForWorkflow(workflow);
    const fieldKeys = getSchemaFieldKeys(schema);

    if (!schema || fieldKeys.length === 0) {
      return redirectToIntake(request, submissionId, "schema_missing");
    }

    const fieldValues = Object.fromEntries(
      fieldKeys.map((fieldName) => [fieldName, cleanField(formData, fieldName)]),
    );

    const legacyColumnValues = Object.fromEntries(
      Object.entries(fieldValues).filter(([fieldName]) => legacyColumnSet.has(fieldName)),
    );

    const submittedAt = new Date().toISOString();
    const workflowTitle = fieldValues.workflow_title || "Untitled workflow";
    const intakePayload = {
      schema_id: schema.id,
      schema_version: schema.version,
      fields: fieldValues,
      stages: buildStagePayload(schema, fieldValues),
    };

    await supabaseFetch(
      `axiom_workflow_submissions?id=eq.${encodeURIComponent(submissionId)}`,
      {
        method: "PATCH",
        prefer: "return=minimal",
        body: JSON.stringify({
          ...legacyColumnValues,
          workflow_title: workflowTitle,
          intake_payload: intakePayload,
          intake_schema_id: schema.id,
          intake_schema_version: schema.version,
          current_stage: fieldKeys.length,
          status: "submitted",
          intake_completed_at: submittedAt,
          submitted_at: submittedAt,
        }),
      },
    );

    await supabaseFetch("axiom_audit_reports?on_conflict=submission_id", {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=minimal",
      body: JSON.stringify({
        submission_id: workflow.id,
        customer_id: workflow.customer_id,
        order_id: workflow.order_id,
        product_id: workflow.product_id,
        tier_slug: workflow.tier_slug,
        report_schema_version: 1,
        status: "queued",
        updated_at: submittedAt,
      }),
    });

    return redirectToReceived(request, submissionId);
  } catch (error) {
    console.error("Workflow intake submission failed", error);
    return redirectToIntake(request, submissionId, "error");
  }
}

export function GET(request: Request) {
  const url = new URL("/dashboard", request.url);
  return NextResponse.redirect(url, 303);
}
