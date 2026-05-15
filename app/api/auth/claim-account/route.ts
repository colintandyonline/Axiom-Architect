import { NextResponse } from "next/server";
import {
  getAxiomCustomerByEmail,
  linkAuthUserToCustomerByEmail,
  setAxiomAuthCookies,
  type AxiomAuthUser,
} from "../../../../lib/axiom-auth";

export const runtime = "nodejs";

type SupabaseSignupResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  user?: AxiomAuthUser;
  error?: string;
  error_description?: string;
  msg?: string;
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

function getAppUrl(request: Request) {
  const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL;
  return (appUrl || new URL(request.url).origin).replace(/\/$/, "");
}

function cleanField(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function redirectToClaimAccount(request: Request, error: string) {
  const url = new URL("/claim-account", request.url);
  url.searchParams.set("error", error);
  return NextResponse.redirect(url, 303);
}

function redirectToLoginCheckEmail(request: Request) {
  const url = new URL("/login", request.url);
  url.searchParams.set("signup", "check_email");
  return NextResponse.redirect(url, 303);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = cleanField(formData, "email").toLowerCase();
  const fullName = cleanField(formData, "fullName");
  const businessName = cleanField(formData, "businessName");
  const password = cleanField(formData, "password");
  const config = getSupabasePublicConfig();

  if (!config) {
    return redirectToClaimAccount(request, "config");
  }

  if (!email || !fullName || !businessName || !password) {
    return redirectToClaimAccount(request, "missing");
  }

  if (password.length < 8) {
    return redirectToClaimAccount(request, "password");
  }

  const customer = await getAxiomCustomerByEmail(email);

  if (!customer) {
    return redirectToClaimAccount(request, "not_found");
  }

  if (customer.auth_user_id) {
    return redirectToClaimAccount(request, "already_claimed");
  }

  const response = await fetch(`${config.url}/auth/v1/signup`, {
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
        axiom_customer_id: customer.id,
        account_source: "paid_customer_claim",
      },
      email_redirect_to: `${getAppUrl(request)}/account`,
    }),
  });

  const result = (await response.json()) as SupabaseSignupResponse;

  if (!response.ok || !result.user) {
    console.error(
      "Axiom account claim failed",
      result.error || result.msg || result.error_description,
    );

    if (
      result.error === "user_already_exists" ||
      result.msg?.toLowerCase().includes("already registered") ||
      result.error_description?.toLowerCase().includes("already registered")
    ) {
      return redirectToClaimAccount(request, "already_exists");
    }

    return redirectToClaimAccount(request, "signup");
  }

  const linkedCustomer = await linkAuthUserToCustomerByEmail(result.user);

  if (!linkedCustomer) {
    console.error("Axiom account claim could not link customer", {
      userId: result.user.id,
      email: result.user.email,
    });

    return redirectToClaimAccount(request, "link");
  }

  if (!result.access_token) {
    return redirectToLoginCheckEmail(request);
  }

  const redirectUrl = new URL("/account", request.url);
  const nextResponse = NextResponse.redirect(redirectUrl, 303);

  return setAxiomAuthCookies(nextResponse, {
    access_token: result.access_token,
    refresh_token: result.refresh_token,
    expires_in: result.expires_in,
  });
}

export function GET(request: Request) {
  const url = new URL("/claim-account", request.url);
  return NextResponse.redirect(url, 303);
}
