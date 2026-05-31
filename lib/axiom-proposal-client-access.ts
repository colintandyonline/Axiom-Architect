import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export const proposalClientAccessibleStatuses = new Set([
  "sent",
  "viewed",
  "accepted",
  "changes_requested",
]);

export function generateProposalAccessToken() {
  return randomBytes(32).toString("base64url");
}

export function hashProposalAccessToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function proposalTokenMatches(token: string, storedHash?: string | null) {
  if (!token || !storedHash) {
    return false;
  }

  const incomingHash = hashProposalAccessToken(token);
  const incomingBuffer = Buffer.from(incomingHash, "hex");
  const storedBuffer = Buffer.from(storedHash, "hex");

  return incomingBuffer.length === storedBuffer.length && timingSafeEqual(incomingBuffer, storedBuffer);
}

export function proposalAccessExpired(expiresAt?: string | null) {
  return Boolean(expiresAt && new Date(expiresAt).getTime() <= Date.now());
}

export function proposalReviewUrl({
  appUrl,
  proposalId,
  token,
}: {
  appUrl: string;
  proposalId: string;
  token: string;
}) {
  const baseUrl = appUrl.replace(/\/$/, "");
  return `${baseUrl}/client/proposals/${encodeURIComponent(proposalId)}?token=${encodeURIComponent(token)}`;
}
