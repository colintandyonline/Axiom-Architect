import type { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ reportId: string }>;
};

export default async function AdminReportReviewLayout({ children, params }: LayoutProps) {
  const { reportId } = await params;

  return (
    <>
      {children}
      <aside className="fixed bottom-4 right-4 z-50 max-w-[22rem] rounded-[1.25rem] border border-[#9ed39f]/40 bg-black/92 p-4 text-white shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur">
        <p className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">
          Report testing
        </p>
        <p className="mt-2 text-sm leading-6 text-white/72">
          Regenerate this report with the latest improvement-led schema and guidance structure.
        </p>
        <form action="/api/admin/reports/action" method="post" className="mt-4">
          <input type="hidden" name="report_id" value={reportId} />
          <input type="hidden" name="action" value="regenerate" />
          <input type="hidden" name="return_to" value={`/admin/reports/${reportId}`} />
          <button
            type="submit"
            className="inline-flex min-h-11 w-full items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-4 text-center text-[0.64rem] font-black uppercase tracking-[0.14em] text-black transition hover:bg-white"
          >
            Regenerate improved report
          </button>
        </form>
      </aside>
    </>
  );
}
