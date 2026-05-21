import type { Metadata } from "next";
import Link from "next/link";
import { requireAxiomAdmin } from "../../../../lib/axiom-admin";
import { formatDate, label } from "../../../../lib/axiom-admin-dashboard";
import { AdminSection, AdminShell, buttonClass, primaryButtonClass, statusPill } from "../../../../components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Send Deliverables | Axiom Architect Admin",
  description:
    "Internal Axiom Architect admin page for uploading workflow deliverables to proposal client workspaces.",
};

export const dynamic = "force-dynamic";

type SearchParamValue = string | string[] | undefined;

type PageProps = {
  searchParams: Promise<{
    deliverable?: SearchParamValue;
  }>;
};

type ProposalRequestRecord = {
  id: string;
  customer_id: string | null;
  request_type: string | null;
  status: string | null;
  proposal_status: string | null;
  contact_name: string | null;
  email: string | null;
  business_name: string | null;
  scope_type: string | null;
  support_type: string | null;
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
  current_priority: string | null;
  updated_at: string | null;
};

type DeliverableRecord = {
  id: string;
  workspace_id: string;
  customer_id: string;
  title: string;
  status: string | null;
  original_filename: string | null;
  delivered_at: string | null;
  created_at: string | null;
};

type DeliverableWorkspaceView = {
  workspace: WorkspaceRecord;
  proposal: ProposalRequestRecord | null;
  customer: CustomerRecord | null;
  deliverables: DeliverableRecord[];
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
    console.error("Admin deliverable uploader Supabase request failed", path, responseText);
    return null;
  }

  if (!responseText) {
    return [] as T;
  }

  return JSON.parse(responseText) as T;
}

async function getUploaderData() {
  const [proposals, customers, workspaces, deliverables] = await Promise.all([
    supabaseFetch<ProposalRequestRecord[]>(
      "axiom_service_requests?select=id,customer_id,request_type,status,proposal_status,contact_name,email,business_name,scope_type,support_type,created_at&source=eq.client_proposal_form&order=created_at.desc&limit=150",
    ),
    supabaseFetch<CustomerRecord[]>(
      "axiom_customers?select=id,email,full_name,business_name&order=created_at.desc&limit=250",
    ),
    supabaseFetch<WorkspaceRecord[]>(
      "axiom_client_workspaces?select=id,customer_id,service_request_id,workspace_name,status,current_phase,current_priority,updated_at&order=updated_at.desc&limit=250",
    ),
    supabaseFetch<DeliverableRecord[]>(
      "axiom_workspace_deliverables?select=id,workspace_id,customer_id,title,status,original_filename,delivered_at,created_at&order=created_at.desc&limit=400",
    ),
  ]);

  return {
    proposals: proposals || [],
    customers: customers || [],
    workspaces: workspaces || [],
    deliverables: deliverables || [],
  };
}

function firstParam(value: SearchParamValue) {
  return Array.isArray(value) ? value[0] : value;
}

function uploadMessage(status?: string) {
  switch (status) {
    case "success":
      return { title: "Deliverable sent.", text: "The file was uploaded, assigned to the workspace, and added to the client deliverables area." };
    case "too-large":
      return { title: "File too large.", text: "Deliverable uploads are currently limited to 50MB." };
    case "type":
      return { title: "File type blocked.", text: "Use a PDF, image, document, spreadsheet, presentation, CSV, or text file." };
    case "missing-file":
      return { title: "No file selected.", text: "Choose a deliverable file before sending." };
    case "workspace":
      return { title: "Workspace not found.", text: "The selected customer workspace could not be verified." };
    case "storage":
    case "record":
    case "config":
      return { title: "Delivery failed.", text: "The file could not be uploaded or recorded. Check the deliverable storage setup." };
    default:
      return null;
  }
}

function clientName(view: DeliverableWorkspaceView) {
  return (
    view.proposal?.business_name ||
    view.customer?.business_name ||
    view.proposal?.contact_name ||
    view.customer?.full_name ||
    view.proposal?.email ||
    view.customer?.email ||
    "Unnamed proposal client"
  );
}

function defaultTitle(view: DeliverableWorkspaceView) {
  const scope = view.proposal?.scope_type?.replace(/_/g, " ") || "Workflow";
  return `${scope.charAt(0).toUpperCase()}${scope.slice(1)} deliverable v1`;
}

function UploaderForm({ view }: { view: DeliverableWorkspaceView }) {
  return (
    <form action="/api/admin/proposals/deliverable/upload" method="post" encType="multipart/form-data" className="mt-5 grid gap-4 border border-[#9ed39f]/18 bg-black/30 p-4">
      <input type="hidden" name="workspace_id" value={view.workspace.id} />
      <input type="hidden" name="customer_id" value={view.workspace.customer_id} />

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="grid gap-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">
          Title
          <input name="title" type="text" defaultValue={defaultTitle(view)} className="min-h-11 border border-[#9ed39f]/30 bg-black px-3 text-sm font-semibold normal-case tracking-normal text-white outline-none focus:border-[#9ed39f]" />
        </label>
        <label className="grid gap-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">
          Version
          <input name="version" type="text" defaultValue="v1" className="min-h-11 border border-[#9ed39f]/30 bg-black px-3 text-sm font-semibold normal-case tracking-normal text-white outline-none focus:border-[#9ed39f]" />
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="grid gap-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">
          Deliverable type
          <select name="deliverable_type" defaultValue="workflow_blueprint" className="min-h-11 border border-[#9ed39f]/30 bg-black px-3 text-sm font-semibold normal-case tracking-normal text-white outline-none focus:border-[#9ed39f]">
            <option value="workflow_blueprint">Workflow blueprint</option>
            <option value="workflow_audit">Workflow audit</option>
            <option value="implementation_blueprint">Implementation blueprint</option>
            <option value="ai_operating_protocol">AI operating protocol</option>
            <option value="assistant_instruction_kit">Assistant instruction kit</option>
            <option value="automation_plan">Automation plan</option>
            <option value="final_report">Final report</option>
            <option value="supporting_file">Supporting file</option>
          </select>
        </label>
        <label className="grid gap-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">
          Status
          <select name="status" defaultValue="delivered" className="min-h-11 border border-[#9ed39f]/30 bg-black px-3 text-sm font-semibold normal-case tracking-normal text-white outline-none focus:border-[#9ed39f]">
            <option value="delivered">Delivered</option>
            <option value="ready_for_review">Ready for review</option>
            <option value="approved">Approved</option>
            <option value="preparing">Preparing</option>
          </select>
        </label>
      </div>

      <label className="grid gap-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">
        Description
        <textarea name="description" rows={3} defaultValue="Workflow deliverable prepared by Axiom Architect." className="border border-[#9ed39f]/30 bg-black px-3 py-3 text-sm font-semibold normal-case tracking-normal text-white outline-none focus:border-[#9ed39f]" />
      </label>

      <label className="grid gap-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">
        File
        <input name="file" type="file" required className="min-h-11 border border-[#9ed39f]/30 bg-black px-3 py-2 text-sm font-semibold normal-case tracking-normal text-white file:mr-4 file:border-0 file:bg-[#9ed39f] file:px-4 file:py-2 file:text-xs file:font-black file:uppercase file:tracking-[0.16em] file:text-black" />
      </label>

      <button type="submit" className={primaryButtonClass}>Send deliverable</button>
    </form>
  );
}

export default async function AdminProposalDeliverablesPage({ searchParams }: PageProps) {
  const { adminEmail } = await requireAxiomAdmin();
  const params = await searchParams;
  const message = uploadMessage(firstParam(params.deliverable));
  const data = await getUploaderData();
  const customersById = new Map(data.customers.map((customer) => [customer.id, customer]));
  const proposalsById = new Map(data.proposals.map((proposal) => [proposal.id, proposal]));
  const deliverablesByWorkspaceId = new Map<string, DeliverableRecord[]>();

  for (const deliverable of data.deliverables) {
    const existing = deliverablesByWorkspaceId.get(deliverable.workspace_id) || [];
    existing.push(deliverable);
    deliverablesByWorkspaceId.set(deliverable.workspace_id, existing);
  }

  const views: DeliverableWorkspaceView[] = data.workspaces
    .filter((workspace) => workspace.service_request_id)
    .map((workspace) => ({
      workspace,
      proposal: workspace.service_request_id ? proposalsById.get(workspace.service_request_id) || null : null,
      customer: customersById.get(workspace.customer_id) || null,
      deliverables: deliverablesByWorkspaceId.get(workspace.id) || [],
    }))
    .filter((view) => view.proposal);

  return (
    <AdminShell
      adminEmail={adminEmail}
      eyebrow="Send deliverables"
      title="Release files to proposal clients."
      intro="Upload a workflow document from the admin side and Axiom will store it in the private deliverables bucket, assign it to the correct customer workspace, and expose it in the client Deliverables area."
      activePath="/admin/proposals"
    >
      {message && (
        <section className="bg-[#9ed39f] px-4 py-5 text-black sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[0.66rem] font-black uppercase tracking-[0.2em]">Deliverable status</p>
              <h2 className="mt-1 text-2xl font-black uppercase tracking-[-0.04em]">{message.title}</h2>
              <p className="mt-1 text-sm font-semibold leading-6 text-black/72">{message.text}</p>
            </div>
            <Link href="/admin/proposals/deliverables" className="inline-flex min-h-11 items-center justify-center border border-black px-4 text-[0.7rem] font-black uppercase tracking-[0.16em] text-black hover:bg-black hover:text-[#9ed39f]">Clear</Link>
          </div>
        </section>
      )}

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-8">
          <AdminSection eyebrow="Uploader" title="Choose a client workspace">
            <div className="mb-6 flex flex-wrap gap-3">
              <Link href="/admin/proposals" className={buttonClass}>Back to proposal clients</Link>
              <Link href="/client/deliverables" className={buttonClass}>Client deliverables view</Link>
            </div>

            <div className="grid gap-5">
              {views.length > 0 ? (
                views.map((view) => (
                  <article key={view.workspace.id} className="border border-[#9ed39f]/20 bg-black/36 p-5">
                    <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
                      <div>
                        <div className="flex flex-wrap gap-3">
                          {statusPill(view.workspace.status)}
                          {statusPill(view.proposal?.proposal_status)}
                        </div>
                        <h3 className="mt-4 text-2xl font-black uppercase leading-tight tracking-[-0.05em] text-white">{clientName(view)}</h3>
                        <p className="mt-2 text-sm leading-7 text-white/68">{view.proposal?.contact_name || view.customer?.full_name || "Contact not set"} · {view.proposal?.email || view.customer?.email || "Email not set"}</p>
                        <div className="mt-4 grid gap-3 text-sm leading-7 text-white/68 md:grid-cols-2">
                          <p><strong className="text-[#9ed39f]">Workspace:</strong> {view.workspace.workspace_name}</p>
                          <p><strong className="text-[#9ed39f]">Phase:</strong> {label(view.workspace.current_phase)}</p>
                          <p><strong className="text-[#9ed39f]">Scope:</strong> {label(view.proposal?.scope_type)}</p>
                          <p><strong className="text-[#9ed39f]">Updated:</strong> {formatDate(view.workspace.updated_at)}</p>
                        </div>
                        <div className="mt-5 border border-[#9ed39f]/16 bg-[#030804] p-4">
                          <p className="text-[0.66rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">Existing deliverables</p>
                          <p className="mt-2 text-sm leading-7 text-white/68">{view.deliverables.length > 0 ? `${view.deliverables.length} deliverable record(s) already released for this workspace.` : "No deliverables have been released to this workspace yet."}</p>
                        </div>
                      </div>
                      <UploaderForm view={view} />
                    </div>
                  </article>
                ))
              ) : (
                <article className="border border-[#9ed39f]/20 bg-black/36 p-6">
                  <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white">No proposal workspaces found.</h3>
                  <p className="mt-3 text-sm leading-7 text-white/68">Create or activate a client workspace from the proposal flow before sending deliverables.</p>
                </article>
              )}
            </div>
          </AdminSection>
        </div>
      </section>
    </AdminShell>
  );
}
