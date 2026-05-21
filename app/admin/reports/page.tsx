import type { Metadata } from "next";
import Link from "next/link";
import { requireAxiomAdmin } from "../../../lib/axiom-admin";
import { canApproveReport, formatDate, getAdminData, label, workflowTitle } from "../../../lib/axiom-admin-dashboard";
import { AdminSection, AdminShell, primaryButtonClass, buttonClass, statusPill } from "../../../components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Admin Reports | Axiom Architect",
  description: "Internal Axiom Architect report review queue and delivery control page.",
};

export const dynamic = "force-dynamic";

function ReportActionForm({ reportId, action, labelText, primary = false }: { reportId: string; action: string; labelText: string; primary?: boolean }) {
  return (
    <form action="/api/admin/reports/action" method="post">
      <input type="hidden" name="report_id" value={reportId} />
      <input type="hidden" name="action" value={action} />
      <input type="hidden" name="return_to" value="/admin/reports" />
      <button type="submit" className={primary ? primaryButtonClass : buttonClass}>
        {labelText}
      </button>
    </form>
  );
}

export default async function AdminReportsPage() {
  const { adminEmail } = await requireAxiomAdmin();
  const data = await getAdminData();
  const workflowsById = new Map(data.workflows.map((workflow) => [workflow.id, workflow]));

  return (
    <AdminShell
      adminEmail={adminEmail}
      eyebrow="Report operations"
      title="Admin report queue."
      intro="This page is for reviewing generated workflow reports, approving outputs, requesting revision, and opening report detail pages."
      activePath="/admin/reports"
    >
      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <AdminSection eyebrow="Report queue" title="Review, approval, and delivery control">
            <p className="mb-6 max-w-4xl text-sm leading-7 text-white/66">
              Reports are created from submitted intake flow. Admin work starts here: review, approve, request revision, or open the report detail page.
            </p>
            <div className="grid gap-4 lg:grid-cols-2">
              {data.reports.map((report) => {
                const linkedWorkflow = report.submission_id ? workflowsById.get(report.submission_id) : null;

                return (
                  <article key={report.id} className="border border-[#9ed39f]/20 bg-black/36 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">{label(report.tier_slug)}</p>
                      {statusPill(report.status)}
                    </div>
                    <h3 className="mt-3 text-xl font-black uppercase leading-tight tracking-[-0.04em] text-white">
                      {workflowTitle(linkedWorkflow)}
                    </h3>
                    <p className="mt-4 border border-[#9ed39f]/16 bg-black/30 p-4 text-sm leading-7 text-white/70">
                      <strong className="text-[#9ed39f]">Report summary:</strong> {report.client_summary || "Report awaiting summary"}
                    </p>
                    <div className="mt-4 grid gap-3 text-sm leading-7 text-white/68 sm:grid-cols-3">
                      <p><strong className="text-[#9ed39f]">Quality:</strong> {report.quality_score ?? "—"}</p>
                      <p><strong className="text-[#9ed39f]">Review:</strong> {label(report.quality_status)}</p>
                      <p><strong className="text-[#9ed39f]">Updated:</strong> {formatDate(report.generated_at || report.updated_at)}</p>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link href={`/admin/reports/${report.id}`} className={primaryButtonClass}>
                        Review report
                      </Link>
                      {canApproveReport(report.status) && <ReportActionForm reportId={report.id} action="approve" labelText="Approve" primary />}
                      <ReportActionForm reportId={report.id} action="needs_revision" labelText="Needs revision" />
                    </div>
                  </article>
                );
              })}
            </div>
          </AdminSection>
        </div>
      </section>
    </AdminShell>
  );
}
