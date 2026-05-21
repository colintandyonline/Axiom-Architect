import { NextResponse } from "next/server";
import { getAxiomAuthContext } from "../../../../../lib/axiom-auth";

export const runtime = "nodejs";

const storageBucket = "axiom-client-documents";
const maxFileSizeBytes = 15 * 1024 * 1024;

const allowedMimeTypes = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "application/pdf",
  "text/plain",
  "text/csv",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

type ClientWorkspaceRecord = {
  id: string;
  customer_id: string;
  workspace_name: string;
  service_request_id: string | null;
};

type ClientDocumentRecord = {
  id: string;
  workspace_id: string;
  customer_id: string;
  original_filename: string;
  document_category: string;
  review_status: string;
  title: string | null;
  description: string | null;
  storage_bucket: string | null;
  storage_path: string | null;
  mime_type: string | null;
  file_size_bytes: number | null;
  uploaded_at: string;
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

function redirectToDocuments(request: Request, status: string) {
  return NextResponse.redirect(new URL(`/client/documents?upload=${status}`, request.url), 303);
}

function cleanInput(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function safeFilename(filename: string) {
  const extensionMatch = filename.match(/\.([a-zA-Z0-9]{1,12})$/);
  const extension = extensionMatch ? `.${extensionMatch[1].toLowerCase()}` : "";
  const baseName = filename
    .replace(/\.[a-zA-Z0-9]{1,12}$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return `${baseName || "client-document"}${extension}`;
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
    console.error("Axiom document upload database request failed", response.status, responseText);
    return null;
  }

  if (!responseText) {
    return undefined as T;
  }

  return JSON.parse(responseText) as T;
}

async function getLatestWorkspace(customerId: string) {
  const records = await supabaseServiceFetch<ClientWorkspaceRecord[]>(
    `axiom_client_workspaces?select=id,customer_id,workspace_name,service_request_id&customer_id=eq.${encodeURIComponent(customerId)}&order=created_at.desc&limit=1`,
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
    console.error("Axiom document storage upload failed", response.status, await response.text());
    return false;
  }

  return true;
}

async function createDocumentRecord(payload: Record<string, unknown>) {
  const records = await supabaseServiceFetch<ClientDocumentRecord[]>(
    "axiom_workspace_documents?select=id,workspace_id,customer_id,original_filename,document_category,review_status,title,description,storage_bucket,storage_path,mime_type,file_size_bytes,uploaded_at",
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
  const authContext = await getAxiomAuthContext();

  if (!authContext.user) {
    return NextResponse.redirect(new URL("/login?redirect=/client/documents", request.url), 303);
  }

  if (!authContext.customer) {
    return redirectToDocuments(request, "customer");
  }

  const config = getSupabaseServiceConfig();

  if (!config) {
    return redirectToDocuments(request, "config");
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return redirectToDocuments(request, "missing-file");
  }

  if (file.size > maxFileSizeBytes) {
    return redirectToDocuments(request, "too-large");
  }

  if (file.type && !allowedMimeTypes.has(file.type)) {
    return redirectToDocuments(request, "type");
  }

  const workspace = await getLatestWorkspace(authContext.customer.id);

  if (!workspace) {
    return redirectToDocuments(request, "workspace");
  }

  const title = cleanInput(formData.get("title"));
  const description = cleanInput(formData.get("description"));
  const documentCategory = cleanInput(formData.get("document_category")) || "supporting_material";
  const filename = safeFilename(file.name || "client-document");
  const objectPath = `${authContext.customer.id}/${workspace.id}/${Date.now()}-${filename}`;

  const uploaded = await uploadToStorage(file, objectPath);

  if (!uploaded) {
    return redirectToDocuments(request, "storage");
  }

  const documentRecord = await createDocumentRecord({
    workspace_id: workspace.id,
    customer_id: authContext.customer.id,
    original_filename: file.name || filename,
    document_category: documentCategory,
    review_status: "under_review",
    title: title || file.name || filename,
    description: description || null,
    storage_bucket: storageBucket,
    storage_path: objectPath,
    mime_type: file.type || "application/octet-stream",
    file_size_bytes: file.size,
    uploaded_by: "client",
    upload_source: "client_portal",
  });

  if (!documentRecord) {
    return redirectToDocuments(request, "record");
  }

  await createActivity({
    workspace_id: workspace.id,
    customer_id: authContext.customer.id,
    actor_type: "client",
    actor_label: authContext.customer.full_name || authContext.customer.email || "Client",
    activity_type: "document_uploaded",
    title: "Document uploaded",
    body: `${documentRecord.title || documentRecord.original_filename} was uploaded for review.`,
    metadata: {
      document_id: documentRecord.id,
      storage_bucket: storageBucket,
      storage_path: objectPath,
      original_filename: documentRecord.original_filename,
      document_category: documentCategory,
    },
    is_client_visible: true,
  });

  return redirectToDocuments(request, "success");
}

export function GET(request: Request) {
  return NextResponse.redirect(new URL("/client/documents", request.url), 303);
}
