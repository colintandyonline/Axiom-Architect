import { NextResponse } from "next/server";
import { getAxiomAuthContext } from "../../../../../lib/axiom-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

function safeReturnPath(value: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/client/operations";
  }

  return value;
}

function redirectWithStatus(request: Request, returnTo: string, status: string) {
  const url = new URL(safeReturnPath(returnTo), request.url);
  url.searchParams.set("message", status);
  return NextResponse.redirect(url, 303);
}

async function markMessageRead(messageId: string, customerId: string) {
  const config = getSupabaseServiceConfig();

  if (!config) {
    return false;
  }

  const response = await fetch(
    `${config.url}/rest/v1/axiom_workspace_messages?id=eq.${encodeURIComponent(messageId)}&customer_id=eq.${encodeURIComponent(customerId)}`,
    {
      method: "PATCH",
      cache: "no-store",
      headers: {
        apikey: config.serviceRoleKey,
        Authorization: `Bearer ${config.serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        status: "read",
        updated_at: new Date().toISOString(),
      }),
    },
  );

  return response.ok;
}

export async function POST(request: Request) {
  const authContext = await getAxiomAuthContext();

  if (!authContext.user) {
    return NextResponse.redirect(new URL("/login?redirect=/client/operations", request.url), 303);
  }

  if (!authContext.customer) {
    return redirectWithStatus(request, "/client/operations", "customer");
  }

  const formData = await request.formData();
  const messageId = cleanInput(formData.get("message_id"));
  const returnTo = cleanInput(formData.get("return_to"));

  if (!messageId) {
    return redirectWithStatus(request, returnTo, "missing");
  }

  const updated = await markMessageRead(messageId, authContext.customer.id);

  return redirectWithStatus(request, returnTo, updated ? "read" : "failed");
}

export function GET(request: Request) {
  return NextResponse.redirect(new URL("/client/operations", request.url), 303);
}
