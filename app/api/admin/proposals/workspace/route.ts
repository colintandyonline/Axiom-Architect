import { NextResponse } from "next/server";
import { requireAxiomAdmin } from "../../../../../lib/axiom-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type WorkspaceRecord = {
  id: string;
  customer_id: string;
  workspace_name: string;
  status: string | null;
  current_phase: string | null;
  current_priority: string | null;
  next_client_action: string | null;
  axiom_review_focus: string | null;
};

function getSupabaseServiceConfig() {
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

function cleanInput(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function safeReturnPath(value: string, workspaceId: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return `/admin/proposals/${workspaceId}`;
  }

  return value;
}

function redirectWithStatus(request: Request, returnTo: string, workspaceId: string, status: string) {
  const url = new URL(safeReturnPath(returnTo, workspaceId), request.url);
  url.searchParams.set("workspace", status);
  return NextResponse.redirect(url, 303);
}

async function supabaseServiceFetch<T>(path: string, options: RequestInit = {}) {
  const config = getSupabaseServiceConfig();

  if (!config) {
    return null;
  }

  const headers = new Headers(options.headers);
  headers.set("apikey", config.serviceRoleKey);
  headers.set("Authorization", `Bearer ${config.serviceRoleKey}`);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...options,
    cache: "no-store",
    headers,
  });

  const responseText = await response.text();

  if (!response.ok) {
    console.error("Axiom admin workspace update request failed", response.status, responseText);
    return null;
  }

  if (!responseText) {
    return undefined as T;
  }

  return JSON.parse(responseText) as T;
}

async function updateWorkspace(workspaceId: string, payload: Record<string, unknown>) {
  const records = await supabaseServiceFetch<WorkspaceRecord[]>(
    `axiom_client_workspaces?id=eq.${encodeURIComponent(workspaceId)}&select=id,customer_id,workspace_name,status,current_phase,current_priority,next_client_action,axiom_review_focus`,
    {
      method: "PATCH",
      headers: {
        Prefer: "return=representation",
      },
      body: JSON.stringify(payload),
    },
  );

  return records?.[0] ?? null;
}

async function createActivity(payload: Record<string, unknown>) {
  await supabaseServiceFetch("axiom_workspace_activity", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function POST(request: Request) {
  const { adminEmail } = await requireAxiomAdmin();
  const formData = await request.formData();
  const workspaceId = cleanInput(formData.get("workspace_id"));
  const returnTo = cleanInput(formData.get("return_to"));
  const currentPriority = cleanInput(formData.get("current_priority"));
  const nextClientAction = cleanInput(formData.get("next_client_action"));
  const axiomReviewFocus = cleanInput(formData.get("axiom_review_focus"));

  if (!workspaceId) {
    return redirectWithStatus(request, returnTo, "", "workspace");
  }

  const workspace = await updateWorkspace(workspaceId, {
    current_priority: currentPriority || null,
    next_client_action: nextClientAction || null,
    axiom_review_focus: axiomReviewFocus || null,
    updated_at: new Date().toISOString(),
    last_activity_at: new Date().toISOString(),
  });

  if (!workspace) {
    return redirectWithStatus(request, returnTo, workspaceId, "failed");
  }

  await createActivity({
    workspace_id: workspace.id,
    customer_id: workspace.customer_id,
    actor_type: "axiom",
    actor_label: adminEmail || "Axiom admin",
    activity_type: "workspace_status_updated",
    title: "Workspace state updated",
    body: `${workspace.workspace_name} workspace state was updated. Priority: ${currentPriority || "none set"}.`,
    metadata: {
      status: workspace.status,
      current_phase: workspace.current_phase,
      current_priority: currentPriority || null,
      next_client_action: nextClientAction || null,
      axiom_review_focus: axiomReviewFocus || null,
    },
    is_client_visible: false,
  });

  return redirectWithStatus(request, returnTo, workspace.id, "saved");
}

export function GET(request: Request) {
  return NextResponse.redirect(new URL("/admin/proposals", request.url), 303);
}
