import type { Metadata } from "next";
import Link from "next/link";
import { requireAxiomAdmin } from "../../lib/axiom-admin";
import { formatCurrency, formatDate, getAdminData } from "../../lib/axiom-admin-dashboard";
import { formatProposalMoney, getProposalPricing } from "../../lib/axiom-proposal-drafts";
import { AdminSection, AdminShell, StatCard, buttonClass, primaryButtonClass } from "../../components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Admin Overview | Axiom Architect",
  description:
    "Internal Axiom Architect operations overview for commercial activity, workflow operations, proposal clients, and service performance.",
};

export const dynamic = "force-dynamic";

function paymentLabel(value?: string | null) {
  return value ? value.replace(/_/g, " ") : "unpaid";
}

export default async function AdminDashboardPage() {
  const { adminEmail } = await requireAxiomAdmin();
  const data = await getAdminData();
  const paidOrders = data.orders.filter((order) => order.payment_status === "paid");
  const productRevenueCents = paidOrders.reduce((sum, order) => sum + (order.amount_total || 0), 0);
  const productRevenueDollars = productRevenueCents / 100;
  const submittedWorkflows = data.workflows.filter((workflow) => workflow.status && workflow.status !== "draft");
  const activeReports = data.reports.filter((report) => ["queued", "generating", "needs_review"].includes(report.status || "")).length;
  const generatedReports = data.reports.filter((report) => ["generated", "approved", "delivered"].includes(report.status || "")).length;
  const openWork = submittedWorkflows.length + activeReports + data.proposals.filter((proposal) => !proposal.final_balance_paid_at && !["cancelled", "refunded"].includes(proposal.payment_status || "")).length;
  const proposalDepositsReceived = data.proposals.filter((proposal) => proposal.deposit_paid_at);
  const proposalFinalsReceived = data.proposals.filter((proposal) => proposal.final_balance_paid_at);
  const proposalDepositPaidFinalDue = data.proposals.filter((proposal) => proposal.deposit_paid_at && !proposal.final_balance_paid_at);
  const proposalPaymentsComplete = data.proposals.filter((proposal) => proposal.final_balance_paid_at);
  const proposalDepositsTotal = proposalDepositsReceived.reduce((sum, proposal) => sum + getProposalPricing(proposal.pricing_json).deposit_required, 0);
  const proposalFinalsTotal = proposalFinalsReceived.reduce((sum, proposal) => sum + getProposalPricing(proposal.pricing_json).balance_amount, 0);
  const proposalPaymentsTotal = proposalDepositsTotal + proposalFinalsTotal;
  const totalReceived = productRevenueDollars + proposalPaymentsTotal;
  const proposalOutstandingFinals = proposalDepositPaidFinalDue.reduce((sum, proposal) => sum + getProposalPricing(proposal.pricing_json).balance_amount, 0);
  const recentProposalPayments = data.proposals
    .filter((proposal) => proposal.deposit_paid_at || proposal.final_balance_paid_at || proposal.payment_status)
    .slice(0, 5);
  const recentPaidOrders = paidOrders.slice(0, 5);

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
          <StatCard title="Product orders" value={String(paidOrders.length)} helper="Paid checkout/order clients" />
          <StatCard title="Proposal payments" value={String(proposalPaymentsComplete.length)} helper="Fully paid proposal clients" />
          <StatCard title="Total received" value={formatProposalMoney(totalReceived)} helper="Product/order plus proposal/service payments" />
          <StatCard title="Open work" value={String(openWork)} helper="Submitted workflows, active reports, open proposals" />
          <StatCard title="Reports" value={`${generatedReports}/${activeReports}`} helper="Generated / active queue" />
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-8">
          <AdminSection eyebrow="Overall business snapshot" title="Combined received revenue">
            <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
              <article className="border border-[#9ed39f]/20 bg-black/36 p-5">
                <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Total received</p>
                <h3 className="mt-3 text-[clamp(2.3rem,5vw,5rem)] font-black uppercase leading-none tracking-[-0.075em] text-white">
                  {formatProposalMoney(totalReceived)}
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/68">
                  This combines paid product/order revenue with proposal deposit and final balance payments that have actually been received.
                </p>
              </article>
              <div className="grid gap-4 sm:grid-cols-2">
                <StatCard title="Product/order revenue" value={formatCurrency(productRevenueCents)} helper="Paid checkout/order records only" />
                <StatCard title="Proposal/service revenue" value={formatProposalMoney(proposalPaymentsTotal)} helper="Paid proposal deposits plus finals" />
                <StatCard title="Outstanding finals" value={formatProposalMoney(proposalOutstandingFinals)} helper="Proposal final balances still due" />
                <StatCard title="Reports / active" value={`${generatedReports}/${activeReports}`} helper="Generated reports / active queue" />
              </div>
            </div>
          </AdminSection>

          <AdminSection eyebrow="Business lanes" title="Product and proposal breakdown">
            <div className="grid gap-5 xl:grid-cols-2">
              <article className="border border-[#9ed39f]/20 bg-black/36 p-5">
                <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white">Product and paid-order clients</h3>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <StatCard title="Revenue" value={formatCurrency(productRevenueCents)} helper="Paid product/order receipts" />
                  <StatCard title="Paid orders" value={String(paidOrders.length)} helper="Checkout records marked paid" />
                  <StatCard title="Workflows" value={String(submittedWorkflows.length)} helper="Submitted workflow intakes" />
                </div>
                <div className="mt-6 overflow-x-auto">
                  <table className="min-w-[620px] w-full border-collapse text-left text-sm">
                    <thead className="text-[0.68rem] uppercase tracking-[0.16em] text-[#9ed39f]">
                      <tr>{["Recent order", "Amount", "Payment", "Created"].map((heading) => <th key={heading} className="border-b border-[#9ed39f]/20 p-3">{heading}</th>)}</tr>
                    </thead>
                    <tbody>
                      {recentPaidOrders.length ? recentPaidOrders.map((order) => (
                        <tr key={order.id} className="border-b border-[#9ed39f]/12 text-white/76">
                          <td className="p-3 font-bold text-white">{order.service_name || order.tier_slug || "Product order"}</td>
                          <td className="p-3">{formatCurrency(order.amount_total || 0, order.currency || "usd")}</td>
                          <td className="p-3">{paymentLabel(order.payment_status)}</td>
                          <td className="p-3">{formatDate(order.created_at)}</td>
                        </tr>
                      )) : (
                        <tr className="border-b border-[#9ed39f]/12 text-white/62">
                          <td colSpan={4} className="p-3">No paid product/order records yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/admin/clients" className={primaryButtonClass}>View clients</Link>
                  <Link href="/admin/orders" className={buttonClass}>View orders</Link>
                </div>
              </article>
              <article className="border border-[#9ed39f]/20 bg-black/36 p-5">
                <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white">Proposal and service clients</h3>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <StatCard title="Received" value={formatProposalMoney(proposalPaymentsTotal)} helper="Deposits plus final balances" />
                  <StatCard title="Outstanding" value={formatProposalMoney(proposalOutstandingFinals)} helper="Final balances still due" />
                  <StatCard title="Complete" value={String(proposalPaymentsComplete.length)} helper="Proposal payments fully paid" />
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <StatCard title="Deposits" value={formatProposalMoney(proposalDepositsTotal)} helper="Recorded proposal deposits" />
                  <StatCard title="Finals" value={formatProposalMoney(proposalFinalsTotal)} helper="Recorded final balances" />
                  <StatCard title="Final due" value={String(proposalDepositPaidFinalDue.length)} helper="Deposit paid, final not paid" />
                </div>
                <div className="mt-6 overflow-x-auto">
                  <table className="min-w-[720px] w-full border-collapse text-left text-sm">
                    <thead className="text-[0.68rem] uppercase tracking-[0.16em] text-[#9ed39f]">
                      <tr>{["Recent proposal", "Status", "Deposit", "Final", "Latest sync"].map((heading) => <th key={heading} className="border-b border-[#9ed39f]/20 p-3">{heading}</th>)}</tr>
                    </thead>
                    <tbody>
                      {recentProposalPayments.length ? recentProposalPayments.map((proposal) => {
                        const pricing = getProposalPricing(proposal.pricing_json);

                        return (
                          <tr key={proposal.id} className="border-b border-[#9ed39f]/12 text-white/76">
                            <td className="p-3 font-bold text-white">
                              <Link href={`/admin/proposals/${proposal.id}/payments`} className="text-[#9ed39f] hover:text-white">
                                {proposal.business_name || proposal.workspace_name || proposal.proposal_reference || "Proposal"}
                              </Link>
                            </td>
                            <td className="p-3">{paymentLabel(proposal.payment_status)}</td>
                            <td className="p-3">{proposal.deposit_paid_at ? formatProposalMoney(pricing.deposit_required) : "Not paid"}</td>
                            <td className="p-3">{proposal.final_balance_paid_at ? formatProposalMoney(pricing.balance_amount) : proposal.final_balance_requested_at ? "Due" : "Not requested"}</td>
                            <td className="p-3">{proposal.stripe_latest_event_type || "No Stripe event"}</td>
                          </tr>
                        );
                      }) : (
                        <tr className="border-b border-[#9ed39f]/12 text-white/62">
                          <td colSpan={5} className="p-3">No proposal payments are recorded yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/admin/proposals" className={primaryButtonClass}>Proposal clients</Link>
                  {recentProposalPayments[0] ? (
                    <Link href={`/admin/proposals/${recentProposalPayments[0].id}/payments`} className={buttonClass}>Latest payment page</Link>
                  ) : null}
                </div>
              </article>
            </div>
          </AdminSection>

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
        </div>
      </section>
    </AdminShell>
  );
}
