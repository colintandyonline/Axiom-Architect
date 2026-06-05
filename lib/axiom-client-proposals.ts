import type { AxiomLinkedCustomer, AxiomAuthUser } from "./axiom-auth";
import { getAxiomAuthContext } from "./axiom-auth";
import type { ProposalDraftRecord } from "./axiom-proposal-drafts";
import { getProposalPaymentTerms, getProposalPricing } from "./axiom-proposal-drafts";
import { proposalClientAccessibleStatuses } from "./axiom-proposal-client-access";

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

async function supabaseServiceFetch<T>(path: string) {
  const config = getSupabaseServiceConfig();

  if (!config) {
    return null;
  }

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    cache: "no-store",
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": "application/json",
    },
  });

  const responseText = await response.text();

  if (!response.ok) {
    console.error("Axiom client proposals request failed", response.status, responseText);
    return null;
  }

  if (!responseText) {
    return [] as T;
  }

  return JSON.parse(responseText) as T;
}

function normalizeEmail(value?: string | null) {
  return (value || "").trim().toLowerCase();
}

function customerEmailFilters(customer: AxiomLinkedCustomer, user: AxiomAuthUser) {
  return Array.from(
    new Set([normalizeEmail(customer.email), normalizeEmail(user.email)].filter(Boolean)),
  );
}

function isClientAccessible(proposal: ProposalDraftRecord) {
  return Boolean(
    proposal.pdf_ready === true &&
      proposal.pdf_file_path &&
      proposalClientAccessibleStatuses.has(proposal.status || ""),
  );
}

function proposalBelongsToClient(
  proposal: ProposalDraftRecord,
  customer: AxiomLinkedCustomer,
  user: AxiomAuthUser,
) {
  if (proposal.customer_id && proposal.customer_id === customer.id) {
    return true;
  }

  const proposalEmail = normalizeEmail(proposal.client_email);
  return Boolean(proposalEmail && customerEmailFilters(customer, user).includes(proposalEmail));
}

function depositRecordedPaid(proposal: ProposalDraftRecord) {
  const paymentStatus = proposal.payment_status || "unpaid";
  return Boolean(proposal.deposit_paid_at) || paymentStatus === "final_balance_due" || paymentStatus === "paid_complete";
}

function finalRecordedPaid(proposal: ProposalDraftRecord) {
  return Boolean(proposal.final_balance_paid_at) || proposal.payment_status === "paid_complete";
}

function finalBalanceIsDue(proposal: ProposalDraftRecord) {
  return !finalRecordedPaid(proposal) && (
    proposal.payment_status === "final_balance_due" || Boolean(proposal.final_balance_requested_at)
  );
}

export function proposalStatusLabel(value?: string | null) {
  return value ? value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) : "Not set";
}

export function proposalPaymentLabel(value?: string | null) {
  return proposalStatusLabel(value || "unpaid");
}

export function getProposalNextAction(proposal: ProposalDraftRecord) {
  const pricing = getProposalPricing(proposal.pricing_json);
  const paymentTerms = getProposalPaymentTerms(proposal.payment_terms_json);
  const accepted = proposal.status === "accepted" || Boolean(proposal.accepted_at);
  const paymentCancelled = proposal.payment_status === "cancelled";
  const depositPaid = depositRecordedPaid(proposal);
  const finalPaid = finalRecordedPaid(proposal);
  const balanceDue = finalBalanceIsDue(proposal);

  if (!accepted) {
    return {
      label: "Review proposal",
      href: `/client/proposals/${proposal.id}`,
      text: "Review the proposed scope and confirm whether you want to proceed.",
    };
  }

  if (!depositPaid && !paymentCancelled && paymentTerms.deposit_payment_url) {
    return {
      label: "Pay deposit",
      href: paymentTerms.deposit_payment_url,
      text: `Deposit required: ${formatProposalCurrency(pricing.deposit_required)}.`,
      external: true,
    };
  }

  if (balanceDue && !paymentCancelled && paymentTerms.final_payment_url) {
    return {
      label: "Pay final balance",
      href: paymentTerms.final_payment_url,
      text: `Balance due: ${formatProposalCurrency(pricing.balance_amount)}.`,
      external: true,
    };
  }

  if (finalPaid) {
    return {
      label: "View deliverables",
      href: "/client/deliverables",
      text: "Payment is complete. Deliverables will appear when released.",
    };
  }

  return {
    label: "View proposal",
    href: `/client/proposals/${proposal.id}`,
    text: "Your proposal is stored in this workspace.",
  };
}

export function formatProposalCurrency(value: unknown) {
  const amount = typeof value === "number" ? value : Number(value || 0);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export async function loadClientProposals() {
  const authContext = await getAxiomAuthContext();

  if (!authContext.user || !authContext.customer) {
    return [];
  }

  const filters = [`customer_id.eq.${encodeURIComponent(authContext.customer.id)}`];
  const emailFilters = customerEmailFilters(authContext.customer, authContext.user).map(
    (email) => `client_email.eq.${encodeURIComponent(email)}`,
  );

  filters.push(...emailFilters);

  const proposals = await supabaseServiceFetch<ProposalDraftRecord[]>(
    `axiom_proposals?select=*&or=(${filters.join(",")})&order=updated_at.desc&limit=12`,
  );

  return (proposals || [])
    .filter((proposal) => proposalBelongsToClient(proposal, authContext.customer!, authContext.user!))
    .filter(isClientAccessible);
}

export async function loadLatestClientProposal() {
  const proposals = await loadClientProposals();
  return proposals[0] ?? null;
}
