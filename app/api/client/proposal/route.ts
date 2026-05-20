import { NextResponse } from "next/server";
import { getAxiomAuthContext } from "../../../../lib/axiom-auth";
import { bespokeProposalFields } from "../../../../lib/axiom-bespoke-proposal";

export const runtime = "nodejs";

type AxiomServiceRequest = {
  id: string;
  customer_id: string;
};

type AxiomClientWorkspace = {
  id: string;
  customer_id: string;
  service_request_id: string | null;
};

const lockedAccountFieldNames = new Set(["name", "email", "business_name"]);
const productionAppUrl = "https://www.axiom-architect.co";

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

function getAppUrl(request: Request) {
  const configuredUrl =
    process.env.APP_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");

  if (configuredUrl) {
    return configuredUrl;
  }

  const requestUrl = new URL(request.url);

  if (requestUrl.hostname.endsWith(".vercel.app")) {
    return productionAppUrl;
  }

  return requestUrl.origin;
}

function cleanField(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function cleanMessage(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim().replace(/\r\n/g, "\n") : "";
}

function nullableText(value: string | null | undefined) {
  return value ? value : null;
}

function redirectToLogin(request: Request) {
  const url = new URL("/login", getAppUrl(request));
  url.searchParams.set("redirect", "/client/proposal");
  return NextResponse.redirect(url, 303);
}

function redirectToProposal(request: Request, error: string) {
  const url = new URL("/client/proposal", getAppUrl(request));
  url.searchParams.set("error", error);
  return NextResponse.redirect(url, 303);
}

function redirectToClient(request: Request) {
  const url = new URL("/client", getAppUrl(request));
  url.searchParams.set("proposal", "received");
  return NextResponse.redirect(url, 303);
}

function collectProposalPayload(formData: FormData) {
  return bespokeProposalFields.reduce<Record<string, string>>((proposalPayload, field) => {
    if (lockedAccountFieldNames.has(field.name)) {
      return proposalPayload;
    }

    proposalPayload[field.name] =
      field.type === "textarea"
        ? cleanMessage(formData, field.name)
        : cleanField(formData, field.name);

    return proposalPayload;
  }, {});
}

function isProposalPayloadValid(payload: Record<string, string>) {
  return bespokeProposalFields.every((field) => {
    if (lockedAccountFieldNames.has(field.name) || !field.required) {
      return true;
    }

    return Boolean(payload[field.name]);
  });
}

async function supabaseServiceFetch<T>(path: string, options: RequestInit = {}) {
  const config = getSupabaseServiceConfig();

  if (!config) {
    return null;
  }

  const headers = new Headers(options.headers);
  headers.set("apikey", config.serviceRoleKey);
  headers.set("Authorization", `Bearer ${config.serviceRoleKey}`);
  headers.set("Content-Type", "application/json");

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...options,
    cache: "no-store",
    headers,
  });

  const responseText = await response.text();

  if (!response.ok) {
    console.error("Axiom proposal Supabase request failed", response.status, responseText);
    return null;
  }

  if (!responseText) {
    return undefined as T;
  }

  return JSON.parse(responseText) as T;
}

async function createProposalPortalRecords({
  customerId,
  fullName,
  email,
  businessName,
  proposalPayload,
  summaryMessage,
}: {
  customerId: string;
  fullName: string;
  email: string;
  businessName: string;
  proposalPayload: Record<string, string>;
  summaryMessage: string;
}) {
  const now = new Date().toISOString();

  const serviceRequests = await supabaseServiceFetch<AxiomServiceRequest[]>(
    "axiom_service_requests?select=id,customer_id",
    {
      method: "POST",
      headers: {
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        customer_id: customerId,
        request_type: "custom_workflow_systems",
        source: "client_proposal_form",
        status: "pending_review",
        proposal_status: "not_prepared",
        contact_name: fullName,
        email,
        business_name: businessName,
        role: nullableText(proposalPayload.role),
        website: nullableText(proposalPayload.website),
        scope_type: nullableText(proposalPayload.scope_type),
        support_type: nullableText(proposalPayload.support_type),
        budget_range: nullableText(proposalPayload.budget_range),
        timeline: nullableText(proposalPayload.timeline),
        sensitive_data: nullableText(proposalPayload.sensitive_data),
        summary_message: nullableText(summaryMessage),
        request_payload: proposalPayload,
      }),
    },
  );

  const serviceRequest = serviceRequests?.[0] ?? null;

  if (!serviceRequest) {
    console.error("Axiom proposal portal sync failed: service request was not created");
    return false;
  }

  const workspaces = await supabaseServiceFetch<AxiomClientWorkspace[]>(
    "axiom_client_workspaces?select=id,customer_id,service_request_id",
    {
      method: "POST",
      headers: {
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        customer_id: customerId,
        service_request_id: serviceRequest.id,
        workspace_name: `${businessName} workspace`,
        workspace_type: "premium_client_portal",
        status: "active",
        current_phase: "discovery",
        current_priority: "Proposal review",
        next_client_action: "Axiom is reviewing your proposal request.",
        axiom_review_focus: "Review submitted proposal context and prepare the premium client workspace.",
        last_activity_at: now,
      }),
    },
  );

  const workspace = workspaces?.[0] ?? null;

  if (!workspace) {
    console.error("Axiom proposal portal sync failed: client workspace was not created");
    return false;
  }

  const activity = await supabaseServiceFetch<Record<string, unknown>[]>(
    "axiom_workspace_activity?select=id",
    {
      method: "POST",
      headers: {
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        workspace_id: workspace.id,
        customer_id: customerId,
        actor_type: "client",
        actor_label: fullName,
        activity_type: "proposal_submitted",
        title: "Proposal request submitted",
        body:
          summaryMessage ||
          "A premium proposal request was submitted through the protected client proposal form.",
        metadata: {
          service_request_id: serviceRequest.id,
          source: "client_proposal_form",
          scope_type: proposalPayload.scope_type || null,
          support_type: proposalPayload.support_type || null,
          timeline: proposalPayload.timeline || null,
          budget_range: proposalPayload.budget_range || null,
        },
        is_client_visible: true,
      }),
    },
  );

  if (!activity?.[0]) {
    console.error("Axiom proposal portal sync failed: workspace activity was not created");
    return false;
  }

  return true;
}

export async function POST(request: Request) {
  const authContext = await getAxiomAuthContext();

  if (!authContext.user) {
    return redirectToLogin(request);
  }

  if (!authContext.customer) {
    return redirectToProposal(request, "account");
  }

  const formData = await request.formData();
  const honeypot = cleanField(formData, "company_website");

  if (honeypot) {
    return redirectToClient(request);
  }

  const proposalPayload = collectProposalPayload(formData);
  const summaryMessage = cleanMessage(formData, "message");

  if (!getSupabaseServiceConfig()) {
    return redirectToProposal(request, "config");
  }

  if (!isProposalPayloadValid(proposalPayload) || !summaryMessage) {
    return redirectToProposal(request, "missing");
  }

  const fullName = authContext.customer.full_name || authContext.user.email || "Axiom client";
  const email = authContext.customer.email || authContext.user.email || "";
  const businessName = authContext.customer.business_name || "Axiom client workspace";

  if (!email) {
    return redirectToProposal(request, "account");
  }

  const portalSynced = await createProposalPortalRecords({
    customerId: authContext.customer.id,
    fullName,
    email,
    businessName,
    proposalPayload,
    summaryMessage,
  });

  if (!portalSynced) {
    return redirectToProposal(request, "portal-sync");
  }

  return redirectToClient(request);
}

export function GET(request: Request) {
  return NextResponse.redirect(new URL("/client/proposal", getAppUrl(request)), 303);
}
