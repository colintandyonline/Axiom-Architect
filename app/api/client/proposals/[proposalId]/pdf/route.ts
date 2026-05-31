import { NextResponse } from "next/server";
import {
  fetchProposalPdfObject,
  validateProposalClientAccess,
} from "../../../../../../lib/axiom-proposal-client.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeDownloadName(filename: string) {
  return filename.replace(/[\r\n"]/g, "").trim() || "axiom-architect-proposal.pdf";
}

export async function GET(
  request: Request,
  context: { params: Promise<{ proposalId: string }> },
) {
  const { proposalId } = await context.params;
  const token = new URL(request.url).searchParams.get("token");
  const access = await validateProposalClientAccess(proposalId, token);

  if (access.ok === false) {
    return new NextResponse(access.message, { status: access.status });
  }

  if (!access.proposal.pdf_file_path) {
    return new NextResponse("Proposal PDF unavailable", { status: 404 });
  }

  const objectResponse = await fetchProposalPdfObject(access.proposal.pdf_file_path);

  if (!objectResponse.body) {
    return new NextResponse("Proposal PDF unavailable", { status: 404 });
  }

  const filename = safeDownloadName(`axiom-architect-proposal-${access.proposal.proposal_reference || access.proposal.id}.pdf`);
  const headers = new Headers();
  headers.set("Content-Type", "application/pdf");
  headers.set("Content-Disposition", `inline; filename="${filename}"`);
  headers.set("Cache-Control", "private, no-store");
  headers.set("X-Robots-Tag", "noindex, nofollow");

  const contentLength = objectResponse.headers.get("Content-Length");

  if (contentLength) {
    headers.set("Content-Length", contentLength);
  }

  return new Response(objectResponse.body, {
    status: 200,
    headers,
  });
}
