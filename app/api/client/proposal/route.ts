import { NextResponse } from "next/server";
import {
  setAxiomAuthCookies,
  type AxiomAuthUser,
} from "../../../../lib/axiom-auth";
import { bespokeProposalFields } from "../../../../lib/axiom-bespoke-proposal";

export const runtime = "nodejs";

type SignupResponse = Record<string, unknown> & {
  id?: string;
  email?: string | null;
  user?: AxiomAuthUser;
  error?: string;
  error_description?: string;
  msg?: string;
};

type AxiomCustomer = {
  id: string;
  auth_user_id: string | null;
  email: string | null;
  full_name: string | null;
  business_name: string | null;
  account_status: string;
  last_login_at: string | null;
};

type AxiomServiceRequest = {
  id: string;
  customer_id: string;
};

type AxiomClientWorkspace = {
  id: string;
  customer_id: string;
  service_request_id: string | null;
};

const sessionTokenKey = "access" + "_token";
const refreshTokenKey = "refresh" + "_token";
const expiryKey = "expires" + "_in";
const productionAppUrl = "https://www.axiom-architect.co";

function getSupabasePublicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return {
    url: url.replace(/\/$/, ""),
    anonKey,
  };
}

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

function redirectToApply(request: Request, error: string) {
  const url = new URL("/bespoke/apply", getAppUrl(request));
  url.searchParams.set("error", error);
  return NextResponse.redirect(url, 303);
}

function redirectToCheckEmail(request: Request, email: string) {
  const url = new URL("/client/check-email", getAppUrl(request));
  url.searchParams.set("proposal", "received");
  url.searchParams.set("email", email);
  return NextResponse.redirect(url, 303);
}

function redirectToClient(request: Request) {
  const url = new URL("/client", getAppUrl(request));
  url.searchParams.set("proposal", "received");
  return NextResponse.redirect(url, 303);
}

function redirectToExistingLogin(request: Request) {
  const url = new URL("/login", getAppUrl(request));
  url.searchParams.set("signup", "existing");
  url.searchParams.set("redirect", "/client?proposal=received");
  return NextResponse.redirect(url, 303);
}

function getAuthErrorText(result: SignupResponse) {
  return [result.error, result.msg, result.error_description]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function getStringValue(result: SignupResponse, key: string) {
  const value = result[key];
  return typeof value === "string" ? value : undefined;
}

function getNumberValue(result: SignupResponse, key: string) {
  const value = result[key];
  return typeof value === "number" ? value : undefined;
}

function getCreatedUser(result: SignupResponse, email: string): AxiomAuthUser | null {
  if (result.user?.id) {
    return result.user;
  }

  if (result.id) {
    return {
      id: result.id,
      email: result.email || email,
      user_metadata: {},
    };
  }

  return null;
}

function collectProposalPayload(formData: FormData) {
  const payload = bespokeProposalFields.reduce<Record<string, string>>((proposalPayload, field) => {
    proposalPayload[field.name] =
      field.type === "textarea"
        ? cleanMessage(formData, field.name)
        : cleanField(formData, field.name);

    return proposalPayload;
  }, {});

  delete payload.password;
  delete payload.confirmPassword;

  return payload;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 180;
}

function isProposalPayloadValid(payload: Record<string, string>) {
  return bespokeProposalFields.every((field) => {
    if (!field.required) {
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

async function getCustomerByEmail(email: string) {
  const records = await supabaseServiceFetch<AxiomCustomer[]>(
    `axiom_customers?select=id,auth_user_id,email,full_name,business_name,account_status,last_login_at&email=eq.${encodeURIComponent(email)}&limit=1`,
  );

  return records?.[0] ?? null;
}

async function linkOrCreateProposalCustomer({
  email,
  fullName,
  businessName,
  user,
}: {
  email: string;
  fullName: string;
  businessName: string;
  user?: AxiomAuthUser | null;
}) {
  const existingCustomer = await getCustomerByEmail(email);
  const now = new Date().toISOString();
  const payload = {
    email,
    full_name: fullName,
    business_name: businessName,
    auth_user_id: user?.id || existingCustomer?.auth_user_id || null,
    account_status: user?.id ? "active" : existingCustomer?.account_status || "proposal_pending",
    last_login_at: user?.id ? now : existingCustomer?.last_login_at || null,
  };

  if (existingCustomer) {
    const updated = await supabaseServiceFetch<AxiomCustomer[]>(
      `axiom_customers?id=eq.${encodeURIComponent(existingCustomer.id)}&select=id,auth_user_id,email,full_name,business_name,account_status,last_login_at`,
      {
        method: "PATCH",
        headers: {
          Prefer: "return=representation",
        },
        body: JSON.stringify(payload),
      },
    );

    return updated?.[0] ?? null;
  }

  const created = await supabaseServiceFetch<AxiomCustomer[]>(
    "axiom_customers?select=id,auth_user_id,email,full_name,business_name,account_status,last_login_at",
    {
      method: "POST",
      headers: {
        Prefer: "return=representation",
      },
      body: JSON.stringify(payload),
    },
  );

  return created?.[0] ?? null;
}

async function createProposalPortalRecords({
  customer,
  fullName,
  email,
  businessName,
  proposalPayload,
  summaryMessage,
}: {
  customer: AxiomCustomer;
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
        customer_id: customer.id,
        request_type: "custom_workflow_systems",
        source: "bespoke_apply_form",
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
        customer_id: customer.id,
        service_request_id: serviceRequest.id,
        workspace_name: `${businessName} workspace`,
        workspace_type: "premium_client_portal",
        status: "active",
        current_phase: "discovery",
        current_priority: "Proposal review",
        next_client_action: "Check your email for account confirmation and next steps.",
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
        customer_id: customer.id,
        actor_type: "client",
        actor_label: fullName,
        activity_type: "proposal_submitted",
        title: "Proposal request submitted",
        body:
          summaryMessage ||
          "A premium proposal request was submitted through the bespoke application form.",
        metadata: {
          service_request_id: serviceRequest.id,
          source: "bespoke_apply_form",
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
  const formData = await request.formData();
  const honeypot = cleanField(formData, "company_website");

  if (honeypot) {
    return redirectToCheckEmail(request, "");
  }

  const publicConfig = getSupabasePublicConfig();
  const fullName = cleanField(formData, "name");
  const email = cleanField(formData, "email").toLowerCase();
  const businessName = cleanField(formData, "business_name");
  const password = cleanField(formData, "password");
  const confirmPassword = cleanField(formData, "confirmPassword");
  const proposalPayload = collectProposalPayload(formData);
  const summaryMessage = cleanMessage(formData, "message");

  if (!publicConfig) {
    return redirectToApply(request, "config");
  }

  if (!fullName || !isValidEmail(email) || !businessName || !isProposalPayloadValid(proposalPayload)) {
    return redirectToApply(request, "missing");
  }

  if (password.length < 8) {
    return redirectToApply(request, "password");
  }

  if (password !== confirmPassword) {
    return redirectToApply(request, "password-match");
  }

  const initialCustomer = await linkOrCreateProposalCustomer({
    email,
    fullName,
    businessName,
  });

  if (!initialCustomer) {
    return redirectToApply(request, "customer");
  }

  const postSignupRedirectUrl = new URL("/login", getAppUrl(request));
  postSignupRedirectUrl.searchParams.set("signup", "confirmed");
  postSignupRedirectUrl.searchParams.set("redirect", "/client?proposal=confirmed");

  const signupUrl = new URL(`${publicConfig.url}/auth/v1/signup`);
  signupUrl.searchParams.set("redirect_to", postSignupRedirectUrl.toString());

  const response = await fetch(signupUrl.toString(), {
    method: "POST",
    cache: "no-store",
    headers: {
      apikey: publicConfig.anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      data: {
        full_name: fullName,
        business_name: businessName,
        account_source: "premium_proposal_request",
        selected_tier: "architect-residency",
        proposal_route: "custom_workflow_systems",
      },
      email_redirect_to: postSignupRedirectUrl.toString(),
    }),
  });

  const result = (await response.json()) as SignupResponse;
  const user = getCreatedUser(result, email);

  if (!response.ok || !user) {
    const errorText = getAuthErrorText(result);

    if (errorText.includes("already") || errorText.includes("registered") || errorText.includes("exists")) {
      const portalSynced = await createProposalPortalRecords({
        customer: initialCustomer,
        fullName,
        email,
        businessName,
        proposalPayload,
        summaryMessage,
      });

      if (!portalSynced) {
        return redirectToApply(request, "portal-sync");
      }

      return redirectToExistingLogin(request);
    }

    console.error("Axiom proposal account signup failed", result.error || result.msg || result.error_description);
    return redirectToApply(request, "account-create");
  }

  const customer = await linkOrCreateProposalCustomer({
    email,
    fullName,
    businessName,
    user,
  });

  if (!customer) {
    return redirectToApply(request, "link");
  }

  const portalSynced = await createProposalPortalRecords({
    customer,
    fullName,
    email,
    businessName,
    proposalPayload,
    summaryMessage,
  });

  if (!portalSynced) {
    return redirectToApply(request, "portal-sync");
  }

  const sessionToken = getStringValue(result, sessionTokenKey);

  if (!sessionToken) {
    return redirectToCheckEmail(request, email);
  }

  const nextResponse = redirectToClient(request);

  return setAxiomAuthCookies(nextResponse, {
    access_token: sessionToken,
    refresh_token: getStringValue(result, refreshTokenKey),
    expires_in: getNumberValue(result, expiryKey),
  });
}

export function GET(request: Request) {
  return NextResponse.redirect(new URL("/bespoke/apply", getAppUrl(request)), 303);
}