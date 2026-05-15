import { NextResponse } from "next/server";
import { clearAxiomAuthCookies } from "../../lib/axiom-auth";

export const runtime = "nodejs";

export function GET(request: Request) {
  const url = new URL("/login", request.url);
  url.searchParams.set("logged_out", "1");

  const response = NextResponse.redirect(url, 303);
  return clearAxiomAuthCookies(response);
}

export function POST(request: Request) {
  return GET(request);
}
