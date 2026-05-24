import type { Metadata } from "next";
import Link from "next/link";
import { requireAxiomAdmin } from "../../../../lib/axiom-admin";
import { formatDate, label } from "../../../../lib/axiom-admin-dashboard";
import {
  axiomDeliverableDefinitions,
  axiomDeliverableTypes,
} from "../../../../lib/axiom-package-model";
import { AdminSection, AdminShell, buttonClass, primaryButtonClass, statusPill } from "../../../../components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Sent Deliverables | Axiom Architect Admin",
  description:
    "Internal Axiom Architect admin page for uploading and controlling workflow deliverables sent to client workspaces.",
};

export const dynamic = "force-dynamic";

const clientVisibleStatuses = new Set(["ready_for_review", "approved", "delivered"]);
const internalStatuses = new Set(["preparing"]);

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

type OrderRecord = {
  id: string;
  customer_id: string | null;
  tier_slug: string | null;
  service_name: string | null;
  status: string | null;
  payment_status: string | null;
  created_at: string | null;
};

type WorkspaceRecord = {
  id: string;
  customer_id: string;
  service_request_id: string | null;
  order_id: string | null;
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
  order: OrderRecord | null;
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
  const [proposals, customers, orders, workspaces, deliverables] = await Promise.all([
    supabaseFetch<ProposalRequestRecord[]>(
      "axiom_service_requests?select=id,customer_id,request_type,status,proposal_status,contact_name,email,business_name,scope_type,support_type,created_at&source=eq.client_proposal_form&order=created_at.desc&limit=150",
    ),
    supabaseFetch<CustomerRecord[]>(
      "axiom_customers?select=id,email,full_name,business_name&order=created_at.desc&limit=250",
    ),
    supabaseFetch<OrderRecord[]>(
      "axiom_orders?select=id,customer_id,tier_slug,service_name,status,payment_status,created_at&order=created_at.desc&limit=250",
    ),
    supabaseFetch<WorkspaceRecord[]>(
      "axiom_client_workspaces?select=id,customer_id,service_request_id,order_id,workspace_name,status,current_phase,current_priority,updated_at&order=updated_at.desc&limit=250",
    ),
    supabaseFetch<DeliverableRecord[]>(
      "axiom_workspace_deliverables?select=id,workspace_id,customer_id,title,status,original_filename,delivered_at,created_at&order=created_at.desc&limit=400",
    ),
  ]);

  return {
    proposals: proposals || [],
    customers: customers || [],
    orders: orders || [],
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
      return { title: "Deliverable saved.", text: "The file was uploaded and recorded. Client visibility depends on the selected status." };
    case "status-updated":
      return { title: "Status updated.", text: "The deliverable visibility state has been updated." };
    case "status-invalid":
      return { title: "Status blocked.", text: "That deliverable status is not allowed." };
    case "status-failed":
      return { title: "Status failed.", text: "The deliverable status could not be updated." };
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

function workspaceRoute(view: DeliverableWorkspaceView) {
  return view.proposal ? "Proposal workspace" : "Package workspace";
}

function routeStatus(view: DeliverableWorkspaceView) {
  return view.proposal?.proposal_status || view.order?.status || view.order?.payment_status || null;
}

function clientName(view: DeliverableWorkspaceView) {
  return (
    view.proposal?.business_name ||
    view.customer?.business_name ||
    view.proposal?.contact_name ||
    view.customer?.full_name ||
    view.proposal?.email ||
    view.customer?.email ||
    "Unnamed client"
  );
}

function clientContact(view: DeliverableWorkspaceView) {
  return view.proposal?.email || view.customer?.email || "Email not set";
}

function defaultTitle(view: DeliverableWorkspaceView) {
  const source = view.proposal?.scope_type || view.order?.service_name || view.order?.tier_slug || "Workflow";
  const cleanSource = source.replace(/_/g, " ");
  return `${cleanSource.charAt(0).toUpperCase()}${cleanSource.slice(1)} deliverable v1`;
}

function scopeLabel(view: DeliverableWorkspaceView) {
  return label(view.proposal?.scope_type || view.order?.service_name || view.order?.tier_slug);
}

function visibilityLabel(status: string | null) {
  if (status && clientVisibleStatuses.has(status)) {
    return "client visible";
  }

  return "internal only";
}

function StatusUpdateForm({ deliverableId, status, labelText, primary = false }: { deliverableId: string; status: string; labelText: string; primary?: boolean }) {
  return (
    <form action="/api/admin/proposals/deliverable/status" method="post">
      <input type="hidden" name="deliverable_id" value={deliverableId} />
      <input type="hidden" name="status" value={status} />
      <button type="submit" className={primary ? primaryButtonClass : buttonClass}>
        {labelText}
      </button>
    </form>
  );
}

function ExistingDeliverables({ deliverables }: { deliverables: DeliverableRecord[] }) {
  if (deliverables.length === 0) {
    return (
      <div className="mt-5 border border-[#9ed39f]/16 bg-[#030804] p-4">
        <p className="text-[0.66rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">Existing deliverables</p>
        <p className="mt-2 text-sm leading-7 text-white/68">No deliverables have been created for this workspace yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-5 border border-[#9ed39f]/16 bg-[#030804] p-4">
      <p className="text-[0.66rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">Existing deliverables</p>
      <div className="mt-4 grid gap-3">
        {deliverables.map((deliverable) => {
          const status = deliverable.status || "preparing";
          const isInternal = internalStatuses.has(status);

          return (
            <article key={deliverable.id} className="border border-[#9ed39f]/14 bg-black/40 p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2">
                    {statusPill(status)}
                    {statusPill(visibilityLabel(status))}
                  </div>
                  <h4 className="mt-3 text-sm font-black uppercase leading-tight tracking-[-0.03em] text-white">{deliverable.title}</h4>
                  <p className="mt-2 break-words text-xs font-bold uppercase tracking-[0.12em] text-white/44">{deliverable.original_filename || "No filename recorded"}</p>
                  <p className="mt-2 text-xs leading-5 text-white/50">{formatDate(deliverable.delivered_at || deliverable.created_at)}</p>
                </div>
                <div className="flex flex-wrap gap-2 lg:justify-end">
                  {isInternal && <StatusUpdateForm deliverableId={deliverable.id} status="ready_for_review" labelText="Release for review" primary />}
                  {status === "ready_for_review" && <StatusUpdateForm deliverableId={deliverable.id} status="approved" labelText="Mark approved" />}
                  {status !== "delivered" && <StatusUpdateForm deliverableId={deliverable.id} status="delivered" labelText="Mark final" />}
                  {!isInternal && <StatusUpdateForm deliverableId={deliverable.id} status="preparing" labelText="Hide from client" />}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
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
          <select name="deliverable_type" defaultValue="workflow_diagnosis" className="min-h-11 border border-[#9ed39f]/30 bg-black px-3 text-sm font-semibold normal-case tracking-normal text-white outline-none focus:border-[#9ed39f]">
            {axiomDeliverableTypes.map((deliverableType) => {
              const deliverable = axiomDeliverableDefinitions[deliverableType];

              return (
                <option key={deliverable.type} value={deliverable.type}>
                  {deliverable.title}
                </option>
              );
            })}
          </select>
        </label>
        <label className="grid gap-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">
          Status
          <select name="status" defaultValue="preparing" className="min-h-11 border border-[#9ed39f]/30 bg-black px-3 text-sm font-semibold normal-case tracking-normal text-white outline-none focus:border-[#9ed39f]">
            <option value="preparing">Preparing — internal only</option>
            <option value="ready_for_review">Ready for review — client visible</option>
            <option value="approved">Approved — client visible</option>
            <option value="delivered">Delivered — client visible</option>
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

      <button type="submit" className={primaryButtonClass}>Save deliverable</button>
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
  const ordersById = new Map(data.orders.map((order) => [order.id, order]));
  const deliverablesByWorkspaceId = new Map<string, DeliverableRecord[]>();

  for (const deliverable of data.deliverables) {
    const existing = deliverablesByWorkspaceId.get(deliverable.workspace_id) || [];
    existing.push(deliverable);
    deliverablesByWorkspaceId.set(deliverable.workspace_id, existing);
  }

  const views: DeliverableWorkspaceView[] = data.workspaces
    .filter((workspace) => workspace.service_request_id || workspace.order_id)
    .map((workspace) => {
      const proposal = workspace.service_request_id ? proposalsById.get(workspace.service_request_id) || null : null;
      const order = workspace.order_id ? ordersById.get(workspace.order_id) || null : null;

      return {
        workspace,
        proposal,
        order,
        customer: customersById.get(workspace.customer_id) || null,
        deliverables: deliverablesByWorkspaceId.get(workspace.id) || [],
      };
    })
    .filter((view) => view.proposal || view.order || view.customer);

  const proposalWorkspaceCount = views.filter((view) => view.proposal).length;
  const packageWorkspaceCount = views.filter((view) => !view.proposal && view.order).length;
  const allDeliverables = views.flatMap((view) => view.deliverables);
  const internalCount = allDeliverables.filter((deliverable) => internalStatuses.has(deliverable.status || "preparing")).length;
  const visibleCount = allDeliverables.filter((deliverable) => clientVisibleStatuses.has(deliverable.status || "")).length;

  return (
    <AdminShell
      adminEmail={adminEmail}
      eyebrow="Sent deliverables"
      title="Files sent to client workspaces."
      intro="Control what Axiom has sent, who received it, and whether each deliverable is internal-only or visible in the client portal."
      activePath="/admin/proposals/deliverables"
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

      <section className="bg-[#9ed39f] px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-5 md:grid-cols-5">
          <article className="border border-black bg-[#061009] p-5"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#9ed39f]">Workspaces</p><h2 className="mt-3 text-4xl font-black">{views.length}</h2></article>
          <article className="border border-black bg-[#061009] p-5"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#9ed39f]">Proposals</p><h2 className="mt-3 text-4xl font-black">{proposalWorkspaceCount}</h2></article>
          <article className="border border-black bg-[#061009] p-5"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#9ed39f]">Packages</p><h2 className="mt-3 text-4xl font-black">{packageWorkspaceCount}</h2></article>
          <article className="border border-black bg-[#061009] p-5"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#9ed39f]">Internal only</p><h2 className="mt-3 text-4xl font-black">{internalCount}</h2></article>
          <article className="border border-black bg-[#061009] p-5"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#9ed39f]">Client visible</p><h2 className="mt-3 text-4xl font-black">{visibleCount}</h2></article>
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-8">
          <AdminSection eyebrow="Delivery control" title="Choose a client workspace">
            <div className="mb-6 flex flex-wrap gap-3">
              <Link href="/admin/proposals" className={buttonClass}>Proposal clients</Link>
              <Link href="/admin/proposals/documents" className={buttonClass}>Client documents</Link>
            </div>

            <div className="grid gap-5">
              {views.length > 0 ? (
                views.map((view) => (
                  <article key={view.workspace.id} className="border border-[#9ed39f]/20 bg-black/36 p-5">
                    <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
                      <div>
                        <div className="flex flex-wrap gap-3">
                          {statusPill(view.workspace.status)}
                          {statusPill(workspaceRoute(view))}
                          {statusPill(routeStatus(view))}
                        </div>
                        <h3 className="mt-4 text-2xl font-black uppercase leading-tight tracking-[-0.05em] text-white">{clientName(view)}</h3>
                        <p className="mt-2 text-sm leading-7 text-white/68">{view.proposal?.contact_name || view.customer?.full_name || "Contact not set"} · {clientContact(view)}</p>
                        <div className="mt-4 grid gap-3 text-sm leading-7 text-white/68 md:grid-cols-2">
                          <p><strong className="text-[#9ed39f]">Workspace:</strong> {view.workspace.workspace_name}</p>
                          <p><strong className="text-[#9ed39f]">Phase:</strong> {label(view.workspace.current_phase)}</p>
                          <p><strong className="text-[#9ed39f]">Scope:</strong> {scopeLabel(view)}</p>
                          <p><strong className="text-[#9ed39f]">Updated:</strong> {formatDate(view.workspace.updated_at)}</p>
                        </div>
                        <div className="mt-5 flex flex-wrap gap-3">
                          <Link href={`/admin/proposals/${view.workspace.id}`} className={buttonClass}>Open workspace</Link>
                        </div>
                        <ExistingDeliverables deliverables={view.deliverables} />
                      </div>
                      <UploaderForm view={view} />
                    </div>
                  </article>
                ))
              ) : (
                <article className="border border-[#9ed39f]/20 bg-black/36 p-6">
                  <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white">No client workspaces found.</h3>
                  <p className="mt-3 text-sm leading-7 text-white/68">Create or activate a proposal workspace, or wait for a package checkout to create a package workspace.</p>
                </article>
              )}
            </div>
          </AdminSection>
        </div>
      </section>
    </AdminShell>
  );
}
