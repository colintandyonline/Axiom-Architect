import type { Metadata } from "next";
import Link from "next/link";
import { requireAxiomAdmin } from "../../../lib/axiom-admin";
import { formatDate, label } from "../../../lib/axiom-admin-dashboard";
import { AdminSection, AdminShell, StatCard, buttonClass, statusPill } from "../../../components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Proposal Clients | Axiom Architect Admin",
  description:
    "Internal Axiom Architect proposal-client control page for workflow proposals, workspace review, client evidence, and deliverable status.",
};

export const dynamic = "force-dynamic";

type JsonRecord = Record<string, unknown>;

type ProposalRequestRecord = {
  id: string;
  customer_id: string | null;
  request_type: string | null;
  source: string | null;
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
  created_at: string | null;
  last_login_at: string | null;
};

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

type DocumentRecord = {
  id: string;
  workspace_id: string;
  customer_id: string;
  review_status: string | null;
  document_category: string | null;
  created_at: string | null;
  uploaded_at: string | null;
};

type DeliverableRecord = {
  id: string;
  workspace_id: string;
  customer_id: string;
  status: string | null;
  deliverable_type: string | null;
  delivered_at: string | null;
  created_at: string | null;
};

type ProposalAdminData = {
  proposals: ProposalRequestRecord[];
  customers: CustomerRecord[];
  workspaces: WorkspaceRecord[];
  documents: DocumentRecord[];
  deliverables: DeliverableRecord[];
};

type ProposalView = {
  proposal: ProposalRequestRecord;
  customer: CustomerRecord | null;
  workspace: WorkspaceRecord | null;
  documents: DocumentRecord[];
  deliverables: DeliverableRecord[];
  segment: string;
  nextAdminAction: string;
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
    console.error("Proposal admin Supabase request failed", path, responseText);
    return null;
  }

  if (!responseText) {
    return [] as T;
  }

  return JSON.parse(responseText) as T;
}

async function getProposalAdminData(): Promise<ProposalAdminData> {
  const [proposals, customers, workspaces, documents, deliverables] = await Promise.all([
    supabaseFetch<ProposalRequestRecord[]>(
      "axiom_service_requests?select=id,customer_id,request_type,source,status,proposal_status,contact_name,email,business_name,role,website,scope_type,support_type,budget_range,timeline,sensitive_data,summary_message,request_payload,created_at,updated_at&source=eq.client_proposal_form&order=created_at.desc&limit=100",
    ),
    supabaseFetch<CustomerRecord[]>(
      "axiom_customers?select=id,email,full_name,business_name,account_status,created_at,last_login_at&order=created_at.desc&limit=200",
    ),
    supabaseFetch<WorkspaceRecord[]>(
      "axiom_client_workspaces?select=id,customer_id,service_request_id,workspace_name,status,current_phase,current_priority,next_client_action,axiom_review_focus,last_activity_at,created_at,updated_at&order=updated_at.desc&limit=200",
    ),
    supabaseFetch<DocumentRecord[]>(
      "axiom_workspace_documents?select=id,workspace_id,customer_id,review_status,document_category,created_at,uploaded_at&order=uploaded_at.desc&limit=300",
    ),
    supabaseFetch<DeliverableRecord[]>(
      "axiom_workspace_deliverables?select=id,workspace_id,customer_id,status,deliverable_type,delivered_at,created_at&order=created_at.desc&limit=300",
    ),
  ]);

  return {
    proposals: proposals || [],
    customers: customers || [],
    workspaces: workspaces || [],
    documents: documents || [],
    deliverables: deliverables || [],
  };
}

function payloadText(payload: JsonRecord | null, key: string) {
  const value = payload?.[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function proposalSummary(proposal: ProposalRequestRecord) {
  return (
    payloadText(proposal.request_payload, "workflow_summary") ||
    payloadText(proposal.request_payload, "current_problem") ||
    proposal.summary_message ||
    "No workflow summary supplied yet."
  );
}

function clientName(proposal: ProposalRequestRecord, customer: CustomerRecord | null) {
  return (
    proposal.business_name ||
    customer?.business_name ||
    proposal.contact_name ||
    customer?.full_name ||
    proposal.email ||
    customer?.email ||
    "Unnamed proposal client"
  );
}

function determineSegment({ proposal, workspace, documents, deliverables }: Omit<ProposalView, "customer" | "segment" | "nextAdminAction">) {
  if (deliverables.length > 0) {
    return "Delivery released";
  }

  if (documents.some((document) => document.review_status === "needs_clarification")) {
    return "Needs clarification";
  }

  if (documents.length > 0) {
    return "Evidence received";
  }

  if (workspace?.status === "active") {
    return "Workspace active";
  }

  if (proposal.proposal_status && proposal.proposal_status !== "not_prepared") {
    return "Proposal prepared";
  }

  return "Needs proposal review";
}

function nextAdminAction(view: Omit<ProposalView, "segment" | "nextAdminAction">) {
  if (view.deliverables.length > 0) {
    return "Monitor client review and follow-up response.";
  }

  if (view.documents.length > 0) {
    return "Review uploaded evidence and prepare the first workflow output.";
  }

  if (view.workspace?.status === "active") {
    return "Request supporting files or prepare the proposal pack.";
  }

  if (view.proposal.proposal_status && view.proposal.proposal_status !== "not_prepared") {
    return "Confirm scope, payment route, or next client decision.";
  }

  return "Review the submitted brief and decide the proposal route.";
}

function SegmentColumn({ title, views }: { title: string; views: ProposalView[] }) {
  return (
    <article className="border border-[#9ed39f]/24 bg-black/34 p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-black uppercase leading-tight tracking-[-0.04em] text-white">{title}</h3>
        <span className="border border-[#9ed39f]/30 px-2 py-1 text-[0.62rem] font-black uppercase tracking-[0.14em] text-[#9ed39f]">
          {views.length}
        </span>
      </div>
      <div className="mt-5 grid gap-3">
        {views.length > 0 ? (
          views.slice(0, 4).map((view) => (
            <div key={view.proposal.id} className="border border-[#9ed39f]/16 bg-[#030804] p-4">
              <p className="text-[0.62rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">{label(view.proposal.scope_type || view.proposal.request_type)}</p>
              <p className="mt-2 text-sm font-black uppercase leading-tight text-white">{clientName(view.proposal, view.customer)}</p>
              <p className="mt-2 text-xs leading-5 text-white/58">{formatDate(view.proposal.created_at)}</p>
            </div>
          ))
        ) : (
          <p className="text-sm leading-7 text-white/58">No clients in this segment.</p>
        )}
      </div>
    </article>
  );
}

export default async function AdminProposalClientsPage() {
  const { adminEmail } = await requireAxiomAdmin();
  const data = await getProposalAdminData();
  const customersById = new Map(data.customers.map((customer) => [customer.id, customer]));
  const workspacesByRequestId = new Map(
    data.workspaces
      .filter((workspace) => workspace.service_request_id)
      .map((workspace) => [workspace.service_request_id as string, workspace]),
  );
  const documentsByWorkspaceId = new Map<string, DocumentRecord[]>();
  const deliverablesByWorkspaceId = new Map<string, DeliverableRecord[]>();

  for (const document of data.documents) {
    const existing = documentsByWorkspaceId.get(document.workspace_id) || [];
    existing.push(document);
    documentsByWorkspaceId.set(document.workspace_id, existing);
  }

  for (const deliverable of data.deliverables) {
    const existing = deliverablesByWorkspaceId.get(deliverable.workspace_id) || [];
    existing.push(deliverable);
    deliverablesByWorkspaceId.set(deliverable.workspace_id, existing);
  }

  const proposalViews: ProposalView[] = data.proposals.map((proposal) => {
    const workspace = proposal.id ? workspacesByRequestId.get(proposal.id) || null : null;
    const documents = workspace ? documentsByWorkspaceId.get(workspace.id) || [] : [];
    const deliverables = workspace ? deliverablesByWorkspaceId.get(workspace.id) || [] : [];
    const customer = proposal.customer_id ? customersById.get(proposal.customer_id) || null : null;
    const partialView = { proposal, customer, workspace, documents, deliverables };
    const segment = determineSegment(partialView);

    return {
      ...partialView,
      segment,
      nextAdminAction: nextAdminAction(partialView),
    };
  });

  const proposalClients = new Set(proposalViews.map((view) => view.proposal.customer_id).filter(Boolean));
  const activeWorkspaces = proposalViews.filter((view) => view.workspace?.status === "active").length;
  const evidenceClients = proposalViews.filter((view) => view.documents.length > 0).length;
  const deliveryClients = proposalViews.filter((view) => view.deliverables.length > 0).length;
  const reviewQueue = proposalViews.filter((view) => view.segment === "Needs proposal review");
  const preparedQueue = proposalViews.filter((view) => view.segment === "Proposal prepared" || view.segment === "Workspace active");
  const evidenceQueue = proposalViews.filter((view) => view.segment === "Evidence received" || view.segment === "Needs clarification");
  const deliveryQueue = proposalViews.filter((view) => view.segment === "Delivery released");

  return (
    <AdminShell
      adminEmail={adminEmail}
      eyebrow="Proposal clients"
      title="Business proposal control."
      intro="This page separates proposal clients from product/order customers and tracks the service workflow from submitted brief to evidence, delivery, and follow-up."
      activePath="/admin/proposals"
    >
      <section className="bg-[#9ed39f] px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-6">
          <StatCard title="Proposals" value={String(data.proposals.length)} helper="Submitted proposal requests" />
          <StatCard title="Clients" value={String(proposalClients.size)} helper="Unique proposal clients" />
          <StatCard title="Workspaces" value={String(activeWorkspaces)} helper="Active client workspaces" />
          <StatCard title="Evidence" value={String(evidenceClients)} helper="Clients with uploads" />
          <StatCard title="Delivery" value={String(deliveryClients)} helper="Clients with deliverables" />
          <StatCard title="Review" value={String(reviewQueue.length)} helper="Needs admin proposal review" />
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-8">
          <AdminSection eyebrow="Business pipeline" title="Proposal-client segmentation">
            <div className="mb-6 flex flex-wrap gap-3">
              <Link href="/admin/proposals/documents" className={buttonClass}>Client documents</Link>
              <Link href="/admin/proposals/deliverables" className={buttonClass}>Sent deliverables</Link>
            </div>
            <div className="grid gap-4 lg:grid-cols-4">
              <SegmentColumn title="Needs review" views={reviewQueue} />
              <SegmentColumn title="Workspace / proposal" views={preparedQueue} />
              <SegmentColumn title="Evidence received" views={evidenceQueue} />
              <SegmentColumn title="Delivery released" views={deliveryQueue} />
            </div>
          </AdminSection>

          <AdminSection eyebrow="Service clients" title="Proposal workspace control">
            <div className="grid gap-5">
              {proposalViews.length > 0 ? (
                proposalViews.map((view) => (
                  <article key={view.proposal.id} className="grid gap-5 border border-[#9ed39f]/20 bg-black/36 p-5 xl:grid-cols-[1.15fr_0.85fr]">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        {statusPill(view.segment)}
                        {statusPill(view.proposal.status)}
                        {statusPill(view.proposal.proposal_status)}
                      </div>
                      <h3 className="mt-4 text-2xl font-black uppercase leading-tight tracking-[-0.05em] text-white">
                        {clientName(view.proposal, view.customer)}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-white/68">
                        {view.proposal.contact_name || view.customer?.full_name || "Contact not set"} · {view.proposal.email || view.customer?.email || "Email not set"}
                      </p>
                      <p className="mt-4 border border-[#9ed39f]/16 bg-black/30 p-4 text-sm leading-7 text-white/72">
                        {proposalSummary(view.proposal)}
                      </p>
                      <div className="mt-4 grid gap-3 text-sm leading-7 text-white/68 md:grid-cols-2 xl:grid-cols-3">
                        <p><strong className="text-[#9ed39f]">Scope:</strong> {label(view.proposal.scope_type)}</p>
                        <p><strong className="text-[#9ed39f]">Support:</strong> {label(view.proposal.support_type)}</p>
                        <p><strong className="text-[#9ed39f]">Budget:</strong> {label(view.proposal.budget_range)}</p>
                        <p><strong className="text-[#9ed39f]">Timeline:</strong> {label(view.proposal.timeline)}</p>
                        <p><strong className="text-[#9ed39f]">Sensitive data:</strong> {label(view.proposal.sensitive_data)}</p>
                        <p><strong className="text-[#9ed39f]">Submitted:</strong> {formatDate(view.proposal.created_at)}</p>
                      </div>
                    </div>

                    <aside className="border border-[#9ed39f]/18 bg-[#030804] p-5">
                      <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">Control state</p>
                      <div className="mt-4 grid gap-3 text-sm leading-7 text-white/68">
                        <p><strong className="text-[#9ed39f]">Workspace:</strong> {view.workspace?.workspace_name || "Workspace not created"}</p>
                        <p><strong className="text-[#9ed39f]">Phase:</strong> {label(view.workspace?.current_phase)}</p>
                        <p><strong className="text-[#9ed39f]">Priority:</strong> {view.workspace?.current_priority || "—"}</p>
                        <p><strong className="text-[#9ed39f]">Next client action:</strong> {view.workspace?.next_client_action || "—"}</p>
                        <p><strong className="text-[#9ed39f]">Client documents:</strong> {view.documents.length}</p>
                        <p><strong className="text-[#9ed39f]">Deliverables:</strong> {view.deliverables.length}</p>
                        <p><strong className="text-[#9ed39f]">Last activity:</strong> {formatDate(view.workspace?.last_activity_at || view.workspace?.updated_at || view.proposal.updated_at)}</p>
                      </div>
                      <div className="mt-5 border border-[#9ed39f]/16 bg-black/30 p-4">
                        <p className="text-[0.62rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">Next admin action</p>
                        <p className="mt-2 text-sm leading-7 text-white/72">{view.nextAdminAction}</p>
                      </div>
                      <div className="mt-5 flex flex-wrap gap-3">
                        <Link href="/admin/proposals/documents" className={buttonClass}>View documents</Link>
                        <Link href="/admin/proposals/deliverables" className={buttonClass}>Manage deliverables</Link>
                      </div>
                    </aside>
                  </article>
                ))
              ) : (
                <article className="border border-[#9ed39f]/20 bg-black/36 p-6">
                  <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white">No proposal clients yet.</h3>
                  <p className="mt-3 text-sm leading-7 text-white/68">Submitted proposal requests will appear here once clients use the proposal flow.</p>
                </article>
              )}
            </div>
          </AdminSection>
        </div>
      </section>
    </AdminShell>
  );
}
