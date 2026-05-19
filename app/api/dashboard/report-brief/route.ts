import { NextResponse } from "next/server";
import { getAxiomAuthContext } from "../../../../lib/axiom-auth";
import type { AxiomReportJson } from "../../../../lib/axiom-report-types";

export const runtime = "nodejs";

type WorkflowRecord = {
  id: string;
  customer_id: string | null;
};

type ReportRecord = {
  id: string;
  status: string | null;
  report_json: Partial<AxiomReportJson> | null;
};

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

async function supabaseFetch<T>(path: string): Promise<T> {
  const { url, serviceRoleKey } = getSupabaseConfig();

  const response = await fetch(`${url}/rest/v1/${path}`, {
    cache: "no-store",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
    },
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

async function getWorkflow(customerId: string, submissionId?: string | null) {
  const query = submissionId
    ? `axiom_workflow_submissions?select=id,customer_id&id=eq.${encodeURIComponent(submissionId)}&customer_id=eq.${encodeURIComponent(customerId)}&limit=1`
    : `axiom_workflow_submissions?select=id,customer_id&customer_id=eq.${encodeURIComponent(customerId)}&order=updated_at.desc&limit=1`;

  const workflows = await supabaseFetch<WorkflowRecord[]>(query);
  return workflows[0] ?? null;
}

async function getReport(submissionId: string) {
  const reports = await supabaseFetch<ReportRecord[]>(
    `axiom_audit_reports?select=id,status,report_json&submission_id=eq.${encodeURIComponent(submissionId)}&limit=1`,
  );

  return reports[0] ?? null;
}

export async function GET(request: Request) {
  try {
    const { user, customer } = await getAxiomAuthContext();

    if (!user) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }

    if (!customer) {
      return NextResponse.json({ ok: false, error: "customer_not_found" }, { status: 403 });
    }

    const url = new URL(request.url);
    const submissionId = url.searchParams.get("submission_id");
    const workflow = await getWorkflow(customer.id, submissionId);

    if (!workflow) {
      return NextResponse.json({ ok: true, available: false, reason: "workflow_not_found" });
    }

    const report = await getReport(workflow.id);
    const reportJson = report?.report_json;

    if (!reportJson) {
      return NextResponse.json({ ok: true, available: false, reason: "report_not_found" });
    }

    return NextResponse.json({
      ok: true,
      available: true,
      report_id: report.id,
      status: report.status,
      improvement_summary: reportJson.improvement_summary || null,
      client_action_brief: reportJson.client_action_brief || null,
      delivery: reportJson.delivery || null,
      executive_summary: reportJson.executive_summary || null,
    });
  } catch (error) {
    console.error("Dashboard report brief request failed", error);

    return NextResponse.json(
      {
        ok: false,
        error: "report_brief_failed",
        message: error instanceof Error ? error.message : "Unknown report brief error.",
      },
      { status: 500 },
    );
  }
}
