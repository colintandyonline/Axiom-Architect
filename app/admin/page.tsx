import type { Metadata } from "next";
import Link from "next/link";
import { requireAxiomAdmin } from "../../lib/axiom-admin";
import { formatCurrency, getAdminData } from "../../lib/axiom-admin-dashboard";
import { AdminSection, AdminShell, StatCard, buttonClass, primaryButtonClass } from "../../components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Admin Overview | Axiom Architect",
  description:
    "Internal Axiom Architect operations overview for commercial activity, workflow operations, proposal clients, and service performance.",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const { adminEmail } = await requireAxiomAdmin();
  const data = await getAdminData();
  const paidOrders = data.orders.filter((order) => order.payment_status === "paid");
  const revenueCents = paidOrders.reduce((sum, order) => sum + (order.amount_total || 0), 0);
  const submittedWorkflows = data.workflows.filter((workflow) => workflow.status && workflow.status !== "draft");
  const activeReports = data.reports.filter((report) => ["queued", "generating", "needs_review"].includes(report.status || "")).length;
  const generatedReports = data.reports.filter((report) => ["generated", "approved", "delivered"].includes(report.status || "")).length;

  return (
    <AdminShell
      adminEmail={adminEmail}
      eyebrow="Internal console"
      title="Axiom operations overview."
      intro="This is the command overview. Use the admin navigation to move into the separate control pages for clients, orders, workflows, reports, proposal clients, and analytics."
      activePath="/admin"
    >
      <section className="bg-[#9ed39f] px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-6">
          <StatCard title="Clients" value={String(data.customers.length)} helper="Customer records in view" />
          <StatCard title="Orders" value={String(data.orders.length)} helper="Commercial order records" />
          <StatCard title="Paid" value={String(paidOrders.length)} helper="Paid order records" />
          <StatCard title="Revenue" value={formatCurrency(revenueCents)} helper="Paid revenue in view" />
          <StatCard title="Workflows" value={String(submittedWorkflows.length)} helper="Submitted workflow intakes" />
          <StatCard title="Reports" value={`${generatedReports}/${activeReports}`} helper="Generated / active queue" />
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-8">
          <AdminSection eyebrow="Admin sections" title="Control areas">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[
                ["Customer records", "Product/account customers, login state, and account status.", "/admin/clients"],
                ["Orders", "Commercial orders, payment state, order state, and revenue view.", "/admin/orders"],
                ["Workflow intakes", "Submitted workflow forms and linked report state.", "/admin/workflows"],
                ["Report queue", "Generated reports, review actions, approvals, and delivery controls.", "/admin/reports"],
                ["Proposal clients", "Business proposal clients, workspaces, uploaded evidence, and deliverables.", "/admin/proposals"],
                ["Analytics", "Tracking, financial notes, and performance-control placeholders.", "/admin/analytics"],
              ].map(([title, text, href]) => (
                <Link key={href} href={href} className="border border-[#9ed39f]/20 bg-black/36 p-5 transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black">
                  <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] group-hover:text-black">Admin area</p>
                  <h2 className="mt-3 text-2xl font-black uppercase leading-tight tracking-[-0.05em]">{title}</h2>
                  <p className="mt-3 text-sm leading-7 opacity-70">{text}</p>
                </Link>
              ))}
            </div>
          </AdminSection>

          <AdminSection eyebrow="Business split" title="Two client lanes now exist">
            <div className="grid gap-5 lg:grid-cols-2">
              <article className="border border-[#9ed39f]/20 bg-black/36 p-5">
                <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white">Product and paid-order clients</h3>
                <p className="mt-3 text-sm leading-7 text-white/68">These clients come through productised offers, checkout, orders, workflow submissions, and generated audit reports.</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/admin/clients" className={primaryButtonClass}>View clients</Link>
                  <Link href="/admin/orders" className={buttonClass}>View orders</Link>
                </div>
              </article>
              <article className="border border-[#9ed39f]/20 bg-black/36 p-5">
                <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white">Proposal and service clients</h3>
                <p className="mt-3 text-sm leading-7 text-white/68">These clients come through the proposal flow and are managed through workspaces, evidence uploads, and released deliverables.</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/admin/proposals" className={primaryButtonClass}>Proposal clients</Link>
                  <Link href="/client/deliverables" className={buttonClass}>Client deliverables view</Link>
                </div>
              </article>
            </div>
          </AdminSection>
        </div>
      </section>
    </AdminShell>
  );
}
