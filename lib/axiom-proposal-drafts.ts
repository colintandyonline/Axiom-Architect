import { proposalPresetRoutes, type ProposalServiceRoute } from "./axiom-proposal-presets";

export type ProposalDraftStatus = "draft" | "internal_review" | "ready_to_send";
export type ProposalDraftType = "simple" | "standard" | "strategic";

export type ProposalDraftRecord = {
  id: string;
  customer_id: string | null;
  source_record_id: string | null;
  source_record_type: string | null;
  proposal_reference: string | null;
  proposal_type: ProposalDraftType | string | null;
  status: ProposalDraftStatus | string | null;
  client_name: string | null;
  business_name: string | null;
  client_email: string | null;
  workspace_name: string | null;
  recommended_service_route: string | null;
  alternative_service_route: string | null;
  client_summary: string | null;
  current_problem_summary: string | null;
  desired_outcome: string | null;
  scope_summary: string | null;
  included_work_json: unknown;
  deliverables_json: unknown;
  timeline_json: unknown;
  exclusions_json: unknown;
  client_responsibilities_json: unknown;
  assumptions_json: unknown;
  pricing_json: unknown;
  internal_pricing_notes: string | null;
  client_price_explanation: string | null;
  internal_risk_notes: string | null;
  revision_notes: string | null;
  payment_terms_json: unknown;
  valid_until: string | null;
  proposal_json: unknown;
  pdf_file_path: string | null;
  pdf_ready: boolean | null;
  pdf_generated_at: string | null;
  sent_at: string | null;
  viewed_at: string | null;
  accepted_at: string | null;
  changes_requested_at: string | null;
  converted_order_id: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type ProposalPricingJson = {
  currency: "USD";
  base_service_price: number;
  complexity_level: string;
  complexity_multiplier: number;
  risk_level: string;
  delivery_depth: string;
  add_ons_text: string;
  discount_amount: number;
  deposit_required: number;
  final_total: number;
};

export type ProposalPaymentTermsJson = {
  payment_schedule: string;
  deposit_required: number;
};

export const proposalTypeOptions: ProposalDraftType[] = ["simple", "standard", "strategic"];
export const proposalStatusOptions: ProposalDraftStatus[] = ["draft", "internal_review", "ready_to_send"];

const legacyServiceRouteOptions = [
  "workflow-audit",
  "workflow-stewardship",
  "departmental-ecosystem",
  "architect-residency",
  "bespoke-implementation",
] as const;

export const serviceRouteOptions = Array.from(
  new Set<ProposalServiceRoute>([...proposalPresetRoutes, ...legacyServiceRouteOptions]),
);

export function getProposalPricing(value: unknown): ProposalPricingJson {
  const record = value && typeof value === "object" && !Array.isArray(value)
    ? (value as Partial<ProposalPricingJson>)
    : {};

  return {
    currency: "USD",
    base_service_price: Number(record.base_service_price || 0),
    complexity_level: String(record.complexity_level || "standard"),
    complexity_multiplier: Number(record.complexity_multiplier || 1),
    risk_level: String(record.risk_level || "medium"),
    delivery_depth: String(record.delivery_depth || "standard"),
    add_ons_text: String(record.add_ons_text || ""),
    discount_amount: Number(record.discount_amount || 0),
    deposit_required: Number(record.deposit_required || 0),
    final_total: Number(record.final_total || 0),
  };
}

export function getProposalPaymentTerms(value: unknown): ProposalPaymentTermsJson {
  const record = value && typeof value === "object" && !Array.isArray(value)
    ? (value as Partial<ProposalPaymentTermsJson>)
    : {};

  return {
    payment_schedule: String(record.payment_schedule || ""),
    deposit_required: Number(record.deposit_required || 0),
  };
}

export function jsonListToText(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        return JSON.stringify(item);
      })
      .join("\n");
  }

  if (typeof value === "string") {
    return value;
  }

  return "";
}

export function textToJsonList(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function formatProposalMoney(value: unknown) {
  const amount = typeof value === "number" ? value : Number(value || 0);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
