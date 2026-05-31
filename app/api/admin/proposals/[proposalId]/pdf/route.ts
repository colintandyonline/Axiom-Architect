import { NextResponse } from "next/server";
import { requireAxiomAdmin } from "../../../../../../lib/axiom-admin";
import type { ProposalDraftRecord } from "../../../../../../lib/axiom-proposal-drafts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const proposalPdfStorageBucket = "axiom-client-deliverables";

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
  return filename.replace(/[\r\n"]/g, "").trim() || "axiom-architect-proposal.pdf";
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
    console.error("Axiom admin proposal PDF database request failed", response.status, responseText);
    return null;
  }

  if (!responseText) {
    return undefined as T;
  }

  return JSON.parse(responseText) as T;
}

async function getProposal(proposalId: string) {
  const records = await supabaseServiceFetch<ProposalDraftRecord[]>(
    `axiom_proposals?select=id,proposal_reference,workspace_name,pdf_ready,pdf_file_path&id=eq.${encodeURIComponent(proposalId)}&limit=1`,
  );

  return records?.[0] ?? null;
}

async function fetchStorageObject(storagePath: string) {
  const config = getSupabaseServiceConfig();

  if (!config) {
    return null;
  }

  const response = await fetch(
    `${config.url}/storage/v1/object/${encodeURIComponent(proposalPdfStorageBucket)}/${encodeStoragePath(storagePath)}`,
    {
      cache: "no-store",
      headers: {
        apikey: config.serviceRoleKey,
        Authorization: `Bearer ${config.serviceRoleKey}`,
      },
    },
  );

  if (!response.ok) {
    console.error("Axiom admin proposal PDF storage download failed", response.status, await response.text());
    return null;
  }

  return response;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ proposalId: string }> },
) {
  await requireAxiomAdmin();

  const { proposalId } = await context.params;

  if (!proposalId) {
    return new NextResponse("Proposal PDF not found", { status: 404 });
  }

  const proposal = await getProposal(proposalId);

  if (!proposal) {
    return new NextResponse("Proposal PDF not found", { status: 404 });
  }

  if (proposal.pdf_ready !== true || !proposal.pdf_file_path) {
    return new NextResponse("Proposal PDF is not ready yet", { status: 404 });
  }

  const objectResponse = await fetchStorageObject(proposal.pdf_file_path);

  if (!objectResponse?.body) {
    return new NextResponse("Proposal PDF unavailable", { status: 404 });
  }

  const filename = safeDownloadName(`axiom-architect-proposal-${proposal.proposal_reference || proposal.id}.pdf`);
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
