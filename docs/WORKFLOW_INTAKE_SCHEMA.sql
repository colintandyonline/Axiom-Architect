-- Axiom Architect workflow intake and report schema
-- Run this after docs/SUPABASE_CHECKOUT_SCHEMA.sql has created:
-- public.axiom_customers
-- public.axiom_orders
-- public.axiom_workflow_submissions
--
-- Purpose:
-- Extend the paid workflow submission slot into the full staged intake record.
-- Add a separate report table for generated diagnostic/blueprint output.
-- Keep Stripe-managed tables in the `stripe` schema untouched.

create extension if not exists pgcrypto;

-- 1. Workflow intake fields

alter table public.axiom_workflow_submissions
  add column if not exists current_stage integer not null default 1,
  add column if not exists intake_payload jsonb not null default '{}'::jsonb,

  -- Stage 1: Business Context
  add column if not exists business_type text,
  add column if not exists user_role text,
  add column if not exists team_size text,
  add column if not exists industry text,
  add column if not exists business_description text,

  -- Stage 2: Workflow Overview
  add column if not exists workflow_goal text,
  add column if not exists people_involved text,
  add column if not exists workflow_frequency text,
  add column if not exists workflow_trigger text,

  -- Stage 3: Current Process
  add column if not exists current_process_steps text,
  add column if not exists tools_used text,
  add column if not exists inputs_needed text,
  add column if not exists outputs_produced text,
  add column if not exists handoffs text,
  add column if not exists information_storage text,

  -- Stage 4: Pain Points
  add column if not exists workflow_slowdowns text,
  add column if not exists manual_repetition text,
  add column if not exists mistake_points text,
  add column if not exists delay_causes text,
  add column if not exists team_or_client_frustrations text,

  -- Stage 5: Risk and Review
  add column if not exists failure_impact text,
  add column if not exists human_approval_needed text,
  add column if not exists risk_areas text,
  add column if not exists protected_decisions text,

  -- Stage 6: Desired Outcome
  add column if not exists ideal_workflow text,
  add column if not exists assistant_support_requested text,
  add column if not exists tools_open_to_using text,
  add column if not exists success_definition text,

  -- Stage 7: Review and Submit
  add column if not exists intake_completed_at timestamptz,
  add column if not exists submitted_at timestamptz;

-- Keep workflow status controlled, but leave it as text for simple dashboard/report handling.
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'axiom_workflow_submissions_status_check'
  ) then
    alter table public.axiom_workflow_submissions
      add constraint axiom_workflow_submissions_status_check
      check (status in ('draft', 'submitted', 'processing', 'ready', 'delivered', 'needs_more_context'))
      not valid;
  end if;
end $$;

alter table public.axiom_workflow_submissions
  validate constraint axiom_workflow_submissions_status_check;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'axiom_workflow_submissions_current_stage_check'
  ) then
    alter table public.axiom_workflow_submissions
      add constraint axiom_workflow_submissions_current_stage_check
      check (current_stage between 1 and 7)
      not valid;
  end if;
end $$;

alter table public.axiom_workflow_submissions
  validate constraint axiom_workflow_submissions_current_stage_check;

-- 2. Report output table
-- Generated report data lives separately from intake data.
-- This keeps customer-submitted source material clean and lets the report engine regenerate versions later.

create table if not exists public.axiom_audit_reports (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique references public.axiom_workflow_submissions(id) on delete cascade,
  customer_id uuid references public.axiom_customers(id) on delete set null,
  order_id uuid references public.axiom_orders(id) on delete set null,
  tier_slug text not null,
  status text not null default 'queued',

  workflow_summary text,
  diagnostic_summary text,
  automation_suitability_score integer,
  report_json jsonb not null default '{}'::jsonb,
  diagnostic_findings jsonb not null default '[]'::jsonb,
  automation_opportunities jsonb not null default '[]'::jsonb,
  assistant_opportunities jsonb not null default '[]'::jsonb,
  risk_review_gates jsonb not null default '[]'::jsonb,
  implementation_recommendations jsonb not null default '[]'::jsonb,
  upgrade_recommendation text,

  pdf_url text,
  generated_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.axiom_audit_reports enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'axiom_audit_reports_status_check'
  ) then
    alter table public.axiom_audit_reports
      add constraint axiom_audit_reports_status_check
      check (status in ('queued', 'processing', 'ready', 'delivered', 'failed', 'needs_more_context'))
      not valid;
  end if;
end $$;

alter table public.axiom_audit_reports
  validate constraint axiom_audit_reports_status_check;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'axiom_audit_reports_score_check'
  ) then
    alter table public.axiom_audit_reports
      add constraint axiom_audit_reports_score_check
      check (automation_suitability_score is null or automation_suitability_score between 0 and 100)
      not valid;
  end if;
end $$;

alter table public.axiom_audit_reports
  validate constraint axiom_audit_reports_score_check;

-- 3. Helpful indexes for dashboard, admin, and report generation queries

create index if not exists axiom_workflow_submissions_customer_id_idx
  on public.axiom_workflow_submissions(customer_id);

create index if not exists axiom_workflow_submissions_order_id_idx
  on public.axiom_workflow_submissions(order_id);

create index if not exists axiom_workflow_submissions_status_idx
  on public.axiom_workflow_submissions(status);

create index if not exists axiom_workflow_submissions_tier_slug_idx
  on public.axiom_workflow_submissions(tier_slug);

create index if not exists axiom_audit_reports_customer_id_idx
  on public.axiom_audit_reports(customer_id);

create index if not exists axiom_audit_reports_order_id_idx
  on public.axiom_audit_reports(order_id);

create index if not exists axiom_audit_reports_status_idx
  on public.axiom_audit_reports(status);

create index if not exists axiom_audit_reports_tier_slug_idx
  on public.axiom_audit_reports(tier_slug);

-- 4. updated_at helper

create or replace function public.axiom_set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists axiom_workflow_submissions_set_updated_at on public.axiom_workflow_submissions;
create trigger axiom_workflow_submissions_set_updated_at
before update on public.axiom_workflow_submissions
for each row
execute function public.axiom_set_updated_at();

drop trigger if exists axiom_audit_reports_set_updated_at on public.axiom_audit_reports;
create trigger axiom_audit_reports_set_updated_at
before update on public.axiom_audit_reports
for each row
execute function public.axiom_set_updated_at();
