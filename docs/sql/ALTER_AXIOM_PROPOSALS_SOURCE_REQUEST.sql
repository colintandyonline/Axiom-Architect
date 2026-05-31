-- Axiom Architect proposal source-link fields.
-- Run this if axiom_proposals already exists before using proposal source prefill.

alter table public.axiom_proposals
  add column if not exists source_record_id text null,
  add column if not exists source_record_type text null;

create index if not exists axiom_proposals_source_record_idx
  on public.axiom_proposals(source_record_type, source_record_id);
