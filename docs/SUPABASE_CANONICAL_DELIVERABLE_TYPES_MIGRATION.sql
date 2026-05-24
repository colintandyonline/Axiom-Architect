-- Axiom Architect - Canonical Deliverable Type Migration
-- Purpose:
--   Align axiom_workspace_deliverables.deliverable_type with the shared canonical
--   deliverable model in lib/axiom-package-model.ts while preserving older values.
--
-- Why this exists:
--   The application now allows admins to choose canonical deliverable types, but the
--   upload route still maps those values to the older database-safe constraint values
--   until this migration is applied in Supabase.
--
-- Safe rollout:
--   1. Run this SQL in the Supabase SQL editor.
--   2. Confirm uploads still work from /admin/proposals/deliverables.
--   3. Confirm /client/deliverables shows clean client-facing labels.
--   4. In a later code step, remove the temporary database-safe mapping from the upload route.
--
-- Notes:
--   - This migration does not remove older values.
--   - Existing rows remain valid.
--   - No secrets are stored or required here.

alter table public.axiom_workspace_deliverables
  drop constraint if exists axiom_workspace_deliverables_type_check;

alter table public.axiom_workspace_deliverables
  add constraint axiom_workspace_deliverables_type_check check (
    deliverable_type in (
      -- Canonical deliverable types from lib/axiom-package-model.ts
      'workflow_diagnosis',
      'workflow_map',
      'risk_review_matrix',
      'automation_opportunity_map',
      'ai_assistant_opportunity_map',
      'tool_stack_architecture',
      'implementation_sequence',
      'ai_operating_protocol',
      'agent_instruction_kit',
      'implementation_workbook',
      'developer_build_brief',
      'stewardship_review',
      'departmental_architecture_map',
      'enterprise_architecture_report',
      'handoff_pack',

      -- Legacy database-safe values retained for existing records and rollback safety
      'architecture_blueprint',
      'automation_suitability_review',
      'governance_plan',
      'final_report',
      'other'
    )
  );
