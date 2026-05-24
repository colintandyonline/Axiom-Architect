# Axiom Client Portal Schema Notes

## Canonical deliverable type follow-up

The original client portal schema in `docs/SUPABASE_CLIENT_PORTAL_SCHEMA.sql` creates `axiom_workspace_deliverables.deliverable_type` with an older database constraint.

The application now uses the shared canonical deliverable model in `lib/axiom-package-model.ts` for admin-facing deliverable selection and client-facing labels.

Run this migration after the original portal schema is installed:

```text
SUPABASE_CANONICAL_DELIVERABLE_TYPES_MIGRATION.sql
```

That migration expands the existing `axiom_workspace_deliverables_type_check` constraint so the database accepts canonical deliverable values while keeping the older values for existing records and rollback safety.

## Current safe runtime behaviour

Until the migration is run in Supabase, the upload route keeps a compatibility bridge:

- Admins select canonical deliverable types.
- The upload route writes a database-safe `deliverable_type` value.
- The exact canonical value is preserved in `metadata.canonical_deliverable_type`.
- The client portal reads metadata and displays the clean client-facing label.

This means the app remains safe before and after the migration.

## Post-migration cleanup

After confirming the migration has been applied and deliverable uploads still work, the compatibility bridge can be simplified so `deliverable_type` stores the canonical value directly.

Do not remove the bridge before applying the migration in Supabase.
