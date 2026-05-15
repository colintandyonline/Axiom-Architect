import { NextResponse } from "next/server";

export const runtime = "nodejs";

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

function redirectToForgotPassword(request: Request, state: string) {
  const url = new URL("/forgot-password", request.url);
  url.searchParams.set(state, "1");
  return NextResponse.redirect(url, 303);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = cleanField(formData, "email").toLowerCase();
  const config = getSupabasePublicConfig();

  if (!config) {
    return redirectToForgotPassword(request, "config_error");
  }

  if (!email) {
    return redirectToForgotPassword(request, "missing");
  }

  const response = await fetch(`${config.url}/auth/v1/recover`, {
    method: "POST",
    cache: "no-store",
    headers: {
      apikey: config.anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      redirect_to: `${getAppUrl(request)}/reset-password`,
    }),
  });

  if (!response.ok) {
    console.error("Axiom password reset request failed", await response.text());
    return redirectToForgotPassword(request, "error");
  }

  return redirectToForgotPassword(request, "sent");
}

export function GET(request: Request) {
  const url = new URL("/forgot-password", request.url);
  return NextResponse.redirect(url, 303);
}
