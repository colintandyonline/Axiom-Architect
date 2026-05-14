# Axiom Architect Build Plan

## Purpose

Axiom Architect is the service and platform layer beside Axiom Studio.

Axiom Studio sells structured digital products: protocols, agent kits, workbooks, and operating packs.

Axiom Architect applies that same operating-system thinking to a client's real workflow. The platform should help a client submit a messy business process, diagnose what is happening, identify safe AI and automation opportunities, and receive a structured implementation blueprint.

The long-term goal is to build an AI-driven workflow architecture system that can sell entry-level audits, generate useful reports, support higher-ticket custom services, and eventually become a reusable client portal.

## Brand Position

Axiom Architect should feel connected to Axiom Studio, but it must not look like the Axiom Studio store.

Use Axiom Studio as the brand reference for:

- Black and near-black backgrounds.
- Mint primary color: `#9ed39f`.
- White typography.
- Technical grid systems.
- Thin outlined panels.
- Blueprint, workflow, node, and architecture motifs.
- Calm, premium, professional tone.

Do not use Axiom Studio storefront/header imagery as the Axiom Architect hero.

Axiom Architect needs its own service identity:

- Workflow diagnostics.
- Operating blueprints.
- Automation suitability.
- AI system design.
- Human-in-the-loop review gates.
- Implementation sequencing.

## Core Offer Ladder

### 1. AI Readiness Checklist

Free or low-cost lead-generation asset.

Purpose:
Help users understand whether their workflows, documentation, tools, and team habits are ready for AI-supported systems.

Output:

- Readiness score.
- Weakness summary.
- Suggested next step.
- CTA into the Workflow Audit.

### 2. Axiom Workflow Audit

First paid service product and MVP entry point.

Purpose:
Diagnose one real workflow and show the client where friction, risk, automation, and AI support opportunities exist.

Client submits:

- Business type.
- Role.
- Workflow description.
- Current tools.
- Pain points.
- Repeated manual tasks.
- Approval/review needs.
- Failure risks.
- Desired outcome.

Output:

- Current workflow diagnosis.
- Bottlenecks and weak points.
- Repeated manual work.
- Automation suitability.
- AI opportunity areas.
- Risk and review requirements.
- Recommended next steps.

### 3. Workflow Blueprint

Deeper implementation plan after the audit.

Purpose:
Turn findings into a practical operating model the client can follow.

Output:

- Future-state workflow.
- Step-by-step process model.
- Recommended AI assistance points.
- Human review gates.
- Automation sequence.
- Handoff logic.
- Implementation priorities.

### 4. Custom AI Operating Protocol

A client-specific protocol inspired by Axiom Studio's structured product model.

Examples:

- Client onboarding protocol.
- Content production protocol.
- Proposal writing protocol.
- Research protocol.
- Customer support triage protocol.
- Internal reporting protocol.
- Sales follow-up protocol.

Output:

- Task framing.
- Required context.
- AI instruction flow.
- Quality checks.
- Output rules.
- Review gates.
- Reuse instructions.

### 5. Custom Agent / Assistant Instruction Kit

Specialist assistant configuration for the client's workflow.

Examples:

- Research assistant.
- Proposal assistant.
- Content strategist.
- Quality reviewer.
- Operations analyst.
- Support triage assistant.
- Workflow documentation assistant.

Output:

- System prompt.
- Assistant role.
- Boundaries.
- Input requirements.
- Output formats.
- Validation rules.
- Escalation rules.
- Setup guide.

### 6. Workflow Implementation Workbook

Guided workbook for the client or team to put the system into practice.

Output:

- Exercises.
- Checklists.
- Practice tasks.
- Review sheets.
- Implementation plan.
- Adoption steps.
- Quality-control habits.

### 7. Custom Operating Pack

Premium bundled deliverable for one workflow.

Includes:

- Workflow Audit.
- Workflow Blueprint.
- Custom Operating Protocol.
- Agent Instruction Kit.
- Implementation Workbook.
- Branded PDF report.
- Copy/paste instruction blocks.
- Setup guide.

This should become the main mid-ticket service package.

### 8. AI Workflow Automation Design

For clients that already know they have repeatable work, but do not know what should be automated.

Output:

- Automation opportunity map.
- Trigger points.
- Input quality assessment.
- Data requirements.
- Approval stages.
- Failure risks.
- Human-in-the-loop design.
- Automation priority sequence.

### 9. Tool Stack Architecture

Service for choosing and structuring tools around the workflow.

Possible tool categories:

- ChatGPT.
- Claude.
- Codex.
- Supabase.
- Airtable.
- Notion.
- Google Workspace.
- Vercel.
- Resend.
- Stripe.
- Zapier, Make, or n8n-style automation.
- CRM or support tools.

Output:

- Tool recommendation.
- Role of each tool.
- Data flow.
- Automation flow.
- Risk notes.
- Setup sequence.

### 10. Team AI Operating System Setup

For teams that need shared operating habits.

Output:

- AI usage rules.
- Prompt standards.
- Review policy.
- Shared workflow protocols.
- Assistant setup.
- Documentation structure.
- Governance notes.
- Team training workbook.

### 11. Governance and Review Gate Design

For clients concerned with quality, accuracy, or approval risk.

Output:

- Human approval stages.
- Verification rules.
- Sensitive-data handling.
- Fact-checking expectations.
- Escalation logic.
- Audit trail recommendations.
- AI decision boundaries.

### 12. Done-With-You Consulting

Higher-touch service for clients who want guidance.

Includes:

- Workflow review call.
- Blueprint walkthrough.
- Tool selection guidance.
- Assistant setup review.
- Implementation support.

### 13. Done-For-You System Build

Highest-ticket service.

Potential build elements:

- Intake app.
- Client dashboard.
- AI generation workflow.
- PDF/report automation.
- Admin tools.
- Email notifications.
- Payment integration.
- Database setup.
- Deployment on Vercel.

## Platform Vision

The platform should eventually support:

- User accounts.
- Paid audit purchase flow.
- Client intake forms.
- Supabase storage of submissions and reports.
- AI-generated diagnostics.
- Branded report pages.
- PDF report generation.
- Resend delivery emails.
- Stripe checkout and webhooks.
- Admin review dashboard.
- Client portal.
- Upgrade paths from audit to blueprint to custom operating pack.

## MVP Build Path

### Phase 1: Foundation

Goal:
Make Axiom Architect credible and ready to accept early users.

Tasks:

- Create proper Axiom Architect homepage.
- Create Workflow Audit service page.
- Create About page.
- Create Contact page.
- Create Privacy Policy, Terms, and Refund / Service Delivery pages.
- Use custom Axiom Architect visual assets.
- Keep styling aligned with Axiom Studio, but not copied from it.

### Phase 2: Workflow Audit Purchase Flow

Goal:
Let a user buy the first service.

Tasks:

- Add Stripe checkout for Workflow Audit.
- Create success page.
- Store order record in Supabase.
- Add Stripe webhook route.
- Confirm payment before allowing workflow submission.
- Send confirmation email via Resend.

### Phase 3: Workflow Intake

Goal:
Collect enough structured information to generate a useful diagnostic.

Tasks:

- Build protected intake form.
- Save submission to Supabase.
- Validate required fields.
- Add status field: `draft`, `submitted`, `processing`, `ready`, `delivered`.
- Send "submission received" email.

### Phase 4: AI Diagnostic Generation

Goal:
Generate a structured workflow audit.

Tasks:

- Create AI generation route.
- Use structured output.
- Generate findings, risks, automation opportunities, and next steps.
- Save report JSON in Supabase.
- Add human review option before delivery.

### Phase 5: Report and PDF Delivery

Goal:
Turn the audit into a premium branded deliverable.

Tasks:

- Build client report page.
- Generate branded PDF.
- Store PDF in Supabase Storage or approved file storage.
- Email report link using Resend.
- Add download CTA.

### Phase 6: Admin Dashboard

Goal:
Allow internal review and operations.

Tasks:

- View orders.
- View submissions.
- View generated reports.
- Update status.
- Trigger or re-trigger generation.
- Send delivery email.

### Phase 7: Upgrade Path

Goal:
Turn audits into higher-value services.

Tasks:

- Add Workflow Blueprint upgrade.
- Add Custom Operating Pack upgrade.
- Add Custom Agent Kit upgrade.
- Add consultation request.
- Add membership or retainer interest capture.

## Suggested Database Tables

Initial Supabase tables:

- `customers`
- `orders`
- `workflow_submissions`
- `audit_reports`
- `report_files`
- `email_events`
- `service_requests`

Future tables:

- `client_accounts`
- `projects`
- `workflow_blueprints`
- `agent_kits`
- `operating_protocols`
- `implementation_workbooks`
- `admin_notes`

## Suggested Environment Variables

Use names only in the repo. Never commit values.

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `RESEND_API_KEY`
- `OPENAI_API_KEY`
- `APP_URL`

## Quality Rules

- Do not ship generic AI copy.
- Do not ship placeholder service pages.
- Do not use Axiom Studio shop images as Axiom Architect service headers.
- Do not build broad dashboards before the Workflow Audit flow works.
- Keep the first paid flow narrow and excellent.
- Every generated report must be useful enough to justify the price.
- Every page must work on mobile.
- Every paid flow must have clear confirmation, delivery expectations, and support language.

## Immediate Next Actions

1. Finalize the Axiom Architect homepage direction.
2. Build the Workflow Audit page.
3. Define the Workflow Audit price and deliverable promise.
4. Create Supabase schema for orders and submissions.
5. Wire Stripe checkout for the audit.
6. Build the post-payment intake form.
7. Add Resend confirmation email.
8. Build the first audit report structure.

