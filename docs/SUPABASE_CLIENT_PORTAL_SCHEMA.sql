-- Axiom Architect - Premium Client Portal Supabase Schema
-- Purpose:
--   Adds the database layer for the premium /client portal without changing the existing
--   standard audit flow tables.
--
-- Existing audit flow tables stay separate:
--   axiom_customers
--   axiom_orders
--   axiom_workflow_submissions
--   axiom_audit_reports
--   axiom_product_intake_schemas
--
-- Premium client portal tables added here:
--   axiom_service_requests
--   axiom_client_workspaces
--   axiom_workspace_activity
--   axiom_workspace_documents
--   axiom_workspace_deliverables
--   axiom_workspace_invoices
--   axiom_workspace_messages
--   axiom_workspace_approval_gates
--
-- Notes:
--   1. Run this in Supabase SQL editor after reviewing table names.
--   2. Do not store secrets, API keys, passwords, or payment card data in these tables.
--   3. Server routes may use SUPABASE_SERVICE_ROLE_KEY, but browser/client access should rely on RLS.
--   4. The client ownership path is always customer -> workspace -> portal records.

create extension if not exists pgcrypto;

create or replace function public.axiom_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.axiom_service_requests (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.axiom_customers(id) on delete cascade,
  request_type text not null default 'custom_workflow_systems',
  source text not null default 'bespoke_apply_form',
  status text not null default 'pending_review',
  proposal_status text not null default 'not_prepared',
  contact_name text not null,
  email text not null,
  business_name text not null,
  role text,
  website text,
  scope_type text,
  support_type text,
  budget_range text,
  timeline text,
  sensitive_data text,
  summary_message text,
  request_payload jsonb not null default '{}'::jsonb,
  internal_notes text,
  reviewed_at timestamptz,
  proposal_sent_at timestamptz,
  accepted_at timestamptz,
  declined_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint axiom_service_requests_status_check check (
    status in (
      'pending_review',
      'reviewing',
      'proposal_prepared',
      'proposal_sent',
      'accepted',
      'declined',
      'converted',
      'closed'
    )
  ),
  constraint axiom_service_requests_proposal_status_check check (
    proposal_status in (
      'not_prepared',
      'drafting',
      'ready_to_send',
      'sent',
      'accepted',
      'declined',
      'expired'
    )
  )
);

create index if not exists axiom_service_requests_customer_id_idx
  on public.axiom_service_requests(customer_id);

create index if not exists axiom_service_requests_status_idx
  on public.axiom_service_requests(status);

create index if not exists axiom_service_requests_created_at_idx
  on public.axiom_service_requests(created_at desc);

drop trigger if exists axiom_service_requests_set_updated_at on public.axiom_service_requests;
create trigger axiom_service_requests_set_updated_at
before update on public.axiom_service_requests
for each row execute function public.axiom_set_updated_at();

create table if not exists public.axiom_client_workspaces (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.axiom_customers(id) on delete cascade,
  service_request_id uuid references public.axiom_service_requests(id) on delete set null,
  order_id uuid references public.axiom_orders(id) on delete set null,
  workspace_name text not null default 'Client workspace',
  workspace_type text not null default 'premium_client_portal',
  status text not null default 'active',
  current_phase text not null default 'discovery',
  current_priority text,
  next_client_action text,
  axiom_review_focus text,
  last_activity_at timestamptz,
  opened_at timestamptz not null default now(),
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint axiom_client_workspaces_status_check check (
    status in ('active', 'paused', 'waiting_on_client', 'in_review', 'completed', 'closed')
  ),
  constraint axiom_client_workspaces_phase_check check (
    current_phase in (
      'discovery',
      'workflow_mapping',
      'architecture_design',
      'implementation_blueprint',
      'review_and_approval',
      'handoff',
      'retainer'
    )
  )
);

create index if not exists axiom_client_workspaces_customer_id_idx
  on public.axiom_client_workspaces(customer_id);

create index if not exists axiom_client_workspaces_service_request_id_idx
  on public.axiom_client_workspaces(service_request_id);

create index if not exists axiom_client_workspaces_status_idx
  on public.axiom_client_workspaces(status);

drop trigger if exists axiom_client_workspaces_set_updated_at on public.axiom_client_workspaces;
create trigger axiom_client_workspaces_set_updated_at
before update on public.axiom_client_workspaces
for each row execute function public.axiom_set_updated_at();

create table if not exists public.axiom_workspace_activity (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.axiom_client_workspaces(id) on delete cascade,
  customer_id uuid not null references public.axiom_customers(id) on delete cascade,
  actor_type text not null default 'system',
  actor_label text not null default 'Axiom Architect',
  activity_type text not null,
  title text not null,
  body text,
  metadata jsonb not null default '{}'::jsonb,
  is_client_visible boolean not null default true,
  created_at timestamptz not null default now(),
  constraint axiom_workspace_activity_actor_type_check check (
    actor_type in ('client', 'axiom', 'system')
  )
);

create index if not exists axiom_workspace_activity_workspace_id_idx
  on public.axiom_workspace_activity(workspace_id);

create index if not exists axiom_workspace_activity_customer_id_idx
  on public.axiom_workspace_activity(customer_id);

create index if not exists axiom_workspace_activity_created_at_idx
  on public.axiom_workspace_activity(created_at desc);

create table if not exists public.axiom_workspace_documents (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.axiom_client_workspaces(id) on delete cascade,
  customer_id uuid not null references public.axiom_customers(id) on delete cascade,
  uploaded_by_user_id uuid,
  storage_bucket text not null default 'workspace-documents',
  storage_path text not null,
  original_filename text not null,
  file_size_bytes bigint,
  mime_type text,
  document_category text not null default 'general',
  review_status text not null default 'uploaded',
  title text,
  description text,
  evidence_tags text[] not null default '{}',
  linked_workflow_area text,
  axiom_notes text,
  uploaded_at timestamptz not null default now(),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint axiom_workspace_documents_category_check check (
    document_category in (
      'general',
      'current_workflow',
      'bottleneck',
      'tool_stack',
      'team_roles',
      'customer_journey',
      'risk_compliance',
      'automation_opportunity',
      'billing',
      'deliverable_source'
    )
  ),
  constraint axiom_workspace_documents_review_status_check check (
    review_status in ('uploaded', 'under_review', 'reviewed', 'needs_clarification', 'archived')
  )
);

create index if not exists axiom_workspace_documents_workspace_id_idx
  on public.axiom_workspace_documents(workspace_id);

create index if not exists axiom_workspace_documents_customer_id_idx
  on public.axiom_workspace_documents(customer_id);

create index if not exists axiom_workspace_documents_review_status_idx
  on public.axiom_workspace_documents(review_status);

drop trigger if exists axiom_workspace_documents_set_updated_at on public.axiom_workspace_documents;
create trigger axiom_workspace_documents_set_updated_at
before update on public.axiom_workspace_documents
for each row execute function public.axiom_set_updated_at();

create table if not exists public.axiom_workspace_deliverables (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.axiom_client_workspaces(id) on delete cascade,
  customer_id uuid not null references public.axiom_customers(id) on delete cascade,
  deliverable_type text not null,
  title text not null,
  description text,
  status text not null default 'preparing',
  version text not null default 'v1',
  storage_bucket text,
  storage_path text,
  external_url text,
  approval_required boolean not null default false,
  approved_at timestamptz,
  delivered_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint axiom_workspace_deliverables_status_check check (
    status in ('preparing', 'ready_for_review', 'revision_requested', 'approved', 'delivered', 'archived')
  ),
  constraint axiom_workspace_deliverables_type_check check (
    deliverable_type in (
      'architecture_blueprint',
      'workflow_map',
      'automation_suitability_review',
      'ai_operating_protocol',
      'implementation_workbook',
      'governance_plan',
      'final_report',
      'other'
    )
  )
);

create index if not exists axiom_workspace_deliverables_workspace_id_idx
  on public.axiom_workspace_deliverables(workspace_id);

create index if not exists axiom_workspace_deliverables_customer_id_idx
  on public.axiom_workspace_deliverables(customer_id);

create index if not exists axiom_workspace_deliverables_status_idx
  on public.axiom_workspace_deliverables(status);

drop trigger if exists axiom_workspace_deliverables_set_updated_at on public.axiom_workspace_deliverables;
create trigger axiom_workspace_deliverables_set_updated_at
before update on public.axiom_workspace_deliverables
for each row execute function public.axiom_set_updated_at();

create table if not exists public.axiom_workspace_invoices (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.axiom_client_workspaces(id) on delete cascade,
  customer_id uuid not null references public.axiom_customers(id) on delete cascade,
  order_id uuid references public.axiom_orders(id) on delete set null,
  stripe_invoice_id text,
  stripe_payment_link_id text,
  invoice_number text,
  title text not null default 'Axiom Architect invoice',
  description text,
  amount_due integer,
  currency text not null default 'gbp',
  status text not null default 'draft',
  due_at timestamptz,
  paid_at timestamptz,
  invoice_url text,
  receipt_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint axiom_workspace_invoices_status_check check (
    status in ('draft', 'sent', 'open', 'paid', 'void', 'uncollectible', 'refunded')
  )
);

create index if not exists axiom_workspace_invoices_workspace_id_idx
  on public.axiom_workspace_invoices(workspace_id);

create index if not exists axiom_workspace_invoices_customer_id_idx
  on public.axiom_workspace_invoices(customer_id);

create index if not exists axiom_workspace_invoices_status_idx
  on public.axiom_workspace_invoices(status);

drop trigger if exists axiom_workspace_invoices_set_updated_at on public.axiom_workspace_invoices;
create trigger axiom_workspace_invoices_set_updated_at
before update on public.axiom_workspace_invoices
for each row execute function public.axiom_set_updated_at();

create table if not exists public.axiom_workspace_messages (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.axiom_client_workspaces(id) on delete cascade,
  customer_id uuid not null references public.axiom_customers(id) on delete cascade,
  author_type text not null,
  author_label text not null,
  subject text,
  body text not null,
  status text not null default 'sent',
  related_document_id uuid references public.axiom_workspace_documents(id) on delete set null,
  related_deliverable_id uuid references public.axiom_workspace_deliverables(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint axiom_workspace_messages_author_type_check check (
    author_type in ('client', 'axiom', 'system')
  ),
  constraint axiom_workspace_messages_status_check check (
    status in ('sent', 'read', 'archived')
  )
);

create index if not exists axiom_workspace_messages_workspace_id_idx
  on public.axiom_workspace_messages(workspace_id);

create index if not exists axiom_workspace_messages_customer_id_idx
  on public.axiom_workspace_messages(customer_id);

create index if not exists axiom_workspace_messages_created_at_idx
  on public.axiom_workspace_messages(created_at desc);

drop trigger if exists axiom_workspace_messages_set_updated_at on public.axiom_workspace_messages;
create trigger axiom_workspace_messages_set_updated_at
before update on public.axiom_workspace_messages
for each row execute function public.axiom_set_updated_at();

create table if not exists public.axiom_workspace_approval_gates (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.axiom_client_workspaces(id) on delete cascade,
  customer_id uuid not null references public.axiom_customers(id) on delete cascade,
  deliverable_id uuid references public.axiom_workspace_deliverables(id) on delete set null,
  gate_type text not null default 'client_approval',
  title text not null,
  description text,
  status text not null default 'open',
  requested_at timestamptz not null default now(),
  responded_at timestamptz,
  response_note text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint axiom_workspace_approval_gates_status_check check (
    status in ('open', 'approved', 'changes_requested', 'blocked', 'closed')
  )
);

create index if not exists axiom_workspace_approval_gates_workspace_id_idx
  on public.axiom_workspace_approval_gates(workspace_id);

create index if not exists axiom_workspace_approval_gates_customer_id_idx
  on public.axiom_workspace_approval_gates(customer_id);

create index if not exists axiom_workspace_approval_gates_status_idx
  on public.axiom_workspace_approval_gates(status);

drop trigger if exists axiom_workspace_approval_gates_set_updated_at on public.axiom_workspace_approval_gates;
create trigger axiom_workspace_approval_gates_set_updated_at
before update on public.axiom_workspace_approval_gates
for each row execute function public.axiom_set_updated_at();

-- Row Level Security
-- These policies allow authenticated customers to read their own portal records.
-- Mutating records should usually happen through server routes so activity, ownership, and audit history stay controlled.

alter table public.axiom_service_requests enable row level security;
alter table public.axiom_client_workspaces enable row level security;
alter table public.axiom_workspace_activity enable row level security;
alter table public.axiom_workspace_documents enable row level security;
alter table public.axiom_workspace_deliverables enable row level security;
alter table public.axiom_workspace_invoices enable row level security;
alter table public.axiom_workspace_messages enable row level security;
alter table public.axiom_workspace_approval_gates enable row level security;

create or replace function public.axiom_customer_owns_record(record_customer_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.axiom_customers customers
    where customers.id = record_customer_id
      and customers.auth_user_id = auth.uid()
  );
$$;

drop policy if exists "Clients can read own service requests" on public.axiom_service_requests;
create policy "Clients can read own service requests"
on public.axiom_service_requests
for select
using (public.axiom_customer_owns_record(customer_id));

drop policy if exists "Clients can read own workspaces" on public.axiom_client_workspaces;
create policy "Clients can read own workspaces"
on public.axiom_client_workspaces
for select
using (public.axiom_customer_owns_record(customer_id));

drop policy if exists "Clients can read own activity" on public.axiom_workspace_activity;
create policy "Clients can read own activity"
on public.axiom_workspace_activity
for select
using (is_client_visible = true and public.axiom_customer_owns_record(customer_id));

drop policy if exists "Clients can read own documents" on public.axiom_workspace_documents;
create policy "Clients can read own documents"
on public.axiom_workspace_documents
for select
using (public.axiom_customer_owns_record(customer_id));

drop policy if exists "Clients can read own deliverables" on public.axiom_workspace_deliverables;
create policy "Clients can read own deliverables"
on public.axiom_workspace_deliverables
for select
using (public.axiom_customer_owns_record(customer_id));

drop policy if exists "Clients can read own invoices" on public.axiom_workspace_invoices;
create policy "Clients can read own invoices"
on public.axiom_workspace_invoices
for select
using (public.axiom_customer_owns_record(customer_id));

drop policy if exists "Clients can read own messages" on public.axiom_workspace_messages;
create policy "Clients can read own messages"
on public.axiom_workspace_messages
for select
using (public.axiom_customer_owns_record(customer_id));

drop policy if exists "Clients can read own approval gates" on public.axiom_workspace_approval_gates;
create policy "Clients can read own approval gates"
on public.axiom_workspace_approval_gates
for select
using (public.axiom_customer_owns_record(customer_id));

-- Storage bucket for workspace documents.
-- The first secure upload implementation should write files under:
--   {customer_id}/{workspace_id}/{generated_file_id}-{safe_filename}
-- and then create an axiom_workspace_documents record.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'workspace-documents',
  'workspace-documents',
  false,
  52428800,
  array[
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/webp',
    'text/plain',
    'text/csv',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Storage object policies can be added after the signed upload/download route is built.
-- For the first implementation, prefer server-created signed URLs rather than exposing direct browser writes.
