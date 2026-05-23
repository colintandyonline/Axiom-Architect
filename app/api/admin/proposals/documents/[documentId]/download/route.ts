import { NextResponse } from "next/server";
import { requireAxiomAdmin } from "../../../../../../../lib/axiom-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DocumentRecord = {
  id: string;
  customer_id: string;
  workspace_id: string;
  title: string | null;
  original_filename: string;
  storage_bucket: string | null;
  storage_path: string | null;
  mime_type: string | null;
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

function encodeStoragePath(path: string) {
  return path.split("/").map(encodeURIComponent).join("/");
}

function safeDownloadName(filename: string) {
  return filename.replace(/[\r\n"]/g, "").trim() || "axiom-client-document";
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
    console.error("Axiom admin document download database request failed", response.status, responseText);
    return null;
  }

  if (!responseText) {
    return undefined as T;
  }

  return JSON.parse(responseText) as T;
}

async function getDocument(documentId: string) {
  const records = await supabaseServiceFetch<DocumentRecord[]>(
    `axiom_workspace_documents?select=id,customer_id,workspace_id,title,original_filename,storage_bucket,storage_path,mime_type&id=eq.${encodeURIComponent(documentId)}&limit=1`,
  );

  return records?.[0] ?? null;
}

async function fetchStorageObject(document: DocumentRecord) {
  const config = getSupabaseServiceConfig();

  if (!config || !document.storage_bucket || !document.storage_path) {
    return null;
  }

  const response = await fetch(
    `${config.url}/storage/v1/object/${encodeURIComponent(document.storage_bucket)}/${encodeStoragePath(document.storage_path)}`,
    {
      cache: "no-store",
      headers: {
        apikey: config.serviceRoleKey,
        Authorization: `Bearer ${config.serviceRoleKey}`,
      },
    },
  );

  if (!response.ok) {
    console.error("Axiom admin document storage download failed", response.status, await response.text());
    return null;
  }

  return response;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ documentId: string }> },
) {
  await requireAxiomAdmin();

  const { documentId } = await context.params;

  if (!documentId) {
    return new NextResponse("Document not found", { status: 404 });
  }

  const document = await getDocument(documentId);

  if (!document) {
    return new NextResponse("Document not found", { status: 404 });
  }

  const objectResponse = await fetchStorageObject(document);

  if (!objectResponse?.body) {
    return new NextResponse("Document unavailable", { status: 404 });
  }

  const filename = safeDownloadName(document.original_filename || document.title || "axiom-client-document");
  const contentType = document.mime_type || objectResponse.headers.get("Content-Type") || "application/octet-stream";
  const headers = new Headers();

  headers.set("Content-Type", contentType);
  headers.set("Content-Disposition", `inline; filename="${filename}"`);
  headers.set("Cache-Control", "private, no-store");

  const contentLength = objectResponse.headers.get("Content-Length");

  if (contentLength) {
    headers.set("Content-Length", contentLength);
  }

  return new Response(objectResponse.body, {
    status: 200,
    headers,
  });
}
