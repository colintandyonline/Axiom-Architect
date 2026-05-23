import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAxiomAdmin } from "../../../../lib/axiom-admin";
import { formatDate, label } from "../../../../lib/axiom-admin-dashboard";
import { AdminSection, AdminShell, StatCard, buttonClass, primaryButtonClass, statusPill } from "../../../../components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Proposal Workspace | Axiom Architect Admin",
  description:
    "Internal Axiom Architect workspace command centre for a single proposal client.",
};

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    workspaceId: string;
  }>;
};

type JsonRecord = Record<string, unknown>;

type WorkspaceRecord = {
  id: string;
  customer_id: string;
  service_request_id: string | null;
  workspace_name: string;
  status: string | null;
  current_phase: string | null;
  current_priority: string | null;
  next_client_action: string | null;
  axiom_review_focus: string | null;
  last_activity_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type ProposalRecord = {
  id: string;
  customer_id: string | null;
  request_type: string | null;
  status: string | null;
  proposal_status: string | null;
  contact_name: string | null;
  email: string | null;
  business_name: string | null;
  role: string | null;
  website: string | null;
  scope_type: string | null;
  support_type: string | null;
  budget_range: string | null;
  timeline: string | null;
  sensitive_data: string | null;
  summary_message: string | null;
  request_payload: JsonRecord | null;
  created_at: string | null;
  updated_at: string | null;
};

type CustomerRecord = {
  id: string;
  email: string | null;
  full_name: string | null;
  business_name: string | null;
  account_status: string | null;
  last_login_at: string | null;
  created_at: string | null;
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
};

type DeliverableRecord = {
  id: string;
  workspace_id: string;
  customer_id: string;
  deliverable_type: string;
  title: string;
  description: string | null;
  status: string | null;
  version: string | null;
  storage_bucket: string | null;
  storage_path: string | null;
  original_filename: string | null;
  mime_type: string | null;
  file_size_bytes: number | null;
  delivered_at: string | null;
  created_at: string | null;
};

type ActivityRecord = {
  id: string;
  workspace_id: string;
  customer_id: string;
  actor_type: string | null;
  actor_label: string | null;
  activity_type: string | null;
  title: string | null;
  body: string | null;
  is_client_visible: boolean | null;
  created_at: string | null;
};

type WorkspacePageData = {
  workspace: WorkspaceRecord | null;
  proposal: ProposalRecord | null;
  customer: CustomerRecord | null;
  documents: DocumentRecord[];
  deliverables: DeliverableRecord[];
  activities: ActivityRecord[];
};

const clientVisibleDeliverableStatuses = new Set(["ready_for_review", "approved", "delivered"]);

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
    console.error("Admin workspace Supabase request failed", path, responseText);
    return null;
  }

  if (!responseText) {
    return [] as T;
  }

  return JSON.parse(responseText) as T;
}

async function getWorkspacePageData(workspaceId: string): Promise<WorkspacePageData> {
  const workspaceRecords = await supabaseFetch<WorkspaceRecord[]>(
    `axiom_client_workspaces?select=id,customer_id,service_request_id,workspace_name,status,current_phase,current_priority,next_client_action,axiom_review_focus,last_activity_at,created_at,updated_at&id=eq.${encodeURIComponent(workspaceId)}&limit=1`,
  );
  const workspace = workspaceRecords?.[0] || null;

  if (!workspace) {
    return {
      workspace: null,
      proposal: null,
      customer: null,
      documents: [],
      deliverables: [],
      activities: [],
    };
  }

  const [proposalRecords, customerRecords, documents, deliverables, activities] = await Promise.all([
    workspace.service_request_id
      ? supabaseFetch<ProposalRecord[]>(
          `axiom_service_requests?select=id,customer_id,request_type,status,proposal_status,contact_name,email,business_name,role,website,scope_type,support_type,budget_range,timeline,sensitive_data,summary_message,request_payload,created_at,updated_at&id=eq.${encodeURIComponent(workspace.service_request_id)}&limit=1`,
        )
      : Promise.resolve([] as ProposalRecord[]),
    supabaseFetch<CustomerRecord[]>(
      `axiom_customers?select=id,email,full_name,business_name,account_status,last_login_at,created_at&id=eq.${encodeURIComponent(workspace.customer_id)}&limit=1`,
    ),
    supabaseFetch<DocumentRecord[]>(
      `axiom_workspace_documents?select=id,workspace_id,customer_id,original_filename,document_category,review_status,title,description,storage_bucket,storage_path,mime_type,file_size_bytes,uploaded_at,reviewed_at&workspace_id=eq.${encodeURIComponent(workspace.id)}&order=uploaded_at.desc&limit=100`,
    ),
    supabaseFetch<DeliverableRecord[]>(
      `axiom_workspace_deliverables?select=id,workspace_id,customer_id,deliverable_type,title,description,status,version,storage_bucket,storage_path,original_filename,mime_type,file_size_bytes,delivered_at,created_at&workspace_id=eq.${encodeURIComponent(workspace.id)}&order=created_at.desc&limit=100`,
    ),
    supabaseFetch<ActivityRecord[]>(
      `axiom_workspace_activity?select=id,workspace_id,customer_id,actor_type,actor_label,activity_type,title,body,is_client_visible,created_at&workspace_id=eq.${encodeURIComponent(workspace.id)}&order=created_at.desc&limit=50`,
    ),
  ]);

  return {
    workspace,
    proposal: proposalRecords?.[0] || null,
    customer: customerRecords?.[0] || null,
    documents: documents || [],
    deliverables: deliverables || [],
    activities: activities || [],
  };
}

function valueFromPayload(payload: JsonRecord | null, key: string) {
  const value = payload?.[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function proposalSummary(proposal: ProposalRecord | null) {
  if (!proposal) {
    return "No proposal request is linked to this workspace.";
  }

  return (
    valueFromPayload(proposal.request_payload, "workflow_summary") ||
    valueFromPayload(proposal.request_payload, "current_problem") ||
    proposal.summary_message ||
    "No workflow summary supplied."
  );
}

function clientName(customer: CustomerRecord | null, proposal: ProposalRecord | null) {
  return (
    proposal?.business_name ||
    customer?.business_name ||
    proposal?.contact_name ||
    customer?.full_name ||
    proposal?.email ||
    customer?.email ||
    "Unknown proposal client"
  );
}

function clientEmail(customer: CustomerRecord | null, proposal: ProposalRecord | null) {
  return proposal?.email || customer?.email || "Email not set";
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

function visibilityLabel(status: string | null) {
  return status && clientVisibleDeliverableStatuses.has(status) ? "client visible" : "internal only";
}

function DetailLine({ labelText, value }: { labelText: string; value: string | null | undefined }) {
  return (
    <p className="text-sm leading-7 text-white/68">
      <strong className="text-[#9ed39f]">{labelText}:</strong> {value || "—"}
    </p>
  );
}

export default async function AdminProposalWorkspacePage({ params }: PageProps) {
  const { adminEmail } = await requireAxiomAdmin();
  const { workspaceId } = await params;
  const data = await getWorkspacePageData(workspaceId);

  if (!data.workspace) {
    notFound();
  }

  const visibleDeliverables = data.deliverables.filter((deliverable) =>
    clientVisibleDeliverableStatuses.has(deliverable.status || ""),
  );
  const internalDeliverables = data.deliverables.length - visibleDeliverables.length;
  const underReviewDocuments = data.documents.filter((document) =>
    ["uploaded", "under_review"].includes(document.review_status || ""),
  ).length;

  return (
    <AdminShell
      adminEmail={adminEmail}
      eyebrow="Client workspace"
      title={clientName(data.customer, data.proposal)}
      intro="Single-client proposal command centre for proposal context, files received, files sent, and activity state."
      activePath="/admin/proposals"
    >
      <section className="bg-[#9ed39f] px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
          <StatCard title="Documents" value={String(data.documents.length)} helper="Client-uploaded files" />
          <StatCard title="Review docs" value={String(underReviewDocuments)} helper="Uploaded or under review" />
          <StatCard title="Deliverables" value={String(data.deliverables.length)} helper="Axiom-created records" />
          <StatCard title="Visible" value={String(visibleDeliverables.length)} helper="Released to client" />
          <StatCard title="Internal" value={String(internalDeliverables)} helper="Hidden from client" />
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-8">
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/proposals" className={buttonClass}>Proposal clients</Link>
            <Link href="/admin/proposals/documents" className={buttonClass}>Files received</Link>
            <Link href="/admin/proposals/deliverables" className={buttonClass}>Sent deliverables</Link>
          </div>

          <section className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
            <AdminSection eyebrow="Proposal brief" title="Workflow context">
              <div className="grid gap-5">
                <div className="border border-[#9ed39f]/18 bg-black/34 p-5">
                  <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">Submitted summary</p>
                  <p className="mt-3 text-sm leading-8 text-white/74">{proposalSummary(data.proposal)}</p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <DetailLine labelText="Contact" value={data.proposal?.contact_name || data.customer?.full_name} />
                  <DetailLine labelText="Email" value={clientEmail(data.customer, data.proposal)} />
                  <DetailLine labelText="Role" value={data.proposal?.role} />
                  <DetailLine labelText="Website" value={data.proposal?.website} />
                  <DetailLine labelText="Scope" value={label(data.proposal?.scope_type)} />
                  <DetailLine labelText="Support" value={label(data.proposal?.support_type)} />
                  <DetailLine labelText="Timeline" value={label(data.proposal?.timeline)} />
                  <DetailLine labelText="Budget" value={label(data.proposal?.budget_range)} />
                  <DetailLine labelText="Sensitive data" value={label(data.proposal?.sensitive_data)} />
                  <DetailLine labelText="Submitted" value={formatDate(data.proposal?.created_at)} />
                </div>
              </div>
            </AdminSection>

            <AdminSection eyebrow="Workspace state" title="Control summary">
              <div className="grid gap-3">
                <div className="flex flex-wrap gap-3">
                  {statusPill(data.workspace.status)}
                  {statusPill(data.workspace.current_phase)}
                  {statusPill(data.proposal?.proposal_status)}
                </div>
                <DetailLine labelText="Workspace" value={data.workspace.workspace_name} />
                <DetailLine labelText="Priority" value={data.workspace.current_priority} />
                <DetailLine labelText="Next client action" value={data.workspace.next_client_action} />
                <DetailLine labelText="Axiom review focus" value={data.workspace.axiom_review_focus} />
                <DetailLine labelText="Last activity" value={formatDate(data.workspace.last_activity_at || data.workspace.updated_at)} />
                <DetailLine labelText="Customer account" value={label(data.customer?.account_status)} />
                <DetailLine labelText="Last login" value={formatDate(data.customer?.last_login_at)} />
              </div>
            </AdminSection>
          </section>

          <AdminSection eyebrow="Files received" title="Client-uploaded documents">
            {data.documents.length > 0 ? (
              <div className="grid gap-4">
                {data.documents.map((document) => (
                  <article key={document.id} className="grid gap-5 border border-[#9ed39f]/18 bg-black/34 p-5 lg:grid-cols-[1fr_auto] lg:items-center">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        {statusPill(document.review_status)}
                        {statusPill(document.document_category)}
                      </div>
                      <h3 className="mt-3 break-words text-xl font-black uppercase tracking-[-0.04em] text-white">
                        {document.title || document.original_filename}
                      </h3>
                      <p className="mt-2 break-words text-xs font-bold uppercase tracking-[0.12em] text-white/44">{document.original_filename}</p>
                      <p className="mt-2 text-sm leading-7 text-white/62">{document.description || "No client description recorded."}</p>
                      <p className="mt-2 text-xs leading-5 text-white/46">{formatDate(document.uploaded_at)} · {formatSize(document.file_size_bytes)} · {document.mime_type || "MIME not recorded"}</p>
                    </div>
                    {document.storage_bucket && document.storage_path ? (
                      <a
                        href={`/api/admin/proposals/documents/${document.id}/download`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={primaryButtonClass}
                      >
                        Open file
                      </a>
                    ) : null}
                  </article>
                ))}
              </div>
            ) : (
              <article className="border border-[#9ed39f]/20 bg-black/36 p-6">
                <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white">No files received yet.</h3>
                <p className="mt-3 text-sm leading-7 text-white/68">Client-uploaded evidence will appear here.</p>
              </article>
            )}
          </AdminSection>

          <AdminSection eyebrow="Files sent" title="Axiom deliverables">
            {data.deliverables.length > 0 ? (
              <div className="grid gap-4">
                {data.deliverables.map((deliverable) => (
                  <article key={deliverable.id} className="grid gap-5 border border-[#9ed39f]/18 bg-black/34 p-5 lg:grid-cols-[1fr_auto] lg:items-center">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        {statusPill(deliverable.status)}
                        {statusPill(visibilityLabel(deliverable.status))}
                        {statusPill(deliverable.deliverable_type)}
                      </div>
                      <h3 className="mt-3 break-words text-xl font-black uppercase tracking-[-0.04em] text-white">{deliverable.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-white/62">{deliverable.description || "No description recorded."}</p>
                      <p className="mt-2 break-words text-xs font-bold uppercase tracking-[0.12em] text-white/44">{deliverable.original_filename || `Version ${deliverable.version || "v1"}`}</p>
                      <p className="mt-2 text-xs leading-5 text-white/46">{formatDate(deliverable.delivered_at || deliverable.created_at)} · {formatSize(deliverable.file_size_bytes)} · {deliverable.mime_type || "MIME not recorded"}</p>
                    </div>
                    <Link href="/admin/proposals/deliverables" className={buttonClass}>Manage</Link>
                  </article>
                ))}
              </div>
            ) : (
              <article className="border border-[#9ed39f]/20 bg-black/36 p-6">
                <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white">No deliverables sent yet.</h3>
                <p className="mt-3 text-sm leading-7 text-white/68">Use Sent deliverables to upload or release files for this workspace.</p>
              </article>
            )}
          </AdminSection>

          <AdminSection eyebrow="Timeline" title="Workspace activity">
            {data.activities.length > 0 ? (
              <div className="grid gap-3">
                {data.activities.map((activity) => (
                  <article key={activity.id} className="border border-[#9ed39f]/16 bg-black/34 p-4">
                    <div className="flex flex-wrap gap-2">
                      {statusPill(activity.activity_type)}
                      {statusPill(activity.actor_type)}
                      {activity.is_client_visible ? statusPill("client visible") : statusPill("internal")}
                    </div>
                    <h3 className="mt-3 text-lg font-black uppercase tracking-[-0.04em] text-white">{activity.title || "Activity"}</h3>
                    <p className="mt-2 text-sm leading-7 text-white/68">{activity.body || "No activity detail recorded."}</p>
                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-white/44">
                      {activity.actor_label || "Axiom"} · {formatDate(activity.created_at)}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <article className="border border-[#9ed39f]/20 bg-black/36 p-6">
                <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white">No activity yet.</h3>
                <p className="mt-3 text-sm leading-7 text-white/68">Workspace activity events will appear here as the client and admin actions build up.</p>
              </article>
            )}
          </AdminSection>
        </div>
      </section>
    </AdminShell>
  );
}
