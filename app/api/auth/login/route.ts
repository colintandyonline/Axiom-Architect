import { NextResponse } from "next/server";
import {
  getAuthRedirectPath,
  linkAuthUserToCustomerByEmail,
  setAxiomAuthCookies,
  type AxiomAuthUser,
} from "../../../../lib/axiom-auth";

export const runtime = "nodejs";

type SupabasePasswordResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  user?: AxiomAuthUser;
  error?: string;
  error_description?: string;
  msg?: string;
};

const operationsAdminEmail = "ops@axiom-architect.co";

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

function cleanField(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function getPostLoginRedirect(email: string, requestedRedirect: string) {
  if (email === operationsAdminEmail && requestedRedirect === "/dashboard") {
    return "/admin";
  }

  return requestedRedirect;
}

function redirectToLogin(request: Request, error: string, redirectTo?: string) {
  const url = new URL("/login", request.url);
  url.searchParams.set("error", error);

  if (redirectTo) {
    url.searchParams.set("redirect", getAuthRedirectPath(redirectTo));
  }

  return NextResponse.redirect(url, 303);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = cleanField(formData, "email").toLowerCase();
  const password = cleanField(formData, "password");
  const requestedRedirect = getAuthRedirectPath(cleanField(formData, "redirect"));
  const redirectTo = getPostLoginRedirect(email, requestedRedirect);
  const config = getSupabasePublicConfig();

  if (!config) {
    return redirectToLogin(request, "config", requestedRedirect);
  }

  if (!email || !password) {
    return redirectToLogin(request, "missing", requestedRedirect);
  }

  const response = await fetch(`${config.url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    cache: "no-store",
    headers: {
      apikey: config.anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const result = (await response.json()) as SupabasePasswordResponse;

  if (!response.ok || !result.access_token) {
    console.error("Axiom login failed", result.error || result.msg || result.error_description);
    return redirectToLogin(request, "invalid", requestedRedirect);
  }

  if (result.user) {
    await linkAuthUserToCustomerByEmail(result.user);
  }

  const redirectUrl = new URL(redirectTo, request.url);
  const nextResponse = NextResponse.redirect(redirectUrl, 303);

  return setAxiomAuthCookies(nextResponse, {
    access_token: result.access_token,
    refresh_token: result.refresh_token,
    expires_in: result.expires_in,
  });
}

export function GET(request: Request) {
  const url = new URL("/login", request.url);
  return NextResponse.redirect(url, 303);
}
