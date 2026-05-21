import type { Metadata } from "next";
import Link from "next/link";
import { requireAxiomAdmin } from "../../../lib/axiom-admin";
import { formatDate, getAdminData, label, workflowTitle } from "../../../lib/axiom-admin-dashboard";
import { AdminSection, AdminShell, buttonClass, primaryButtonClass, statusPill } from "../../../components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Admin Workflows | Axiom Architect",
  description: "Internal Axiom Architect submitted workflow intake control page.",
};

export const dynamic = "force-dynamic";

export default async function AdminWorkflowsPage() {
  const { adminEmail } = await requireAxiomAdmin();
  const data = await getAdminData();
  const reportsBySubmissionId = new Map(
    data.reports
      .filter((report) => report.submission_id)
      .map((report) => [report.submission_id as string, report]),
  );
  const submittedWorkflows = data.workflows.filter((workflow) => workflow.status && workflow.status !== "draft");
  const draftWorkflows = data.workflows.filter((workflow) => !workflow.status || workflow.status === "draft");

  return (
    <AdminShell
      adminEmail={adminEmail}
      eyebrow="Workflow estate"
      title="Submitted workflow intakes."
      intro="This page controls submitted workflow intake records and their linked report status. Draft intakes are separated so they are not confused with active client work."
      activePath="/admin/workflows"
    >
      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-8">
          <AdminSection eyebrow="Submitted intakes" title="Active workflow submissions">
            {submittedWorkflows.length > 0 ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {submittedWorkflows.map((workflow) => {
                  const linkedReport = reportsBySubmissionId.get(workflow.id);

                  return (
                    <article key={workflow.id} className="border border-[#9ed39f]/20 bg-black/36 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">{label(workflow.tier_slug)}</p>
                        {statusPill(workflow.status)}
                      </div>
                      <h3 className="mt-3 text-xl font-black uppercase leading-tight tracking-[-0.04em] text-white">
                        {workflowTitle(workflow)}
                      </h3>
                      <div className="mt-4 grid gap-3 text-sm leading-7 text-white/68 sm:grid-cols-2">
                        <p><strong className="text-[#9ed39f]">Workflow updated:</strong> {formatDate(workflow.updated_at)}</p>
                        <p><strong className="text-[#9ed39f]">Linked report:</strong> {label(linkedReport?.status)}</p>
                      </div>
                      <div className="mt-5 flex flex-wrap gap-3">
                        {linkedReport ? (
                          <Link href={`/admin/reports/${linkedReport.id}`} className={primaryButtonClass}>
                            Review report
                          </Link>
                        ) : (
                          <span className="inline-flex min-h-10 items-center justify-center border border-[#9ed39f]/20 bg-black/40 px-3 text-center text-[0.62rem] font-black uppercase tracking-[0.14em] text-white/46">
                            Report record pending
                          </span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="border border-[#9ed39f]/20 bg-black/36 p-5 text-sm leading-7 text-white/68">
                No submitted workflow intakes are currently in view.
              </div>
            )}
          </AdminSection>

          <AdminSection eyebrow="Drafts" title="Incomplete workflow records">
            {draftWorkflows.length > 0 ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {draftWorkflows.map((workflow) => (
                  <article key={workflow.id} className="border border-[#9ed39f]/14 bg-black/24 p-5 opacity-75">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">{label(workflow.tier_slug)}</p>
                      {statusPill(workflow.status)}
                    </div>
                    <h3 className="mt-3 text-lg font-black uppercase leading-tight tracking-[-0.04em] text-white">
                      {workflowTitle(workflow)}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-white/62">Updated {formatDate(workflow.updated_at)}</p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="border border-[#9ed39f]/20 bg-black/36 p-5 text-sm leading-7 text-white/68">
                No draft workflow intakes are currently in view.
              </div>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/admin/reports" className={buttonClass}>Open report queue</Link>
            </div>
          </AdminSection>
        </div>
      </section>
    </AdminShell>
  );
}
