import type { Metadata } from "next";
import { requireAxiomAdmin } from "../../../lib/axiom-admin";
import { formatDate, getAdminData } from "../../../lib/axiom-admin-dashboard";
import { AdminSection, AdminShell, statusPill } from "../../../components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Admin Clients | Axiom Architect",
  description: "Internal Axiom Architect client records and account status page.",
};

export const dynamic = "force-dynamic";

export default async function AdminClientsPage() {
  const { adminEmail } = await requireAxiomAdmin();
  const data = await getAdminData();

  return (
    <AdminShell
      adminEmail={adminEmail}
      eyebrow="Client records"
      title="Customers and account status."
      intro="This page is for product/account customer records, login state, and account visibility. Proposal/service clients are separated into the proposal clients area."
      activePath="/admin/clients"
    >
      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <AdminSection eyebrow="Account records" title="Customer list">
            <div className="overflow-x-auto">
              <table className="min-w-[920px] w-full border-collapse text-left text-sm">
                <thead className="text-[0.68rem] uppercase tracking-[0.16em] text-[#9ed39f]">
                  <tr>{["Name", "Email", "Business", "Status", "Created", "Last login"].map((heading) => <th key={heading} className="border-b border-[#9ed39f]/20 p-3">{heading}</th>)}</tr>
                </thead>
                <tbody>
                  {data.customers.map((customer) => (
                    <tr key={customer.id} className="border-b border-[#9ed39f]/12 text-white/76">
                      <td className="p-3 font-bold text-white">{customer.full_name || "—"}</td>
                      <td className="p-3">{customer.email || "—"}</td>
                      <td className="p-3">{customer.business_name || "—"}</td>
                      <td className="p-3">{statusPill(customer.account_status)}</td>
                      <td className="p-3">{formatDate(customer.created_at)}</td>
                      <td className="p-3">{formatDate(customer.last_login_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AdminSection>
        </div>
      </section>
    </AdminShell>
  );
}
