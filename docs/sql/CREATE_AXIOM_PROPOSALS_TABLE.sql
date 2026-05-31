-- Axiom Architect proposal draft preparation table.
-- Run this in Supabase before using the admin proposal draft workflow.

create table if not exists public.axiom_proposals (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid null references public.axiom_customers(id) on delete set null,
  source_record_id text null,
  source_record_type text null,
  proposal_reference text not null unique,
  proposal_type text not null default 'standard',
  status text not null default 'draft',
  client_name text,
  business_name text,
  client_email text,
  workspace_name text not null,
  recommended_service_route text not null,
  alternative_service_route text null,
  client_summary text null,
  current_problem_summary text null,
  desired_outcome text null,
  scope_summary text null,
  included_work_json jsonb not null default '[]'::jsonb,
  deliverables_json jsonb not null default '[]'::jsonb,
  timeline_json jsonb not null default '[]'::jsonb,
  exclusions_json jsonb not null default '[]'::jsonb,
  client_responsibilities_json jsonb not null default '[]'::jsonb,
  assumptions_json jsonb not null default '[]'::jsonb,
  pricing_json jsonb not null default '{}'::jsonb,
  internal_pricing_notes text null,
  client_price_explanation text null,
  internal_risk_notes text null,
  revision_notes text null,
  payment_terms_json jsonb not null default '{}'::jsonb,
  valid_until timestamptz null,
  proposal_json jsonb not null default '{}'::jsonb,
  pdf_file_path text null,
  pdf_ready boolean not null default false,
  pdf_generated_at timestamptz null,
  client_access_token_hash text null,
  client_access_token_created_at timestamptz null,
  client_access_token_last_used_at timestamptz null,
  client_access_expires_at timestamptz null,
  sent_at timestamptz null,
  viewed_at timestamptz null,
  accepted_at timestamptz null,
  changes_requested_at timestamptz null,
  change_request_message text null,
  deposit_paid_at timestamptz null,
  final_balance_requested_at timestamptz null,
  final_balance_paid_at timestamptz null,
  payment_status text null,
  payment_status_note text null,
  converted_order_id uuid null references public.axiom_orders(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.axiom_proposals enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'axiom_proposals_type_check'
  ) then
    alter table public.axiom_proposals
      add constraint axiom_proposals_type_check
      check (proposal_type in ('simple', 'standard', 'strategic'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'axiom_proposals_status_check'
  ) then
    alter table public.axiom_proposals
      add constraint axiom_proposals_status_check
      check (status in ('draft', 'internal_review', 'ready_to_send', 'sent', 'viewed', 'accepted', 'changes_requested', 'expired'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'axiom_proposals_payment_status_check'
  ) then
    alter table public.axiom_proposals
      add constraint axiom_proposals_payment_status_check
      check (
        payment_status is null
        or payment_status in ('unpaid', 'deposit_pending', 'deposit_paid', 'final_balance_due', 'paid_complete', 'refunded', 'cancelled')
      );
  end if;
end $$;

create index if not exists axiom_proposals_customer_id_idx
  on public.axiom_proposals(customer_id);

create index if not exists axiom_proposals_source_record_idx
  on public.axiom_proposals(source_record_type, source_record_id);

create index if not exists axiom_proposals_status_idx
  on public.axiom_proposals(status);

create index if not exists axiom_proposals_client_token_hash_idx
  on public.axiom_proposals(client_access_token_hash);

create index if not exists axiom_proposals_sent_at_idx
  on public.axiom_proposals(sent_at desc);

create index if not exists axiom_proposals_accepted_at_idx
  on public.axiom_proposals(accepted_at desc);

create index if not exists axiom_proposals_payment_status_idx
  on public.axiom_proposals(payment_status);

create index if not exists axiom_proposals_deposit_paid_at_idx
  on public.axiom_proposals(deposit_paid_at desc);

create index if not exists axiom_proposals_final_balance_paid_at_idx
  on public.axiom_proposals(final_balance_paid_at desc);

create index if not exists axiom_proposals_updated_at_idx
  on public.axiom_proposals(updated_at desc);

drop policy if exists "Axiom service role can manage proposal drafts" on public.axiom_proposals;
create policy "Axiom service role can manage proposal drafts"
on public.axiom_proposals
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

-- Client-facing proposal access is handled by server-side token validation.
-- The storage bucket must remain private.
