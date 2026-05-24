import type { Metadata } from "next";
import Link from "next/link";
import { requireAxiomAdmin } from "../../../../lib/axiom-admin";
import { formatDate, label } from "../../../../lib/axiom-admin-dashboard";
import { AdminSection, AdminShell, StatCard, buttonClass, statusPill } from "../../../../components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Client Updates | Axiom Architect Admin",
  description: "Internal Axiom Architect monitor for client-visible workspace updates and read status.",
};

export const dynamic = "force-dynamic";

type ClientUpdate = {
  id: string;
  workspace_id: string;
  customer_id: string;
  author_type: string;
  author_label: string;
  subject: string | null;
  body: string;
  status: string;
  created_at: string;
  updated_at: string;
};

type Workspace = {
  id: string;
  customer_id: string;
  workspace_name: string;
  status: string | null;
  current_phase: string | null;
};

type Customer = {
  id: string;
  email: string | null;
  full_name: string | null;
  business_name: string | null;
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

  const text = await response.text();

  if (!response.ok) {
    console.error("Admin client updates request failed", path, text);
    return null;
  }

  return text ? (JSON.parse(text) as T) : ([] as T);
}

async function loadClientUpdates() {
  const [updates, workspaces, customers] = await Promise.all([
    supabaseFetch<ClientUpdate[]>(
      "axiom_workspace_messages?select=id,workspace_id,customer_id,author_type,author_label,subject,body,status,created_at,updated_at&order=created_at.desc&limit=200",
    ),
    supabaseFetch<Workspace[]>(
      "axiom_client_workspaces?select=id,customer_id,workspace_name,status,current_phase&order=updated_at.desc&limit=250",
    ),
    supabaseFetch<Customer[]>(
      "axiom_customers?select=id,email,full_name,business_name&order=created_at.desc&limit=300",
    ),
  ]);

  return {
    updates: updates || [],
    workspaces: workspaces || [],
    customers: customers || [],
  };
}

function clientName(customer: Customer | null) {
  return customer?.business_name || customer?.full_name || customer?.email || "Unknown client";
}

function preview(value: string) {
  return value.length > 240 ? `${value.slice(0, 240)}...` : value;
}

export default async function AdminClientUpdatesPage() {
  const { adminEmail } = await requireAxiomAdmin();
  const data = await loadClientUpdates();
  const workspacesById = new Map(data.workspaces.map((workspace) => [workspace.id, workspace]));
  const customersById = new Map(data.customers.map((customer) => [customer.id, customer]));

  const sent = data.updates.filter((update) => update.status === "sent").length;
  const read = data.updates.filter((update) => update.status === "read").length;
  const archived = data.updates.filter((update) => update.status === "archived").length;

  return (
    <AdminShell
      adminEmail={adminEmail}
      eyebrow="Client updates"
      title="Message status monitor."
      intro="See which client-visible workspace updates are still sent, which have been read, and which have been archived."
      activePath="/admin/proposals"
    >
      <section className="bg-[#9ed39f] px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-5 md:grid-cols-4">
          <StatCard title="Updates" value={String(data.updates.length)} helper="Client-visible messages" />
          <StatCard title="Sent" value={String(sent)} helper="Awaiting read status" />
          <StatCard title="Read" value={String(read)} helper="Marked by client" />
          <StatCard title="Archived" value={String(archived)} helper="Closed updates" />
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-8">
          <AdminSection eyebrow="Monitor" title="Client-visible updates">
            <div className="mb-6 flex flex-wrap gap-3">
              <Link href="/admin/proposals" className={buttonClass}>Proposal clients</Link>
              <Link href="/admin/proposals/documents" className={buttonClass}>Files received</Link>
              <Link href="/admin/proposals/deliverables" className={buttonClass}>Sent deliverables</Link>
            </div>

            {data.updates.length > 0 ? (
              <div className="grid gap-4">
                {data.updates.map((update) => {
                  const workspace = workspacesById.get(update.workspace_id) || null;
                  const customer = customersById.get(update.customer_id) || null;

                  return (
                    <article key={update.id} className="grid gap-5 border border-[#9ed39f]/20 bg-black/36 p-5 xl:grid-cols-[0.85fr_1.15fr]">
                      <div>
                        <div className="flex flex-wrap gap-2">
                          {statusPill(update.status)}
                          {statusPill(update.author_type)}
                          {statusPill(workspace?.current_phase)}
                        </div>
                        <h3 className="mt-4 break-words text-2xl font-black uppercase leading-tight tracking-[-0.05em] text-white">
                          {update.subject || "Workspace update"}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-white/68">
                          {clientName(customer)} · {customer?.email || "Email not set"}
                        </p>
                        <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-white/44">
                          Created {formatDate(update.created_at)} · Updated {formatDate(update.updated_at)}
                        </p>
                        {workspace ? (
                          <div className="mt-5 flex flex-wrap gap-3">
                            <Link href={`/admin/proposals/${workspace.id}`} className={buttonClass}>Open workspace</Link>
                          </div>
                        ) : null}
                      </div>

                      <aside className="border border-[#9ed39f]/18 bg-[#030804] p-5">
                        <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">Update body</p>
                        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-white/72">{preview(update.body)}</p>
                        <div className="mt-5 grid gap-2 text-sm leading-7 text-white/62 md:grid-cols-2">
                          <p><strong className="text-[#9ed39f]">Workspace:</strong> {workspace?.workspace_name || "Workspace not found"}</p>
                          <p><strong className="text-[#9ed39f]">Workspace status:</strong> {label(workspace?.status)}</p>
                          <p><strong className="text-[#9ed39f]">Message status:</strong> {label(update.status)}</p>
                          <p><strong className="text-[#9ed39f]">Author:</strong> {update.author_label}</p>
                        </div>
                      </aside>
                    </article>
                  );
                })}
              </div>
            ) : (
              <article className="border border-[#9ed39f]/20 bg-black/36 p-6">
                <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white">No client updates yet.</h3>
                <p className="mt-3 text-sm leading-7 text-white/68">Client-visible update records will appear here once sent from a workspace.</p>
              </article>
            )}
          </AdminSection>
        </div>
      </section>
    </AdminShell>
  );
}
