-- Axiom Architect - Stripe proposal payment sync
-- Run this in the Supabase SQL editor before enabling the Stripe webhook.

alter table public.axiom_proposals
  add column if not exists stripe_customer_id text null,
  add column if not exists stripe_deposit_invoice_id text null,
  add column if not exists stripe_final_invoice_id text null,
  add column if not exists stripe_deposit_payment_intent_id text null,
  add column if not exists stripe_final_payment_intent_id text null,
  add column if not exists stripe_latest_event_id text null,
  add column if not exists stripe_latest_event_type text null,
  add column if not exists stripe_payment_synced_at timestamptz null,
  add column if not exists stripe_last_error text null;

create table if not exists public.axiom_stripe_events (
  id text primary key,
  event_type text not null,
  proposal_id uuid null references public.axiom_proposals(id) on delete set null,
  payment_stage text null,
  processed_at timestamptz not null default now(),
  payload jsonb null
);

alter table public.axiom_stripe_events enable row level security;

drop policy if exists "Service role can manage axiom stripe events" on public.axiom_stripe_events;
create policy "Service role can manage axiom stripe events"
  on public.axiom_stripe_events
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create index if not exists axiom_proposals_stripe_customer_idx
  on public.axiom_proposals(stripe_customer_id);

create index if not exists axiom_proposals_stripe_deposit_invoice_idx
  on public.axiom_proposals(stripe_deposit_invoice_id);

create index if not exists axiom_proposals_stripe_final_invoice_idx
  on public.axiom_proposals(stripe_final_invoice_id);

create index if not exists axiom_stripe_events_proposal_idx
  on public.axiom_stripe_events(proposal_id);
