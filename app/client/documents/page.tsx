import type { Metadata } from "next";
import Link from "next/link";
import { loadClientPortalData } from "../../../lib/axiom-client-portal-data";

export const metadata: Metadata = {
  title: "Documents | Axiom Architect Client Portal",
  description:
    "Your Axiom Architect documents page for files, examples, evidence, document requests, and review status.",
};

export const dynamic = "force-dynamic";

function formatLabel(value: string | null | undefined, fallback = "Not set") {
  if (!value) {
    return fallback;
  }

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "Not recorded";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatFileSize(value: number | null | undefined) {
  if (!value) {
    return "Size not shown";
  }

  if (value < 1024 * 1024) {
    return `${Math.round(value / 1024)} KB`;
  }

  return `${(value / 1024 / 1024).toFixed(1)} MB`;
}

export default async function ClientPortalDocumentsPage() {
  const liveData = await loadClientPortalData("/client/documents");
  const documents = liveData.documents;
  const latestDocument = documents[0];
  const underReviewCount = documents.filter((document) => document.review_status === "under_review").length;
  const needsClarificationCount = documents.filter((document) => document.review_status === "needs_clarification").length;
  const reviewedCount = documents.filter((document) => document.review_status === "reviewed").length;

  const summaryCards = [
    {
      label: "Files",
      value: String(documents.length),
      text: documents.length === 1 ? "One file is attached to this workspace." : "Files attached to this workspace.",
    },
    {
      label: "Under review",
      value: String(underReviewCount),
      text: "Files currently being checked by Axiom.",
    },
    {
      label: "Clarification",
      value: String(needsClarificationCount),
      text: "Files that need more context or a replacement.",
    },
    {
      label: "Reviewed",
      value: String(reviewedCount),
      text: "Files that have already been checked.",
    },
  ];

  const helpfulFiles = [
    {
      label: "Process",
      title: "Current steps",
      text: "Checklists, process notes, handoff steps, or standard ways of working.",
    },
    {
      label: "Screens",
      title: "Tool examples",
      text: "Screenshots or exports showing forms, queues, dashboards, or repeated manual tasks.",
    },
    {
      label: "Samples",
      title: "Real examples",
      text: "Redacted examples of common requests, exceptions, approvals, or failure points.",
    },
    {
      label: "Rules",
      title: "Requirements",
      text: "Policies, limits, approval rules, or compliance points that shape the work.",
    },
  ];

  return (
    <main className="bg-black text-white">
      <section className="relative overflow-hidden border-b border-[#9ed39f]/20 bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_34%,#000_78%)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto max-w-[1440px]">
          <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
            Documents
          </p>

          <div className="mt-6 grid gap-8 lg:grid-cols-[0.95fr_0.55fr] lg:items-end">
            <div>
              <h1 className="max-w-5xl text-[clamp(3rem,6vw,6.5rem)] font-black uppercase leading-[0.86] tracking-[-0.08em] text-white">
                Files and context.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[#e6f6e7]/78 sm:text-lg">
                Keep useful material in one place: screenshots, notes, examples, exports, and anything Axiom needs to understand the workflow clearly.
              </p>
            </div>

            <aside className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5">
              <p className="m-0 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">
                Latest file
              </p>
              <p className="mt-4 text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-white">
                {latestDocument?.title || latestDocument?.original_filename || "None yet"}
              </p>
              <p className="mb-0 mt-3 text-sm leading-7 text-[#e6f6e7]/72">
                {latestDocument ? `${formatLabel(latestDocument.review_status)} · ${formatDate(latestDocument.uploaded_at)}` : "File requests and uploads will appear here."}
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-[#9ed39f] px-4 py-12 text-black sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-6 lg:grid-cols-[0.42fr_1fr] lg:items-end">
          <div>
            <p className="inline-flex border border-black bg-black px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-[#9ed39f]">
              Files
            </p>
            <h2 className="mt-5 text-[clamp(2.1rem,4vw,4.4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-black">
              {documents.length > 0 ? `${documents.length} attached` : "Nothing requested yet."}
            </h2>
          </div>
          <p className="max-w-4xl text-base leading-8 text-black/76 sm:text-lg">
            {documents.length > 0
              ? "Review the files below and check whether anything needs clarification."
              : "When Axiom needs a file or example, it will appear here with a clear purpose and status."}
          </p>
        </div>
      </section>

      <section className="bg-[#020904] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <article key={card.label} className="rounded-[1.25rem] border border-[#9ed39f]/30 bg-black p-5 shadow-[0_18px_40px_rgba(0,0,0,0.3)]">
              <span className="mb-5 block h-2 w-2 bg-[#9ed39f]" />
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">{card.label}</p>
              <h2 className="mt-3 text-2xl font-black uppercase leading-tight tracking-[-0.05em] text-white">{card.value}</h2>
              <p className="mt-4 text-sm leading-6 text-[#e6f6e7]/72">{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-8 lg:grid-cols-[0.42fr_1fr] lg:items-end">
            <div>
              <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
                Attached files
              </p>
              <h2 className="mt-5 text-[clamp(2.1rem,4vw,4.4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">
                Workspace material.
              </h2>
            </div>
            <p className="max-w-3xl text-base leading-8 text-[#e6f6e7]/75 sm:text-lg">
              Files shown here are connected to the engagement and reviewed as part of the work.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {documents.length > 0 ? (
              documents.map((document) => (
                <article key={document.id} className="border border-[#9ed39f]/24 bg-[#030804] p-5">
                  <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">
                    {formatLabel(document.review_status)}
                  </p>
                  <h3 className="mt-4 text-2xl font-black uppercase tracking-[-0.05em] text-white">
                    {document.title || document.original_filename}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72">
                    {document.description || formatLabel(document.document_category)}
                  </p>
                  <div className="mt-5 grid gap-2 border-t border-[#9ed39f]/16 pt-4 text-xs font-bold uppercase tracking-[0.14em] text-[#e6f6e7]/58">
                    <span>{formatDate(document.uploaded_at)}</span>
                    <span>{formatFileSize(undefined)}</span>
                  </div>
                </article>
              ))
            ) : (
              <article className="border border-[#9ed39f]/24 bg-[#030804] p-5 lg:col-span-3">
                <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white">No files yet.</h3>
                <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72">
                  You do not need to upload anything unless Axiom asks for it. File requests will appear here when needed.
                </p>
              </article>
            )}
          </div>
        </div>
      </section>

      <section className="bg-[#020904] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-8 lg:grid-cols-[0.42fr_1fr] lg:items-end">
            <div>
              <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
                Helpful context
              </p>
              <h2 className="mt-5 text-[clamp(2.1rem,4vw,4.4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">
                What helps.
              </h2>
            </div>
            <p className="max-w-3xl text-base leading-8 text-[#e6f6e7]/75 sm:text-lg">
              Strong examples make the proposal and any later work more accurate. Keep them redacted and relevant.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {helpfulFiles.map((item) => (
              <article key={item.title} className="border border-[#9ed39f]/24 bg-black p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">{item.label}</span>
                  <span className="h-2 w-2 bg-[#9ed39f]" />
                </div>
                <h3 className="mt-4 text-2xl font-black uppercase leading-tight tracking-[-0.05em] text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[0.42fr_1fr]">
          <div>
            <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
              Privacy
            </p>
            <h2 className="mt-5 text-[clamp(2.1rem,4vw,4.4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">
              Share carefully.
            </h2>
          </div>

          <div className="grid gap-3">
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-[#030804] p-4 md:grid-cols-[0.28fr_1fr] md:items-center">
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Never</p>
              <p className="text-sm font-semibold leading-7 text-white md:text-base">Passwords, private keys, recovery phrases, card numbers, or access tokens.</p>
            </div>
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-[#030804] p-4 md:grid-cols-[0.28fr_1fr] md:items-center">
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Redact</p>
              <p className="text-sm font-semibold leading-7 text-white md:text-base">Names, customer details, internal IDs, personal data, and anything not needed for the work.</p>
            </div>
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-[#030804] p-4 md:grid-cols-[0.28fr_1fr] md:items-center">
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Share</p>
              <p className="text-sm font-semibold leading-7 text-white md:text-base">Only the material that explains the workflow, issue, decision, or repeated task.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#020904] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-8 lg:grid-cols-[0.42fr_1fr] lg:items-end">
            <div>
              <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
                Next
              </p>
              <h2 className="mt-5 text-[clamp(2.1rem,4vw,4.4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">
                Useful links.
              </h2>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <Link href="/client" className="group border border-[#9ed39f]/24 bg-black p-5 transition hover:border-[#9ed39f] hover:bg-[#9ed39f]">
              <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white group-hover:text-black">Overview</h3>
              <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72 group-hover:text-black/72">Return to the workspace summary.</p>
            </Link>
            <Link href="/client/operations" className="group border border-[#9ed39f]/24 bg-black p-5 transition hover:border-[#9ed39f] hover:bg-[#9ed39f]">
              <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white group-hover:text-black">Operations</h3>
              <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72 group-hover:text-black/72">Check the working plan.</p>
            </Link>
            <Link href="/client/deliverables" className="group border border-[#9ed39f]/24 bg-black p-5 transition hover:border-[#9ed39f] hover:bg-[#9ed39f]">
              <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white group-hover:text-black">Deliverables</h3>
              <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72 group-hover:text-black/72">See where outputs will appear.</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
