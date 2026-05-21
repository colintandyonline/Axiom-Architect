import type { Metadata } from "next";
import { requireAxiomAdmin } from "../../../lib/axiom-admin";
import { formatCurrency, getAdminData } from "../../../lib/axiom-admin-dashboard";
import { AdminSection, AdminShell, StatCard } from "../../../components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Admin Analytics | Axiom Architect",
  description: "Internal Axiom Architect tracking and performance overview page.",
};

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const { adminEmail } = await requireAxiomAdmin();
  const data = await getAdminData();
  const paidOrders = data.orders.filter((order) => order.payment_status === "paid");
  const revenueCents = paidOrders.reduce((sum, order) => sum + (order.amount_total || 0), 0);
  const activeReports = data.reports.filter((report) => ["queued", "generating", "needs_review"].includes(report.status || "")).length;
  const deliveredReports = data.reports.filter((report) => report.status === "delivered").length;

  return (
    <AdminShell
      adminEmail={adminEmail}
      eyebrow="Analytics"
      title="Tracking and performance overview."
      intro="This page keeps the analytics lane separate from operational control. It currently surfaces internal platform totals and placeholders for the next GA/Stripe reporting pass."
      activePath="/admin/analytics"
    >
      <section className="bg-[#9ed39f] px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Revenue" value={formatCurrency(revenueCents)} helper="Paid revenue in current view" />
          <StatCard title="Paid orders" value={String(paidOrders.length)} helper="Commercial orders marked paid" />
          <StatCard title="Active reports" value={String(activeReports)} helper="Queued, generating, or in review" />
          <StatCard title="Delivered" value={String(deliveredReports)} helper="Reports marked delivered" />
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <AdminSection eyebrow="Performance lanes" title="Analytics control areas">
            <div className="grid gap-5 lg:grid-cols-3">
              <article className="border border-[#9ed39f]/20 bg-black/36 p-5">
                <h3 className="text-xl font-black uppercase tracking-[-0.04em] text-white">Google Analytics</h3>
                <p className="mt-3 text-sm leading-7 text-white/70">
                  GA is installed on the public site. A later admin pass can connect the Google Analytics Data API for sessions, conversions, and top page reporting.
                </p>
              </article>
              <article className="border border-[#9ed39f]/20 bg-black/36 p-5">
                <h3 className="text-xl font-black uppercase tracking-[-0.04em] text-white">Financials</h3>
                <p className="mt-3 text-sm leading-7 text-white/70">
                  Stripe-backed order records are visible in the orders page. Later we can add month-to-date revenue, refunds, subscriptions, and offer-level performance.
                </p>
              </article>
              <article className="border border-[#9ed39f]/20 bg-black/36 p-5">
                <h3 className="text-xl font-black uppercase tracking-[-0.04em] text-white">Service performance</h3>
                <p className="mt-3 text-sm leading-7 text-white/70">
                  Proposal clients now have a dedicated page. The next metrics layer can track review time, evidence received, deliverables released, and follow-up conversion.
                </p>
              </article>
            </div>
          </AdminSection>
        </div>
      </section>
    </AdminShell>
  );
}
