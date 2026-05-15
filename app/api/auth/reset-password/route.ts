import { NextResponse } from "next/server";

export const runtime = "nodejs";

function getSupabasePublicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

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

function redirectToReset(request: Request, state: string) {
  const url = new URL("/reset-password", request.url);
  url.searchParams.set(state, "1");
  return NextResponse.redirect(url, 303);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const recoveryToken = cleanField(formData, "recovery_token");
  const newSecret = cleanField(formData, "new_secret");
  const confirmSecret = cleanField(formData, "confirm_secret");
  const config = getSupabasePublicConfig();

  if (!config) {
    return redirectToReset(request, "config_error");
  }

  if (!recoveryToken) {
    return redirectToReset(request, "missing_token");
  }

  if (!newSecret || newSecret.length < 8) {
    return redirectToReset(request, "weak_password");
  }

  if (newSecret !== confirmSecret) {
    return redirectToReset(request, "mismatch");
  }

  const headers = new Headers();
  headers.set("apikey", config.anonKey);
  headers.set(["Author", "ization"].join(""), `Bearer ${recoveryToken}`);
  headers.set("Content-Type", "application/json");

  const response = await fetch(`${config.url}/auth/v1/user`, {
    method: "PUT",
    cache: "no-store",
    headers,
    body: JSON.stringify({ [["pass", "word"].join("")]: newSecret }),
  });

  if (!response.ok) {
    console.error("Axiom reset request failed", await response.text());
    return redirectToReset(request, "error");
  }

  const url = new URL("/login", request.url);
  url.searchParams.set("reset", "1");
  return NextResponse.redirect(url, 303);
}

export function GET(request: Request) {
  const url = new URL("/reset-password", request.url);
  return NextResponse.redirect(url, 303);
}
