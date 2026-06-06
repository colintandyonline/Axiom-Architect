# Stripe Live Mode Audit

Project: Axiom Architect  
Production domain: `https://www.axiom-architect.co`  
Vercel project: `axiom-architect`

This audit lists the Stripe-related environment variables and live-mode checks needed before switching Axiom Architect from Stripe test mode to Stripe live mode.

No secret values are included in this file.

## Summary

The current code uses one main Stripe webhook route:

```text
/api/stripe/webhook
```

Production webhook URL:

```text
https://www.axiom-architect.co/api/stripe/webhook
```

That main webhook handles both:

- product/package checkout completion
- proposal invoice/payment sync

There is also an older route:

```text
/api/stripe/proposal-webhook
```

The older route is still present in code and in `docs/STRIPE_PROPOSAL_PAYMENT_SYNC.md`, but the current tested payment flow is consolidated into `/api/stripe/webhook`. For live mode, use `/api/stripe/webhook` unless the code is deliberately changed to split proposal payments again.

## Code Env Var Inventory

| Variable | Where Used | Purpose | Required For | Production Required | Expected Live Format |
| --- | --- | --- | --- | --- | --- |
| `STRIPE_SECRET_KEY` | `app/api/checkout/route.ts`, `app/api/stripe/webhook/route.ts`, `lib/axiom-stripe-proposal-sync.server.ts` | Server-side Stripe API client | product/package checkout, proposal invoices, webhooks | Yes | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | `app/api/stripe/webhook/route.ts`, `app/api/stripe/proposal-webhook/route.ts`, `lib/axiom-stripe-proposal-sync.server.ts` | Verifies Stripe webhook signatures | product/package checkout webhook, proposal payment webhook | Yes | `whsec_...` from the live webhook endpoint |
| `STRIPE_PRICE_WORKFLOW_AUDIT` | `app/api/checkout/route.ts`, `app/admin/readiness/page.tsx` | Stripe Price ID for Workflow Audit checkout | product/package checkout | Yes | live `price_...` |
| `STRIPE_PRICE_WORKFLOW_BLUEPRINT` | `app/api/checkout/route.ts`, `app/admin/readiness/page.tsx` | Stripe Price ID for Workflow Blueprint checkout | product/package checkout | Yes | live `price_...` |
| `STRIPE_PRICE_CUSTOM_OPERATING_PACK` | `app/api/checkout/route.ts`, `app/admin/readiness/page.tsx` | Stripe Price ID for Custom Operating Pack checkout | product/package checkout | Yes | live `price_...` |
| `STRIPE_PRICE_WORKFLOW_STEWARDSHIP` | `app/api/checkout/route.ts`, `app/admin/readiness/page.tsx` | Stripe Price ID for Workflow Stewardship checkout | product/package checkout subscription | Yes, if selling stewardship | live recurring `price_...` |
| `STRIPE_PRICE_DEPARTMENTAL_ECOSYSTEM` | `app/api/checkout/route.ts`, `app/admin/readiness/page.tsx` | Stripe Price ID for Departmental Ecosystem checkout | product/package checkout | Yes | live `price_...` |
| `STRIPE_PRICE_ENTERPRISE_ARCHITECTURE_SYSTEM` | `app/api/checkout/route.ts`, `app/admin/readiness/page.tsx` | Stripe Price ID for Axiom Enterprise Architecture System checkout | product/package checkout | Yes | live `price_...` |
| `APP_URL` | checkout redirects, auth redirects, proposal links, report delivery links | Canonical app URL for server-generated links | checkout, proposal links, emails | Yes | `https://www.axiom-architect.co` |
| `NEXT_PUBLIC_APP_URL` | fallback for server-generated links | Public app URL fallback | checkout/proposal/email fallback | Recommended | `https://www.axiom-architect.co` |
| `NEXT_PUBLIC_SUPABASE_URL` | many server/client routes | Supabase REST/Auth URL | checkout webhook, proposal sync, dashboards | Yes | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | many server routes | Server-side Supabase writes | checkout webhook, proposal sync, admin delivery | Yes | Supabase service role key |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | auth/signup/login routes | Public Supabase auth client | auth/client flows | Yes, one of them | Supabase public key |
| `RESEND_API_KEY` | contact, report/proposal emails | Email delivery | proposal send, report delivery, contact | Yes for production email | Resend key |
| `RESEND_FROM_EMAIL` | contact, report/proposal emails | Sender identity | proposal send, report delivery, contact | Yes for production email | verified sender/domain |

## Variables Not Used By Current Code

The current code does not read these common Stripe variables:

```text
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_PRODUCT_*
STRIPE_PRODUCT_ID_*
STRIPE_PRICE_ID_*
```

The product/package checkout is server-side and redirects to Stripe Checkout using server-created sessions. No frontend Stripe.js publishable key is currently required by the code.

## Product And Price ID Mapping

Product/package checkout uses code slugs mapped to Stripe Price ID environment variables in `app/api/checkout/route.ts`.

| Site Package | Checkout Slug | Mode | Stripe Price Env Var | Live Mode Requirement |
| --- | --- | --- | --- | --- |
| Workflow Audit | `workflow-audit` | payment | `STRIPE_PRICE_WORKFLOW_AUDIT` | Replace with live one-time `price_...` |
| Workflow Blueprint | `workflow-blueprint` | payment | `STRIPE_PRICE_WORKFLOW_BLUEPRINT` | Replace with live one-time `price_...` |
| Custom Operating Pack | `custom-operating-pack` | payment | `STRIPE_PRICE_CUSTOM_OPERATING_PACK` | Replace with live one-time `price_...` |
| Workflow Stewardship | `workflow-stewardship` | subscription | `STRIPE_PRICE_WORKFLOW_STEWARDSHIP` | Replace with live recurring `price_...` |
| Departmental Ecosystem | `departmental-ecosystem` | payment | `STRIPE_PRICE_DEPARTMENTAL_ECOSYSTEM` | Replace with live one-time `price_...` |
| Axiom Enterprise Architecture System | `architect-residency` | payment | `STRIPE_PRICE_ENTERPRISE_ARCHITECTURE_SYSTEM` | Replace with live one-time `price_...` |

Important: test-mode Stripe Price IDs cannot be used with a live-mode `STRIPE_SECRET_KEY`. Every package needs a live-mode Price ID.

## Proposal Invoice Payments

Proposal payments do not use Stripe Product IDs or Price IDs.

Proposal invoices are created dynamically in:

```text
lib/axiom-stripe-proposal-invoices.server.ts
```

The dynamic invoice item amount comes from proposal JSON:

- deposit invoice: `pricing_json.deposit_required`
- final invoice: `pricing_json.balance_amount`

Proposal invoice currency is currently hardcoded to:

```text
usd
```

The proposal invoice display formatter also formats in:

```text
USD
```

Switching to live mode will create live USD proposal invoices unless code is changed.

## Product Checkout Currency

Product/package checkout currency comes from the Stripe Price ID used.

The public pricing page displays dollar pricing:

- Workflow Audit: `$49`
- Workflow Blueprint: `$149`
- Custom Operating Pack: `$399`
- Workflow Stewardship: `$299/mo`
- Departmental Ecosystem: `$999`
- Enterprise Architecture System: `$2,499`

For consistency, live Stripe prices should be created in USD unless the public UI is changed.

## Webhook Requirements

Recommended live webhook endpoint:

```text
https://www.axiom-architect.co/api/stripe/webhook
```

The same route handles product checkout and proposal payment events.

Required live webhook signing secret:

```text
STRIPE_WEBHOOK_SECRET
```

Required event types based on code:

```text
checkout.session.completed
invoice.paid
invoice.payment_succeeded
invoice.payment_failed
payment_intent.succeeded
payment_intent.payment_failed
```

Notes:

- `checkout.session.completed` is required for product/package checkout.
- `invoice.paid` and/or `invoice.payment_succeeded` are required for proposal invoice payment sync.
- `payment_intent.succeeded` is also handled for proposal payments if metadata is present.
- The webhook ignores non-Axiom checkout sessions.
- Proposal payment events require metadata:
  - `axiom_proposal_id`
  - `axiom_payment_stage` as `deposit` or `final`
  - `axiom_customer_id` where available
  - `axiom_proposal_reference` where available

## Vercel Env Inspection Status

Local Vercel env inspection was not completed because:

- `vercel` is not installed globally on PATH.
- `npx vercel env ls` works, but the local codebase is not linked to a Vercel project.
- There is no local `.vercel/project.json`.

Manual Vercel dashboard verification is required.

Use:

```text
Vercel dashboard -> axiom-architect -> Settings -> Environment Variables
```

Check Production, Preview, and Development scopes separately.

## Variables To Change In Vercel Production

| Variable | Current State | Required Live Value Type | Where To Get It | What Breaks If Wrong |
| --- | --- | --- | --- | --- |
| `STRIPE_SECRET_KEY` | Hidden/unknown | `sk_live_...` | Stripe Dashboard -> Developers -> API keys, live mode | Checkout and proposal invoices fail, or live/test objects mismatch |
| `STRIPE_WEBHOOK_SECRET` | Hidden/unknown | `whsec_...` for `https://www.axiom-architect.co/api/stripe/webhook` | Stripe Dashboard -> Developers -> Webhooks -> live endpoint signing secret | Webhook signature verification fails; payments will not sync |
| `STRIPE_PRICE_WORKFLOW_AUDIT` | Hidden/unknown | live one-time `price_...` | Stripe live product price for Workflow Audit | Checkout fails or charges wrong/test price |
| `STRIPE_PRICE_WORKFLOW_BLUEPRINT` | Hidden/unknown | live one-time `price_...` | Stripe live product price for Workflow Blueprint | Checkout fails or charges wrong/test price |
| `STRIPE_PRICE_CUSTOM_OPERATING_PACK` | Hidden/unknown | live one-time `price_...` | Stripe live product price for Custom Operating Pack | Checkout fails or charges wrong/test price |
| `STRIPE_PRICE_WORKFLOW_STEWARDSHIP` | Hidden/unknown | live recurring `price_...` | Stripe live recurring price for Workflow Stewardship | Subscription checkout fails or uses wrong/test price |
| `STRIPE_PRICE_DEPARTMENTAL_ECOSYSTEM` | Hidden/unknown | live one-time `price_...` | Stripe live product price for Departmental Ecosystem | Checkout fails or charges wrong/test price |
| `STRIPE_PRICE_ENTERPRISE_ARCHITECTURE_SYSTEM` | Hidden/unknown | live one-time `price_...` | Stripe live product price for Axiom Enterprise Architecture System | Checkout fails or charges wrong/test price |
| `APP_URL` | Hidden/unknown | `https://www.axiom-architect.co` | Vercel/project domain | Checkout redirects, proposal links, and emails may point to wrong host |
| `NEXT_PUBLIC_APP_URL` | Hidden/unknown | `https://www.axiom-architect.co` | Vercel/project domain | Fallback generated links may point to wrong host |

## Variables To Leave Alone Unless Project Changed

Do not change these as part of Stripe live mode unless the underlying service changed:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
RESEND_FROM_EMAIL
OPENAI_API_KEY
OPENAI_REPORT_MODEL
AXIOM_REPORT_GENERATION_TOKEN
AXIOM_ADMIN_EMAILS
CONTACT_TO_EMAIL
CONTACT_SUPPORT_EMAIL
CONTACT_PROJECTS_EMAIL
```

## Stripe Dashboard Live-Mode Tasks

1. Switch Stripe Dashboard to live mode.
2. Create or confirm live Products and Prices for:
   - Workflow Audit
   - Workflow Blueprint
   - Custom Operating Pack
   - Workflow Stewardship
   - Departmental Ecosystem
   - Axiom Enterprise Architecture System
3. Confirm all live prices match the site display and intended currency.
4. Copy each live `price_...` ID into the matching Vercel Production variable.
5. Create a live webhook endpoint:

```text
https://www.axiom-architect.co/api/stripe/webhook
```

6. Select required events:

```text
checkout.session.completed
invoice.paid
invoice.payment_succeeded
invoice.payment_failed
payment_intent.succeeded
payment_intent.payment_failed
```

7. Copy the live webhook signing secret into:

```text
STRIPE_WEBHOOK_SECRET
```

8. Confirm `STRIPE_SECRET_KEY` starts with `sk_live_`.
9. Redeploy production after changing Vercel Production env vars.

## Vercel Redeploy Requirement

Changing Vercel Production environment variables does not automatically rewrite an already-built deployment runtime in every case. After env changes, trigger a new production deployment or redeploy the latest production deployment.

No code commit is needed if only environment variables change.

## Safe Live Smoke Test

Do not run the full test-mode payment cycle with live money unless intentionally paying and refunding real funds.

Recommended minimal smoke test:

1. Confirm live env vars are set.
2. Redeploy production.
3. Create one internal low-value product or one internal proposal with the lowest sensible amount.
4. Start checkout or create a proposal invoice.
5. Confirm Stripe creates a live object with the correct amount and metadata.
6. Stop before payment unless you intentionally want to pay real money.
7. If paid intentionally, confirm webhook sync and refund immediately if appropriate.

## Known Limitations And Notes

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is not used by the current code.
- Product checkout uses live Price IDs from env, not Supabase price fields.
- Supabase `axiom_products` must contain active rows for the package slugs, but those rows do not store Stripe Price IDs in the current code.
- The old `/api/stripe/proposal-webhook` route and `docs/STRIPE_PROPOSAL_PAYMENT_SYNC.md` are documentation/code drift from an earlier split webhook design.
- Workflow Stewardship is a subscription checkout, but the current order/workspace webhook handles initial checkout completion only. Recurring renewal accounting is not currently modeled as a separate order/payment history flow.
