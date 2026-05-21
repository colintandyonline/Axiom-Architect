import Link from "next/link";
import { loadClientPortalData } from "../../../lib/axiom-client-portal-data";

export const dynamic = "force-dynamic";

function tidy(value: string | null | undefined) {
  return value ? value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) : "Not set";
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Not recorded";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function ClientPortalDeliverablesPage() {
  const data = await loadClientPortalData("/client/deliverables");
  const rows = data.deliverables;
  const latest = rows[0];
  const reviewCount = rows.filter((row) => row.status === "ready_for_review").length;
  const approvedCount = rows.filter((row) => row.status === "approved").length;
  const finalCount = rows.filter((row) => row.status === "delivered").length;

  return (
    <main className="min-h-screen bg-black px-4 py-12 text-white sm:px-6 lg:px-8">
      <section className="mx-auto max-w-[1440px] border border-[#9ed39f]/24 bg-[#020904] p-6 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <p className="inline-flex bg-[#9ed39f] px-3 py-2 text-xs font-black uppercase tracking-[0.22em] text-black">Deliverables</p>
            <h1 className="mt-6 text-[clamp(3rem,6vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.08em]">Outputs.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">Prepared workflow documents, blueprints, reports, and implementation files released by Axiom.</p>
          </div>
          <aside className="border border-[#9ed39f]/35 bg-black p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9ed39f]">Latest</p>
            <h2 className="mt-3 break-words text-2xl font-black uppercase tracking-[-0.04em]">{latest?.title || "None yet"}</h2>
            <p className="mt-3 text-sm leading-7 text-white/68">{latest ? `${tidy(latest.status)} · ${formatDate(latest.delivered_at || latest.created_at)}` : "No files have been released yet."}</p>
          </aside>
        </div>
      </section>

      <section className="mx-auto mt-6 grid max-w-[1440px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="border border-[#9ed39f]/24 bg-[#030804] p-5"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#9ed39f]">Total</p><h2 className="mt-3 text-4xl font-black">{rows.length}</h2></article>
        <article className="border border-[#9ed39f]/24 bg-[#030804] p-5"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#9ed39f]">For review</p><h2 className="mt-3 text-4xl font-black">{reviewCount}</h2></article>
        <article className="border border-[#9ed39f]/24 bg-[#030804] p-5"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#9ed39f]">Approved</p><h2 className="mt-3 text-4xl font-black">{approvedCount}</h2></article>
        <article className="border border-[#9ed39f]/24 bg-[#030804] p-5"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#9ed39f]">Final</p><h2 className="mt-3 text-4xl font-black">{finalCount}</h2></article>
      </section>

      <section className="mx-auto mt-6 max-w-[1440px] border border-[#9ed39f]/24 bg-[#020904] p-6 lg:p-8">
        <div className="flex flex-col gap-4 border-b border-[#9ed39f]/20 pb-6 md:flex-row md:items-end md:justify-between">
          <div><p className="inline-flex bg-[#9ed39f] px-3 py-2 text-xs font-black uppercase tracking-[0.22em] text-black">List</p><h2 className="mt-5 text-[clamp(2rem,4vw,4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em]">{rows.length ? "Released files." : "No outputs yet."}</h2></div>
          <Link href="/client/operations" className="inline-flex min-h-12 items-center justify-center border border-[#9ed39f] px-5 text-xs font-black uppercase tracking-[0.18em] text-[#9ed39f] hover:bg-[#9ed39f] hover:text-black">Back to operations</Link>
        </div>
        <div className="mt-8 grid gap-4">
          {rows.length ? rows.map((row) => (
            <article key={row.id} className="grid gap-4 border border-[#9ed39f]/24 bg-black p-5 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9ed39f]">{tidy(row.status)}</p>
                <h3 className="mt-3 break-words text-2xl font-black uppercase tracking-[-0.05em]">{row.title}</h3>
                <p className="mt-2 text-sm leading-7 text-white/68">{row.description || tidy(row.deliverable_type)}</p>
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-white/48">{row.original_filename || `Version ${row.version}`}</p>
              </div>
              <div className="flex flex-col gap-3 text-left text-xs font-bold uppercase tracking-[0.14em] text-white/54 lg:items-end lg:text-right">
                <p>{formatDate(row.delivered_at || row.created_at)}</p>
                {row.storage_bucket && row.storage_path && (
                  <a
                    href={`/api/client/deliverables/${row.id}/download`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-center border border-[#9ed39f] px-4 text-xs font-black uppercase tracking-[0.16em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black"
                  >
                    Open deliverable
                  </a>
                )}
              </div>
            </article>
          )) : <article className="border border-[#9ed39f]/24 bg-black p-6"><h3 className="text-2xl font-black uppercase tracking-[-0.05em]">No outputs attached.</h3><p className="mt-3 text-sm leading-7 text-white/68">Nothing has been released for this workspace yet.</p></article>}
        </div>
      </section>
    </main>
  );
}
