import { redirect } from "next/navigation";
import { getAxiomAuthContext } from "./axiom-auth";

const fallbackAdminEmails = ["ops@axiom-architect.co", "colintandy@gmail.com"];

function normalizeEmail(email?: string | null) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

function getConfiguredAdminEmails() {
  const configuredEmails = process.env.AXIOM_ADMIN_EMAILS;

  if (!configuredEmails) {
    return fallbackAdminEmails;
  }

  const emails = configuredEmails
    .split(",")
    .map((email) => normalizeEmail(email))
    .filter(Boolean);

  return emails.length > 0 ? emails : fallbackAdminEmails;
}

export function isAxiomAdminEmail(email?: string | null) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return false;
  }

  return getConfiguredAdminEmails().includes(normalizedEmail);
}

export async function requireAxiomAdmin() {
  const context = await getAxiomAuthContext();

  if (!context.user) {
    redirect("/login?redirect=/admin");
  }

  const userEmail = normalizeEmail(context.user.email);
  const customerEmail = normalizeEmail(context.customer?.email);
  const isAdmin = isAxiomAdminEmail(userEmail) || isAxiomAdminEmail(customerEmail);

  if (!isAdmin) {
    redirect("/dashboard");
  }

  return {
    ...context,
    adminEmail: userEmail || customerEmail,
  };
}
