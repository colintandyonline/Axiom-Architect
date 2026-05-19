import { NextResponse } from "next/server";
import { requireAxiomAdmin } from "../../../../../lib/axiom-admin";

export const runtime = "nodejs";

type AdminReportAction = "generate" | "regenerate" | "approve" | "needs_revision" | "queue";

const allowedActions = new Set<AdminReportAction>([
  "generate",
  "regenerate",
  "approve",
  "needs_revision",
  "queue",
]);

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

async function patchReport(reportId: string, payload: Record<string, unknown>) {
  await supabaseFetch(`axiom_audit_reports?id=eq.${encodeURIComponent(reportId)}`, {
    method: "PATCH",
    prefer: "return=minimal",
    body: JSON.stringify(payload),
  });
}

function redirectBack(request: Request, result: "success" | "error", action: string, message?: string) {
  const url = new URL("/admin#reports", request.url);
  url.searchParams.set("report_action", action);
  url.searchParams.set("result", result);

  if (message) {
    url.searchParams.set("message", message.slice(0, 180));
  }

  return NextResponse.redirect(url, 303);
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

  if (!reportId || !allowedActions.has(action as AdminReportAction)) {
    return redirectBack(request, "error", action || "unknown", "Invalid report action.");
  }

  try {
    const now = new Date().toISOString();

    if (action === "generate" || action === "regenerate") {
      await runReportGeneration(request, reportId);
      return redirectBack(request, "success", action);
    }

    if (action === "approve") {
      await patchReport(reportId, {
        status: "approved",
        updated_at: now,
      });
      return redirectBack(request, "success", action);
    }

    if (action === "needs_revision") {
      await patchReport(reportId, {
        status: "revision_requested",
        updated_at: now,
      });
      return redirectBack(request, "success", action);
    }

    if (action === "queue") {
      await patchReport(reportId, {
        status: "queued",
        updated_at: now,
      });
      return redirectBack(request, "success", action);
    }

    return redirectBack(request, "error", action, "Unsupported report action.");
  } catch (error) {
    console.error("Admin report action failed", error);
    return redirectBack(
      request,
      "error",
      action,
      error instanceof Error ? error.message : "Unknown admin report action error.",
    );
  }
}

export function GET(request: Request) {
  return NextResponse.redirect(new URL("/admin", request.url), 303);
}
