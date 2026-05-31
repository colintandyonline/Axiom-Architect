import { NextResponse } from "next/server";
import { requireAxiomAdmin } from "../../../../../lib/axiom-admin";
import { generateAxiomProposalPdf } from "../../../../../lib/axiom-proposal-pdf.server";
import type { ProposalDraftRecord } from "../../../../../lib/axiom-proposal-drafts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ProposalAction = "generate_pdf" | "regenerate_pdf" | "mark_ready_to_send" | "mark_internal_review";

const allowedActions = new Set<ProposalAction>([
  "generate_pdf",
  "regenerate_pdf",
  "mark_ready_to_send",
  "mark_internal_review",
]);
const proposalPdfStorageBucket = "axiom-client-deliverables";

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Missing database environment variables.");
  }

  return {
    url: url.replace(/\/$/, ""),
    serviceRoleKey,
  };
}

async function supabaseFetch<T>(
  path: string,
  options: RequestInit & { prefer?: string } = {},
): Promise<T> {
  const { url, serviceRoleKey } = getSupabaseConfig();
  const headers = new Headers(options.headers);

  headers.set("apikey", serviceRoleKey);
  headers.set("Authorization", `Bearer ${serviceRoleKey}`);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (options.prefer) {
    headers.set("Prefer", options.prefer);
  }

  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    cache: "no-store",
    headers,
  });
  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`Database request failed: ${response.status} ${responseText}`);
  }

  if (!responseText) {
    return undefined as T;
  }

  return JSON.parse(responseText) as T;
}

async function getProposal(proposalId: string) {
  const proposals = await supabaseFetch<ProposalDraftRecord[]>(
    `axiom_proposals?select=*&id=eq.${encodeURIComponent(proposalId)}&limit=1`,
  );

  return proposals[0] ?? null;
}

async function patchProposal(proposalId: string, payload: Record<string, unknown>) {
  await supabaseFetch(`axiom_proposals?id=eq.${encodeURIComponent(proposalId)}`, {
    method: "PATCH",
    prefer: "return=minimal",
    body: JSON.stringify(payload),
  });
}

function storageObjectUrl(objectPath: string) {
  const { url } = getSupabaseConfig();
  const encodedPath = objectPath.split("/").map(encodeURIComponent).join("/");
  return `${url}/storage/v1/object/${proposalPdfStorageBucket}/${encodedPath}`;
}

async function uploadPdfToStorage(pdfBuffer: Buffer, objectPath: string) {
  const { serviceRoleKey } = getSupabaseConfig();
  const response = await fetch(storageObjectUrl(objectPath), {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/pdf",
      "x-upsert": "true",
    },
    body: new Uint8Array(pdfBuffer),
  });
  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`Proposal PDF storage upload failed: ${response.status} ${responseText}`);
  }
}

function cleanInput(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function safeReturnPath(value: string, proposalId: string) {
  const fallback = proposalId ? `/admin/proposals/${proposalId}` : "/admin/proposals";

  if (!value || !value.startsWith("/") || value.startsWith("//") || !value.startsWith("/admin/proposals")) {
    return fallback;
  }

  return value;
}

function redirectBack(request: Request, returnPath: string, action: string, result: "success" | "error", message?: string) {
  const url = new URL(returnPath, request.url);
  url.searchParams.set("proposal_action", action);
  url.searchParams.set("result", result);

  if (message) {
    url.searchParams.set("message", message.slice(0, 180));
  }

  return NextResponse.redirect(url, 303);
}

function safeFilename(value?: string | null) {
  const baseName = (value || "proposal")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return `${baseName || "proposal"}-proposal.pdf`;
}

async function generateProposalPdf(proposalId: string) {
  const proposal = await getProposal(proposalId);

  if (!proposal) {
    throw new Error("Proposal draft not found.");
  }

  const now = new Date().toISOString();
  const customerId = proposal.customer_id || "unassigned";
  const pdfBuffer = await generateAxiomProposalPdf(proposal);
  const objectPath = `proposals/${customerId}/${proposal.id}/${Date.now()}-${safeFilename(proposal.workspace_name)}`;

  await uploadPdfToStorage(pdfBuffer, objectPath);

  await patchProposal(proposal.id, {
    pdf_file_path: objectPath,
    pdf_ready: true,
    pdf_generated_at: now,
    proposal_json: {
      generated_from: "admin_proposal_draft",
      pdf_generated_at: now,
      proposal_reference: proposal.proposal_reference,
      workspace_name: proposal.workspace_name,
      recommended_service_route: proposal.recommended_service_route,
      valid_until: proposal.valid_until,
      pricing_json: {
        ...(proposal.pricing_json && typeof proposal.pricing_json === "object" && !Array.isArray(proposal.pricing_json)
          ? proposal.pricing_json
          : {}),
        currency: "USD",
      },
    },
    updated_at: now,
  });
}

export async function POST(request: Request) {
  await requireAxiomAdmin();

  const formData = await request.formData();
  const proposalId = cleanInput(formData.get("proposal_id"));
  const action = cleanInput(formData.get("action"));
  const returnPath = safeReturnPath(cleanInput(formData.get("return_to")), proposalId);

  if (!proposalId || !allowedActions.has(action as ProposalAction)) {
    return redirectBack(request, returnPath, action || "unknown", "error", "Invalid proposal action.");
  }

  try {
    const now = new Date().toISOString();

    if (action === "generate_pdf" || action === "regenerate_pdf") {
      await generateProposalPdf(proposalId);
      return redirectBack(request, returnPath, action, "success", "Proposal PDF generated.");
    }

    if (action === "mark_internal_review") {
      await patchProposal(proposalId, {
        status: "internal_review",
        updated_at: now,
      });
      return redirectBack(request, returnPath, action, "success", "Proposal moved to internal review.");
    }

    if (action === "mark_ready_to_send") {
      const proposal = await getProposal(proposalId);

      if (!proposal?.pdf_ready) {
        throw new Error("Generate the proposal PDF before marking it ready to send.");
      }

      await patchProposal(proposalId, {
        status: "ready_to_send",
        updated_at: now,
      });
      return redirectBack(request, returnPath, action, "success", "Proposal marked ready to send.");
    }

    return redirectBack(request, returnPath, action, "error", "Unsupported proposal action.");
  } catch (error) {
    console.error("Admin proposal action failed", error);
    return redirectBack(
      request,
      returnPath,
      action,
      "error",
      error instanceof Error ? error.message : "Unknown proposal action error.",
    );
  }
}

export function GET(request: Request) {
  return NextResponse.redirect(new URL("/admin/proposals", request.url), 303);
}
