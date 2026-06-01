# Stripe Proposal Payment Sync

This document explains the first Stripe sync layer for Axiom Architect proposal payments.

## Webhook route

Use this endpoint for proposal-payment events:

```text
/api/stripe/proposal-webhook
```

Production URL example:

```text
https://www.axiom-architect.co/api/stripe/proposal-webhook
```

This route is separate from the existing package checkout webhook so proposal payments can be tested without disturbing package/order checkout handling.

## Required environment variables

```text
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

The webhook secret must be the signing secret for the proposal webhook endpoint.

## Required SQL

Run this migration in Supabase before enabling sync:

```text
docs/sql/ALTER_AXIOM_PROPOSALS_STRIPE_SYNC.sql
```

It adds Stripe sync columns to `axiom_proposals` and creates `axiom_stripe_events` for processed event records.

## Stripe metadata required

Every proposal payment object must include these metadata keys:

```text
axiom_proposal_id = the axiom_proposals.id value
axiom_payment_stage = deposit OR final
axiom_customer_id = optional axiom_customers.id value
```

For the current manual Stripe invoice flow, add this metadata to the Stripe invoice/payment object before sending the payment link.

## Supported events

The proposal webhook processes successful payment events:

```text
invoice.paid
invoice.payment_succeeded
checkout.session.completed
payment_intent.succeeded
```

It also records failed payment states for:

```text
invoice.payment_failed
payment_intent.payment_failed
```

## Status updates

When `axiom_payment_stage = deposit` and payment succeeds:

```text
payment_status = deposit_paid
deposit_paid_at = now()
stripe_deposit_invoice_id / stripe_deposit_payment_intent_id saved where available
```

When `axiom_payment_stage = final` and payment succeeds:

```text
payment_status = paid_complete
final_balance_paid_at = now()
stripe_final_invoice_id / stripe_final_payment_intent_id saved where available
```

The billing page reads these proposal fields, so the client workspace updates after Stripe sends the webhook.

## Manual fallback

The existing admin buttons remain available:

```text
Mark deposit paid
Mark final balance due
Mark final balance paid
Mark cancelled
```

Use them as a fallback if a manual Stripe invoice was created without the required metadata or if a webhook delivery fails.
