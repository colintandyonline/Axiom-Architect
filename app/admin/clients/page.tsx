import type { Metadata } from "next";
import Link from "next/link";
import { requireAxiomAdmin } from "../../../lib/axiom-admin";
import { formatDate, getAdminData, supabaseAdminFetch, type CustomerRecord } from "../../../lib/axiom-admin-dashboard";
import { AdminSection, AdminShell, StatCard, buttonClass, statusPill } from "../../../components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Admin Clients | Axiom Architect",
  description: "Internal Axiom Architect segmented client records and account status page.",
};

export const dynamic = "force-dynamic";

type ProposalClientRecord = {
  id: string;
  customer_id: string | null;
  status: string | null;
  proposal_status: string | null;
  source: string | null;
  created_at: string | null;
};

async function getProposalClientRecords() {
  return (
    (await supabaseAdminFetch<ProposalClientRecord[]>(
      "axiom_service_requests?select=id,customer_id,status,proposal_status,source,created_at&source=eq.client_proposal_form&order=created_at.desc&limit=250",
    )) || []
  );
}

function ClientTable({ customers, labelText }: { customers: CustomerRecord[]; labelText: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[920px] w-full border-collapse text-left text-sm">
        <thead className="text-[0.68rem] uppercase tracking-[0.16em] text-[#9ed39f]">
          <tr>{["Name", "Email", "Business", "Client lane", "Status", "Created", "Last login"].map((heading) => <th key={heading} className="border-b border-[#9ed39f]/20 p-3">{heading}</th>)}</tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="border-b border-[#9ed39f]/12 text-white/76">
              <td className="p-3 font-bold text-white">{customer.full_name || "—"}</td>
              <td className="p-3">{customer.email || "—"}</td>
              <td className="p-3">{customer.business_name || "—"}</td>
              <td className="p-3">{statusPill(labelText)}</td>
              <td className="p-3">{statusPill(customer.account_status)}</td>
              <td className="p-3">{formatDate(customer.created_at)}</td>
              <td className="p-3">{formatDate(customer.last_login_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function AdminClientsPage() {
  const { adminEmail } = await requireAxiomAdmin();
  const data = await getAdminData();
  const proposalRecords = await getProposalClientRecords();
  const proposalCustomerIds = new Set(
    proposalRecords
      .map((record) => record.customer_id)
      .filter((customerId): customerId is string => Boolean(customerId)),
  );
  const proposalClients = data.customers.filter((customer) => proposalCustomerIds.has(customer.id));
  const productClients = data.customers.filter((customer) => !proposalCustomerIds.has(customer.id));

  return (
    <AdminShell
      adminEmail={adminEmail}
      eyebrow="Client records"
      title="Segmented customer list."
      intro="This page separates general product/account customers from proposal/service clients so the admin console matches the two business lanes."
      activePath="/admin/clients"
    >
      <section className="bg-[#9ed39f] px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-5 md:grid-cols-3">
          <StatCard title="All clients" value={String(data.customers.length)} helper="Customer records in view" />
          <StatCard title="Product lane" value={String(productClients.length)} helper="No proposal request attached" />
          <StatCard title="Proposal lane" value={String(proposalClients.length)} helper="Linked to proposal service flow" />
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-8">
          <AdminSection eyebrow="Product clients" title="Product and account customers">
            <p className="mb-6 max-w-4xl text-sm leading-7 text-white/66">
              These clients are general account/customer records that are not currently linked to the proposal-service flow.
            </p>
            {productClients.length > 0 ? (
              <ClientTable customers={productClients} labelText="product account" />
            ) : (
              <div className="border border-[#9ed39f]/20 bg-black/36 p-5 text-sm leading-7 text-white/68">
                No product/account-only clients are currently in view.
              </div>
            )}
          </AdminSection>

          <AdminSection eyebrow="Proposal clients" title="Proposal and service customers">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <p className="max-w-4xl text-sm leading-7 text-white/66">
                These clients have entered the bespoke proposal flow. Manage their workspace, evidence, and deliverables from the proposal clients area.
              </p>
              <Link href="/admin/proposals" className={buttonClass}>Open proposal clients</Link>
            </div>
            {proposalClients.length > 0 ? (
              <ClientTable customers={proposalClients} labelText="proposal service" />
            ) : (
              <div className="border border-[#9ed39f]/20 bg-black/36 p-5 text-sm leading-7 text-white/68">
                No proposal/service clients are currently in view.
              </div>
            )}
          </AdminSection>
        </div>
      </section>
    </AdminShell>
  );
}
