import { NextResponse } from "next/server";
import { generateAxiomJsonWithOpenAi } from "../../../../lib/axiom-ai.server";
import { assertAxiomReportJson } from "../../../../lib/axiom-report-validation";
import type {
  AxiomProductSlug,
  AxiomReportJson,
  AxiomReportType,
} from "../../../../lib/axiom-report-types";

export const runtime = "nodejs";

type ReportRecord = {
  id: string;
  submission_id: string | null;
  customer_id: string | null;
  order_id: string | null;
  product_id: string | null;
  tier_slug: string | null;
  report_schema_version: number | null;
  status: string | null;
};

type WorkflowSubmissionRecord = {
  id: string;
  customer_id: string | null;
  order_id: string | null;
  product_id: string | null;
  intake_schema_id: string | null;
  intake_schema_version: number | null;
  tier_slug: string | null;
  workflow_title: string | null;
  status: string | null;
  intake_payload: unknown;
  updated_at: string | null;
};

type CustomerRecord = {
  full_name: string | null;
  business_name: string | null;
  email: string | null;
};

type OrderRecord = {
  service_name: string | null;
  tier_slug: string | null;
  payment_status: string | null;
  status: string | null;
};

type GenerateRequestBody = {
  report_id?: string;
};

const productReportTypeMap: Record<AxiomProductSlug, AxiomReportType> = {
  "workflow-audit": "diagnostic_report",
  "workflow-blueprint": "implementation_blueprint",
  "custom-operating-pack": "operating_pack",
  "workflow-stewardship": "optimisation_review",
  "departmental-ecosystem": "ecosystem_architecture",
  "architect-residency": "deployment_scope",
};

const allowedProductSlugs = new Set<AxiomProductSlug>(Object.keys(productReportTypeMap) as AxiomProductSlug[]);

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Missing database environment variables.");
  }

  return {
    url: url.replace(/\/$/, ""),
    serviceRoleKey,
  };
}

function getGenerationToken() {
  const token = process.env.AXIOM_REPORT_GENERATION_TOKEN;

  if (!token) {
    throw new Error("Missing AXIOM_REPORT_GENERATION_TOKEN environment variable.");
  }

  return token;
}

function getProvidedToken(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length).trim();
  }

  return request.headers.get("x-axiom-report-token")?.trim() || "";
}

function unauthorized() {
  return NextResponse.json(
    {
      ok: false,
      error: "unauthorized",
    },
    { status: 401 },
  );
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

async function readRequestBody(request: Request): Promise<GenerateRequestBody> {
  const contentType = request.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    return {};
  }

  try {
    return (await request.json()) as GenerateRequestBody;
  } catch {
    return {};
  }
}

async function getQueuedReport(reportId?: string) {
  const query = reportId
    ? `axiom_audit_reports?select=id,submission_id,customer_id,order_id,product_id,tier_slug,report_schema_version,status&id=eq.${encodeURIComponent(reportId)}&limit=1`
    : "axiom_audit_reports?select=id,submission_id,customer_id,order_id,product_id,tier_slug,report_schema_version,status&status=eq.queued&order=updated_at.asc&limit=1";

  const reports = await supabaseFetch<ReportRecord[]>(query);
  return reports[0] ?? null;
}

async function getWorkflowSubmission(submissionId: string) {
  const submissions = await supabaseFetch<WorkflowSubmissionRecord[]>(
    `axiom_workflow_submissions?select=id,customer_id,order_id,product_id,intake_schema_id,intake_schema_version,tier_slug,workflow_title,status,intake_payload,updated_at&id=eq.${encodeURIComponent(submissionId)}&limit=1`,
  );

  return submissions[0] ?? null;
}

async function getCustomer(customerId?: string | null) {
  if (!customerId) {
    return null;
  }

  const customers = await supabaseFetch<CustomerRecord[]>(
    `axiom_customers?select=full_name,business_name,email&id=eq.${encodeURIComponent(customerId)}&limit=1`,
  );

  return customers[0] ?? null;
}

async function getOrder(orderId?: string | null) {
  if (!orderId) {
    return null;
  }

  const orders = await supabaseFetch<OrderRecord[]>(
    `axiom_orders?select=service_name,tier_slug,payment_status,status&id=eq.${encodeURIComponent(orderId)}&limit=1`,
  );

  return orders[0] ?? null;
}

async function patchReport(reportId: string, payload: Record<string, unknown>) {
  await supabaseFetch(`axiom_audit_reports?id=eq.${encodeURIComponent(reportId)}`, {
    method: "PATCH",
    prefer: "return=minimal",
    body: JSON.stringify(payload),
  });
}

async function markReportGenerationFailed(reportId: string) {
  try {
    await patchReport(reportId, {
      status: "failed",
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to mark report generation as failed", error);
  }
}

function getProductSlug(report: ReportRecord, submission: WorkflowSubmissionRecord, order: OrderRecord | null) {
  const slug = report.tier_slug || submission.tier_slug || order?.tier_slug;

  if (!slug || !allowedProductSlugs.has(slug as AxiomProductSlug)) {
    throw new Error("Unsupported or missing product slug for report generation.");
  }

  return slug as AxiomProductSlug;
}

function recommendedReportStatus(reportJson: AxiomReportJson) {
  if (reportJson.quality_control.status === "ready" && reportJson.quality_control.total >= 10) {
    return "generated";
  }

  return "needs_review";
}

function buildSystemPrompt() {
  return `You are Axiom Architect's report generation engine.

You produce structured, evidence-based workflow architecture reports from paid client intake data.

Rules:
- Return only valid JSON. Do not wrap the JSON in markdown.
- Match the requested schema exactly.
- Do not invent client facts, tools, metrics, risks, or constraints.
- If information is not present, say so in assumptions or missing_information.
- Do not make legal, financial, security, uptime, revenue, compliance, or performance guarantees.
- Avoid unqualified certainty in client-facing wording.
- Use clear, calm, practical language that a business owner can implement.
- Every recommendation must connect to evidence from the intake data.
- Every automation recommendation must include a human review boundary.
- Keep the report premium, useful, and operational — not motivational or generic.
- Do not recommend automating sensitive approval decisions without review gates.
- Do not pressure an upgrade. Recommend a next product only when the evidence supports it.

Most important report rule:
The report must lead with what Axiom Architect has improved or clarified for the client. Do not simply repeat their intake back to them. Convert messy input into a clearer workflow model, action path, and safer operating structure.

Improvement summary requirement:
- improvement_summary.before_state must summarise the messy or risky state implied by the intake.
- improvement_summary.improved_state must state how Axiom has reframed the workflow into a clearer operating model.
- improvement_summary.value_created must explain the practical value created by the report.
- improvement_summary.core_improvements must each connect one client input to one specific improvement made by Axiom and why it matters.

Client action brief requirement:
- client_action_brief.first_priority must be the single most important action the client should take first.
- next_7_days must include practical actions the client can do immediately.
- next_30_days must include staged actions that build on the first week.
- do_not_automate_yet must protect the client from risky automation.
- decision_points_for_client must state what the client needs to decide before implementation.
- where_axiom_can_help_next must describe concrete service support Axiom can provide next.

Scorecard rule:
The scorecard is supporting evidence only. It must explain readiness in plain English and must not make the report feel like a pass/fail grade.

Quality scoring:
- quality_control.clarity, completeness, evidence, assumptions, risk_control, and actionability must each be 0, 1, or 2.
- quality_control.total must equal those six scores added together.
- quality_control.status must be ready for 10-12, needs_fixes for 7-9, or blocked for 0-6.

Client outcome requirement:
The final report must tell the client what Axiom improved, why it matters, what should change, what should stay human-controlled, and what to do next.`;
}

function buildUserPrompt({
  report,
  submission,
  customer,
  order,
  productSlug,
}: {
  report: ReportRecord;
  submission: WorkflowSubmissionRecord;
  customer: CustomerRecord | null;
  order: OrderRecord | null;
  productSlug: AxiomProductSlug;
}) {
  const source = {
    target_report_schema: {
      schema_version: 2,
      product_slug: productSlug,
      report_type: productReportTypeMap[productSlug],
      required_top_level_keys: [
        "schema_version",
        "product_slug",
        "report_type",
        "report_status",
        "generated_at",
        "client",
        "submission",
        "improvement_summary",
        "client_action_brief",
        "executive_summary",
        "current_state",
        "diagnosis",
        "scorecard",
        "assistant_opportunity_map",
        "automation_suitability",
        "risk_review",
        "future_state",
        "implementation_plan",
        "upgrade_recommendation",
        "quality_control",
        "delivery",
      ],
    },
    report_record: report,
    client: customer,
    order,
    submission: {
      id: submission.id,
      workflow_title: submission.workflow_title || "Untitled workflow",
      tier_slug: productSlug,
      intake_schema_version: submission.intake_schema_version,
      status: submission.status,
      submitted_at: submission.updated_at,
      intake_payload: submission.intake_payload,
    },
  };

  return `Generate one Axiom Architect report JSON object from this source data.

The report must follow this exact TypeScript-compatible JSON shape:

{
  "schema_version": 2,
  "product_slug": "${productSlug}",
  "report_type": "${productReportTypeMap[productSlug]}",
  "report_status": "generated",
  "generated_at": "ISO timestamp",
  "client": { "name": string|null, "email": string|null, "business_name": string|null },
  "submission": { "id": string, "workflow_title": string, "tier_slug": "${productSlug}", "intake_schema_version": number|null, "submitted_at": string|null },
  "improvement_summary": { "headline": string, "before_state": string, "improved_state": string, "value_created": string, "core_improvements": [{ "area": string, "client_input_used": string, "improvement_made": string, "why_it_matters": string }] },
  "client_action_brief": { "first_priority": string, "next_7_days": string[], "next_30_days": string[], "do_not_automate_yet": string[], "decision_points_for_client": string[], "where_axiom_can_help_next": string[] },
  "executive_summary": { "headline": string, "plain_english_summary": string, "strongest_opportunity": string, "primary_constraint": string, "next_best_action": string },
  "current_state": { "workflow_purpose": string, "current_workflow_map": string[], "tools_and_systems": string[], "human_roles": string[], "known_constraints": string[] },
  "diagnosis": { "findings": [{ "title": string, "observation": string, "evidence": string[], "implication": string, "recommended_response": string }], "assumptions": string[], "missing_information": string[] },
  "scorecard": { "scores": [{ "name": string, "label": string, "score": number, "rationale": string, "client_meaning": string }], "overall_readiness_score": number, "overall_readiness_label": string },
  "assistant_opportunity_map": [{ "workflow_step": string, "assistant_role": string, "suitable_tasks": string[], "must_not_do": string[], "review_gate": string }],
  "automation_suitability": { "summary": string, "suitable_now": string[], "suitable_later": string[], "not_recommended": string[], "reasoned_boundary": string },
  "risk_review": { "human_review_level": "low"|"medium"|"high"|"critical", "review_gates": [{ "risk": string, "level": "low"|"medium"|"high"|"critical", "why_it_matters": string, "review_gate": string }] },
  "future_state": { "summary": string, "workflow_steps": [{ "step": string, "owner": string, "ai_support": string, "human_review": string, "output": string }] },
  "implementation_plan": { "immediate_actions": [{ "title": string, "priority": "low"|"medium"|"high", "owner_type": "client"|"axiom"|"shared", "expected_outcome": string, "implementation_note": string }], "next_30_days": [{ "title": string, "priority": "low"|"medium"|"high", "owner_type": "client"|"axiom"|"shared", "expected_outcome": string, "implementation_note": string }], "later_actions": [{ "title": string, "priority": "low"|"medium"|"high", "owner_type": "client"|"axiom"|"shared", "expected_outcome": string, "implementation_note": string }] },
  "upgrade_recommendation": { "recommended_product_slug": "workflow-audit"|"workflow-blueprint"|"custom-operating-pack"|"workflow-stewardship"|"departmental-ecosystem"|"architect-residency"|"none", "recommendation": string, "evidence": string[], "why_now_or_why_not": string },
  "quality_control": { "clarity": number, "completeness": number, "evidence": number, "assumptions": number, "risk_control": number, "actionability": number, "total": number, "status": "ready"|"needs_fixes"|"blocked", "reviewer_notes": string[] },
  "delivery": { "dashboard_summary": string, "client_expectation_note": string, "pdf_ready": false, "email_ready": false }
}

Content requirements:
- Create at least 4 core_improvements.
- Each core_improvement must say what client input was used, what improvement was made, and why that matters.
- Create at least 3 next_7_days actions and 3 next_30_days actions.
- The first_priority must be specific enough for the client to act on without asking what it means.
- The delivery.dashboard_summary must explain the value of the report, not just restate the workflow title.

Source data:
${JSON.stringify(source, null, 2)}`;
}

export async function POST(request: Request) {
  let activeReportId: string | null = null;

  try {
    if (getProvidedToken(request) !== getGenerationToken()) {
      return unauthorized();
    }

    const body = await readRequestBody(request);
    const report = await getQueuedReport(body.report_id);
    activeReportId = report?.id ?? null;

    if (!report) {
      return NextResponse.json({
        ok: true,
        generated: false,
        reason: "no_queued_report",
      });
    }

    if (!report.submission_id) {
      await markReportGenerationFailed(report.id);

      return NextResponse.json(
        {
          ok: false,
          error: "report_missing_submission_id",
          report_id: report.id,
        },
        { status: 422 },
      );
    }

    await patchReport(report.id, {
      status: "generating",
      updated_at: new Date().toISOString(),
    });

    const submission = await getWorkflowSubmission(report.submission_id);

    if (!submission) {
      await markReportGenerationFailed(report.id);

      return NextResponse.json(
        {
          ok: false,
          error: "submission_not_found",
          report_id: report.id,
        },
        { status: 404 },
      );
    }

    const [customer, order] = await Promise.all([
      getCustomer(report.customer_id || submission.customer_id),
      getOrder(report.order_id || submission.order_id),
    ]);
    const productSlug = getProductSlug(report, submission, order);

    const generatedJson = await generateAxiomJsonWithOpenAi({
      system: buildSystemPrompt(),
      user: buildUserPrompt({
        report,
        submission,
        customer,
        order,
        productSlug,
      }),
      model: process.env.OPENAI_REPORT_MODEL || undefined,
      temperature: 0.2,
    });

    assertAxiomReportJson(generatedJson);

    const reportJson = generatedJson as AxiomReportJson;
    const status = recommendedReportStatus(reportJson);
    const generatedAt = reportJson.generated_at || new Date().toISOString();

    await patchReport(report.id, {
      status,
      report_json: reportJson,
      report_schema_version: reportJson.schema_version,
      quality_score: reportJson.quality_control.total,
      quality_status: reportJson.quality_control.status,
      reviewer_notes: reportJson.quality_control.reviewer_notes,
      client_summary: reportJson.delivery.dashboard_summary,
      generated_at: generatedAt,
      updated_at: generatedAt,
    });

    return NextResponse.json({
      ok: true,
      generated: true,
      report_id: report.id,
      submission_id: submission.id,
      status,
      quality_score: reportJson.quality_control.total,
      quality_status: reportJson.quality_control.status,
    });
  } catch (error) {
    console.error("Axiom report generation failed", error);

    if (activeReportId) {
      await markReportGenerationFailed(activeReportId);
    }

    return NextResponse.json(
      {
        ok: false,
        error: "report_generation_failed",
        message: error instanceof Error ? error.message : "Unknown report generation error.",
      },
      { status: 500 },
    );
  }
}

export function GET() {
  return NextResponse.json(
    {
      ok: false,
      error: "method_not_allowed",
    },
    { status: 405 },
  );
}
