-- Axiom Architect auth customer linking schema
-- Run after the existing customer/order/intake/report schema migrations.
--
-- Purpose:
-- Link Supabase Auth users to Axiom customer records without touching Stripe-managed tables.
-- This is the foundation for login, logout, account pages, protected dashboards, and customer-owned audits.

-- 1. Add nullable auth ownership fields to the customer record.
-- auth_user_id stays nullable so existing paid customers are not broken before account claiming/linking is built.

alter table public.axiom_customers
  add column if not exists auth_user_id uuid references auth.users(id) on delete set null,
  add column if not exists last_login_at timestamptz,
  add column if not exists account_status text not null default 'active';

-- 2. Ensure one Auth user can only be linked to one Axiom customer.
-- A partial unique index allows existing unlinked customers to remain valid.

create unique index if not exists axiom_customers_auth_user_id_unique_idx
  on public.axiom_customers(auth_user_id)
  where auth_user_id is not null;

-- 3. Keep account status controlled while still easy to query.

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'axiom_customers_account_status_check'
  ) then
    alter table public.axiom_customers
      add constraint axiom_customers_account_status_check
      check (account_status in ('active', 'pending', 'suspended', 'closed'))
      not valid;
  end if;
end $$;

alter table public.axiom_customers
  validate constraint axiom_customers_account_status_check;

-- 4. Helpful indexes for auth lookup and account dashboards.

create index if not exists axiom_customers_account_status_idx
  on public.axiom_customers(account_status);

create index if not exists axiom_customers_email_idx
  on public.axiom_customers(email);

-- 5. Ensure updated_at is maintained on customer updates.
-- This duplicates the helper safely if it has not already been created by another migration.

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

drop trigger if exists axiom_customers_set_updated_at on public.axiom_customers;
create trigger axiom_customers_set_updated_at
before update on public.axiom_customers
for each row
execute function public.axiom_set_updated_at();
