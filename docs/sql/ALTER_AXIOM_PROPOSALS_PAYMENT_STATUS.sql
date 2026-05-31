-- Axiom Architect manual proposal payment status controls.
-- Run this before using admin payment lifecycle actions.

alter table public.axiom_proposals
  add column if not exists deposit_paid_at timestamptz null,
  add column if not exists final_balance_requested_at timestamptz null,
  add column if not exists final_balance_paid_at timestamptz null,
  add column if not exists payment_status text null,
  add column if not exists payment_status_note text null;

alter table public.axiom_proposals
  drop constraint if exists axiom_proposals_payment_status_check;

alter table public.axiom_proposals
  add constraint axiom_proposals_payment_status_check
  check (
    payment_status is null
    or payment_status in (
      'unpaid',
      'deposit_pending',
      'deposit_paid',
      'final_balance_due',
      'paid_complete',
      'refunded',
      'cancelled'
    )
  );

create index if not exists axiom_proposals_payment_status_idx
  on public.axiom_proposals(payment_status);

create index if not exists axiom_proposals_deposit_paid_at_idx
  on public.axiom_proposals(deposit_paid_at desc);

create index if not exists axiom_proposals_final_balance_paid_at_idx
  on public.axiom_proposals(final_balance_paid_at desc);
