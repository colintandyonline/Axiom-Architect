import { NextResponse } from "next/server";

export const runtime = "nodejs";

type WorkflowRecord = {
  id: string;
  customer_id: string | null;
  order_id: string | null;
  tier_slug: string;
};

const fieldNames = [
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

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables");
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
    throw new Error(`Supabase request failed: ${response.status} ${responseText}`);
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

async function getWorkflowSubmission(submissionId: string) {
  const records = await supabaseFetch<WorkflowRecord[]>(
    `axiom_workflow_submissions?select=id,customer_id,order_id,tier_slug&id=eq.${encodeURIComponent(submissionId)}&limit=1`,
  );

  return records[0] ?? null;
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

    const intakeValues = Object.fromEntries(
      fieldNames.map((fieldName) => [fieldName, cleanField(formData, fieldName)]),
    ) as Record<(typeof fieldNames)[number], string>;

    const intakePayload = {
      business_context: {
        business_type: intakeValues.business_type,
        user_role: intakeValues.user_role,
        team_size: intakeValues.team_size,
        industry: intakeValues.industry,
        business_description: intakeValues.business_description,
      },
      workflow_overview: {
        workflow_title: intakeValues.workflow_title,
        workflow_goal: intakeValues.workflow_goal,
        people_involved: intakeValues.people_involved,
        workflow_frequency: intakeValues.workflow_frequency,
        workflow_trigger: intakeValues.workflow_trigger,
      },
      current_process: {
        current_process_steps: intakeValues.current_process_steps,
        tools_used: intakeValues.tools_used,
        inputs_needed: intakeValues.inputs_needed,
        outputs_produced: intakeValues.outputs_produced,
        handoffs: intakeValues.handoffs,
        information_storage: intakeValues.information_storage,
      },
      pain_points: {
        workflow_slowdowns: intakeValues.workflow_slowdowns,
        manual_repetition: intakeValues.manual_repetition,
        mistake_points: intakeValues.mistake_points,
        delay_causes: intakeValues.delay_causes,
        team_or_client_frustrations: intakeValues.team_or_client_frustrations,
      },
      risk_and_review: {
        failure_impact: intakeValues.failure_impact,
        human_approval_needed: intakeValues.human_approval_needed,
        risk_areas: intakeValues.risk_areas,
        protected_decisions: intakeValues.protected_decisions,
      },
      desired_outcome: {
        ideal_workflow: intakeValues.ideal_workflow,
        assistant_support_requested: intakeValues.assistant_support_requested,
        tools_open_to_using: intakeValues.tools_open_to_using,
        success_definition: intakeValues.success_definition,
      },
    };

    const submittedAt = new Date().toISOString();

    await supabaseFetch(
      `axiom_workflow_submissions?id=eq.${encodeURIComponent(submissionId)}`,
      {
        method: "PATCH",
        prefer: "return=minimal",
        body: JSON.stringify({
          ...intakeValues,
          workflow_title: intakeValues.workflow_title || "Untitled workflow",
          intake_payload: intakePayload,
          current_stage: 7,
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
        tier_slug: workflow.tier_slug,
        status: "queued",
        updated_at: submittedAt,
      }),
    });

    return redirectToIntake(request, submissionId, "submitted");
  } catch (error) {
    console.error("Workflow intake submission failed", error);
    return redirectToIntake(request, submissionId, "error");
  }
}

export function GET(request: Request) {
  const url = new URL("/dashboard", request.url);
  return NextResponse.redirect(url, 303);
}
