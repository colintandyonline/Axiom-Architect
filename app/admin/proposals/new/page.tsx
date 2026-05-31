import type { Metadata } from "next";
import { requireAxiomAdmin } from "../../../../lib/axiom-admin";
import { AdminSection, AdminShell } from "../../../../components/admin/AdminShell";
import { ProposalDraftForm } from "../ProposalDraftForm";

export const metadata: Metadata = {
  title: "New Proposal Draft | Axiom Architect Admin",
  description: "Create an internal Axiom Architect proposal draft with pricing, scope, and delivery terms.",
};

export const dynamic = "force-dynamic";

type CustomerOption = {
  id: string;
  email: string | null;
  full_name: string | null;
  business_name: string | null;
};

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return { url: url.replace(/\/$/, ""), serviceRoleKey };
}

async function supabaseFetch<T>(path: string): Promise<T | null> {
  const config = getSupabaseConfig();

  if (!config) {
    return null;
  }

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    cache: "no-store",
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("New proposal draft customer request failed", path, await response.text());
    return null;
  }

  return (await response.json()) as T;
}

async function getCustomers() {
  const customers = await supabaseFetch<CustomerOption[]>(
    "axiom_customers?select=id,email,full_name,business_name&order=created_at.desc&limit=200",
  );

  return customers || [];
}

export default async function NewProposalDraftPage() {
  const { adminEmail } = await requireAxiomAdmin();
  const customers = await getCustomers();

  return (
    <AdminShell
      adminEmail={adminEmail}
      eyebrow="Proposal draft"
      title="Create proposal draft."
      intro="Prepare scope, pricing, payment terms, and internal risk notes before any client-facing proposal, PDF, or payment conversion is built."
      activePath="/admin/proposals"
    >
      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <AdminSection eyebrow="Preparation" title="New proposal draft">
            <ProposalDraftForm mode="create" customers={customers} />
          </AdminSection>
        </div>
      </section>
    </AdminShell>
  );
}
