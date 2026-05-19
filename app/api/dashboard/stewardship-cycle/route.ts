import { NextResponse } from "next/server";
import { getAxiomAuthContext } from "../../../../lib/axiom-auth";
import {
  formatStewardshipDate,
  getStewardshipCycleState,
} from "../../../../lib/axiom-stewardship";

export const runtime = "nodejs";

type WorkflowRecord = {
  id: string;
  order_id: string | null;
  tier_slug: string | null;
  workflow_title: string | null;
  status: string | null;
  updated_at: string | null;
};

type ReportRecord = {
  id: string;
  status: string | null;
  updated_at: string | null;
  generated_at: string | null;
};

type OrderRecord = {
  service_name: string | null;
  tier_slug: string | null;
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
    ? `axiom_workflow_submissions?select=id,order_id,tier_slug,workflow_title,status,updated_at&id=eq.${encodeURIComponent(submissionId)}&customer_id=eq.${encodeURIComponent(customerId)}&limit=1`
    : `axiom_workflow_submissions?select=id,order_id,tier_slug,workflow_title,status,updated_at&customer_id=eq.${encodeURIComponent(customerId)}&order=updated_at.desc&limit=1`;

  const workflows = await supabaseFetch<WorkflowRecord[]>(query);
  return workflows[0] ?? null;
}

async function getOrder(customerId: string, orderId?: string | null) {
  if (!orderId) {
    return null;
  }

  const orders = await supabaseFetch<OrderRecord[]>(
    `axiom_orders?select=service_name,tier_slug&id=eq.${encodeURIComponent(orderId)}&customer_id=eq.${encodeURIComponent(customerId)}&limit=1`,
  );

  return orders[0] ?? null;
}

async function getReport(submissionId: string) {
  const reports = await supabaseFetch<ReportRecord[]>(
    `axiom_audit_reports?select=id,status,updated_at,generated_at&submission_id=eq.${encodeURIComponent(submissionId)}&order=updated_at.desc&limit=1`,
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

    const order = await getOrder(customer.id, workflow.order_id);
    const tierSlug = workflow.tier_slug || order?.tier_slug;

    if (tierSlug !== "workflow-stewardship") {
      return NextResponse.json({ ok: true, available: false, reason: "not_stewardship" });
    }

    const report = await getReport(workflow.id);
    const cycle = getStewardshipCycleState({
      tierSlug,
      workflowStatus: workflow.status,
      workflowUpdatedAt: workflow.updated_at,
      reportUpdatedAt: report?.generated_at || report?.updated_at,
    });

    if (!cycle) {
      return NextResponse.json({ ok: true, available: false, reason: "cycle_not_available" });
    }

    return NextResponse.json({
      ok: true,
      available: true,
      workflow_id: workflow.id,
      workflow_title: workflow.workflow_title,
      service_name: order?.service_name || "Workflow Stewardship",
      report_status: report?.status || null,
      cycle: {
        ...cycle,
        anchorDateLabel: formatStewardshipDate(cycle.anchorDate),
        nextSubmissionOpensAtLabel: formatStewardshipDate(cycle.nextSubmissionOpensAt),
      },
    });
  } catch (error) {
    console.error("Stewardship cycle status request failed", error);

    return NextResponse.json(
      {
        ok: false,
        error: "stewardship_cycle_failed",
        message: error instanceof Error ? error.message : "Unknown stewardship cycle error.",
      },
      { status: 500 },
    );
  }
}
