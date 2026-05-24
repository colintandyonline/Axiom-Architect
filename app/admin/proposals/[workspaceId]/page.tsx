import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAxiomAdmin } from "../../../../lib/axiom-admin";
import { formatDate, label } from "../../../../lib/axiom-admin-dashboard";
import { AdminSection, AdminShell, StatCard, buttonClass, primaryButtonClass, statusPill } from "../../../../components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Client Workspace | Axiom Architect Admin",
  description: "Internal Axiom Architect workspace command centre for a single client.",
};

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ workspaceId: string }>; searchParams?: Promise<{ note?: string | string[]; workspace?: string | string[]; clientUpdate?: string | string[] }> };
type JsonRecord = Record<string, unknown>;

type WorkspaceRecord = {
  id: string;
  customer_id: string;
  service_request_id: string | null;
  order_id: string | null;
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

type OrderRecord = {
  id: string;
  customer_id: string | null;
  tier_slug: string | null;
  service_name: string | null;
  status: string | null;
  payment_status: string | null;
  amount_total: number | null;
  currency: string | null;
  created_at: string | null;
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
  order: OrderRecord | null;
  customer: CustomerRecord | null;
  documents: DocumentRecord[];
  deliverables: DeliverableRecord[];
  activities: ActivityRecord[];
};

const clientVisibleDeliverableStatuses = new Set(["ready_for_review", "approved", "delivered"]);

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && serviceRoleKey ? { url: url.replace(/\/$/, ""), serviceRoleKey } : null;
}

async function supabaseFetch<T>(path: string): Promise<T | null> {
  const config = getSupabaseConfig();
  if (!config) return null;

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

  return responseText ? (JSON.parse(responseText) as T) : ([] as T);
}

async function getWorkspacePageData(workspaceId: string): Promise<WorkspacePageData> {
  const workspaceRecords = await supabaseFetch<WorkspaceRecord[]>(
    `axiom_client_workspaces?select=id,customer_id,service_request_id,order_id,workspace_name,status,current_phase,current_priority,next_client_action,axiom_review_focus,last_activity_at,created_at,updated_at&id=eq.${encodeURIComponent(workspaceId)}&limit=1`,
  );
  const workspace = workspaceRecords?.[0] || null;

  if (!workspace) return { workspace: null, proposal: null, order: null, customer: null, documents: [], deliverables: [], activities: [] };

  const [proposalRecords, orderRecords, customerRecords, documents, deliverables, activities] = await Promise.all([
    workspace.service_request_id
      ? supabaseFetch<ProposalRecord[]>(
          `axiom_service_requests?select=id,customer_id,request_type,status,proposal_status,contact_name,email,business_name,role,website,scope_type,support_type,budget_range,timeline,sensitive_data,summary_message,request_payload,created_at,updated_at&id=eq.${encodeURIComponent(workspace.service_request_id)}&limit=1`,
        )
      : Promise.resolve([] as ProposalRecord[]),
    workspace.order_id
      ? supabaseFetch<OrderRecord[]>(
          `axiom_orders?select=id,customer_id,tier_slug,service_name,status,payment_status,amount_total,currency,created_at&id=eq.${encodeURIComponent(workspace.order_id)}&limit=1`,
        )
      : Promise.resolve([] as OrderRecord[]),
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
    order: orderRecords?.[0] || null,
    customer: customerRecords?.[0] || null,
    documents: documents || [],
    deliverables: deliverables || [],
    activities: activities || [],
  };
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function noteMessage(status?: string) {
  switch (status) {
    case "saved": return { eyebrow: "Internal note", title: "Internal note saved.", text: "The note was added to the admin-only workspace timeline." };
    case "missing": return { eyebrow: "Internal note", title: "Note missing.", text: "Write a note before saving it." };
    case "workspace": return { eyebrow: "Internal note", title: "Workspace not found.", text: "The internal note could not be attached to this workspace." };
    default: return null;
  }
}

function workspaceMessage(status?: string) {
  switch (status) {
    case "saved": return { eyebrow: "Workspace controls", title: "Workspace updated.", text: "The workspace state was saved and an internal timeline event was recorded." };
    case "invalid": return { eyebrow: "Workspace controls", title: "Update blocked.", text: "The selected workspace status or phase is not allowed." };
    case "failed": return { eyebrow: "Workspace controls", title: "Update failed.", text: "The workspace state could not be saved." };
    case "workspace": return { eyebrow: "Workspace controls", title: "Workspace not found.", text: "The workspace could not be updated." };
    default: return null;
  }
}

function clientUpdateMessage(status?: string) {
  switch (status) {
    case "sent": return { eyebrow: "Client update", title: "Client update sent.", text: "The update was added to the client portal and the visible workspace timeline." };
    case "missing": return { eyebrow: "Client update", title: "Update missing.", text: "Write a client update before sending it." };
    case "workspace": return { eyebrow: "Client update", title: "Workspace not found.", text: "The update could not be attached to this workspace." };
    default: return null;
  }
}

function valueFromPayload(payload: JsonRecord | null, key: string) {
  const value = payload?.[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function workspaceRouteLabel(proposal: ProposalRecord | null, order: OrderRecord | null) {
  if (proposal) return "Proposal workspace";
  if (order) return "Package workspace";
  return "Client workspace";
}

function workspaceSummary(proposal: ProposalRecord | null, order: OrderRecord | null) {
  if (proposal) {
    return valueFromPayload(proposal.request_payload, "workflow_summary") || valueFromPayload(proposal.request_payload, "current_problem") || proposal.summary_message || "No workflow summary supplied.";
  }

  if (order) {
    return `${order.service_name || label(order.tier_slug)} was purchased through checkout. Use this workspace to manage intake, updates, deliverables, and client-visible handoff files.`;
  }

  return "No proposal request or package order is linked to this workspace.";
}

function clientName(customer: CustomerRecord | null, proposal: ProposalRecord | null) {
  return proposal?.business_name || customer?.business_name || proposal?.contact_name || customer?.full_name || proposal?.email || customer?.email || "Unknown client";
}

function clientEmail(customer: CustomerRecord | null, proposal: ProposalRecord | null) {
  return proposal?.email || customer?.email || "Email not set";
}

function formatSize(bytes: number | null) {
  if (!bytes) return "Size not recorded";
  return bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function formatMoney(amount: number | null, currency: string | null) {
  if (amount === null || amount === undefined) return "Not recorded";

  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency || "gbp",
  }).format(amount / 100);
}

function visibilityLabel(status: string | null) {
  return status && clientVisibleDeliverableStatuses.has(status) ? "client visible" : "internal only";
}

function activityTypeLabel(type: string | null | undefined) {
  switch (type) {
    case "proposal_submitted": return "Proposal submitted";
    case "package_workspace_created": return "Package workspace opened";
    case "document_uploaded": return "Document uploaded";
    case "document_status_updated": return "Document review update";
    case "deliverable_released": return "Deliverable released";
    case "deliverable_status_updated": return "Deliverable status update";
    case "internal_note": return "Internal admin note";
    case "workspace_status_updated": return "Workspace status update";
    case "client_update_sent": return "Client update sent";
    default: return label(type) === "Not set" ? "Workspace activity" : label(type);
  }
}

function activityLaneLabel(activity: ActivityRecord) {
  if (activity.activity_type === "client_update_sent") return "Client update";
  if (activity.activity_type === "internal_note") return "Admin note";
  if (activity.activity_type === "workspace_status_updated") return "Admin control";
  if (activity.actor_type === "client") return "Client action";
  if (activity.actor_type === "axiom") return "Axiom action";
  return "System event";
}

function activityVisibilityLabel(activity: ActivityRecord) {
  return activity.is_client_visible ? "Client-visible" : "Internal only";
}

function activityGroupLabel(activity: ActivityRecord) {
  switch (activity.activity_type) {
    case "proposal_submitted": return "Intake";
    case "package_workspace_created": return "Checkout";
    case "document_uploaded":
    case "document_status_updated": return "Evidence";
    case "deliverable_released":
    case "deliverable_status_updated": return "Delivery";
    case "internal_note": return "Internal";
    case "workspace_status_updated": return "Control";
    case "client_update_sent": return "Client update";
    default: return "Operations";
  }
}

function activityDisplayTitle(activity: ActivityRecord) {
  return activity.title || activityTypeLabel(activity.activity_type);
}

function DetailLine({ labelText, value }: { labelText: string; value: string | null | undefined }) {
  return <p className="text-sm leading-7 text-white/68"><strong className="text-[#9ed39f]">{labelText}:</strong> {value || "—"}</p>;
}

function DocumentStatusForm({ documentId, workspaceId, reviewStatus, labelText, primary = false }: { documentId: string; workspaceId: string; reviewStatus: string; labelText: string; primary?: boolean }) {
  return (
    <form action="/api/admin/proposals/documents/status" method="post">
      <input type="hidden" name="document_id" value={documentId} />
      <input type="hidden" name="review_status" value={reviewStatus} />
      <input type="hidden" name="return_to" value={`/admin/proposals/${workspaceId}`} />
      <button type="submit" className={primary ? primaryButtonClass : buttonClass}>{labelText}</button>
    </form>
  );
}

function DocumentReviewControls({ document, workspaceId }: { document: DocumentRecord; workspaceId: string }) {
  const status = document.review_status || "under_review";
  return (
    <div className="mt-4 flex flex-wrap gap-3">
      {status !== "reviewed" ? <DocumentStatusForm documentId={document.id} workspaceId={workspaceId} reviewStatus="reviewed" labelText="Mark reviewed" primary /> : null}
      {status !== "needs_clarification" ? <DocumentStatusForm documentId={document.id} workspaceId={workspaceId} reviewStatus="needs_clarification" labelText="Needs clarification" /> : null}
      {status !== "under_review" ? <DocumentStatusForm documentId={document.id} workspaceId={workspaceId} reviewStatus="under_review" labelText="Back to review" /> : null}
      {status !== "archived" ? <DocumentStatusForm documentId={document.id} workspaceId={workspaceId} reviewStatus="archived" labelText="Archive" /> : null}
    </div>
  );
}

function WorkspaceStatusForm({ workspace }: { workspace: WorkspaceRecord }) {
  return (
    <form action="/api/admin/proposals/workspace" method="post" className="grid gap-4 border border-[#9ed39f]/18 bg-black/34 p-5">
      <input type="hidden" name="workspace_id" value={workspace.id} />
      <input type="hidden" name="return_to" value={`/admin/proposals/${workspace.id}`} />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">Workspace status<select name="status" defaultValue={workspace.status || "active"} className="min-h-11 border border-[#9ed39f]/30 bg-black px-3 text-sm font-semibold normal-case tracking-normal text-white outline-none focus:border-[#9ed39f]"><option value="active">Active</option><option value="paused">Paused</option><option value="waiting_on_client">Waiting on client</option><option value="in_review">In review</option><option value="completed">Completed</option><option value="closed">Closed</option></select></label>
        <label className="grid gap-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">Current phase<select name="current_phase" defaultValue={workspace.current_phase || "discovery"} className="min-h-11 border border-[#9ed39f]/30 bg-black px-3 text-sm font-semibold normal-case tracking-normal text-white outline-none focus:border-[#9ed39f]"><option value="discovery">Discovery</option><option value="workflow_mapping">Workflow mapping</option><option value="architecture_design">Architecture design</option><option value="implementation_blueprint">Implementation blueprint</option><option value="review_and_approval">Review and approval</option><option value="handoff">Handoff</option><option value="retainer">Retainer</option></select></label>
      </div>
      <label className="grid gap-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">Current priority<input name="current_priority" type="text" defaultValue={workspace.current_priority || ""} placeholder="Proposal review, document review, delivery follow-up..." className="min-h-11 border border-[#9ed39f]/30 bg-black px-3 text-sm font-semibold normal-case tracking-normal text-white outline-none placeholder:text-white/30 focus:border-[#9ed39f]" /></label>
      <label className="grid gap-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">Next client action<textarea name="next_client_action" rows={3} defaultValue={workspace.next_client_action || ""} placeholder="What the client needs to do next..." className="min-h-24 border border-[#9ed39f]/30 bg-black px-3 py-3 text-sm font-semibold normal-case tracking-normal text-white outline-none placeholder:text-white/30 focus:border-[#9ed39f]" /></label>
      <label className="grid gap-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">Axiom review focus<textarea name="axiom_review_focus" rows={3} defaultValue={workspace.axiom_review_focus || ""} placeholder="What Axiom should review or prepare next..." className="min-h-24 border border-[#9ed39f]/30 bg-black px-3 py-3 text-sm font-semibold normal-case tracking-normal text-white outline-none placeholder:text-white/30 focus:border-[#9ed39f]" /></label>
      <button type="submit" className={primaryButtonClass}>Save workspace state</button>
    </form>
  );
}

function ClientUpdateForm({ workspaceId }: { workspaceId: string }) {
  return (
    <form action="/api/admin/proposals/client-update" method="post" className="grid gap-4 border border-[#9ed39f]/18 bg-black/34 p-5">
      <input type="hidden" name="workspace_id" value={workspaceId} />
      <input type="hidden" name="return_to" value={`/admin/proposals/${workspaceId}`} />
      <label className="grid gap-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">Subject<input name="subject" type="text" defaultValue="Workspace update" className="min-h-11 border border-[#9ed39f]/30 bg-black px-3 text-sm font-semibold normal-case tracking-normal text-white outline-none placeholder:text-white/30 focus:border-[#9ed39f]" /></label>
      <label className="grid gap-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">Client-visible update<textarea name="update_text" rows={5} required placeholder="Write a clear update the client should see in their portal..." className="min-h-32 border border-[#9ed39f]/30 bg-black px-3 py-3 text-sm font-semibold normal-case tracking-normal text-white outline-none placeholder:text-white/30 focus:border-[#9ed39f]" /></label>
      <button type="submit" className={primaryButtonClass}>Send client update</button>
    </form>
  );
}

function InternalNoteForm({ workspaceId }: { workspaceId: string }) {
  return (
    <form action="/api/admin/proposals/notes" method="post" className="grid gap-4 border border-[#9ed39f]/18 bg-black/34 p-5">
      <input type="hidden" name="workspace_id" value={workspaceId} />
      <input type="hidden" name="return_to" value={`/admin/proposals/${workspaceId}`} />
      <div className="grid gap-4 md:grid-cols-[0.28fr_0.72fr]">
        <label className="grid gap-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">Note type<select name="note_type" defaultValue="general_note" className="min-h-11 border border-[#9ed39f]/30 bg-black px-3 text-sm font-semibold normal-case tracking-normal text-white outline-none focus:border-[#9ed39f]"><option value="general_note">General note</option><option value="risk_note">Risk note</option><option value="follow_up">Follow-up</option><option value="pricing_note">Pricing note</option><option value="implementation_idea">Implementation idea</option></select></label>
        <label className="grid gap-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">Internal note<textarea name="note" rows={4} required placeholder="Add an internal admin-only note for this workspace..." className="min-h-28 border border-[#9ed39f]/30 bg-black px-3 py-3 text-sm font-semibold normal-case tracking-normal text-white outline-none placeholder:text-white/30 focus:border-[#9ed39f]" /></label>
      </div>
      <button type="submit" className={primaryButtonClass}>Save internal note</button>
    </form>
  );
}

function ActivityCard({ activity }: { activity: ActivityRecord }) {
  return (
    <article className="grid gap-4 border border-[#9ed39f]/16 bg-black/34 p-4 md:grid-cols-[0.22fr_0.78fr]">
      <div><p className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">{activityGroupLabel(activity)}</p><p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-white/46">{formatDate(activity.created_at)}</p></div>
      <div><div className="flex flex-wrap gap-2">{statusPill(activityLaneLabel(activity))}{statusPill(activityVisibilityLabel(activity))}{statusPill(activityTypeLabel(activity.activity_type))}</div><h3 className="mt-3 text-lg font-black uppercase tracking-[-0.04em] text-white">{activityDisplayTitle(activity)}</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-white/68">{activity.body || "No activity detail recorded."}</p><p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-white/44">{activity.actor_label || "Axiom Architect"}</p></div>
    </article>
  );
}

export default async function AdminProposalWorkspacePage({ params, searchParams }: PageProps) {
  const { adminEmail } = await requireAxiomAdmin();
  const { workspaceId } = await params;
  const query = searchParams ? await searchParams : {};
  const notice = noteMessage(firstParam(query.note)) || workspaceMessage(firstParam(query.workspace)) || clientUpdateMessage(firstParam(query.clientUpdate));
  const data = await getWorkspacePageData(workspaceId);

  if (!data.workspace) notFound();

  const visibleDeliverables = data.deliverables.filter((deliverable) => clientVisibleDeliverableStatuses.has(deliverable.status || ""));
  const internalDeliverables = data.deliverables.length - visibleDeliverables.length;
  const underReviewDocuments = data.documents.filter((document) => ["uploaded", "under_review"].includes(document.review_status || "")).length;
  const latestActivity = data.activities[0] || null;
  const clientVisibleActivityCount = data.activities.filter((activity) => activity.is_client_visible).length;
  const internalActivityCount = data.activities.length - clientVisibleActivityCount;
  const routeLabel = workspaceRouteLabel(data.proposal, data.order);

  return (
    <AdminShell adminEmail={adminEmail} eyebrow="Client workspace" title={clientName(data.customer, data.proposal)} intro="Single-client command centre for intake context, files received, files sent, client updates, notes, and activity state." activePath="/admin/proposals">
      {notice ? <section className="bg-[#9ed39f] px-4 py-5 text-black sm:px-6 lg:px-8"><div className="mx-auto flex max-w-[1440px] flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><p className="text-[0.66rem] font-black uppercase tracking-[0.2em]">{notice.eyebrow}</p><h2 className="mt-1 text-2xl font-black uppercase tracking-[-0.04em]">{notice.title}</h2><p className="mt-1 text-sm font-semibold leading-6 text-black/72">{notice.text}</p></div><Link href={`/admin/proposals/${data.workspace.id}`} className="inline-flex min-h-11 items-center justify-center border border-black px-4 text-[0.7rem] font-black uppercase tracking-[0.16em] text-black hover:bg-black hover:text-[#9ed39f]">Clear</Link></div></section> : null}

      <section className="bg-[#9ed39f] px-4 py-14 text-white sm:px-6 lg:px-8"><div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5"><StatCard title="Documents" value={String(data.documents.length)} helper="Client-uploaded files" /><StatCard title="Review docs" value={String(underReviewDocuments)} helper="Uploaded or under review" /><StatCard title="Deliverables" value={String(data.deliverables.length)} helper="Axiom-created records" /><StatCard title="Visible" value={String(visibleDeliverables.length)} helper="Released to client" /><StatCard title="Internal" value={String(internalDeliverables)} helper="Hidden from client" /></div></section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24"><div className="mx-auto grid max-w-[1440px] gap-8">
        <div className="flex flex-wrap gap-3"><Link href="/admin/proposals" className={buttonClass}>Proposal clients</Link><Link href="/admin/proposals/documents" className={buttonClass}>Files received</Link><Link href="/admin/proposals/deliverables" className={buttonClass}>Sent deliverables</Link></div>

        <section className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]"><AdminSection eyebrow={routeLabel} title="Workspace context"><div className="grid gap-5"><div className="border border-[#9ed39f]/18 bg-black/34 p-5"><p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">Current brief</p><p className="mt-3 text-sm leading-8 text-white/74">{workspaceSummary(data.proposal, data.order)}</p></div><div className="grid gap-3 md:grid-cols-2"><DetailLine labelText="Contact" value={data.proposal?.contact_name || data.customer?.full_name} /><DetailLine labelText="Email" value={clientEmail(data.customer, data.proposal)} /><DetailLine labelText="Route" value={routeLabel} /><DetailLine labelText="Service" value={data.order?.service_name || label(data.proposal?.scope_type)} /><DetailLine labelText="Scope" value={label(data.proposal?.scope_type || data.order?.tier_slug)} /><DetailLine labelText="Support" value={label(data.proposal?.support_type)} /><DetailLine labelText="Timeline" value={label(data.proposal?.timeline)} /><DetailLine labelText="Budget" value={label(data.proposal?.budget_range)} /><DetailLine labelText="Payment" value={data.order ? `${label(data.order.payment_status)} · ${formatMoney(data.order.amount_total, data.order.currency)}` : "—"} /><DetailLine labelText="Sensitive data" value={label(data.proposal?.sensitive_data)} /><DetailLine labelText="Created" value={formatDate(data.proposal?.created_at || data.order?.created_at || data.workspace.created_at)} /></div></div></AdminSection><AdminSection eyebrow="Workspace state" title="Control summary"><div className="grid gap-3"><div className="flex flex-wrap gap-3">{statusPill(data.workspace.status)}{statusPill(data.workspace.current_phase)}{statusPill(data.proposal?.proposal_status || data.order?.status || data.order?.payment_status)}{statusPill(routeLabel)}</div><DetailLine labelText="Workspace" value={data.workspace.workspace_name} /><DetailLine labelText="Priority" value={data.workspace.current_priority} /><DetailLine labelText="Next client action" value={data.workspace.next_client_action} /><DetailLine labelText="Axiom review focus" value={data.workspace.axiom_review_focus} /><DetailLine labelText="Last activity" value={formatDate(data.workspace.last_activity_at || data.workspace.updated_at)} /><DetailLine labelText="Customer account" value={label(data.customer?.account_status)} /><DetailLine labelText="Last login" value={formatDate(data.customer?.last_login_at)} /></div></AdminSection></section>

        <AdminSection eyebrow="Workspace controls" title="Update workspace state"><WorkspaceStatusForm workspace={data.workspace} /></AdminSection>
        <AdminSection eyebrow="Client updates" title="Send client-visible update"><ClientUpdateForm workspaceId={data.workspace.id} /></AdminSection>
        <AdminSection eyebrow="Internal notes" title="Add admin-only note"><InternalNoteForm workspaceId={data.workspace.id} /></AdminSection>

        <AdminSection eyebrow="Files received" title="Client-uploaded documents">{data.documents.length > 0 ? <div className="grid gap-4">{data.documents.map((document) => <article key={document.id} className="grid gap-5 border border-[#9ed39f]/18 bg-black/34 p-5 lg:grid-cols-[1fr_auto] lg:items-center"><div><div className="flex flex-wrap gap-2">{statusPill(document.review_status)}{statusPill(document.document_category)}</div><h3 className="mt-3 break-words text-xl font-black uppercase tracking-[-0.04em] text-white">{document.title || document.original_filename}</h3><p className="mt-2 break-words text-xs font-bold uppercase tracking-[0.12em] text-white/44">{document.original_filename}</p><p className="mt-2 text-sm leading-7 text-white/62">{document.description || "No client description recorded."}</p><p className="mt-2 text-xs leading-5 text-white/46">{formatDate(document.uploaded_at)} · {formatSize(document.file_size_bytes)} · {document.mime_type || "MIME not recorded"}</p><DocumentReviewControls document={document} workspaceId={data.workspace.id} /></div>{document.storage_bucket && document.storage_path ? <a href={`/api/admin/proposals/documents/${document.id}/download`} target="_blank" rel="noopener noreferrer" className={primaryButtonClass}>Open file</a> : null}</article>)}</div> : <article className="border border-[#9ed39f]/20 bg-black/36 p-6"><h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white">No files received yet.</h3><p className="mt-3 text-sm leading-7 text-white/68">Client-uploaded evidence will appear here.</p></article>}</AdminSection>

        <AdminSection eyebrow="Files sent" title="Axiom deliverables">{data.deliverables.length > 0 ? <div className="grid gap-4">{data.deliverables.map((deliverable) => <article key={deliverable.id} className="grid gap-5 border border-[#9ed39f]/18 bg-black/34 p-5 lg:grid-cols-[1fr_auto] lg:items-center"><div><div className="flex flex-wrap gap-2">{statusPill(deliverable.status)}{statusPill(visibilityLabel(deliverable.status))}{statusPill(deliverable.deliverable_type)}</div><h3 className="mt-3 break-words text-xl font-black uppercase tracking-[-0.04em] text-white">{deliverable.title}</h3><p className="mt-2 text-sm leading-7 text-white/62">{deliverable.description || "No description recorded."}</p><p className="mt-2 break-words text-xs font-bold uppercase tracking-[0.12em] text-white/44">{deliverable.original_filename || `Version ${deliverable.version || "v1"}`}</p><p className="mt-2 text-xs leading-5 text-white/46">{formatDate(deliverable.delivered_at || deliverable.created_at)} · {formatSize(deliverable.file_size_bytes)} · {deliverable.mime_type || "MIME not recorded"}</p></div><Link href="/admin/proposals/deliverables" className={buttonClass}>Manage</Link></article>)}</div> : <article className="border border-[#9ed39f]/20 bg-black/36 p-6"><h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white">No deliverables sent yet.</h3><p className="mt-3 text-sm leading-7 text-white/68">Use Sent deliverables to upload or release files for this workspace.</p></article>}</AdminSection>

        <AdminSection eyebrow="Timeline" title="Workspace activity">{latestActivity ? <div className="mb-5 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]"><article className="border border-[#9ed39f]/22 bg-[#9ed39f]/10 p-5"><p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">Latest event</p><h3 className="mt-3 text-2xl font-black uppercase leading-tight tracking-[-0.05em] text-white">{activityDisplayTitle(latestActivity)}</h3><p className="mt-3 text-sm leading-7 text-white/68">{latestActivity.body || "No latest activity detail recorded."}</p></article><article className="grid gap-3 border border-[#9ed39f]/22 bg-black/34 p-5 text-sm leading-7 text-white/68"><DetailLine labelText="Total events" value={String(data.activities.length)} /><DetailLine labelText="Client-visible" value={String(clientVisibleActivityCount)} /><DetailLine labelText="Internal only" value={String(internalActivityCount)} /><DetailLine labelText="Latest time" value={formatDate(latestActivity.created_at)} /></article></div> : null}{data.activities.length > 0 ? <div className="grid gap-3">{data.activities.map((activity) => <ActivityCard key={activity.id} activity={activity} />)}</div> : <article className="border border-[#9ed39f]/20 bg-black/36 p-6"><h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white">No activity yet.</h3><p className="mt-3 text-sm leading-7 text-white/68">Workspace activity events will appear here as the client and admin actions build up.</p></article>}</AdminSection>
      </div></section>
    </AdminShell>
  );
}
