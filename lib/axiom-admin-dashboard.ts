import { isAxiomAdminEmail } from "./axiom-admin";

export type CustomerRecord = {
  id: string;
  email: string | null;
  full_name: string | null;
  business_name: string | null;
  account_status: string | null;
  created_at: string | null;
  last_login_at: string | null;
};

export type OrderRecord = {
  id: string;
  tier_slug: string | null;
  service_name: string | null;
  amount_total: number | null;
  currency: string | null;
  payment_status: string | null;
  status: string | null;
  created_at: string | null;
};

export type WorkflowRecord = {
  id: string;
  tier_slug: string | null;
  workflow_title: string | null;
  status: string | null;
  updated_at: string | null;
};

export type ReportRecord = {
  id: string;
  submission_id: string | null;
  tier_slug: string | null;
  status: string | null;
  quality_score: number | null;
  quality_status: string | null;
  client_summary: string | null;
  generated_at: string | null;
  updated_at: string | null;
};

export type AdminData = {
  customers: CustomerRecord[];
  orders: OrderRecord[];
  workflows: WorkflowRecord[];
  reports: ReportRecord[];
};

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return { url: url.replace(/\/$/, ""), serviceRoleKey };
}

function excludeAdminCustomers(customers?: CustomerRecord[] | null) {
  return (customers || []).filter((customer) => !isAxiomAdminEmail(customer.email));
}

export async function supabaseAdminFetch<T>(path: string): Promise<T | null> {
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

  if (!response.ok) {
    console.error("Admin Supabase request failed", path, await response.text());
    return null;
  }

  return (await response.json()) as T;
}

export async function getAdminData(): Promise<AdminData> {
  const [customers, orders, workflows, reports] = await Promise.all([
    supabaseAdminFetch<CustomerRecord[]>(
      "axiom_customers?select=id,email,full_name,business_name,account_status,created_at,last_login_at&order=created_at.desc&limit=100",
    ),
    supabaseAdminFetch<OrderRecord[]>(
      "axiom_orders?select=id,tier_slug,service_name,amount_total,currency,payment_status,status,created_at&order=created_at.desc&limit=100",
    ),
    supabaseAdminFetch<WorkflowRecord[]>(
      "axiom_workflow_submissions?select=id,tier_slug,workflow_title,status,updated_at&order=updated_at.desc&limit=150",
    ),
    supabaseAdminFetch<ReportRecord[]>(
      "axiom_audit_reports?select=id,submission_id,tier_slug,status,quality_score,quality_status,client_summary,generated_at,updated_at&order=updated_at.desc&limit=100",
    ),
  ]);

  return {
    customers: excludeAdminCustomers(customers),
    orders: orders || [],
    workflows: workflows || [],
    reports: reports || [],
  };
}

export function label(value?: string | null) {
  return value ? value.replace(/_/g, " ") : "—";
}

export function formatDate(value?: string | null) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatCurrency(cents = 0, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

export function workflowTitle(workflow?: WorkflowRecord | null) {
  if (!workflow) {
    return "Linked workflow not found";
  }

  return workflow.workflow_title || "Untitled workflow";
}

export function canApproveReport(status?: string | null) {
  return ["generated", "needs_review"].includes(status || "");
}
