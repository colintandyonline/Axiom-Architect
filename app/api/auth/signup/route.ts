import { NextResponse } from "next/server";
import {
  setAxiomAuthCookies,
  type AxiomAuthUser,
} from "../../../../lib/axiom-auth";

export const runtime = "nodejs";

type TierSlug = "workflow-audit" | "workflow-blueprint" | "custom-operating-pack";

type SignupResponse = {
  id?: string;
  email?: string | null;
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
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

function isTierSlug(value: string | null): value is TierSlug {
  return (
    value === "workflow-audit" ||
    value === "workflow-blueprint" ||
    value === "custom-operating-pack"
  );
}

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
  return (
    process.env.APP_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    new URL(request.url).origin
  );
}

function cleanField(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function signupRedirect(request: Request, tier: TierSlug, error: string) {
  const url = new URL("/signup", request.url);
  url.searchParams.set("tier", tier);
  url.searchParams.set("error", error);
  return NextResponse.redirect(url, 303);
}

function confirmationRedirect(request: Request, tier: TierSlug) {
  const url = new URL("/signup", request.url);
  url.searchParams.set("tier", tier);
  url.searchParams.set("account", "check_email");
  return NextResponse.redirect(url, 303);
}

function paymentRedirect(request: Request, tier: TierSlug, state: string) {
  const url = new URL("/pricing", request.url);
  url.searchParams.set("tier", tier);
  url.searchParams.set("account", state);
  return NextResponse.redirect(url, 303);
}

function loginRedirect(request: Request, tier: TierSlug, state: string) {
  const url = new URL("/login", request.url);
  url.searchParams.set("signup", state);
  url.searchParams.set("redirect", `/pricing?tier=${tier}&account=confirmed`);
  return NextResponse.redirect(url, 303);
}

function getAuthErrorText(result: SignupResponse) {
  return [result.error, result.msg, result.error_description]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
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
    console.error("Axiom signup customer request failed", response.status, responseText);
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

async function linkOrCreateCustomer({
  email,
  fullName,
  businessName,
  user,
}: {
  email: string;
  fullName: string;
  businessName: string;
  user: AxiomAuthUser;
}) {
  const existingCustomer = await getCustomerByEmail(email);
  const payload = {
    email,
    full_name: fullName,
    business_name: businessName,
    auth_user_id: user.id,
    account_status: existingCustomer?.account_status || "pending_confirmation",
    last_login_at: null,
  };

  if (existingCustomer) {
    if (existingCustomer.auth_user_id && existingCustomer.auth_user_id !== user.id) {
      return null;
    }

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
  const tierValue = cleanField(formData, "tier");
  const tier: TierSlug = isTierSlug(tierValue) ? tierValue : "workflow-blueprint";
  const fullName = cleanField(formData, "name");
  const email = cleanField(formData, "email").toLowerCase();
  const businessName = cleanField(formData, "business");
  const password = cleanField(formData, "password");
  const confirmPassword = cleanField(formData, "confirmPassword");
  const publicConfig = getSupabasePublicConfig();

  if (!publicConfig) {
    return signupRedirect(request, tier, "config");
  }

  if (!getSupabaseServiceConfig()) {
    return signupRedirect(request, tier, "service-config");
  }

  if (!fullName || !email || !businessName || !password || !confirmPassword) {
    return signupRedirect(request, tier, "missing");
  }

  if (password.length < 8) {
    return signupRedirect(request, tier, "password");
  }

  if (password !== confirmPassword) {
    return signupRedirect(request, tier, "password-match");
  }

  const response = await fetch(`${publicConfig.url}/auth/v1/signup`, {
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
        account_source: "account_first_signup",
      },
      email_redirect_to: `${getAppUrl(request)}/login?signup=confirmed&redirect=${encodeURIComponent(`/pricing?tier=${tier}&account=confirmed`)}`,
    }),
  });

  const result = (await response.json()) as SignupResponse;
  const user = getCreatedUser(result, email);

  if (!response.ok || !user) {
    const errorText = getAuthErrorText(result);

    console.error("Axiom account signup failed", result.error || result.msg || result.error_description);

    if (errorText.includes("already") || errorText.includes("registered") || errorText.includes("exists")) {
      return loginRedirect(request, tier, "existing");
    }

    return signupRedirect(request, tier, "account-create");
  }

  const customer = await linkOrCreateCustomer({
    email,
    fullName,
    businessName,
    user,
  });

  if (!customer) {
    return signupRedirect(request, tier, "link");
  }

  if (!result.access_token) {
    return confirmationRedirect(request, tier);
  }

  const nextResponse = paymentRedirect(request, tier, "created");

  return setAxiomAuthCookies(nextResponse, {
    access_token: result.access_token,
    refresh_token: result.refresh_token,
    expires_in: result.expires_in,
  });
}

export function GET(request: Request) {
  const url = new URL("/signup", request.url);
  return NextResponse.redirect(url, 303);
}
