import { NextResponse } from "next/server";
import {
  getEnterpriseArchitectureIntakeSchema,
  isEnterpriseArchitectureSlug,
} from "../../../lib/axiom-enterprise-intake";
import { getStewardshipCycleState, isWorkflowStewardship } from "../../../lib/axiom-stewardship";

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
  updated_at: string | null;
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

type AuditReportRecord = {
  id: string;
  updated_at: string | null;
  generated_at?: string | null;
};

const universalWorkflowTitleField: SchemaField = {
  key: "workflow_title",
  label: "Workflow name",
  type: "input",
  required: true,
};

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
    `axiom_workflow_submissions?select=id,customer_id,order_id,product_id,intake_schema_id,intake_schema_version,tier_slug,status,updated_at&id=eq.${encodeURIComponent(submissionId)}&limit=1`,
  );

  return records[0] ?? null;
}

async function getLatestReport(workflowId: string) {
  const reports = await supabaseFetch<AuditReportRecord[]>(
    `axiom_audit_reports?select=id,updated_at,generated_at&submission_id=eq.${encodeURIComponent(workflowId)}&order=updated_at.desc&limit=1`,
  );

  return reports[0] ?? null;
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

async function getSchemaForWorkflow(workflow: WorkflowRecord): Promise<IntakeSchemaRecord | null> {
  const storedSchema =
    (await getSchemaById(workflow.intake_schema_id)) ||
    (await getActiveSchemaByProduct(workflow.product_id));

  if (isEnterpriseArchitectureSlug(workflow.tier_slug)) {
    return getEnterpriseArchitectureIntakeSchema(storedSchema) as IntakeSchemaRecord;
  }

  return storedSchema;
}

function schemaHasWorkflowTitle(schema: IntakeSchemaRecord | null) {
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

function getSchemaFieldKeys(schema: IntakeSchemaRecord | null) {
  const stages = schema?.schema_json?.stages;

  if (!Array.isArray(stages)) {
    return [];
  }

  const fieldKeys = Array.from(
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

  if (!fieldKeys.includes(universalWorkflowTitleField.key)) {
    return [universalWorkflowTitleField.key, ...fieldKeys];
  }

  return fieldKeys;
}

function buildStagePayload(schema: IntakeSchemaRecord | null, fieldValues: Record<string, string>) {
  const stages = schema?.schema_json?.stages;

  if (!Array.isArray(stages)) {
    return [];
  }

  const shouldInjectWorkflowTitle = !schemaHasWorkflowTitle(schema);

  return stages.map((stage, index) => {
    const stageFields = Array.isArray(stage.fields) ? stage.fields : [];
    const fields = shouldInjectWorkflowTitle && index === 0
      ? [universalWorkflowTitleField, ...stageFields]
      : stageFields;

    return {
      number: stage.number || String(index + 1).padStart(2, "0"),
      title: stage.title || `Stage ${index + 1}`,
      fields: fields.map((field) => ({
        key: field.key,
        label: field.label || field.key,
        type: field.type || "textarea",
        required: Boolean(field.required),
        value: fieldValues[field.key] || "",
      })),
    };
  });
}

async function queueAuditReport(workflow: WorkflowRecord, submittedAt: string) {
  const existingReports = await supabaseFetch<AuditReportRecord[]>(
    `axiom_audit_reports?select=id,updated_at&submission_id=eq.${encodeURIComponent(workflow.id)}&limit=1`,
  );

  const existingReport = existingReports[0];
  const reportPayload = {
    submission_id: workflow.id,
    customer_id: workflow.customer_id,
    order_id: workflow.order_id,
    product_id: workflow.product_id,
    tier_slug: workflow.tier_slug,
    report_schema_version: 2,
    status: "queued",
    updated_at: submittedAt,
  };

  if (existingReport?.id) {
    await supabaseFetch(
      `axiom_audit_reports?id=eq.${encodeURIComponent(existingReport.id)}`,
      {
        method: "PATCH",
        prefer: "return=minimal",
        body: JSON.stringify(reportPayload),
      },
    );

    return;
  }

  await supabaseFetch("axiom_audit_reports", {
    method: "POST",
    prefer: "return=minimal",
    body: JSON.stringify(reportPayload),
  });
}

async function canSubmitWorkflow(workflow: WorkflowRecord) {
  if (!workflow.status || workflow.status === "draft") {
    return true;
  }

  if (!isWorkflowStewardship(workflow.tier_slug)) {
    return false;
  }

  const latestReport = await getLatestReport(workflow.id);
  const cycleState = getStewardshipCycleState({
    tierSlug: workflow.tier_slug,
    workflowStatus: workflow.status,
    workflowUpdatedAt: workflow.updated_at,
    reportUpdatedAt: latestReport?.generated_at || latestReport?.updated_at,
  });

  return Boolean(cycleState?.canSubmitUpdate);
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

    if (!(await canSubmitWorkflow(workflow))) {
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

    const submittedAt = new Date().toISOString();
    const workflowTitle =
      cleanField(formData, universalWorkflowTitleField.key) ||
      fieldValues.workflow_title ||
      "Untitled workflow";
    const intakeFieldValues = {
      ...fieldValues,
      workflow_title: workflowTitle,
    };
    const intakePayload = {
      schema_id: schema.id,
      schema_version: schema.version,
      fields: intakeFieldValues,
      stages: buildStagePayload(schema, intakeFieldValues),
      enterprise_architecture_submitted_at: isEnterpriseArchitectureSlug(workflow.tier_slug) ? submittedAt : undefined,
      stewardship_cycle_submitted_at: isWorkflowStewardship(workflow.tier_slug) ? submittedAt : undefined,
    };

    await supabaseFetch(
      `axiom_workflow_submissions?id=eq.${encodeURIComponent(submissionId)}`,
      {
        method: "PATCH",
        prefer: "return=minimal",
        body: JSON.stringify({
          workflow_title: workflowTitle,
          intake_payload: intakePayload,
          intake_schema_id: schema.id,
          intake_schema_version: schema.version,
          status: "submitted",
          submitted_at: submittedAt,
          updated_at: submittedAt,
        }),
      },
    );

    await queueAuditReport(workflow, submittedAt);

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
