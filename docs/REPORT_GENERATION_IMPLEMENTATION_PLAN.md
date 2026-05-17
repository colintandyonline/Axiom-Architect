# Report Generation Implementation Plan

## Purpose

This plan turns `docs/AXIOM_REPORT_QUALITY_STANDARD.md` into an implementation path for the Axiom Architect report engine.

The goal is to build the client-results layer in the correct order:

1. Intake is submitted.
2. A report queue record already exists.
3. Structured report JSON is generated.
4. The report is quality checked.
5. The approved report is shown in the client dashboard.
6. The same report JSON is later rendered into a premium PDF.
7. The client is notified by email.

PDF production and Codex-assisted rendering come later. The source of truth must be the report JSON first.

## Current Starting Point

The current intake route already creates a report queue record after the client submits their intake.

Current flow:

1. Client completes checkout.
2. Webhook creates order and draft workflow submission.
3. Dashboard opens the product-specific intake.
4. Client submits intake.
5. `app/api/intake/route.ts` patches `axiom_workflow_submissions` to `status: "submitted"`.
6. The same route upserts into `axiom_audit_reports` with:
   - `submission_id`
   - `customer_id`
   - `order_id`
   - `product_id`
   - `tier_slug`
   - `report_schema_version: 1`
   - `status: "queued"`
   - `updated_at`

That existing `queued` record should remain the starting point for report generation.

## Implementation Principle

Do not generate dashboard text, PDF text, and email text separately.

The system should generate and save one canonical report JSON object. Every client-facing surface should read from it:

- dashboard report page
- downloadable PDF
- email notification summary
- admin review view
- future revision history

## Proposed Tables / Fields

The current `axiom_audit_reports` table can remain the main report table if it already exists. The implementation should extend around it rather than creating unnecessary duplicates.

### `axiom_audit_reports`

Recommended fields:

| Field | Purpose |
| --- | --- |
| `id` | Primary report ID. |
| `submission_id` | Links to the workflow submission. |
| `customer_id` | Links to the client. |
| `order_id` | Links to the purchase. |
| `product_id` | Links to the purchased product. |
| `tier_slug` | Product slug used for report type selection. |
| `report_schema_version` | Version of report JSON schema used. |
| `status` | Lifecycle status. |
| `report_json` | Canonical structured output. |
| `quality_score` | Internal readiness score, usually 0-12. |
| `quality_status` | `ready`, `needs_fixes`, or `blocked`. |
| `reviewer_notes` | Internal review notes. |
| `client_summary` | Short client-facing summary for dashboard cards and email. |
| `pdf_file_id` | Optional reference to generated PDF file. |
| `pdf_url` | Optional signed or stored PDF URL. |
| `dashboard_viewed_at` | First time client opened report. |
| `delivered_at` | When client delivery was completed. |
| `created_at` | Record creation timestamp. |
| `updated_at` | Last update timestamp. |
| `generated_at` | When report JSON was generated. |
| `approved_at` | When report was approved for delivery. |

### Optional future table: `axiom_report_events`

Use this later if auditability becomes important.

| Field | Purpose |
| --- | --- |
| `id` | Event ID. |
| `report_id` | Linked report. |
| `event_type` | `queued`, `generation_started`, `generated`, `needs_review`, `approved`, `pdf_created`, `email_sent`, `delivered`, `failed`. |
| `event_message` | Human-readable event note. |
| `metadata` | JSON detail. |
| `created_at` | Timestamp. |

### Optional future table: `axiom_report_files`

Use this when PDF storage becomes more mature.

| Field | Purpose |
| --- | --- |
| `id` | File ID. |
| `report_id` | Linked report. |
| `customer_id` | Client owner. |
| `file_type` | `pdf`, `html_snapshot`, or future export format. |
| `storage_path` | Storage path. |
| `public_url` | Public or signed delivery URL if applicable. |
| `version` | File version. |
| `created_at` | Timestamp. |

## Report Lifecycle Statuses

Use one clear lifecycle. Avoid overlapping status names across dashboard, report engine, and delivery.

| Status | Meaning | Client visibility |
| --- | --- | --- |
| `queued` | Intake submitted and report is waiting for generation. | Client sees report pending. |
| `generating` | Report engine is actively producing JSON. | Client sees report in progress. |
| `generated` | Report JSON exists but has not passed delivery rules. | Usually internal only. |
| `needs_review` | Quality score or risk requires internal review. | Client sees report in review. |
| `approved` | Report is approved for delivery. | Client may see ready soon. |
| `pdf_pending` | PDF generation is required but not complete. | Client sees report approved / preparing PDF. |
| `pdf_ready` | PDF exists and can be downloaded. | Client can download PDF. |
| `delivered` | Dashboard and email delivery have completed. | Client sees ready report. |
| `failed` | Generation or delivery failed. | Client sees support-safe error if needed. |
| `revision_requested` | Report needs correction or rework. | Client or admin visible depending on context. |
| `archived` | Report is no longer active. | Historical access only. |

## Generation Architecture

### Phase 1: Manual/Admin Trigger

Build this first for safety.

- Admin or protected route picks one `queued` report.
- Route loads:
  - report record
  - workflow submission
  - product slug
  - intake payload
  - customer/order metadata
- Route calls the report generation function.
- JSON is validated against the standard.
- Report is saved as `generated`, `needs_review`, or `failed`.

This avoids automatic production surprises while the report standard is being tested.

### Phase 2: Automated Queue Worker

After manual generation is reliable:

- Worker picks queued reports.
- Processes one report per request/run.
- Uses status locks to avoid duplicate generation.
- Writes failure reasons to the report record.
- Does not expose secrets or raw prompts to clients.

### Phase 3: Approval And Delivery

After report JSON quality is reliable:

- Admin/reviewer can approve a report.
- Approved report becomes dashboard-readable.
- PDF can be generated from the same JSON.
- Email is sent after dashboard page and PDF are ready.

## Route Plan

### Report generation route

Suggested route:

`app/api/reports/generate/route.ts`

Purpose:

- Protected/admin-only route.
- Accepts a `report_id` or processes the next queued report.
- Loads source data.
- Generates report JSON.
- Validates report JSON.
- Updates `axiom_audit_reports`.

Important rules:

- Do not initialise OpenAI or other SDKs at module scope.
- Use lazy server-side getter or route-level initialisation.
- Do not expose prompts, keys, or service-role access to the client.
- Process one report per request at first.

### Client report page

Suggested route:

`app/dashboard/reports/[reportId]/page.tsx`

Purpose:

- Authenticated client page.
- Verifies report belongs to current customer.
- Shows report status.
- If delivered/approved, renders report JSON into dashboard sections.
- Shows PDF download only when PDF is ready.

### Admin review page

Suggested future route:

`app/admin/reports/[reportId]/page.tsx`

Purpose:

- Internal review only.
- Shows raw quality score and reviewer notes.
- Allows approve, request revision, or regenerate.

Only build this when auth/role handling is ready enough.

### PDF generation route

Future route:

`app/api/reports/pdf/route.ts`

Purpose:

- Takes an approved report ID.
- Loads report JSON.
- Renders approved JSON into branded PDF.
- Stores the file.
- Updates `pdf_file_id`, `pdf_url`, and status.

This route comes after dashboard report rendering is stable.

### Delivery email route / function

Future route or server function:

`sendReportReadyEmail(reportId)`

Purpose:

- Sends a short email only after dashboard and PDF are ready.
- Includes link to dashboard report.
- Includes PDF download prompt or link.
- Does not include sensitive full report content in email.

## Report Generation Function Plan

Suggested internal function:

`generateAxiomReport({ report, submission, customer, product })`

Inputs:

- `report.id`
- `report.tier_slug`
- `submission.intake_payload`
- `submission.workflow_title`
- `customer.business_name`
- product metadata
- report schema version

Outputs:

- `report_json`
- `client_summary`
- `quality_control`
- `recommended_status`

The generator should choose the product-specific report format from `tier_slug`.

## Product-Specific Generator Modes

| Product slug | Report type | Generator mode |
| --- | --- | --- |
| `workflow-audit` | Diagnostic Report | `diagnostic_report` |
| `workflow-blueprint` | Implementation Blueprint | `implementation_blueprint` |
| `custom-operating-pack` | Operating Pack | `operating_pack` |
| `workflow-stewardship` | Optimisation Review | `optimisation_review` |
| `departmental-ecosystem` | Ecosystem Architecture Report | `ecosystem_architecture` |
| `architect-residency` | Deployment Scope Report | `deployment_scope` |

## Validation Rules

Do not save a report as `generated` unless the JSON includes:

- `schema_version`
- `product_slug`
- `report_type`
- `report_status`
- `generated_at`
- `client`
- `submission`
- `executive_summary`
- `current_state`
- `diagnosis`
- `scorecard`
- `assistant_opportunity_map`
- `automation_suitability`
- `risk_review`
- `future_state`
- `implementation_plan`
- `upgrade_recommendation`
- `quality_control`
- `delivery`

Do not save a report as `approved` unless:

- Quality readiness score is at least 10/12, or a human reviewer approves an exception.
- Human-review triggers are visible.
- Assumptions and missing information are visible.
- Upgrade recommendation is justified or set to `none`.
- Client-facing copy avoids unsupported guarantees.

## Dashboard Report Page Structure

The dashboard report page should be the primary client experience.

Recommended sections:

1. Report header
   - Product name.
   - Workflow name.
   - Status.
   - Generated date.
   - PDF download button when ready.

2. Executive summary
   - Main finding.
   - Highest priority issue.
   - Best next action.

3. Scorecard panel
   - Product-relevant scores.
   - Human-review requirement level.
   - Intake confidence.

4. Current workflow map
   - Trigger.
   - Inputs.
   - Steps.
   - Owners.
   - Outputs.
   - Failure points.

5. Diagnosis
   - Bottlenecks.
   - Friction points.
   - Missing standards.
   - Tool/data gaps.

6. AI and automation map
   - Assistant opportunities.
   - Suitable automation areas.
   - Unsafe or premature automation areas.
   - Required guardrails.

7. Review gates and risk
   - Human approval points.
   - Sensitive areas.
   - Risk notes.

8. Future-state workflow
   - Improved shape.
   - Role changes.
   - Tool changes.
   - Review gates.

9. Implementation priorities
   - Immediate fix.
   - 7-day actions.
   - 30-day plan.
   - Later improvements.

10. Upgrade recommendation
    - Recommended next product or none.
    - Evidence.
    - Client-facing explanation.

11. Assumptions and missing information
    - Transparency section.

12. Delivery notes
    - What is included.
    - What is not included.
    - Suggested next step.

## Dashboard Status Copy

Use client-safe wording.

| Status | Dashboard copy |
| --- | --- |
| `queued` | Your intake has been received. Your report is waiting to be generated. |
| `generating` | Your report is being prepared. |
| `generated` | Your report has been generated and is being checked. |
| `needs_review` | Your report is being reviewed before delivery. |
| `approved` | Your report has been approved and is being prepared for delivery. |
| `pdf_pending` | Your report is ready. The downloadable PDF is being prepared. |
| `pdf_ready` | Your report is ready and the PDF is available. |
| `delivered` | Your report is ready. |
| `failed` | We could not prepare the report automatically. Support has been notified. |
| `revision_requested` | Your report is being updated. |
| `archived` | This report is archived. |

## PDF Rendering Rules For Later

The PDF must not create its own content.

PDF input:

- `report_json`
- client metadata
- report metadata
- approved PDF style template

PDF output:

- one stored PDF file
- versioned file reference
- downloadable client link

PDF layout should follow the Axiom Studio quality benchmark but should be Architect-specific:

- Axiom Architect cover.
- Technical grid.
- Product-specific report identity.
- Strong section dividers.
- Scorecard panels.
- Tables for workflow maps and recommendations.
- Clear footer with version/date.
- No crowded text blocks.
- No hidden overflow.
- No tiny unreadable mobile/web capture styling.

## Email Delivery Rules

Email should be brief and calm.

Email should include:

- client name if available
- product/report name
- one-sentence completion note
- link to dashboard report
- note that PDF is available when ready
- support contact

Email should not include:

- full report content
- sensitive details
- raw score breakdown unless intentionally included
- unsupported claims
- upgrade pressure

## Error Handling

Every generation failure should preserve enough detail for admin/debugging without exposing sensitive internals to clients.

Recommended fields:

- `status: "failed"`
- `failure_stage`
- `failure_message`
- `failure_code`
- `failed_at`
- `retry_count`

Client-facing failed copy should be generic and supportive.

Do not show raw AI provider errors to clients.

## Security And Access Rules

- Clients can only access reports linked to their own `customer_id`.
- Report generation routes must be server-only/protected.
- Service-role database access must stay server-side.
- Report JSON may contain business-sensitive workflow details and must not be exposed publicly.
- PDF links should be signed or access-controlled unless intentionally public.
- Admin review pages must require an admin/owner role before implementation.

## Build Order

### Step 1: Confirm database fields

Check `axiom_audit_reports` in Supabase and confirm whether these fields exist:

- `report_json`
- `client_summary`
- `quality_score`
- `quality_status`
- `reviewer_notes`
- `generated_at`
- `approved_at`
- `delivered_at`
- `pdf_file_id`
- `pdf_url`
- failure fields

Add only missing fields.

### Step 2: Create TypeScript report types

Create a single internal type file for report JSON.

Suggested file:

`lib/axiom-report-types.ts`

Purpose:

- Product slugs.
- Report status types.
- Report JSON shape.
- Quality score types.
- Product report mode map.

### Step 3: Create report validator

Suggested file:

`lib/axiom-report-validation.ts`

Purpose:

- Validate required top-level keys.
- Validate product slug and report type.
- Validate quality score readiness.
- Return actionable validation errors.

### Step 4: Create report renderer helpers

Suggested file:

`lib/axiom-report-rendering.ts`

Purpose:

- Convert report JSON into dashboard-friendly sections.
- Keep dashboard and PDF section order consistent.
- Avoid duplicating section logic inside page components.

### Step 5: Build dashboard report page

Suggested route:

`app/dashboard/reports/[reportId]/page.tsx`

Purpose:

- Load authenticated customer.
- Load report by ID and customer ID.
- Show status if not delivered.
- Render report sections if available.
- Show PDF download button only when available.

### Step 6: Build manual generation route

Suggested route:

`app/api/reports/generate/route.ts`

Purpose:

- Protected/manual route.
- Generate one report.
- Validate and save JSON.
- Set status according to quality rules.

### Step 7: Add admin review layer

Only after generation is reliable.

Purpose:

- View generated JSON in readable form.
- Approve delivery.
- Request revision.
- Trigger PDF later.

### Step 8: Add PDF generation

Only after dashboard rendering is stable.

Purpose:

- Use report JSON as source.
- Render premium Axiom Architect PDF.
- Store and link file.

### Step 9: Add delivery email

Only after dashboard and PDF are ready.

Purpose:

- Notify client.
- Link dashboard report.
- Mention PDF availability.

## Codex Handoff Requirements For PDF Phase

When the PDF phase begins, Codex should receive:

- `docs/AXIOM_REPORT_QUALITY_STANDARD.md`
- `docs/REPORT_GENERATION_IMPLEMENTATION_PLAN.md`
- approved dashboard report page structure
- approved report JSON example
- Axiom Studio PDF visual benchmark files
- Axiom Architect brand assets
- exact PDF storage strategy
- exact rendering tool choice

Codex should not be asked to invent report content. Its job should be layout, rendering, pagination, storage, and quality of the PDF output.

## Definition Of Done For Report Engine V1

Report Engine V1 is complete when:

- A submitted intake creates or uses a queued report record.
- A protected generation route can generate structured report JSON for at least `workflow-audit`.
- Report JSON validates against required shape.
- The dashboard report page can render the report clearly.
- Statuses move correctly from `queued` to `generated` or `needs_review`.
- Internal quality score is saved.
- Client can see a readable report page once approved/delivered.
- PDF and email are not required for V1, but the data shape supports both.

## Definition Of Done For Full Delivery V1

Full Delivery V1 is complete when:

- Report JSON is generated and approved.
- Dashboard report page is live.
- PDF is generated from the same JSON.
- PDF is downloadable by the correct client.
- Email notification sends a dashboard link and PDF availability note.
- Report status ends as `delivered`.
- No report content is duplicated across dashboard, PDF, and email systems.
