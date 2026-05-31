import { NextResponse } from "next/server";
import { requireAxiomAdmin } from "../../../../../../lib/axiom-admin";
import type { AxiomReportJson } from "../../../../../../lib/axiom-report-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ReportRecord = {
  id: string;
  report_json: Partial<AxiomReportJson> | null;
};

const reportPdfStorageBucket = "axiom-client-deliverables";

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
  return filename.replace(/[\r\n"]/g, "").trim() || "axiom-architect-report.pdf";
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
    console.error("Axiom admin report PDF database request failed", response.status, responseText);
    return null;
  }

  if (!responseText) {
    return undefined as T;
  }

  return JSON.parse(responseText) as T;
}

async function getReport(reportId: string) {
  const records = await supabaseServiceFetch<ReportRecord[]>(
    `axiom_audit_reports?select=id,report_json&id=eq.${encodeURIComponent(reportId)}&limit=1`,
  );

  return records?.[0] ?? null;
}

async function fetchStorageObject(bucket: string, storagePath: string) {
  const config = getSupabaseServiceConfig();

  if (!config) {
    return null;
  }

  const response = await fetch(
    `${config.url}/storage/v1/object/${encodeURIComponent(bucket)}/${encodeStoragePath(storagePath)}`,
    {
      cache: "no-store",
      headers: {
        apikey: config.serviceRoleKey,
        Authorization: `Bearer ${config.serviceRoleKey}`,
      },
    },
  );

  if (!response.ok) {
    console.error("Axiom admin report PDF storage download failed", response.status, await response.text());
    return null;
  }

  return response;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ reportId: string }> },
) {
  await requireAxiomAdmin();

  const { reportId } = await context.params;

  if (!reportId) {
    return new NextResponse("Report PDF not found", { status: 404 });
  }

  const report = await getReport(reportId);

  if (!report) {
    return new NextResponse("Report PDF not found", { status: 404 });
  }

  const delivery = report.report_json?.delivery;
  const storagePath = typeof delivery?.pdf_file_path === "string" ? delivery.pdf_file_path : "";

  if (delivery?.pdf_ready !== true || !storagePath) {
    return new NextResponse("Report PDF is not ready yet", { status: 404 });
  }

  const objectResponse = await fetchStorageObject(reportPdfStorageBucket, storagePath);

  if (!objectResponse?.body) {
    return new NextResponse("Report PDF unavailable", { status: 404 });
  }

  const filename = safeDownloadName(`axiom-architect-report-${report.id}-admin-review.pdf`);
  const headers = new Headers();
  headers.set("Content-Type", "application/pdf");
  headers.set("Content-Disposition", `inline; filename="${filename}"`);
  headers.set("Cache-Control", "private, no-store");
  headers.set("X-Robots-Tag", "noindex, nofollow");

  const contentLength = objectResponse.headers.get("Content-Length");

  if (contentLength) {
    headers.set("Content-Length", contentLength);
  }

  return new Response(objectResponse.body, {
    status: 200,
    headers,
  });
}
