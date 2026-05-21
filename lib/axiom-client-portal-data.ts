import { redirect } from "next/navigation";
import {
  getAxiomAuthContext,
  type AxiomAuthUser,
  type AxiomLinkedCustomer,
} from "./axiom-auth";

export type ClientPortalWorkspace = {
  id: string;
  customer_id: string;
  service_request_id: string | null;
  order_id: string | null;
  workspace_name: string;
  workspace_type: string;
  status: string;
  current_phase: string;
  current_priority: string | null;
  next_client_action: string | null;
  axiom_review_focus: string | null;
  last_activity_at: string | null;
  opened_at: string;
  created_at: string;
  updated_at: string;
};

export type ClientPortalServiceRequest = {
  id: string;
  customer_id: string;
  request_type: string;
  source: string;
  status: string;
  proposal_status: string;
  contact_name: string;
  email: string;
  business_name: string;
  role: string | null;
  website: string | null;
  scope_type: string | null;
  support_type: string | null;
  budget_range: string | null;
  timeline: string | null;
  sensitive_data: string | null;
  summary_message: string | null;
  created_at: string;
  updated_at: string;
};

export type ClientPortalActivity = {
  id: string;
  workspace_id: string;
  customer_id: string;
  actor_type: string;
  actor_label: string;
  activity_type: string;
  title: string;
  body: string | null;
  metadata: Record<string, unknown>;
  is_client_visible: boolean;
  created_at: string;
};

export type ClientPortalDocument = {
  id: string;
  workspace_id: string;
  customer_id: string;
  original_filename: string;
  document_category: string;
  review_status: string;
  title: string | null;
  description: string | null;
  storage_bucket: string | null;
  storage_path: string | null;
  mime_type: string | null;
  file_size_bytes: number | null;
  uploaded_at: string;
  reviewed_at: string | null;
};

export type ClientPortalDeliverable = {
  id: string;
  workspace_id: string;
  customer_id: string;
  deliverable_type: string;
  title: string;
  description: string | null;
  status: string;
  version: string;
  approval_required: boolean;
  original_filename: string | null;
  storage_bucket: string | null;
  storage_path: string | null;
  mime_type: string | null;
  file_size_bytes: number | null;
  approved_at: string | null;
  delivered_at: string | null;
  created_at: string;
};

export type ClientPortalInvoice = {
  id: string;
  workspace_id: string;
  customer_id: string;
  invoice_number: string | null;
  title: string;
  description: string | null;
  amount_due: number | null;
  currency: string;
  status: string;
  due_at: string | null;
  paid_at: string | null;
  invoice_url: string | null;
  receipt_url: string | null;
  created_at: string;
};

export type ClientPortalMessage = {
  id: string;
  workspace_id: string;
  customer_id: string;
  author_type: string;
  author_label: string;
  subject: string | null;
  body: string;
  status: string;
  created_at: string;
};

export type ClientPortalApprovalGate = {
  id: string;
  workspace_id: string;
  customer_id: string;
  gate_type: string;
  title: string;
  description: string | null;
  status: string;
  requested_at: string;
  responded_at: string | null;
};

export type ClientPortalLiveData = {
  user: AxiomAuthUser;
  customer: AxiomLinkedCustomer;
  workspace: ClientPortalWorkspace | null;
  serviceRequest: ClientPortalServiceRequest | null;
  latestActivity: ClientPortalActivity | null;
  documents: ClientPortalDocument[];
  deliverables: ClientPortalDeliverable[];
  invoices: ClientPortalInvoice[];
  messages: ClientPortalMessage[];
  approvalGates: ClientPortalApprovalGate[];
};

function getSupabaseServiceConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return {
    url: url.replace(/\/$/, ""),
    serviceRoleKey,
  };
}

async function supabaseServiceFetch<T>(path: string) {
  const config = getSupabaseServiceConfig();

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
    console.error("Axiom client portal data request failed", response.status, responseText);
    return null;
  }

  if (!responseText) {
    return [] as T;
  }

  return JSON.parse(responseText) as T;
}

async function getLatestWorkspace(customerId: string) {
  const records = await supabaseServiceFetch<ClientPortalWorkspace[]>(
    `axiom_client_workspaces?select=id,customer_id,service_request_id,order_id,workspace_name,workspace_type,status,current_phase,current_priority,next_client_action,axiom_review_focus,last_activity_at,opened_at,created_at,updated_at&customer_id=eq.${encodeURIComponent(customerId)}&order=created_at.desc&limit=1`,
  );

  return records?.[0] ?? null;
}

async function getLatestServiceRequest(customerId: string) {
  const records = await supabaseServiceFetch<ClientPortalServiceRequest[]>(
    `axiom_service_requests?select=id,customer_id,request_type,source,status,proposal_status,contact_name,email,business_name,role,website,scope_type,support_type,budget_range,timeline,sensitive_data,summary_message,created_at,updated_at&customer_id=eq.${encodeURIComponent(customerId)}&order=created_at.desc&limit=1`,
  );

  return records?.[0] ?? null;
}

async function getServiceRequestById(serviceRequestId: string) {
  const records = await supabaseServiceFetch<ClientPortalServiceRequest[]>(
    `axiom_service_requests?select=id,customer_id,request_type,source,status,proposal_status,contact_name,email,business_name,role,website,scope_type,support_type,budget_range,timeline,sensitive_data,summary_message,created_at,updated_at&id=eq.${encodeURIComponent(serviceRequestId)}&limit=1`,
  );

  return records?.[0] ?? null;
}

async function getLatestActivity(workspaceId: string) {
  const records = await supabaseServiceFetch<ClientPortalActivity[]>(
    `axiom_workspace_activity?select=id,workspace_id,customer_id,actor_type,actor_label,activity_type,title,body,metadata,is_client_visible,created_at&workspace_id=eq.${encodeURIComponent(workspaceId)}&is_client_visible=eq.true&order=created_at.desc&limit=1`,
  );

  return records?.[0] ?? null;
}

async function getWorkspaceDocuments(workspaceId: string) {
  return (
    (await supabaseServiceFetch<ClientPortalDocument[]>(
      `axiom_workspace_documents?select=id,workspace_id,customer_id,original_filename,document_category,review_status,title,description,storage_bucket,storage_path,mime_type,file_size_bytes,uploaded_at,reviewed_at&workspace_id=eq.${encodeURIComponent(workspaceId)}&order=uploaded_at.desc&limit=12`,
    )) || []
  );
}

async function getWorkspaceDeliverables(workspaceId: string) {
  return (
    (await supabaseServiceFetch<ClientPortalDeliverable[]>(
      `axiom_workspace_deliverables?select=id,workspace_id,customer_id,deliverable_type,title,description,status,version,approval_required,original_filename,storage_bucket,storage_path,mime_type,file_size_bytes,approved_at,delivered_at,created_at&workspace_id=eq.${encodeURIComponent(workspaceId)}&order=created_at.desc&limit=12`,
    )) || []
  );
}

async function getWorkspaceInvoices(workspaceId: string) {
  return (
    (await supabaseServiceFetch<ClientPortalInvoice[]>(
      `axiom_workspace_invoices?select=id,workspace_id,customer_id,invoice_number,title,description,amount_due,currency,status,due_at,paid_at,invoice_url,receipt_url,created_at&workspace_id=eq.${encodeURIComponent(workspaceId)}&order=created_at.desc&limit=12`,
    )) || []
  );
}

async function getWorkspaceMessages(workspaceId: string) {
  return (
    (await supabaseServiceFetch<ClientPortalMessage[]>(
      `axiom_workspace_messages?select=id,workspace_id,customer_id,author_type,author_label,subject,body,status,created_at&workspace_id=eq.${encodeURIComponent(workspaceId)}&order=created_at.desc&limit=8`,
    )) || []
  );
}

async function getWorkspaceApprovalGates(workspaceId: string) {
  return (
    (await supabaseServiceFetch<ClientPortalApprovalGate[]>(
      `axiom_workspace_approval_gates?select=id,workspace_id,customer_id,gate_type,title,description,status,requested_at,responded_at&workspace_id=eq.${encodeURIComponent(workspaceId)}&order=requested_at.desc&limit=8`,
    )) || []
  );
}

export async function loadClientPortalData(redirectTo: string): Promise<ClientPortalLiveData> {
  const authContext = await getAxiomAuthContext();

  if (!authContext.user) {
    redirect(`/login?redirect=${redirectTo}`);
  }

  if (!authContext.customer) {
    redirect("/bespoke/apply?error=customer");
  }

  const workspace = await getLatestWorkspace(authContext.customer.id);
  const serviceRequest = workspace?.service_request_id
    ? await getServiceRequestById(workspace.service_request_id)
    : await getLatestServiceRequest(authContext.customer.id);

  const latestActivity = workspace ? await getLatestActivity(workspace.id) : null;
  const documents = workspace ? await getWorkspaceDocuments(workspace.id) : [];
  const deliverables = workspace ? await getWorkspaceDeliverables(workspace.id) : [];
  const invoices = workspace ? await getWorkspaceInvoices(workspace.id) : [];
  const messages = workspace ? await getWorkspaceMessages(workspace.id) : [];
  const approvalGates = workspace ? await getWorkspaceApprovalGates(workspace.id) : [];

  return {
    user: authContext.user,
    customer: authContext.customer,
    workspace,
    serviceRequest,
    latestActivity,
    documents,
    deliverables,
    invoices,
    messages,
    approvalGates,
  };
}
