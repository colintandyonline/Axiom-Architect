import type { Metadata } from "next";
import Link from "next/link";
import { requireAxiomAdmin } from "../../../../lib/axiom-admin";
import { formatDate, label } from "../../../../lib/axiom-admin-dashboard";
import { AdminSection, AdminShell, StatCard, buttonClass, primaryButtonClass, statusPill } from "../../../../components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Client Documents | Axiom Architect Admin",
  description:
    "Internal Axiom Architect admin page for reviewing client-uploaded documents and evidence by proposal workspace.",
};

export const dynamic = "force-dynamic";

type ProposalRequestRecord = {
  id: string;
  customer_id: string | null;
  contact_name: string | null;
  email: string | null;
  business_name: string | null;
  scope_type: string | null;
  proposal_status: string | null;
  created_at: string | null;
};

type CustomerRecord = {
  id: string;
  email: string | null;
  full_name: string | null;
  business_name: string | null;
};

type WorkspaceRecord = {
  id: string;
  customer_id: string;
  service_request_id: string | null;
  workspace_name: string;
  status: string | null;
  current_phase: string | null;
  updated_at: string | null;
};

type DocumentRecord = {
  id: string;
  workspace_id: string;
  customer_id: string;
  original_filename: string;
  document_category: string | null;
  review_status: string | null;
  title: string | null;
  description: string | null;
  storage_bucket: string | null;
  storage_path: string | null;
  mime_type: string | null;
  file_size_bytes: number | null;
  uploaded_at: string | null;
  reviewed_at: string | null;
  uploaded_by: string | null;
  upload_source: string | null;
};

type DocumentView = {
  document: DocumentRecord;
  workspace: WorkspaceRecord | null;
  proposal: ProposalRequestRecord | null;
  customer: CustomerRecord | null;
};

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return { url: url.replace(/\/$/, ""), serviceRoleKey };
}

async function supabaseFetch<T>(path: string): Promise<T | null> {
  const config = getSupabaseConfig();

  if (!config) {
    return null;
  }

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    cache: "no-store",
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": "application/json",
    },
  });

  const responseText = await response.text();

  if (!response.ok) {
    console.error("Admin proposal documents Supabase request failed", path, responseText);
    return null;
  }

  if (!responseText) {
    return [] as T;
  }

  return JSON.parse(responseText) as T;
}

async function getDocumentAdminData() {
  const [documents, workspaces, proposals, customers] = await Promise.all([
    supabaseFetch<DocumentRecord[]>(
      "axiom_workspace_documents?select=id,workspace_id,customer_id,original_filename,document_category,review_status,title,description,storage_bucket,storage_path,mime_type,file_size_bytes,uploaded_at,reviewed_at,uploaded_by,upload_source&order=uploaded_at.desc&limit=400",
    ),
    supabaseFetch<WorkspaceRecord[]>(
      "axiom_client_workspaces?select=id,customer_id,service_request_id,workspace_name,status,current_phase,updated_at&order=updated_at.desc&limit=250",
    ),
    supabaseFetch<ProposalRequestRecord[]>(
      "axiom_service_requests?select=id,customer_id,contact_name,email,business_name,scope_type,proposal_status,created_at&source=eq.client_proposal_form&order=created_at.desc&limit=250",
    ),
    supabaseFetch<CustomerRecord[]>(
      "axiom_customers?select=id,email,full_name,business_name&order=created_at.desc&limit=300",
    ),
  ]);

  return {
    documents: documents || [],
    workspaces: workspaces || [],
    proposals: proposals || [],
    customers: customers || [],
  };
}

function clientName(view: DocumentView) {
  return (
    view.proposal?.business_name ||
    view.customer?.business_name ||
    view.proposal?.contact_name ||
    view.customer?.full_name ||
    view.proposal?.email ||
    view.customer?.email ||
    "Unknown client"
  );
}

function formatSize(bytes: number | null) {
  if (!bytes) {
    return "Size not recorded";
  }

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default async function AdminProposalDocumentsPage() {
  const { adminEmail } = await requireAxiomAdmin();
  const data = await getDocumentAdminData();
  const workspacesById = new Map(data.workspaces.map((workspace) => [workspace.id, workspace]));
  const proposalsById = new Map(data.proposals.map((proposal) => [proposal.id, proposal]));
  const customersById = new Map(data.customers.map((customer) => [customer.id, customer]));

  const views: DocumentView[] = data.documents.map((document) => {
    const workspace = workspacesById.get(document.workspace_id) || null;
    const proposal = workspace?.service_request_id ? proposalsById.get(workspace.service_request_id) || null : null;
    const customer = customersById.get(document.customer_id) || null;

    return { document, workspace, proposal, customer };
  });

  const uniqueClients = new Set(views.map((view) => view.document.customer_id));
  const underReview = views.filter((view) => view.document.review_status === "under_review" || view.document.review_status === "uploaded").length;
  const needsInfo = views.filter((view) => view.document.review_status === "needs_clarification").length;

  return (
    <AdminShell
      adminEmail={adminEmail}
      eyebrow="Client documents"
      title="Evidence and uploaded files."
      intro="This admin-only page shows which proposal clients have uploaded evidence, screenshots, documents, and supporting files. It replaces the old client-portal shortcut links."
      activePath="/admin/proposals/documents"
    >
      <section className="bg-[#9ed39f] px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-5 md:grid-cols-4">
          <StatCard title="Files" value={String(views.length)} helper="Client-uploaded records" />
          <StatCard title="Clients" value={String(uniqueClients.size)} helper="Clients with uploaded files" />
          <StatCard title="Review" value={String(underReview)} helper="Uploaded or under review" />
          <StatCard title="Needs info" value={String(needsInfo)} helper="Marked for clarification" />
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-8">
          <AdminSection eyebrow="Document control" title="Uploaded documents by client">
            <div className="mb-6 flex flex-wrap gap-3">
              <Link href="/admin/proposals" className={buttonClass}>Proposal clients</Link>
              <Link href="/admin/proposals/deliverables" className={buttonClass}>Sent deliverables</Link>
            </div>

            {views.length > 0 ? (
              <div className="grid gap-4">
                {views.map((view) => (
                  <article key={view.document.id} className="grid gap-5 border border-[#9ed39f]/20 bg-black/36 p-5 xl:grid-cols-[0.82fr_1.18fr]">
                    <div>
                      <div className="flex flex-wrap gap-3">
                        {statusPill(view.document.review_status)}
                        {statusPill(view.document.document_category)}
                      </div>
                      <h3 className="mt-4 break-words text-2xl font-black uppercase leading-tight tracking-[-0.05em] text-white">
                        {view.document.title || view.document.original_filename}
                      </h3>
                      <p className="mt-2 break-words text-xs font-bold uppercase tracking-[0.14em] text-white/44">
                        {view.document.original_filename}
                      </p>
                      <p className="mt-4 text-sm leading-7 text-white/68">
                        {view.document.description || "No client description recorded."}
                      </p>
                      {view.document.storage_bucket && view.document.storage_path ? (
                        <a
                          href={`/api/admin/proposals/documents/${view.document.id}/download`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${primaryButtonClass} mt-5`}
                        >
                          Open file
                        </a>
                      ) : null}
                    </div>

                    <aside className="border border-[#9ed39f]/18 bg-[#030804] p-5 text-sm leading-7 text-white/68">
                      <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">Admin context</p>
                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <p><strong className="text-[#9ed39f]">Client:</strong> {clientName(view)}</p>
                        <p><strong className="text-[#9ed39f]">Email:</strong> {view.proposal?.email || view.customer?.email || "—"}</p>
                        <p><strong className="text-[#9ed39f]">Workspace:</strong> {view.workspace?.workspace_name || "Workspace not found"}</p>
                        <p><strong className="text-[#9ed39f]">Phase:</strong> {label(view.workspace?.current_phase)}</p>
                        <p><strong className="text-[#9ed39f]">Uploaded:</strong> {formatDate(view.document.uploaded_at)}</p>
                        <p><strong className="text-[#9ed39f]">Size:</strong> {formatSize(view.document.file_size_bytes)}</p>
                        <p><strong className="text-[#9ed39f]">MIME:</strong> {view.document.mime_type || "—"}</p>
                        <p><strong className="text-[#9ed39f]">Source:</strong> {label(view.document.upload_source || view.document.uploaded_by)}</p>
                      </div>
                      <p className="mt-4 break-words border border-[#9ed39f]/14 bg-black/36 p-3 text-xs leading-6 text-white/48">
                        {view.document.storage_bucket || "No bucket"} / {view.document.storage_path || "No storage path"}
                      </p>
                    </aside>
                  </article>
                ))}
              </div>
            ) : (
              <article className="border border-[#9ed39f]/20 bg-black/36 p-6">
                <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white">No client documents yet.</h3>
                <p className="mt-3 text-sm leading-7 text-white/68">Uploaded client evidence and supporting files will appear here.</p>
              </article>
            )}
          </AdminSection>
        </div>
      </section>
    </AdminShell>
  );
}
