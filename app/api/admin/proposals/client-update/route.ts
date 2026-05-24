import { NextResponse } from "next/server";
import { requireAxiomAdmin } from "../../../../../lib/axiom-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type WorkspaceRecord = {
  id: string;
  customer_id: string;
  workspace_name: string;
};

function getSupabaseServiceConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) return null;

  return { url: url.replace(/\/$/, ""), serviceRoleKey };
}

function cleanInput(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function safeReturnPath(value: string, workspaceId: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return `/admin/proposals/${workspaceId}`;
  return value;
}

function redirectWithStatus(request: Request, returnTo: string, workspaceId: string, status: string) {
  const url = new URL(safeReturnPath(returnTo, workspaceId), request.url);
  url.searchParams.set("clientUpdate", status);
  return NextResponse.redirect(url, 303);
}

async function supabaseServiceFetch<T>(path: string, options: RequestInit = {}) {
  const config = getSupabaseServiceConfig();
  if (!config) return null;

  const headers = new Headers(options.headers);
  headers.set("apikey", config.serviceRoleKey);
  headers.set("Authorization", `Bearer ${config.serviceRoleKey}`);
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...options,
    cache: "no-store",
    headers,
  });

  if (!response.ok) return null;
  const responseText = await response.text();
  return responseText ? (JSON.parse(responseText) as T) : (undefined as T);
}

async function getWorkspace(workspaceId: string) {
  const records = await supabaseServiceFetch<WorkspaceRecord[]>(
    `axiom_client_workspaces?select=id,customer_id,workspace_name&id=eq.${encodeURIComponent(workspaceId)}&limit=1`,
  );

  return records?.[0] ?? null;
}

async function insertRow(table: string, payload: Record<string, unknown>) {
  await supabaseServiceFetch(table, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function POST(request: Request) {
  const { adminEmail } = await requireAxiomAdmin();
  const formData = await request.formData();
  const workspaceId = cleanInput(formData.get("workspace_id"));
  const subject = cleanInput(formData.get("subject"));
  const updateText = cleanInput(formData.get("update_text"));
  const returnTo = cleanInput(formData.get("return_to"));

  if (!workspaceId) return redirectWithStatus(request, returnTo, "", "workspace");
  if (!updateText || updateText.length < 3) return redirectWithStatus(request, returnTo, workspaceId, "missing");

  const workspace = await getWorkspace(workspaceId);
  if (!workspace) return redirectWithStatus(request, returnTo, workspaceId, "workspace");

  const updateSubject = subject || "Workspace update";
  const updateBody = updateText.slice(0, 4000);

  await insertRow("axiom_workspace_messages", {
    workspace_id: workspace.id,
    customer_id: workspace.customer_id,
    author_type: "axiom",
    author_label: "Axiom Architect",
    subject: updateSubject,
    body: updateBody,
    status: "sent",
  });

  await insertRow("axiom_workspace_activity", {
    workspace_id: workspace.id,
    customer_id: workspace.customer_id,
    actor_type: "axiom",
    actor_label: adminEmail || "Axiom admin",
    activity_type: "client_update_sent",
    title: updateSubject,
    body: updateBody,
    metadata: { workspace_name: workspace.workspace_name },
    is_client_visible: true,
  });

  return redirectWithStatus(request, returnTo, workspace.id, "sent");
}

export function GET(request: Request) {
  return NextResponse.redirect(new URL("/admin/proposals", request.url), 303);
}
