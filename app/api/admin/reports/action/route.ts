import { NextResponse } from "next/server";
import { requireAxiomAdmin } from "../../../../../lib/axiom-admin";
import {
  getAxiomPackageByCheckoutSlug,
  type AxiomDeliverableType,
} from "../../../../../lib/axiom-package-model";

export const runtime = "nodejs";

type AdminReportAction = "generate" | "regenerate" | "approve" | "needs_revision" | "queue" | "deliver";

type ReportJson = Record<string, unknown> & {
  delivery?: Record<string, unknown>;
  submission?: {
    workflow_title?: string;
  };
};

type ReportRecord = {
  id: string;
  submission_id: string | null;
  customer_id: string | null;
  order_id: string | null;
  tier_slug: string | null;
  status: string | null;
  client_summary: string | null;
  report_json: ReportJson | null;
};

type WorkflowSubmissionRecord = {
  id: string;
  customer_id: string | null;
  order_id: string | null;
  tier_slug: string | null;
  workflow_title: string | null;
};

type CustomerRecord = {
  email: string | null;
  full_name: string | null;
  business_name: string | null;
};

type WorkspaceRecord = {
  id: string;
  customer_id: string;
};

type DeliverableRecord = {
  id: string;
  metadata: Record<string, unknown> | null;
};

const allowedActions = new Set<AdminReportAction>([
  "generate",
  "regenerate",
  "approve",
  "needs_revision",
  "queue",
  "deliver",
]);

const productReportDeliverableMap: Record<string, AxiomDeliverableType> = {
  "workflow-audit": "workflow_diagnosis",
  "workflow-blueprint": "implementation_sequence",
  "custom-operating-pack": "handoff_pack",
  "workflow-stewardship": "stewardship_review",
  "departmental-ecosystem": "departmental_architecture_map",
  "architect-residency": "enterprise_architecture_report",
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

function getGenerationToken() {
  const token = process.env.AXIOM_REPORT_GENERATION_TOKEN;

  if (!token) {
    throw new Error("Missing AXIOM_REPORT_GENERATION_TOKEN environment variable.");
  }

  return token;
}

function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY environment variable.");
  }

  if (!fromEmail) {
    throw new Error("Missing RESEND_FROM_EMAIL environment variable.");
  }

  return {
    apiKey,
    fromEmail,
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

async function getReport(reportId: string) {
  const reports = await supabaseFetch<ReportRecord[]>(
    `axiom_audit_reports?select=id,submission_id,customer_id,order_id,tier_slug,status,client_summary,report_json&id=eq.${encodeURIComponent(reportId)}&limit=1`,
  );

  return reports[0] ?? null;
}

async function getWorkflowSubmission(submissionId?: string | null) {
  if (!submissionId) {
    return null;
  }

  const submissions = await supabaseFetch<WorkflowSubmissionRecord[]>(
    `axiom_workflow_submissions?select=id,customer_id,order_id,tier_slug,workflow_title&id=eq.${encodeURIComponent(submissionId)}&limit=1`,
  );

  return submissions[0] ?? null;
}

async function getCustomer(customerId?: string | null) {
  if (!customerId) {
    return null;
  }

  const customers = await supabaseFetch<CustomerRecord[]>(
    `axiom_customers?select=email,full_name,business_name&id=eq.${encodeURIComponent(customerId)}&limit=1`,
  );

  return customers[0] ?? null;
}

async function patchReport(reportId: string, payload: Record<string, unknown>) {
  await supabaseFetch(`axiom_audit_reports?id=eq.${encodeURIComponent(reportId)}`, {
    method: "PATCH",
    prefer: "return=minimal",
    body: JSON.stringify(payload),
  });
}

function safeReturnPath(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return "/admin#reports";
  }

  const trimmedValue = value.trim();

  if (!trimmedValue.startsWith("/") || trimmedValue.startsWith("//")) {
    return "/admin#reports";
  }

  if (!trimmedValue.startsWith("/admin")) {
    return "/admin#reports";
  }

  return trimmedValue;
}

function redirectBack(
  request: Request,
  returnPath: string,
  result: "success" | "error",
  action: string,
  message?: string,
) {
  const url = new URL(returnPath, request.url);
  url.searchParams.set("report_action", action);
  url.searchParams.set("result", result);

  if (message) {
    url.searchParams.set("message", message.slice(0, 180));
  }

  return NextResponse.redirect(url, 303);
}

function appUrl(request: Request) {
  const configuredUrl = process.env.APP_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  return new URL(request.url).origin.replace(/\/$/, "");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function reportTitle(report: ReportRecord, submission: WorkflowSubmissionRecord | null) {
  return (
    submission?.workflow_title ||
    report.report_json?.submission?.workflow_title ||
    "Your workflow report"
  );
}

function reportDeliveryUrl(request: Request, submissionId: string) {
  return `${appUrl(request)}/dashboard/report?submission_id=${encodeURIComponent(submissionId)}`;
}

function reportSummary(report: ReportRecord) {
  return report.client_summary ||
    (typeof report.report_json?.delivery?.dashboard_summary === "string"
      ? report.report_json.delivery.dashboard_summary
      : "Your Axiom Architect workflow report is ready to review in your dashboard.");
}

function getCanonicalReportDeliverableType(report: ReportRecord, submission: WorkflowSubmissionRecord) {
  const productSlug = report.tier_slug || submission.tier_slug || "";
  return productReportDeliverableMap[productSlug] || "workflow_diagnosis";
}

async function getReportWorkspace({
  customerId,
  orderId,
  report,
  submission,
}: {
  customerId: string;
  orderId: string | null;
  report: ReportRecord;
  submission: WorkflowSubmissionRecord;
}) {
  if (orderId) {
    const orderWorkspaces = await supabaseFetch<WorkspaceRecord[]>(
      `axiom_client_workspaces?select=id,customer_id&order_id=eq.${encodeURIComponent(orderId)}&limit=1`,
    );

    if (orderWorkspaces[0]?.id) {
      return orderWorkspaces[0];
    }
  }

  const customerWorkspaces = await supabaseFetch<WorkspaceRecord[]>(
    `axiom_client_workspaces?select=id,customer_id&customer_id=eq.${encodeURIComponent(customerId)}&order=updated_at.desc&limit=1`,
  );

  if (customerWorkspaces[0]?.id) {
    return customerWorkspaces[0];
  }

  const productSlug = report.tier_slug || submission.tier_slug || null;
  const packageModel = getAxiomPackageByCheckoutSlug(productSlug);
  const now = new Date().toISOString();
  const workspaces = await supabaseFetch<WorkspaceRecord[]>(
    "axiom_client_workspaces?select=id,customer_id",
    {
      method: "POST",
      prefer: "return=representation",
      body: JSON.stringify({
        customer_id: customerId,
        order_id: orderId,
        workspace_name: `${packageModel?.name || reportTitle(report, submission)} workspace`,
        workspace_type: "report_delivery_workspace",
        status: "active",
        current_phase: "review_and_approval",
        current_priority: "Review delivered report",
        next_client_action: "Open and review your delivered Axiom Architect report.",
        axiom_review_focus: packageModel?.shortDescription || reportSummary(report),
        last_activity_at: now,
        updated_at: now,
      }),
    },
  );

  return workspaces[0] ?? null;
}

async function getExistingReportDeliverable(workspaceId: string, reportId: string) {
  const deliverables = await supabaseFetch<DeliverableRecord[]>(
    `axiom_workspace_deliverables?select=id,metadata&workspace_id=eq.${encodeURIComponent(workspaceId)}&order=created_at.desc&limit=100`,
  );

  return deliverables.find((deliverable) => deliverable.metadata?.report_id === reportId) ?? null;
}

async function upsertReportDeliverable({
  request,
  report,
  submission,
  customerId,
}: {
  request: Request;
  report: ReportRecord;
  submission: WorkflowSubmissionRecord;
  customerId: string;
}) {
  const orderId = report.order_id || submission.order_id || null;
  const workspace = await getReportWorkspace({ customerId, orderId, report, submission });

  if (!workspace?.id) {
    throw new Error("No client workspace was available for report delivery.");
  }

  const now = new Date().toISOString();
  const title = reportTitle(report, submission);
  const summary = reportSummary(report);
  const externalUrl = reportDeliveryUrl(request, submission.id);
  const canonicalDeliverableType = getCanonicalReportDeliverableType(report, submission);
  const metadata = {
    source: "axiom_audit_reports",
    report_id: report.id,
    submission_id: submission.id,
    order_id: orderId,
    tier_slug: report.tier_slug || submission.tier_slug,
    canonical_deliverable_type: canonicalDeliverableType,
    report_delivery_url: externalUrl,
  };
  const existingDeliverable = await getExistingReportDeliverable(workspace.id, report.id);
  const payload = {
    workspace_id: workspace.id,
    customer_id: customerId,
    deliverable_type: canonicalDeliverableType,
    title,
    description: summary,
    status: "delivered",
    version: "v1",
    approval_required: false,
    external_url: externalUrl,
    delivered_at: now,
    metadata,
    updated_at: now,
  };

  if (existingDeliverable?.id) {
    await supabaseFetch(`axiom_workspace_deliverables?id=eq.${encodeURIComponent(existingDeliverable.id)}`, {
      method: "PATCH",
      prefer: "return=minimal",
      body: JSON.stringify(payload),
    });
  } else {
    await supabaseFetch("axiom_workspace_deliverables", {
      method: "POST",
      prefer: "return=minimal",
      body: JSON.stringify({
        ...payload,
        created_at: now,
      }),
    });
  }

  await supabaseFetch("axiom_workspace_activity", {
    method: "POST",
    prefer: "return=minimal",
    body: JSON.stringify({
      workspace_id: workspace.id,
      customer_id: customerId,
      actor_type: "axiom",
      actor_label: "Axiom Architect",
      activity_type: "report_delivered",
      title: "Report delivered",
      body: `${title} has been released to the client portal.`,
      metadata,
      is_client_visible: true,
    }),
  });
}

async function sendReportDeliveryEmail({
  request,
  report,
  submission,
  customer,
}: {
  request: Request;
  report: ReportRecord;
  submission: WorkflowSubmissionRecord;
  customer: CustomerRecord;
}) {
  const { apiKey, fromEmail } = getResendConfig();
  const clientEmail = customer.email?.trim();

  if (!clientEmail) {
    throw new Error("Cannot deliver report because the linked customer has no email address.");
  }

  const title = reportTitle(report, submission);
  const clientName = customer.full_name?.trim() || customer.business_name?.trim() || "there";
  const reportUrl = reportDeliveryUrl(request, submission.id);
  const summary = reportSummary(report);

  const escapedName = escapeHtml(clientName);
  const escapedTitle = escapeHtml(title);
  const escapedSummary = escapeHtml(summary);
  const escapedReportUrl = escapeHtml(reportUrl);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [clientEmail],
      subject: `Your Axiom Architect report is ready: ${title}`,
      html: `
        <div style="font-family:Arial,sans-serif;background:#050805;color:#ffffff;padding:32px;line-height:1.6;">
          <div style="max-width:680px;margin:0 auto;border:1px solid rgba(158,211,159,0.35);padding:28px;background:#030804;">
            <p style="margin:0 0 16px;color:#9ed39f;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">Axiom Architect</p>
            <h1 style="margin:0 0 18px;font-size:30px;line-height:1.05;text-transform:uppercase;letter-spacing:-0.04em;">Your workflow report is ready.</h1>
            <p style="margin:0 0 18px;color:#dfeee0;">Hi ${escapedName},</p>
            <p style="margin:0 0 18px;color:#dfeee0;">Your report for <strong style="color:#9ed39f;">${escapedTitle}</strong> is now available in your Axiom Architect dashboard.</p>
            <p style="margin:0 0 24px;color:#dfeee0;">${escapedSummary}</p>
            <p style="margin:0 0 24px;">
              <a href="${escapedReportUrl}" style="display:inline-block;background:#9ed39f;color:#000000;text-decoration:none;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;font-size:12px;padding:14px 18px;">View report</a>
            </p>
            <p style="margin:0;color:#aebbae;font-size:13px;">If the button does not work, copy this link into your browser:<br>${escapedReportUrl}</p>
          </div>
        </div>
      `,
      text: `Hi ${clientName},\n\nYour Axiom Architect report for ${title} is ready.\n\n${summary}\n\nView it here: ${reportUrl}`,
    }),
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`Resend delivery failed: ${response.status} ${responseText}`);
  }
}

async function deliverReport(request: Request, reportId: string) {
  const report = await getReport(reportId);

  if (!report) {
    throw new Error("Report not found.");
  }

  if (!["approved", "delivered"].includes(report.status || "")) {
    throw new Error("Report must be approved before delivery.");
  }

  const submission = await getWorkflowSubmission(report.submission_id);

  if (!submission) {
    throw new Error("Linked workflow submission was not found.");
  }

  const customerId = report.customer_id || submission.customer_id;
  const customer = await getCustomer(customerId);

  if (!customer) {
    throw new Error("Linked customer was not found.");
  }

  await sendReportDeliveryEmail({ request, report, submission, customer });

  try {
    await upsertReportDeliverable({
      request,
      report,
      submission,
      customerId: customerId || "",
    });
  } catch (error) {
    console.warn("Report workspace deliverable bridge skipped", {
      reportId: report.id,
      submissionId: submission.id,
      error,
    });
  }

  const now = new Date().toISOString();
  const updatedReportJson = report.report_json
    ? {
        ...report.report_json,
        report_status: "delivered",
        delivery: {
          ...(report.report_json.delivery || {}),
          email_ready: true,
        },
      }
    : null;

  await patchReport(report.id, {
    status: "delivered",
    ...(updatedReportJson ? { report_json: updatedReportJson } : {}),
    updated_at: now,
  });
}

async function runReportGeneration(request: Request, reportId: string) {
  const response = await fetch(new URL("/api/reports/generate", request.url), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getGenerationToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ report_id: reportId }),
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(responseText || `Report generation failed with ${response.status}`);
  }
}

export async function POST(request: Request) {
  await requireAxiomAdmin();

  const formData = await request.formData();
  const reportId = typeof formData.get("report_id") === "string" ? String(formData.get("report_id")) : "";
  const action = typeof formData.get("action") === "string" ? String(formData.get("action")) : "";
  const returnPath = safeReturnPath(formData.get("return_to"));

  if (!reportId || !allowedActions.has(action as AdminReportAction)) {
    return redirectBack(request, returnPath, "error", action || "unknown", "Invalid report action.");
  }

  try {
    const now = new Date().toISOString();

    if (action === "generate" || action === "regenerate") {
      await runReportGeneration(request, reportId);
      return redirectBack(request, returnPath, "success", action);
    }

    if (action === "approve") {
      await patchReport(reportId, {
        status: "approved",
        updated_at: now,
      });
      return redirectBack(request, returnPath, "success", action);
    }

    if (action === "deliver") {
      await deliverReport(request, reportId);
      return redirectBack(request, returnPath, "success", action, "Report email sent and client portal deliverable updated.");
    }

    if (action === "needs_revision") {
      await patchReport(reportId, {
        status: "revision_requested",
        updated_at: now,
      });
      return redirectBack(request, returnPath, "success", action);
    }

    if (action === "queue") {
      await patchReport(reportId, {
        status: "queued",
        updated_at: now,
      });
      return redirectBack(request, returnPath, "success", action);
    }

    return redirectBack(request, returnPath, "error", action, "Unsupported report action.");
  } catch (error) {
    console.error("Admin report action failed", error);
    return redirectBack(
      request,
      returnPath,
      "error",
      action,
      error instanceof Error ? error.message : "Unknown admin report action error.",
    );
  }
}

export function GET(request: Request) {
  return NextResponse.redirect(new URL("/admin", request.url), 303);
}
