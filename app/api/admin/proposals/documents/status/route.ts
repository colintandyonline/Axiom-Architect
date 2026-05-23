import { NextResponse } from "next/server";
import { requireAxiomAdmin } from "../../../../../../lib/axiom-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedStatuses = new Set(["under_review", "needs_clarification", "reviewed", "archived"]);

type DocumentRecord = {
  id: string;
  workspace_id: string;
  customer_id: string;
  title: string | null;
  original_filename: string;
  review_status: string;
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

function safeReturnPath(value: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/admin/proposals/documents";
  }

  return value;
}

function redirectWithStatus(request: Request, returnTo: string, status: string) {
  const url = new URL(safeReturnPath(returnTo), request.url);
  url.searchParams.set("document", status);
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
    console.error("Axiom admin document status request failed", response.status, responseText);
    return null;
  }

  if (!responseText) {
    return undefined as T;
  }

  return JSON.parse(responseText) as T;
}

async function updateDocumentStatus(documentId: string, reviewStatus: string) {
  const payload: Record<string, unknown> = {
    review_status: reviewStatus,
    updated_at: new Date().toISOString(),
  };

  if (reviewStatus === "reviewed" || reviewStatus === "archived") {
    payload.reviewed_at = new Date().toISOString();
  }

  if (reviewStatus === "under_review" || reviewStatus === "needs_clarification") {
    payload.reviewed_at = null;
  }

  const records = await supabaseServiceFetch<DocumentRecord[]>(
    `axiom_workspace_documents?id=eq.${encodeURIComponent(documentId)}&select=id,workspace_id,customer_id,title,original_filename,review_status`,
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
  const documentId = cleanInput(formData.get("document_id"));
  const reviewStatus = cleanInput(formData.get("review_status"));
  const returnTo = cleanInput(formData.get("return_to"));

  if (!documentId || !allowedStatuses.has(reviewStatus)) {
    return redirectWithStatus(request, returnTo, "status-invalid");
  }

  const document = await updateDocumentStatus(documentId, reviewStatus);

  if (!document) {
    return redirectWithStatus(request, returnTo, "status-failed");
  }

  await createActivity({
    workspace_id: document.workspace_id,
    customer_id: document.customer_id,
    actor_type: "axiom",
    actor_label: adminEmail || "Axiom admin",
    activity_type: "document_status_updated",
    title: "Document review status updated",
    body: `${document.title || document.original_filename} is now ${reviewStatus.replace(/_/g, " ")}.`,
    metadata: {
      document_id: document.id,
      review_status: reviewStatus,
    },
    is_client_visible: false,
  });

  return redirectWithStatus(request, returnTo, "status-updated");
}

export function GET(request: Request) {
  return NextResponse.redirect(new URL("/admin/proposals/documents", request.url), 303);
}
