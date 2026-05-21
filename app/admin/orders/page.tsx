import type { Metadata } from "next";
import { requireAxiomAdmin } from "../../../lib/axiom-admin";
import { formatCurrency, formatDate, getAdminData, label } from "../../../lib/axiom-admin-dashboard";
import { AdminSection, AdminShell, statusPill } from "../../../components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Admin Orders | Axiom Architect",
  description: "Internal Axiom Architect commercial order and payment status page.",
};

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const { adminEmail } = await requireAxiomAdmin();
  const data = await getAdminData();

  return (
    <AdminShell
      adminEmail={adminEmail}
      eyebrow="Commercial overview"
      title="Orders and financial status."
      intro="This page tracks productised service orders, payment state, order state, and recent commercial records."
      activePath="/admin/orders"
    >
      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <AdminSection eyebrow="Order records" title="Payments and order state">
            <div className="overflow-x-auto">
              <table className="min-w-[920px] w-full border-collapse text-left text-sm">
                <thead className="text-[0.68rem] uppercase tracking-[0.16em] text-[#9ed39f]">
                  <tr>{["Service", "Tier", "Amount", "Payment", "Order", "Created"].map((heading) => <th key={heading} className="border-b border-[#9ed39f]/20 p-3">{heading}</th>)}</tr>
                </thead>
                <tbody>
                  {data.orders.map((order) => (
                    <tr key={order.id} className="border-b border-[#9ed39f]/12 text-white/76">
                      <td className="p-3 font-bold text-white">{order.service_name || "—"}</td>
                      <td className="p-3">{label(order.tier_slug)}</td>
                      <td className="p-3">{formatCurrency(order.amount_total || 0, order.currency || "usd")}</td>
                      <td className="p-3">{statusPill(order.payment_status)}</td>
                      <td className="p-3">{statusPill(order.status)}</td>
                      <td className="p-3">{formatDate(order.created_at)}</td>
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
