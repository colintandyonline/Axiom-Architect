import { NextResponse } from "next/server";
import { requireAxiomAdmin } from "../../../../../../lib/axiom-admin";
import {
  axiomDeliverableTypes,
  type AxiomDeliverableType,
} from "../../../../../../lib/axiom-package-model";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const storageBucket = "axiom-client-deliverables";
const maxFileSizeBytes = 50 * 1024 * 1024;

const allowedMimeTypes = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/pdf",
  "text/plain",
  "text/csv",
  "application/csv",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
]);

type WorkspaceRecord = {
  id: string;
  customer_id: string;
  workspace_name: string;
  service_request_id: string | null;
};

type DeliverableRecord = {
  id: string;
  workspace_id: string;
  customer_id: string;
  title: string;
  status: string;
  original_filename: string | null;
  storage_bucket: string | null;
  storage_path: string | null;
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

function isCanonicalDeliverableType(value: string): value is AxiomDeliverableType {
  return (axiomDeliverableTypes as readonly string[]).includes(value);
}

function getDeliverableType(value: string) {
  return isCanonicalDeliverableType(value) ? value : "workflow_diagnosis";
}

function redirectToProposals(request: Request, status: string) {
  return NextResponse.redirect(new URL(`/admin/proposals?deliverable=${status}`, request.url), 303);
}

function safeFilename(filename: string) {
  const extensionMatch = filename.match(/\.([a-zA-Z0-9]{1,12})$/);
  const extension = extensionMatch ? `.${extensionMatch[1].toLowerCase()}` : "";
  const baseName = filename
    .replace(/\.[a-zA-Z0-9]{1,12}$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);

  return `${baseName || "axiom-deliverable"}${extension}`;
}

function storageObjectUrl(config: { url: string }, objectPath: string) {
  const encodedPath = objectPath.split("/").map(encodeURIComponent).join("/");
  return `${config.url}/storage/v1/object/${storageBucket}/${encodedPath}`;
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
    console.error("Axiom admin deliverable database request failed", response.status, responseText);
    return null;
  }

  if (!responseText) {
    return undefined as T;
  }

  return JSON.parse(responseText) as T;
}

async function getWorkspace(workspaceId: string, customerId: string) {
  const records = await supabaseServiceFetch<WorkspaceRecord[]>(
    `axiom_client_workspaces?select=id,customer_id,workspace_name,service_request_id&id=eq.${encodeURIComponent(workspaceId)}&customer_id=eq.${encodeURIComponent(customerId)}&limit=1`,
  );

  return records?.[0] ?? null;
}

async function uploadToStorage(file: File, objectPath: string) {
  const config = getSupabaseServiceConfig();

  if (!config) {
    return false;
  }

  const response = await fetch(storageObjectUrl(config, objectPath), {
    method: "POST",
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "false",
    },
    body: Buffer.from(await file.arrayBuffer()),
  });

  if (!response.ok) {
    console.error("Axiom admin deliverable storage upload failed", response.status, await response.text());
    return false;
  }

  return true;
}

async function createDeliverableRecord(payload: Record<string, unknown>) {
  const records = await supabaseServiceFetch<DeliverableRecord[]>(
    "axiom_workspace_deliverables?select=id,workspace_id,customer_id,title,status,original_filename,storage_bucket,storage_path",
    {
      method: "POST",
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
  const config = getSupabaseServiceConfig();

  if (!config) {
    return redirectToProposals(request, "config");
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const workspaceId = cleanInput(formData.get("workspace_id"));
  const customerId = cleanInput(formData.get("customer_id"));

  if (!workspaceId || !customerId) {
    return redirectToProposals(request, "workspace");
  }

  if (!(file instanceof File) || file.size === 0) {
    return redirectToProposals(request, "missing-file");
  }

  if (file.size > maxFileSizeBytes) {
    return redirectToProposals(request, "too-large");
  }

  if (file.type && !allowedMimeTypes.has(file.type)) {
    return redirectToProposals(request, "type");
  }

  const workspace = await getWorkspace(workspaceId, customerId);

  if (!workspace) {
    return redirectToProposals(request, "workspace");
  }

  const title = cleanInput(formData.get("title")) || file.name || "Axiom deliverable";
  const description = cleanInput(formData.get("description"));
  const deliverableType = getDeliverableType(cleanInput(formData.get("deliverable_type")) || "workflow_diagnosis");
  const status = cleanInput(formData.get("status")) || "delivered";
  const version = cleanInput(formData.get("version")) || "v1";
  const filename = safeFilename(file.name || "axiom-deliverable");
  const objectPath = `${customerId}/${workspaceId}/${Date.now()}-${filename}`;

  const uploaded = await uploadToStorage(file, objectPath);

  if (!uploaded) {
    return redirectToProposals(request, "storage");
  }

  const deliverable = await createDeliverableRecord({
    workspace_id: workspaceId,
    customer_id: customerId,
    deliverable_type: deliverableType,
    title,
    description: description || null,
    status,
    version,
    approval_required: false,
    original_filename: file.name || filename,
    storage_bucket: storageBucket,
    storage_path: objectPath,
    mime_type: file.type || "application/octet-stream",
    file_size_bytes: file.size,
    delivered_at: status === "delivered" ? new Date().toISOString() : null,
    metadata: {
      canonical_deliverable_type: deliverableType,
    },
  });

  if (!deliverable) {
    return redirectToProposals(request, "record");
  }

  await createActivity({
    workspace_id: workspaceId,
    customer_id: customerId,
    actor_type: "axiom",
    actor_label: adminEmail || "Axiom admin",
    activity_type: "deliverable_released",
    title: "Deliverable released",
    body: `${title} was added to the client deliverables area.`,
    metadata: {
      deliverable_id: deliverable.id,
      storage_bucket: storageBucket,
      storage_path: objectPath,
      original_filename: file.name || filename,
      canonical_deliverable_type: deliverableType,
      deliverable_type: deliverableType,
    },
    is_client_visible: true,
  });

  return redirectToProposals(request, "success");
}

export function GET(request: Request) {
  return NextResponse.redirect(new URL("/admin/proposals", request.url), 303);
}
