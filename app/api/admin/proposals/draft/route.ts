import { NextResponse } from "next/server";
import { requireAxiomAdmin } from "../../../../../lib/axiom-admin";
import {
  proposalStatusOptions,
  proposalTypeOptions,
  serviceRouteOptions,
  textToJsonList,
} from "../../../../../lib/axiom-proposal-drafts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const validProposalTypes = new Set<string>(proposalTypeOptions);
const validProposalStatuses = new Set<string>(proposalStatusOptions);
const validServiceRoutes = new Set<string>(serviceRouteOptions);

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

function nullableText(value: string) {
  return value || null;
}

function cleanNumber(value: string) {
  const normalized = Number(value.replace(/,/g, ""));
  return Number.isFinite(normalized) ? normalized : 0;
}

function cleanDate(value: string) {
  return value ? new Date(`${value}T23:59:59.000Z`).toISOString() : null;
}

function proposalReference() {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `AXP-${stamp}-${suffix}`;
}

function safeReturnPath(value: string, fallback = "/admin/proposals") {
  if (!value || !value.startsWith("/") || value.startsWith("//") || !value.startsWith("/admin/proposals")) {
    return fallback;
  }

  return value;
}

function redirectWithStatus(request: Request, path: string, status: string) {
  const url = new URL(path, request.url);
  url.searchParams.set("proposal", status);
  return NextResponse.redirect(url, 303);
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
    console.error("Axiom proposal draft request failed", response.status, responseText);
    return null;
  }

  if (!responseText) {
    return undefined as T;
  }

  return JSON.parse(responseText) as T;
}

function proposalPayload(formData: FormData, existingReference?: string | null) {
  const proposalType = cleanInput(formData.get("proposal_type")) || "standard";
  const status = cleanInput(formData.get("status")) || "draft";
  const recommendedServiceRoute = cleanInput(formData.get("recommended_service_route")) || "workflow-blueprint";
  const alternativeServiceRoute = cleanInput(formData.get("alternative_service_route"));
  const baseServicePrice = cleanNumber(cleanInput(formData.get("base_service_price")));
  const complexityMultiplier = cleanNumber(cleanInput(formData.get("complexity_multiplier"))) || 1;
  const discountAmount = cleanNumber(cleanInput(formData.get("discount_amount")));
  const depositRequired = cleanNumber(cleanInput(formData.get("deposit_required")));
  const balanceAmount = cleanNumber(cleanInput(formData.get("balance_amount")));
  const finalTotal = cleanNumber(cleanInput(formData.get("final_total")));
  const paymentSchedule = cleanInput(formData.get("payment_schedule"));
  const paymentInstructions = cleanInput(formData.get("payment_instructions"));
  const paymentStatusNote = cleanInput(formData.get("payment_status_note"));
  const sourceRecordId = cleanInput(formData.get("source_record_id"));
  const sourceRecordType = cleanInput(formData.get("source_record_type"));
  const sourceRecordTitle = cleanInput(formData.get("source_record_title"));
  const sourceRecordSummary = cleanInput(formData.get("source_record_summary"));

  return {
    customer_id: nullableText(cleanInput(formData.get("customer_id"))),
    source_record_id: nullableText(sourceRecordId),
    source_record_type: nullableText(sourceRecordType),
    proposal_reference: existingReference || cleanInput(formData.get("proposal_reference")) || proposalReference(),
    proposal_type: validProposalTypes.has(proposalType) ? proposalType : "standard",
    status: validProposalStatuses.has(status) ? status : "draft",
    client_name: nullableText(cleanInput(formData.get("client_name"))),
    business_name: nullableText(cleanInput(formData.get("business_name"))),
    client_email: nullableText(cleanInput(formData.get("client_email"))),
    workspace_name: cleanInput(formData.get("workspace_name")) || "Proposal workspace",
    recommended_service_route: validServiceRoutes.has(recommendedServiceRoute)
      ? recommendedServiceRoute
      : "workflow-blueprint",
    alternative_service_route: validServiceRoutes.has(alternativeServiceRoute) ? alternativeServiceRoute : null,
    client_summary: nullableText(cleanInput(formData.get("client_summary"))),
    current_problem_summary: nullableText(cleanInput(formData.get("current_problem_summary"))),
    desired_outcome: nullableText(cleanInput(formData.get("desired_outcome"))),
    scope_summary: nullableText(cleanInput(formData.get("scope_summary"))),
    included_work_json: textToJsonList(cleanInput(formData.get("included_work"))),
    deliverables_json: textToJsonList(cleanInput(formData.get("deliverables"))),
    timeline_json: textToJsonList(cleanInput(formData.get("timeline"))),
    exclusions_json: textToJsonList(cleanInput(formData.get("exclusions"))),
    client_responsibilities_json: textToJsonList(cleanInput(formData.get("client_responsibilities"))),
    assumptions_json: textToJsonList(cleanInput(formData.get("assumptions"))),
    pricing_json: {
      currency: "USD",
      base_service_price: baseServicePrice,
      complexity_level: cleanInput(formData.get("complexity_level")) || "standard",
      complexity_multiplier: complexityMultiplier,
      risk_level: cleanInput(formData.get("risk_level")) || "medium",
      delivery_depth: cleanInput(formData.get("delivery_depth")) || "standard",
      add_ons_text: cleanInput(formData.get("add_ons_text")),
      discount_amount: discountAmount,
      deposit_required: depositRequired,
      balance_amount: balanceAmount,
      final_total: finalTotal,
    },
    internal_pricing_notes: nullableText(cleanInput(formData.get("internal_pricing_notes"))),
    client_price_explanation: nullableText(cleanInput(formData.get("client_price_explanation"))),
    internal_risk_notes: nullableText(cleanInput(formData.get("internal_risk_notes"))),
    revision_notes: nullableText(cleanInput(formData.get("revision_notes"))),
    payment_terms_json: {
      payment_schedule: paymentSchedule,
      deposit_required: depositRequired,
      deposit_payment_url: cleanInput(formData.get("deposit_payment_url")),
      final_payment_url: cleanInput(formData.get("final_payment_url")),
      payment_instructions: paymentInstructions,
      payment_status_note: paymentStatusNote,
    },
    payment_status_note: nullableText(paymentStatusNote),
    valid_until: cleanDate(cleanInput(formData.get("valid_until"))),
    proposal_json: {
      prepared_by: "Axiom Architect admin",
      preparation_state: status,
      updated_from: "admin_proposal_draft_form",
      source_record: sourceRecordId
        ? {
            id: sourceRecordId,
            type: sourceRecordType || null,
            title: sourceRecordTitle || null,
            summary: sourceRecordSummary || null,
          }
        : null,
    },
    updated_at: new Date().toISOString(),
  };
}

async function getExistingReference(proposalId: string) {
  const records = await supabaseServiceFetch<{ proposal_reference: string | null }[]>(
    `axiom_proposals?select=proposal_reference&id=eq.${encodeURIComponent(proposalId)}&limit=1`,
  );

  return records?.[0]?.proposal_reference || null;
}

export async function POST(request: Request) {
  await requireAxiomAdmin();

  if (!getSupabaseServiceConfig()) {
    return redirectWithStatus(request, "/admin/proposals", "config");
  }

  const formData = await request.formData();
  const action = cleanInput(formData.get("action")) || "create";
  const proposalId = cleanInput(formData.get("proposal_id"));
  const returnTo = safeReturnPath(cleanInput(formData.get("return_to")));

  if (action === "update") {
    if (!proposalId) {
      return redirectWithStatus(request, "/admin/proposals", "missing");
    }

    const existingReference = await getExistingReference(proposalId);
    const records = await supabaseServiceFetch<{ id: string }[]>(
      `axiom_proposals?id=eq.${encodeURIComponent(proposalId)}&select=id`,
      {
        method: "PATCH",
        headers: {
          Prefer: "return=representation",
        },
        body: JSON.stringify(proposalPayload(formData, existingReference)),
      },
    );

    if (!records?.[0]) {
      return redirectWithStatus(request, returnTo, "failed");
    }

    return redirectWithStatus(request, `/admin/proposals/${records[0].id}`, "saved");
  }

  const records = await supabaseServiceFetch<{ id: string }[]>(
    "axiom_proposals?select=id",
    {
      method: "POST",
      headers: {
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        ...proposalPayload(formData),
        created_at: new Date().toISOString(),
      }),
    },
  );

  if (!records?.[0]) {
    return redirectWithStatus(request, returnTo, "failed");
  }

  return redirectWithStatus(request, `/admin/proposals/${records[0].id}`, "created");
}

export function GET(request: Request) {
  return NextResponse.redirect(new URL("/admin/proposals", request.url), 303);
}
