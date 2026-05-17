import { NextResponse } from "next/server";
import { getAxiomAuthContext } from "../../../../lib/axiom-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const { user, customer } = await getAxiomAuthContext();

  return NextResponse.json({
    signedIn: Boolean(user),
    hasCustomer: Boolean(customer),
  });
}
