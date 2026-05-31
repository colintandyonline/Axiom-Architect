-- Axiom Architect proposal client delivery layer.
-- Run this before sending proposal links to clients.

alter table public.axiom_proposals
  add column if not exists client_access_token_hash text null,
  add column if not exists client_access_token_created_at timestamptz null,
  add column if not exists client_access_token_last_used_at timestamptz null,
  add column if not exists client_access_expires_at timestamptz null,
  add column if not exists sent_at timestamptz null,
  add column if not exists viewed_at timestamptz null,
  add column if not exists accepted_at timestamptz null,
  add column if not exists changes_requested_at timestamptz null,
  add column if not exists change_request_message text null;

alter table public.axiom_proposals
  drop constraint if exists axiom_proposals_status_check;

alter table public.axiom_proposals
  add constraint axiom_proposals_status_check
  check (
    status in (
      'draft',
      'internal_review',
      'ready_to_send',
      'sent',
      'viewed',
      'accepted',
      'changes_requested',
      'expired'
    )
  );

create index if not exists axiom_proposals_client_token_hash_idx
  on public.axiom_proposals(client_access_token_hash);

create index if not exists axiom_proposals_sent_at_idx
  on public.axiom_proposals(sent_at desc);

create index if not exists axiom_proposals_accepted_at_idx
  on public.axiom_proposals(accepted_at desc);
