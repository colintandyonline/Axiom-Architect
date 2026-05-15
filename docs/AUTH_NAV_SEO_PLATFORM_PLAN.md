# Axiom Architect Auth, Navigation, SEO, and Client Platform Plan

This plan keeps the next build stages structured so Axiom Architect becomes a secure customer platform rather than a link-based checkout flow.

## Non-negotiables

- Keep Axiom Architect mobile optimized on every public and client-facing page.
- Keep the brand aligned with the dark technical Axiom system style.
- Keep SEO, metadata, structured page hierarchy, and AI-search readability built into each page from the start.
- Use Supabase Auth for real customer accounts.
- Do not expose secrets in code, logs, UI, or committed files.
- Do not initialize Supabase, Stripe, Resend, OpenAI, or service clients at module scope.
- Keep work staged and focused.

## Current working flow

1. User selects an audit tier.
2. User enters checkout details.
3. Stripe Checkout completes payment.
4. Stripe webhook creates:
   - `public.axiom_customers`
   - `public.axiom_orders`
   - `public.axiom_workflow_submissions`
5. Customer opens dashboard.
6. Customer submits staged workflow intake.
7. Intake saves into `public.axiom_workflow_submissions`.
8. Report queue record is created in `public.axiom_audit_reports`.

## Target platform flow

1. Visitor lands on a public SEO-optimized page.
2. Visitor can use public navigation:
   - Home
   - Workflow Audit
   - Pricing
   - How It Works
   - About
   - Login
   - Start Audit
3. Customer signs up or logs in.
4. Customer pays or connects to an existing paid audit.
5. Auth user is linked to `public.axiom_customers`.
6. Dashboard loads audits owned by the logged-in user.
7. Customer can view:
   - My Audits
   - Audit status
   - Submitted intake
   - Report page
   - Account settings
8. Customer can log out.
9. Customer can reset or change password.
10. Reports and future PDFs are protected by authenticated ownership.

## Stage 1 — Auth schema foundation

Add auth ownership fields to the existing Axiom tables.

### `public.axiom_customers`

Add:

- `auth_user_id uuid unique references auth.users(id) on delete set null`
- `last_login_at timestamptz`
- `account_status text default 'active'`

Purpose:

- Connect Supabase Auth users to customer records.
- Keep Stripe customer/order data separate from Auth while linking both safely.

### `public.axiom_orders`

No immediate change required unless we later need direct auth user filtering.
Orders remain attached through `customer_id`.

### `public.axiom_workflow_submissions`

No immediate change required if ownership is enforced through `customer_id`.

### `public.axiom_audit_reports`

No immediate change required if ownership is enforced through `customer_id` and `submission_id`.

## Stage 2 — Auth utility layer

Create server-side auth helpers for:

- Getting the current user.
- Getting the linked Axiom customer.
- Requiring authentication on protected routes.
- Redirecting logged-out users to `/login`.
- Preventing customers from accessing another customer's audit by URL.

Implementation rule:

- Do not initialize Supabase clients at module scope.
- Use lazy server-side functions or route-level initialization.

## Stage 3 — Auth pages

Create the customer account pages:

- `/login`
- `/signup`
- `/logout`
- `/forgot-password`
- `/reset-password`
- `/account`

The `/account` page should include:

- Customer name
- Email
- Business name
- Password reset/change pathway
- Log out action
- Link to dashboard
- Link to support/contact

## Stage 4 — Branded navigation

Create shared navigation components.

### Public navigation

Use on public marketing/service pages:

- Axiom Architect
- Home
- Workflow Audit
- Pricing
- How It Works
- About
- Login
- Start Audit

### Logged-in navigation

Use on dashboard, intake, account, audit status, report pages:

- Axiom Architect
- Dashboard
- My Audits
- Account
- Log out

Mobile requirement:

- Navigation must collapse cleanly on small screens.
- Buttons must remain readable and tappable.
- No horizontal overflow.

## Stage 5 — Footer and legal structure

Create a professional global footer with structured link groups.

### Services

- Workflow Audit
- Workflow Blueprint
- Custom Operating Pack

### Platform

- Dashboard
- My Audits
- Account
- Contact

### Company

- About
- Axiom Studio

### Legal

- Privacy Policy
- Terms of Service
- Refund / Service Delivery Policy

Create legal pages:

- `/privacy`
- `/terms`
- `/refund-policy`
- `/contact`
- `/about`

## Stage 6 — Protected dashboard and audits

Move dashboard access from URL-based lookup toward authenticated ownership.

Protected routes:

- `/dashboard`
- `/dashboard/intake`
- `/dashboard/intake/received`
- `/dashboard/audits/[id]`
- `/reports/[id]`
- `/account`

Dashboard should show:

- Customer greeting
- Purchased audits
- Workflow title
- Tier
- Intake status
- Report status
- Action links

## Stage 7 — Audit detail page

Create:

- `/dashboard/audits/[id]`

This page should show:

- Workflow title
- Tier purchased
- Business context
- Submission status
- Report status
- Intake summary
- Processing timeline
- Review submitted intake link
- Future report/PDF link
- Upgrade CTA

## Stage 8 — Report and delivery layer

Create protected client report route:

- `/reports/[id]`

Report page should eventually include:

- Workflow summary
- Diagnostic findings
- Automation suitability
- Assistant opportunities
- Risk/review gates
- Implementation sequence
- Download PDF CTA
- Upgrade CTA

## SEO and AI-search requirements

Every public page should include:

- Unique metadata title.
- Unique metadata description.
- Clear H1.
- Logical H2/H3 structure.
- Descriptive internal links.
- Service-specific language.
- Helpful plain-language summaries.
- Mobile-readable content blocks.
- No placeholder/admin/build-status copy.

Recommended public-page SEO targets:

- workflow audit
- workflow blueprint
- workflow architecture
- business process audit
- automation readiness
- AI workflow audit
- AI operating system design
- human-in-the-loop automation
- implementation blueprint

AI-search / LLM readability requirements:

- Add concise explanatory sections that clearly define what Axiom Architect does.
- Use stable service names consistently.
- Use structured lists for deliverables, process, and outcomes.
- Add FAQ sections on public offer pages.
- Avoid vague marketing claims.
- Make service scope, customer input, output, and next steps explicit.

## Mobile requirements

Every new page/component must be checked for:

- No horizontal overflow.
- Readable font sizes on mobile.
- Tappable buttons.
- Stacked card layouts.
- Non-cramped form fields.
- Navigation usability.
- Footer usability.
- Dashboard cards readable on small screens.

## Recommended next build order

1. Add Auth schema migration.
2. Add Auth helper layer.
3. Build `/login`, `/logout`, and `/account` skeletons.
4. Add public/logged-in navigation components.
5. Add footer and legal page shells.
6. Protect dashboard/intake routes.
7. Build `/dashboard/audits/[id]`.
8. Build protected report page route.
