-- AXIOM ARCHITECT PROPOSALS-ONLY CLEANUP
-- WARNING: REVIEW BEFORE RUNNING.
--
-- Purpose:
--   Remove proposal draft/client delivery/payment test data only.
--
-- This script DOES delete:
--   - public.axiom_stripe_events rows where proposal_id is not null
--   - public.axiom_proposals rows
--
-- This script DOES NOT delete:
--   - auth users
--   - public.axiom_customers
--   - public.axiom_service_requests
--   - public.axiom_orders
--   - public.axiom_workflow_submissions
--   - public.axiom_audit_reports
--   - public.axiom_client_workspaces
--   - public.axiom_workspace_documents
--   - public.axiom_workspace_deliverables
--
-- Storage is not touched by this SQL. Proposal PDFs under
-- axiom-client-deliverables/proposals/... are listed for manual review.
--
-- Safety:
--   ROLLBACK is the default.
--   Only uncomment COMMIT after reviewing the pre-delete counts and the
--   post-delete verification output inside the transaction.


-- ---------------------------------------------------------------------------
-- 1) PRE-DELETE COUNTS: proposal-only data selected for cleanup
-- ---------------------------------------------------------------------------

select
  'DELETE TARGET: public.axiom_proposals' as check_name,
  count(*) as row_count
from public.axiom_proposals;

select
  'DELETE TARGET: public.axiom_stripe_events where proposal_id is not null' as check_name,
  count(*) as row_count
from public.axiom_stripe_events
where proposal_id is not null;


-- ---------------------------------------------------------------------------
-- 2) MANUAL STORAGE REVIEW: proposal PDF paths to review outside SQL
-- ---------------------------------------------------------------------------

select
  'MANUAL STORAGE REVIEW: proposal PDF paths' as check_name,
  id as proposal_id,
  proposal_reference,
  client_email,
  pdf_file_path
from public.axiom_proposals
where pdf_file_path is not null
order by updated_at desc nulls last;


-- ---------------------------------------------------------------------------
-- 3) PRESERVATION COUNTS: these tables must not be cleaned by this script
-- ---------------------------------------------------------------------------

select 'PRESERVE: public.axiom_customers' as check_name, count(*) as row_count
from public.axiom_customers;

select 'PRESERVE: public.axiom_service_requests' as check_name, count(*) as row_count
from public.axiom_service_requests;

select 'PRESERVE: public.axiom_orders' as check_name, count(*) as row_count
from public.axiom_orders;

select 'PRESERVE: public.axiom_workflow_submissions' as check_name, count(*) as row_count
from public.axiom_workflow_submissions;

select 'PRESERVE: public.axiom_audit_reports' as check_name, count(*) as row_count
from public.axiom_audit_reports;

select 'PRESERVE: public.axiom_client_workspaces' as check_name, count(*) as row_count
from public.axiom_client_workspaces;

select 'PRESERVE: public.axiom_workspace_documents' as check_name, count(*) as row_count
from public.axiom_workspace_documents;

select 'PRESERVE: public.axiom_workspace_deliverables' as check_name, count(*) as row_count
from public.axiom_workspace_deliverables;


-- ---------------------------------------------------------------------------
-- 4) CLEANUP TRANSACTION
-- ---------------------------------------------------------------------------

begin;

-- Delete proposal-linked Stripe event ledger rows first.
-- This preserves any non-proposal Stripe event rows where proposal_id is null.
delete from public.axiom_stripe_events
where proposal_id is not null;

-- Delete proposal-only records last.
-- This clears proposal draft, client access token, PDF path, delivery state,
-- manual payment status, and Stripe invoice metadata stored on proposals.
delete from public.axiom_proposals;


-- ---------------------------------------------------------------------------
-- 5) POST-DELETE VERIFICATION INSIDE THE TRANSACTION
-- ---------------------------------------------------------------------------

select
  'VERIFY DELETE TARGET: public.axiom_proposals' as check_name,
  count(*) as remaining_rows
from public.axiom_proposals;

select
  'VERIFY DELETE TARGET: public.axiom_stripe_events where proposal_id is not null' as check_name,
  count(*) as remaining_rows
from public.axiom_stripe_events
where proposal_id is not null;

select
  'VERIFY PRESERVED: public.axiom_customers' as check_name,
  count(*) as row_count
from public.axiom_customers;

select
  'VERIFY PRESERVED: public.axiom_service_requests' as check_name,
  count(*) as row_count
from public.axiom_service_requests;

select
  'VERIFY PRESERVED: public.axiom_orders' as check_name,
  count(*) as row_count
from public.axiom_orders;

select
  'VERIFY PRESERVED: public.axiom_workflow_submissions' as check_name,
  count(*) as row_count
from public.axiom_workflow_submissions;

select
  'VERIFY PRESERVED: public.axiom_audit_reports' as check_name,
  count(*) as row_count
from public.axiom_audit_reports;


-- ---------------------------------------------------------------------------
-- 6) DEFAULT SAFE ENDING
-- ---------------------------------------------------------------------------

rollback;

-- After reviewing all counts above, replace rollback with commit:
-- commit;
