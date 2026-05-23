import { NextResponse } from "next/server";
import { requireAxiomAdmin } from "../../../../../../lib/axiom-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedStatuses = new Set(["preparing", "pending", "ready_for_review", "approved", "delivered"]);
const clientVisibleStatuses = new Set(["ready_for_review", "approved", "delivered"]);

type DeliverableRecord = {
  id: string;
  workspace_id: string;
  customer_id: string;
  title: string;
  status: string;
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

function redirectToUploader(request: Request, status: string) {
  return NextResponse.redirect(new URL(`/admin/proposals/deliverables?deliverable=${status}`, request.url), 303);
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
    console.error("Axiom admin deliverable status request failed", response.status, responseText);
    return null;
  }

  if (!responseText) {
    return undefined as T;
  }

  return JSON.parse(responseText) as T;
}

async function updateDeliverableStatus(deliverableId: string, status: string) {
  const payload: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (status === "delivered") {
    payload.delivered_at = new Date().toISOString();
  }

  const records = await supabaseServiceFetch<DeliverableRecord[]>(
    `axiom_workspace_deliverables?id=eq.${encodeURIComponent(deliverableId)}&select=id,workspace_id,customer_id,title,status`,
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
  const deliverableId = cleanInput(formData.get("deliverable_id"));
  const status = cleanInput(formData.get("status"));

  if (!deliverableId || !allowedStatuses.has(status)) {
    return redirectToUploader(request, "status-invalid");
  }

  const deliverable = await updateDeliverableStatus(deliverableId, status);

  if (!deliverable) {
    return redirectToUploader(request, "status-failed");
  }

  if (clientVisibleStatuses.has(status)) {
    await createActivity({
      workspace_id: deliverable.workspace_id,
      customer_id: deliverable.customer_id,
      actor_type: "axiom",
      actor_label: adminEmail || "Axiom admin",
      activity_type: "deliverable_status_updated",
      title: "Deliverable updated",
      body: `${deliverable.title} is now ${status.replace(/_/g, " ")}.`,
      metadata: {
        deliverable_id: deliverable.id,
        status,
      },
      is_client_visible: true,
    });
  }

  return redirectToUploader(request, "status-updated");
}

export function GET(request: Request) {
  return NextResponse.redirect(new URL("/admin/proposals/deliverables", request.url), 303);
}
