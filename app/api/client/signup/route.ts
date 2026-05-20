import { NextResponse } from "next/server";
import type { AxiomAuthUser } from "../../../../lib/axiom-auth";

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

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 180;
}

function redirectToApply(request: Request, error: string) {
  const url = new URL("/bespoke/apply", getAppUrl(request));
  url.searchParams.set("error", error);
  return NextResponse.redirect(url, 303);
}

function redirectToCheckEmail(request: Request, email: string) {
  const url = new URL("/client/check-email", getAppUrl(request));
  url.searchParams.set("proposal", "signup");
  url.searchParams.set("email", email);
  return NextResponse.redirect(url, 303);
}

function redirectToExistingLogin(request: Request) {
  const url = new URL("/login", getAppUrl(request));
  url.searchParams.set("signup", "existing");
  url.searchParams.set("redirect", "/client/proposal");
  return NextResponse.redirect(url, 303);
}

function getAuthErrorText(result: SignupResponse) {
  return [result.error, result.msg, result.error_description]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function getCreatedUserId(result: SignupResponse) {
  if (result.user?.id) {
    return result.user.id;
  }

  if (typeof result.id === "string") {
    return result.id;
  }

  return null;
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
    console.error("Axiom client signup customer request failed", response.status, responseText);
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

async function upsertSignupCustomer({
  email,
  fullName,
  businessName,
  authUserId,
}: {
  email: string;
  fullName: string;
  businessName: string;
  authUserId: string | null;
}) {
  const existingCustomer = await getCustomerByEmail(email);
  const payload = {
    email,
    full_name: fullName,
    business_name: businessName,
    auth_user_id: authUserId || existingCustomer?.auth_user_id || null,
    account_status: authUserId ? "active" : existingCustomer?.account_status || "proposal_pending",
    last_login_at: existingCustomer?.last_login_at || null,
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

export async function POST(request: Request) {
  const formData = await request.formData();
  const honeypot = cleanField(formData, "company_website");

  if (honeypot) {
    return redirectToCheckEmail(request, "");
  }

  const config = getSupabasePublicConfig();
  const fullName = cleanField(formData, "name");
  const email = cleanField(formData, "email").toLowerCase();
  const businessName = cleanField(formData, "business_name");
  const password = cleanField(formData, "password");
  const confirmPassword = cleanField(formData, "confirmPassword");

  if (!config) {
    return redirectToApply(request, "config");
  }

  if (!fullName || !isValidEmail(email) || !businessName) {
    return redirectToApply(request, "missing");
  }

  if (password.length < 8) {
    return redirectToApply(request, "password");
  }

  if (password !== confirmPassword) {
    return redirectToApply(request, "password-match");
  }

  const postSignupRedirectUrl = new URL("/login", getAppUrl(request));
  postSignupRedirectUrl.searchParams.set("signup", "confirmed");
  postSignupRedirectUrl.searchParams.set("redirect", "/client/proposal");

  const signupUrl = new URL(`${config.url}/auth/v1/signup`);
  signupUrl.searchParams.set("redirect_to", postSignupRedirectUrl.toString());

  const response = await fetch(signupUrl.toString(), {
    method: "POST",
    cache: "no-store",
    headers: {
      apikey: config.anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      data: {
        full_name: fullName,
        business_name: businessName,
        account_source: "premium_client_signup",
        proposal_route: "custom_workflow_systems",
      },
      email_redirect_to: postSignupRedirectUrl.toString(),
    }),
  });

  const result = (await response.json()) as SignupResponse;

  if (!response.ok) {
    const errorText = getAuthErrorText(result);

    if (errorText.includes("already") || errorText.includes("registered") || errorText.includes("exists")) {
      return redirectToExistingLogin(request);
    }

    console.error("Axiom client signup failed", result.error || result.msg || result.error_description);
    return redirectToApply(request, "account-create");
  }

  const customer = await upsertSignupCustomer({
    email,
    fullName,
    businessName,
    authUserId: getCreatedUserId(result),
  });

  if (!customer) {
    return redirectToApply(request, "customer");
  }

  return redirectToCheckEmail(request, email);
}

export function GET(request: Request) {
  return NextResponse.redirect(new URL("/bespoke/apply", getAppUrl(request)), 303);
}
