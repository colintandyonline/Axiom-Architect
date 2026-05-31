import type { AxiomAuthUser, AxiomLinkedCustomer } from "./axiom-auth";
import { getAxiomAuthContext } from "./axiom-auth";
import type { ProposalDraftRecord } from "./axiom-proposal-drafts";
import {
  proposalAccessExpired,
  proposalClientAccessibleStatuses,
  proposalTokenMatches,
} from "./axiom-proposal-client-access";

const proposalPdfStorageBucket = "axiom-client-deliverables";

export type ProposalAccessResult =
  | { ok: true; proposal: ProposalDraftRecord }
  | { ok: false; status: number; message: string };

function getSupabaseServiceConfig() {
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

async function supabaseServiceFetch<T>(
  path: string,
  options: RequestInit & { prefer?: string } = {},
): Promise<T> {
  const config = getSupabaseServiceConfig();
  const headers = new Headers(options.headers);

  headers.set("apikey", config.serviceRoleKey);
  headers.set("Authorization", `Bearer ${config.serviceRoleKey}`);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (options.prefer) {
    headers.set("Prefer", options.prefer);
  }

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
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

async function getProposalById(proposalId: string) {
  const proposals = await supabaseServiceFetch<ProposalDraftRecord[]>(
    `axiom_proposals?select=*&id=eq.${encodeURIComponent(proposalId)}&limit=1`,
  );

  return proposals[0] ?? null;
}

function proposalAvailableForClient(proposal: ProposalDraftRecord): ProposalAccessResult | null {
  if (proposal.pdf_ready !== true || !proposal.pdf_file_path) {
    return { ok: false, status: 404, message: "Proposal is not available yet." };
  }

  if (!proposalClientAccessibleStatuses.has(proposal.status || "")) {
    return { ok: false, status: 403, message: "Proposal is not available for client review." };
  }

  return null;
}

function normalizeEmail(value?: string | null) {
  return (value || "").trim().toLowerCase();
}

function authenticatedClientOwnsProposal(
  proposal: ProposalDraftRecord,
  customer: AxiomLinkedCustomer | null,
  user: AxiomAuthUser | null,
) {
  if (!customer || !user) {
    return false;
  }

  if (proposal.customer_id && proposal.customer_id === customer.id) {
    return true;
  }

  const proposalEmail = normalizeEmail(proposal.client_email);
  const customerEmail = normalizeEmail(customer.email);
  const userEmail = normalizeEmail(user.email);

  return Boolean(proposalEmail && (proposalEmail === customerEmail || proposalEmail === userEmail));
}

export async function patchClientProposal(proposalId: string, payload: Record<string, unknown>) {
  await supabaseServiceFetch(`axiom_proposals?id=eq.${encodeURIComponent(proposalId)}`, {
    method: "PATCH",
    prefer: "return=minimal",
    body: JSON.stringify(payload),
  });
}

export async function validateProposalClientAccess(
  proposalId: string,
  token?: string | null,
): Promise<ProposalAccessResult> {
  if (!proposalId || !token) {
    return { ok: false, status: 404, message: "Proposal link unavailable." };
  }

  const proposal = await getProposalById(proposalId);

  if (!proposal) {
    return { ok: false, status: 404, message: "Proposal link unavailable." };
  }

  const availability = proposalAvailableForClient(proposal);

  if (availability) {
    return availability;
  }

  if (proposalAccessExpired(proposal.client_access_expires_at)) {
    return { ok: false, status: 403, message: "This proposal link has expired." };
  }

  if (!proposalTokenMatches(token, proposal.client_access_token_hash)) {
    return { ok: false, status: 404, message: "Proposal link unavailable." };
  }

  return { ok: true, proposal };
}

export async function validateProposalAuthenticatedAccess(
  proposalId: string,
): Promise<ProposalAccessResult> {
  if (!proposalId) {
    return { ok: false, status: 404, message: "Proposal unavailable." };
  }

  const authContext = await getAxiomAuthContext();

  if (!authContext.user || !authContext.customer) {
    return { ok: false, status: 401, message: "Sign in to view this proposal." };
  }

  const proposal = await getProposalById(proposalId);

  if (!proposal) {
    return { ok: false, status: 404, message: "Proposal unavailable." };
  }

  const availability = proposalAvailableForClient(proposal);

  if (availability) {
    return availability;
  }

  if (!authenticatedClientOwnsProposal(proposal, authContext.customer, authContext.user)) {
    return { ok: false, status: 403, message: "This proposal is not attached to your account." };
  }

  return { ok: true, proposal };
}

export async function validateProposalClientOrAuthenticatedAccess(
  proposalId: string,
  token?: string | null,
): Promise<ProposalAccessResult> {
  if (token) {
    return validateProposalClientAccess(proposalId, token);
  }

  return validateProposalAuthenticatedAccess(proposalId);
}

export async function recordProposalClientView(proposal: ProposalDraftRecord) {
  const now = new Date().toISOString();
  await patchClientProposal(proposal.id, {
    client_access_token_last_used_at: now,
    viewed_at: proposal.viewed_at || now,
    status: proposal.status === "sent" ? "viewed" : proposal.status,
    updated_at: now,
  });
}

function encodeStoragePath(path: string) {
  return path.split("/").map(encodeURIComponent).join("/");
}

export async function fetchProposalPdfObject(storagePath: string) {
  const config = getSupabaseServiceConfig();
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
    throw new Error(`Proposal PDF download failed: ${response.status} ${await response.text()}`);
  }

  return response;
}
