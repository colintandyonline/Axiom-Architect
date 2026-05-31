import { NextResponse } from "next/server";
import { getAxiomAuthContext } from "../../../../../../lib/axiom-auth";
import { isAxiomAdminEmail } from "../../../../../../lib/axiom-admin";
import type { AxiomReportJson } from "../../../../../../lib/axiom-report-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ReportRecord = {
  id: string;
  customer_id: string | null;
  submission_id: string | null;
  status: string | null;
  report_json: Partial<AxiomReportJson> | null;
};

const fallbackStorageBucket = "axiom-client-deliverables";

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

function loginRedirect(request: Request, reportId: string) {
  const redirectPath = `/api/client/reports/${encodeURIComponent(reportId)}/pdf`;
  return NextResponse.redirect(
    new URL(`/login?redirect=${encodeURIComponent(redirectPath)}`, request.url),
    303,
  );
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
    console.error("Axiom report PDF database request failed", response.status, responseText);
    return null;
  }

  if (!responseText) {
    return undefined as T;
  }

  return JSON.parse(responseText) as T;
}

async function getReport(reportId: string) {
  const records = await supabaseServiceFetch<ReportRecord[]>(
    `axiom_audit_reports?select=id,customer_id,submission_id,status,report_json&id=eq.${encodeURIComponent(reportId)}&limit=1`,
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
    console.error("Axiom report PDF storage download failed", response.status, await response.text());
    return null;
  }

  return response;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ reportId: string }> },
) {
  const { reportId } = await context.params;

  if (!reportId) {
    return new NextResponse("Report PDF not found", { status: 404 });
  }

  const authContext = await getAxiomAuthContext();

  if (!authContext.user) {
    return loginRedirect(request, reportId);
  }

  const report = await getReport(reportId);

  if (!report) {
    return new NextResponse("Report PDF not found", { status: 404 });
  }

  const userEmail = authContext.user.email || authContext.customer?.email || "";
  const isAdmin = isAxiomAdminEmail(userEmail);
  const isDelivered = report.status === "delivered";
  const canAccess =
    isAdmin ||
    Boolean(isDelivered && authContext.customer?.id && report.customer_id === authContext.customer.id);

  if (!canAccess) {
    return new NextResponse("Report PDF not found", { status: 404 });
  }

  const delivery = report.report_json?.delivery;
  const storagePath = typeof delivery?.pdf_file_path === "string" ? delivery.pdf_file_path : "";

  if (delivery?.pdf_ready !== true || !storagePath) {
    return new NextResponse("Report PDF is not ready yet", { status: 404 });
  }

  const objectResponse = await fetchStorageObject(fallbackStorageBucket, storagePath);

  if (!objectResponse?.body) {
    return new NextResponse("Report PDF unavailable", { status: 404 });
  }

  const filename = safeDownloadName(`axiom-architect-report-${report.id}.pdf`);
  const headers = new Headers();
  headers.set("Content-Type", "application/pdf");
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
