import { NextResponse } from "next/server";
import {
  patchClientProposal,
  validateProposalClientAccess,
} from "../../../../../../lib/axiom-proposal-client.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cleanInput(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function redirectToProposal(request: Request, proposalId: string, token: string, status: string) {
  const url = new URL(`/client/proposals/${encodeURIComponent(proposalId)}`, request.url);
  url.searchParams.set("token", token);
  url.searchParams.set("proposal", status);
  return NextResponse.redirect(url, 303);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ proposalId: string }> },
) {
  const { proposalId } = await context.params;
  const formData = await request.formData();
  const token = cleanInput(formData.get("token"));
  const action = cleanInput(formData.get("action"));
  const access = await validateProposalClientAccess(proposalId, token);

  if (access.ok === false) {
    return new NextResponse(access.message, { status: access.status });
  }

  const now = new Date().toISOString();

  if (action === "accept_proposal") {
    await patchClientProposal(access.proposal.id, {
      accepted_at: access.proposal.accepted_at || now,
      status: "accepted",
      updated_at: now,
    });
    return redirectToProposal(request, access.proposal.id, token, "accepted");
  }

  if (action === "request_changes") {
    const message = cleanInput(formData.get("message"));

    if (!message) {
      return redirectToProposal(request, access.proposal.id, token, "missing-message");
    }

    await patchClientProposal(access.proposal.id, {
      changes_requested_at: now,
      change_request_message: message.slice(0, 5000),
      status: "changes_requested",
      updated_at: now,
    });
    return redirectToProposal(request, access.proposal.id, token, "changes-requested");
  }

  return new NextResponse("Unsupported proposal action", { status: 400 });
}
