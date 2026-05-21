import type { Metadata } from "next";
import Link from "next/link";
import { loadClientPortalData } from "../../../lib/axiom-client-portal-data";

export const metadata: Metadata = {
  title: "Documents | Axiom Architect Client Portal",
  description: "Your Axiom Architect documents page for files, document requests, and review status.",
};

export const dynamic = "force-dynamic";

type DocumentsSearchParams = {
  upload?: string;
};

function formatLabel(value: string | null | undefined, fallback = "Not set") {
  if (!value) return fallback;
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
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

function getUploadMessage(status?: string) {
  switch (status) {
    case "success":
      return { title: "Upload received.", text: "Your file has been saved and added to this workspace for review." };
    case "too-large":
      return { title: "File too large.", text: "Uploads are limited to 15MB. Try a smaller file or compressed screenshot." };
    case "type":
      return { title: "File type blocked.", text: "Use an image, PDF, document, spreadsheet, CSV, or plain text file." };
    case "missing-file":
      return { title: "No file selected.", text: "Choose a file before uploading." };
    case "workspace":
      return { title: "Workspace missing.", text: "A workspace is required before files can be uploaded." };
    case "storage":
    case "record":
    case "config":
      return { title: "Upload failed.", text: "The file could not be saved. Check the storage setup and try again." };
    default:
      return null;
  }
}

export default async function ClientPortalDocumentsPage({
  searchParams,
}: {
  searchParams: Promise<DocumentsSearchParams>;
}) {
  const params = await searchParams;
  const uploadMessage = getUploadMessage(params.upload);
  const liveData = await loadClientPortalData("/client/documents");
  const documents = liveData.documents;
  const latestDocument = documents[0];
  const underReviewCount = documents.filter((document) => document.review_status === "under_review").length;
  const needsClarificationCount = documents.filter((document) => document.review_status === "needs_clarification").length;
  const reviewedCount = documents.filter((document) => document.review_status === "reviewed").length;

  const summaryCards = [
    { label: "Files", value: String(documents.length), text: "Attached to this workspace." },
    { label: "Reviewing", value: String(underReviewCount), text: "Currently being checked." },
    { label: "Needs info", value: String(needsClarificationCount), text: "Waiting for more detail." },
    { label: "Complete", value: String(reviewedCount), text: "Already reviewed." },
  ];

  return (
    <main className="bg-black text-white">
      <section className="relative overflow-hidden border-b border-[#9ed39f]/20 bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_34%,#000_78%)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto max-w-[1440px]">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_0.55fr] lg:items-end">
            <div>
              <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">Documents</p>
              <h1 className="mt-6 max-w-5xl text-[clamp(3rem,6vw,6.5rem)] font-black uppercase leading-[0.86] tracking-[-0.08em] text-white">Files.</h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[#e6f6e7]/78 sm:text-lg">Upload screenshots, PDFs, documents, exports, and working examples for this client workspace.</p>
            </div>

            <aside className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5">
              <p className="m-0 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Latest file</p>
              <p className="mt-4 text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-white">{latestDocument?.title || latestDocument?.original_filename || "None yet"}</p>
              <p className="mb-0 mt-3 text-sm leading-7 text-[#e6f6e7]/72">{latestDocument ? `${formatLabel(latestDocument.review_status)} · ${formatDate(latestDocument.uploaded_at)}` : "No files are attached right now."}</p>
            </aside>
          </div>
        </div>
      </section>

      {uploadMessage && (
        <section className="bg-[#9ed39f] px-4 py-5 text-black sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[0.66rem] font-black uppercase tracking-[0.2em]">Upload status</p>
              <h2 className="mt-1 text-2xl font-black uppercase tracking-[-0.04em]">{uploadMessage.title}</h2>
              <p className="mt-1 text-sm font-semibold leading-6 text-black/72">{uploadMessage.text}</p>
            </div>
            <Link href="/client/documents" className="inline-flex min-h-11 items-center justify-center border border-black px-4 text-[0.7rem] font-black uppercase tracking-[0.16em] text-black hover:bg-black hover:text-[#9ed39f]">Clear</Link>
          </div>
        </section>
      )}

      <section className="bg-[#020904] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <article key={card.label} className="rounded-[1.25rem] border border-[#9ed39f]/30 bg-black p-5 shadow-[0_18px_40px_rgba(0,0,0,0.3)]">
              <span className="mb-5 flex h-9 w-9 items-center justify-center border border-[#9ed39f]/60 text-[#9ed39f]">▣</span>
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">{card.label}</p>
              <h2 className="mt-3 text-3xl font-black uppercase leading-tight tracking-[-0.05em] text-white">{card.value}</h2>
              <p className="mt-4 text-sm leading-6 text-[#e6f6e7]/72">{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-black px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="mx-auto grid max-w-[1440px] gap-6 lg:grid-cols-[0.44fr_1fr]">
          <div>
            <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">Upload</p>
            <h2 className="mt-5 text-[clamp(2.1rem,4vw,4.4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">Add a file.</h2>
            <p className="mt-5 text-sm leading-7 text-[#e6f6e7]/72">Accepted: images, PDFs, documents, spreadsheets, CSV, and plain text. Maximum file size: 15MB.</p>
          </div>

          <form action="/api/client/documents/upload" method="post" encType="multipart/form-data" className="grid gap-4 border border-[#9ed39f]/30 bg-[#030804] p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">
                Title
                <input name="title" type="text" placeholder="Screenshot / workflow export / brief" className="min-h-12 border border-[#9ed39f]/30 bg-black px-4 text-sm font-semibold normal-case tracking-normal text-white outline-none focus:border-[#9ed39f]" />
              </label>
              <label className="grid gap-2 text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">
                Category
                <select name="document_category" defaultValue="supporting_material" className="min-h-12 border border-[#9ed39f]/30 bg-black px-4 text-sm font-semibold normal-case tracking-normal text-white outline-none focus:border-[#9ed39f]">
                  <option value="supporting_material">Supporting material</option>
                  <option value="screenshot">Screenshot</option>
                  <option value="process_export">Process export</option>
                  <option value="brief">Brief</option>
                  <option value="example">Example</option>
                </select>
              </label>
            </div>
            <label className="grid gap-2 text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">
              Description
              <textarea name="description" rows={3} placeholder="Optional note about what this file shows" className="border border-[#9ed39f]/30 bg-black px-4 py-3 text-sm font-semibold normal-case tracking-normal text-white outline-none focus:border-[#9ed39f]" />
            </label>
            <label className="grid gap-2 text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">
              File
              <input name="file" type="file" required className="min-h-12 border border-[#9ed39f]/30 bg-black px-4 py-3 text-sm font-semibold normal-case tracking-normal text-white file:mr-4 file:border-0 file:bg-[#9ed39f] file:px-4 file:py-2 file:text-xs file:font-black file:uppercase file:tracking-[0.16em] file:text-black" />
            </label>
            <button type="submit" className="inline-flex min-h-12 w-fit items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-6 text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white">Upload file</button>
          </form>
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-5 border-b border-[#9ed39f]/20 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">File list</p>
              <h2 className="mt-5 text-[clamp(2.1rem,4vw,4.4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">{documents.length > 0 ? "Attached files." : "No files yet."}</h2>
            </div>
            <Link href="/client/operations" className="inline-flex min-h-12 items-center justify-center border border-[#9ed39f] px-5 text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black">Back to operations</Link>
          </div>

          <div className="mt-8 grid gap-4">
            {documents.length > 0 ? (
              documents.map((document) => (
                <article key={document.id} className="grid gap-4 border border-[#9ed39f]/24 bg-[#030804] p-5 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div>
                    <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">{formatLabel(document.review_status)}</p>
                    <h3 className="mt-3 text-2xl font-black uppercase tracking-[-0.05em] text-white">{document.title || document.original_filename}</h3>
                    <p className="mt-2 text-sm leading-7 text-[#e6f6e7]/72">{document.description || formatLabel(document.document_category)}</p>
                  </div>
                  <div className="text-left text-xs font-bold uppercase tracking-[0.14em] text-[#e6f6e7]/58 lg:text-right">
                    <p>{formatDate(document.uploaded_at)}</p>
                    {document.reviewed_at && <p className="mt-2">Reviewed {formatDate(document.reviewed_at)}</p>}
                  </div>
                </article>
              ))
            ) : (
              <article className="border border-[#9ed39f]/24 bg-[#030804] p-6">
                <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white">No files attached.</h3>
                <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72">There are no file requests or uploads for this workspace right now.</p>
              </article>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
