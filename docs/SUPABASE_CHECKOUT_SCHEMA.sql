-- Axiom Architect checkout persistence schema
-- Run this in Supabase SQL Editor before enabling the Axiom Stripe webhook.
--
-- Your Supabase project already has Stripe-managed tables under the `stripe` schema.
-- Do not edit those tables directly for app workflow state.
--
-- These public tables are Axiom-specific records used by the app:
-- axiom_customer -> axiom_order -> axiom_workflow_submission.

create extension if not exists pgcrypto;

create table if not exists public.axiom_customers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text,
  business_name text,
  stripe_customer_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.axiom_orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.axiom_customers(id) on delete set null,
  stripe_checkout_session_id text not null unique,
  stripe_customer_id text,
  stripe_payment_intent_id text,
  tier_slug text not null,
  service_name text not null,
  amount_total integer,
  currency text,
  payment_status text not null default 'paid',
  status text not null default 'paid',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.axiom_workflow_submissions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.axiom_customers(id) on delete set null,
  order_id uuid not null unique references public.axiom_orders(id) on delete cascade,
  tier_slug text not null,
  workflow_title text not null default 'Untitled workflow',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.axiom_customers enable row level security;
alter table public.axiom_orders enable row level security;
alter table public.axiom_workflow_submissions enable row level security;

-- Service-role writes are used by the webhook.
-- Customer-facing dashboard policies should be added when Supabase Auth is wired.
-- Keep the existing `stripe` schema untouched; it remains the synced Stripe data layer.
