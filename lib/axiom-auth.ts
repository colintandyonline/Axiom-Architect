import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextResponse } from "next/server";

export type AxiomAuthUser = {
  id: string;
  aud?: string;
  role?: string;
  email?: string;
  email_confirmed_at?: string | null;
  phone?: string | null;
  confirmed_at?: string | null;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
};

export type AxiomLinkedCustomer = {
  id: string;
  auth_user_id: string | null;
  email: string | null;
  full_name: string | null;
  business_name: string | null;
  account_status: string;
  last_login_at: string | null;
};

export type AxiomClientWorkspaceRoute = {
  id: string;
  customer_id: string;
  service_request_id: string | null;
  order_id: string | null;
  workspace_type: string | null;
  workspace_name: string;
  status: string | null;
};

export type AxiomAuthContext = {
  user: AxiomAuthUser | null;
  customer: AxiomLinkedCustomer | null;
};

export const AXIOM_ACCESS_TOKEN_COOKIE = "axiom_access_token";
export const AXIOM_REFRESH_TOKEN_COOKIE = "axiom_refresh_token";

const authCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

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

function getMetadataString(user: AxiomAuthUser, key: string) {
  const value = user.user_metadata?.[key];
  return typeof value === "string" ? value.trim() : "";
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
    console.error("Axiom auth customer request failed", response.status, responseText);
    return null;
  }

  if (!responseText) {
    return undefined as T;
  }

  return JSON.parse(responseText) as T;
}

export async function getAxiomAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get(AXIOM_ACCESS_TOKEN_COOKIE)?.value || null;
}

export async function getCurrentAuthUser() {
  const config = getSupabasePublicConfig();
  const accessToken = await getAxiomAccessToken();

  if (!config || !accessToken) {
    return null;
  }

  const response = await fetch(`${config.url}/auth/v1/user`, {
    cache: "no-store",
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as AxiomAuthUser;
}

export async function getLinkedAxiomCustomer(userId?: string | null) {
  if (!userId) {
    return null;
  }

  const records = await supabaseServiceFetch<AxiomLinkedCustomer[]>(
    `axiom_customers?select=id,auth_user_id,email,full_name,business_name,account_status,last_login_at&auth_user_id=eq.${encodeURIComponent(userId)}&limit=1`,
  );

  return records?.[0] ?? null;
}

export async function getAxiomCustomerByEmail(email?: string | null) {
  if (!email) {
    return null;
  }

  const records = await supabaseServiceFetch<AxiomLinkedCustomer[]>(
    `axiom_customers?select=id,auth_user_id,email,full_name,business_name,account_status,last_login_at&email=eq.${encodeURIComponent(email)}&limit=1`,
  );

  return records?.[0] ?? null;
}

export async function getAxiomClientWorkspaceByCustomerId(customerId?: string | null) {
  if (!customerId) {
    return null;
  }

  const records = await supabaseServiceFetch<AxiomClientWorkspaceRoute[]>(
    `axiom_client_workspaces?select=id,customer_id,service_request_id,order_id,workspace_type,workspace_name,status&customer_id=eq.${encodeURIComponent(customerId)}&order=created_at.desc&limit=1`,
  );

  return records?.[0] ?? null;
}

export async function hasAxiomClientWorkspace(customerId?: string | null) {
  return Boolean(await getAxiomClientWorkspaceByCustomerId(customerId));
}

export function shouldRouteServiceClientToPortal(path?: string | null) {
  const redirectPath = getAuthRedirectPath(path);

  return ["/dashboard", "/client/proposal", "/bespoke", "/bespoke/apply"].includes(redirectPath);
}

export async function getAxiomAuthContext(): Promise<AxiomAuthContext> {
  const user = await getCurrentAuthUser();

  if (!user) {
    return {
      user: null,
      customer: null,
    };
  }

  const linkedCustomer = await getLinkedAxiomCustomer(user.id);
  const customer = linkedCustomer || (await linkAuthUserToCustomerByEmail(user));

  return {
    user,
    customer,
  };
}

export async function requireAxiomAuth(redirectTo = "/login") {
  const context = await getAxiomAuthContext();

  if (!context.user) {
    redirect(redirectTo);
  }

  return context as AxiomAuthContext & { user: AxiomAuthUser };
}

export async function requireLinkedAxiomCustomer(redirectTo = "/account") {
  const context = await requireAxiomAuth();

  if (!context.customer) {
    redirect(redirectTo);
  }

  return context as AxiomAuthContext & {
    user: AxiomAuthUser;
    customer: AxiomLinkedCustomer;
  };
}

export async function linkAuthUserToCustomerByEmail(user: AxiomAuthUser) {
  if (!user.email) {
    return null;
  }

  const existingCustomer = await getAxiomCustomerByEmail(user.email);
  const payload = {
    email: user.email,
    full_name:
      existingCustomer?.full_name ||
      getMetadataString(user, "full_name") ||
      user.email,
    business_name:
      existingCustomer?.business_name ||
      getMetadataString(user, "business_name") ||
      "Axiom client",
    auth_user_id: user.id,
    last_login_at: new Date().toISOString(),
    account_status: "active",
  };

  if (existingCustomer) {
    if (existingCustomer.auth_user_id && existingCustomer.auth_user_id !== user.id) {
      return null;
    }

    const updatedCustomers = await supabaseServiceFetch<AxiomLinkedCustomer[]>(
      `axiom_customers?id=eq.${encodeURIComponent(existingCustomer.id)}&select=id,auth_user_id,email,full_name,business_name,account_status,last_login_at`,
      {
        method: "PATCH",
        headers: {
          Prefer: "return=representation",
        },
        body: JSON.stringify(payload),
      },
    );

    return updatedCustomers?.[0] ?? null;
  }

  const createdCustomers = await supabaseServiceFetch<AxiomLinkedCustomer[]>(
    "axiom_customers?select=id,auth_user_id,email,full_name,business_name,account_status,last_login_at",
    {
      method: "POST",
      headers: {
        Prefer: "return=representation",
      },
      body: JSON.stringify(payload),
    },
  );

  return createdCustomers?.[0] ?? null;
}

export function setAxiomAuthCookies(
  response: NextResponse,
  tokens: { access_token: string; refresh_token?: string; expires_in?: number },
) {
  response.cookies.set(AXIOM_ACCESS_TOKEN_COOKIE, tokens.access_token, {
    ...authCookieOptions,
    maxAge: tokens.expires_in || 60 * 60,
  });

  if (tokens.refresh_token) {
    response.cookies.set(AXIOM_REFRESH_TOKEN_COOKIE, tokens.refresh_token, {
      ...authCookieOptions,
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return response;
}

export function clearAxiomAuthCookies(response: NextResponse) {
  response.cookies.set(AXIOM_ACCESS_TOKEN_COOKIE, "", {
    ...authCookieOptions,
    maxAge: 0,
  });
  response.cookies.set(AXIOM_REFRESH_TOKEN_COOKIE, "", {
    ...authCookieOptions,
    maxAge: 0,
  });

  return response;
}

export function getAuthRedirectPath(path?: string | null) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return "/dashboard";
  }

  return path;
}
