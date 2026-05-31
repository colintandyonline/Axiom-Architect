# Axiom Architect Proposal Pricing and Preparation Plan

## Purpose

This document defines the first proposal engine layer for Axiom Architect.

The proposal system is not a static product PDF generator. It is a controlled commercial workflow for preparing client-specific service proposals, pricing them responsibly, reviewing them internally, sending them to the client, and converting accepted work into an order or implementation engagement.

The proposal engine must help Axiom Architect answer:

- What does this client actually need?
- Which service route is the safest and most valuable fit?
- What is included?
- What is excluded?
- What price is justified by complexity, risk, scope, and delivery depth?
- What should the client do next?

The first build should prioritise structure, admin control, reviewability, and safe commercial presentation over automation.

---

## Core Principle

Proposal pricing must remain admin-controlled.

AI can assist with suggested route, scope language, risk notes, deliverables, and client-facing price explanation, but the final commercial decision must be reviewed and set by Axiom Architect admin.

Internal pricing notes and client-facing pricing explanation must remain separate.

Example internal note:

> High-risk workflow with multiple systems, custom review gates, and implementation sequencing required.

Example client-facing explanation:

> The investment reflects the level of workflow mapping, control design, implementation sequencing, and custom operating documentation required to create a safe and usable system.

---

## Proposal Types

### 1. Simple Proposal

Use for small, contained engagements.

Typical shape:

- 1 to 3 pages
- One fixed-price service
- Clear scope
- Minimal options
- Fast acceptance path

Best for:

- Small workflow blueprint
- One-off custom instruction kit
- Short advisory package
- Narrow operating document

### 2. Standard Proposal

Use for most Axiom Architect work.

Typical shape:

- 6 to 10 pages
- Recommended service route
- Scope of work
- Deliverables
- Timeline
- Investment
- Payment terms
- Exclusions
- Acceptance instructions

Best for:

- Workflow Blueprint
- Custom Operating Pack
- Custom Agent / Assistant Instruction Kit
- AI Workflow System Design
- Tool Stack Architecture

### 3. Strategic Proposal

Use for larger, phased, higher-risk or implementation-heavy work.

Typical shape:

- 10 to 20 pages
- Phased roadmap
- Multiple service options
- Risk controls
- Review gates
- Implementation stages
- Optional retainer / stewardship route
- Commercial terms

Best for:

- Done-with-you implementation
- Done-for-you system build
- Departmental workflow system
- Team AI operating setup
- Ongoing Workflow Stewardship

---

## Proposal Statuses

The proposal lifecycle should be separate from audit report statuses.

Recommended status chain:

1. `draft`
   - Admin is preparing scope and pricing.

2. `internal_review`
   - Proposal content exists and is being checked before it can be sent.

3. `ready_to_send`
   - Proposal has passed internal review and can be sent to the client.

4. `sent`
   - Proposal email has been sent to the client.

5. `viewed`
   - Client has opened the proposal page or downloaded the PDF.

6. `accepted`
   - Client has accepted the proposal terms.

7. `changes_requested`
   - Client has requested edits, clarification, or a revised scope.

8. `expired`
   - Proposal validity period has passed.

9. `converted_to_order`
   - Accepted proposal has been converted into a paid order, invoice route, Stripe checkout, or implementation workspace.

---

## Pricing Model

The proposal engine should use a structured pricing model, but only show a clean commercial summary to the client.

### Internal Pricing Factors

Admin should consider:

- Base service type
- Workflow complexity
- Number of workflows or processes
- Number of tools or systems involved
- Number of teams or roles involved
- Risk level
- AI / automation suitability
- Amount of custom instruction design required
- Amount of custom operating documentation required
- Whether implementation is included
- Whether delivery is advisory, done-with-you, or done-for-you
- Urgency
- Number of deliverables
- Ongoing support requirement
- Review and governance burden
- Client responsiveness / evidence quality

### Base Service Routes

Initial routes:

- Workflow Blueprint
- Custom Operating Pack
- Custom Agent / Assistant Instruction Kit
- AI Workflow System Design
- Tool Stack Architecture
- Team AI Operating System Setup
- Implementation Support / Done-With-You
- Done-For-You System Build
- Ongoing Workflow Stewardship / Retainer

### Suggested Starting Price Bands

These are starting guidance bands, not hard-coded final prices.

| Service route | Suggested band |
| --- | ---: |
| Workflow Blueprint | $250 - $750 |
| Custom Operating Pack | $500 - $1,500 |
| Custom Agent / Assistant Instruction Kit | $400 - $1,200 |
| AI Workflow System Design | $1,000 - $3,500 |
| Tool Stack Architecture | $750 - $2,500 |
| Team AI Operating System Setup | $1,500 - $5,000 |
| Implementation Support / Done-With-You | $1,500 - $5,000 |
| Done-For-You System Build | $3,000 - $10,000+ |
| Ongoing Workflow Stewardship | $250 - $1,500/month |

### Complexity Levels

Use complexity as a pricing input, not a client-facing label unless helpful.

| Level | Multiplier guide | Meaning |
| --- | ---: | --- |
| Simple | x1.0 | Single workflow, low risk, few systems, clear outcome. |
| Standard | x1.5 | Multiple handoffs, several tools, moderate ambiguity. |
| Advanced | x2.25 | Multiple roles/systems, higher custom design requirement. |
| Complex | x3.0+ | High-risk, implementation-heavy, multi-phase or operationally sensitive. |

### Risk Levels

Risk should influence price when the work touches:

- Customer-facing AI output
- Payment, finance, or commercial operations
- Sensitive customer data
- Legal, compliance, HR, medical, or regulated contexts
- Operational decisions with real-world consequences
- Production system changes
- Automated client communication
- Cost-sensitive AI usage or token consumption

Suggested risk labels:

- Low
- Medium
- High
- Critical

Higher risk requires stronger review gates, documentation, and testing. That should increase the price or reduce the automation scope.

### Delivery Depth

Pricing should increase as delivery depth increases.

| Delivery depth | Description |
| --- | --- |
| Advice only | Recommendations and explanation only. |
| Blueprint only | Future-state workflow and design map. |
| Blueprint + implementation plan | Sequenced plan with ownership and milestones. |
| Blueprint + templates/instructions | Includes operating docs, AI instructions, review gates, or SOPs. |
| Done-with-you support | Includes guided sessions, implementation review, and build support. |
| Done-for-you implementation | Axiom designs and builds defined parts of the system. |
| Ongoing stewardship | Monitoring, review, maintenance, improvement, and support. |

---

## Admin Proposal Preparation Fields

The admin preparation form should include the following fields.

### Client Context

- Client name
- Business / organisation name
- Client email
- Proposal workspace name
- Source request or linked submission
- Current problem summary
- Desired outcome
- Evidence supplied
- Tools / systems involved
- People / roles involved

### Recommended Route

- Proposal type: simple, standard, strategic
- Recommended service route
- Alternative service route, if applicable
- Why this route is recommended
- Why other routes are not recommended yet

### Pricing Inputs

- Base service price
- Complexity level
- Risk level
- Delivery depth
- Add-ons
- Discount, if any
- Deposit required
- Payment schedule
- Proposal validity period
- Final total
- Currency
- VAT/tax note, if applicable

### Scope

- Scope summary
- Included work
- Deliverables
- Timeline
- Milestones
- Client responsibilities
- What is not included
- Assumptions
- Dependencies
- Change request terms

### Internal Controls

- Internal pricing notes
- Internal risk notes
- Internal margin confidence
- Admin reviewer
- Approval state
- Revision notes

### Client-Facing Commercial Copy

- Client-facing price explanation
- Outcome summary
- Investment summary
- Payment terms
- Acceptance instructions
- Next step CTA

---

## Proposal PDF Structure

Proposal PDFs should share the Axiom Architect branded report style, but should read as commercial proposal documents rather than diagnostic reports.

### Cover Page

Should include:

- Axiom Architect brand
- Prepared for client name
- Business / organisation name
- Proposal workspace name
- Proposal title
- Recommended service route
- Prepared date
- Proposal reference
- Valid until date

Recommended title format:

> [Business Name]  
> [Proposal Workspace Name]  
> [Recommended Service Route] Proposal

Example:

> Kiwiai  
> Core AI  
> Workflow Blueprint Proposal

### Control Page

Should include:

- Client
- Business
- Email
- Proposal reference
- Recommended service
- Proposal type
- Valid until
- Prepared by
- Current status

### Client Situation Summary

Purpose:

- Show that Axiom understands the client context.
- Summarise the current problem without overloading the client.

Should include:

- What we understand
- Current friction points
- Desired outcome
- Key risk or constraint

### Recommended Route

Should include:

- Recommended service route
- Why this is the correct route
- Why it is safe / proportionate
- What this avoids
- Optional alternative route, if useful

### Scope of Work

Should include:

- Included work
- Delivery phases
- What Axiom will prepare
- What the client must provide
- Review points

### Deliverables

Should include:

- Deliverable name
- Description
- Format
- Owner
- Expected value

### Timeline

Should include:

- Estimated start
- Delivery window
- Milestones
- Client response dependencies
- Review dates, if applicable

### Investment

Should show a clean commercial summary, not raw internal scoring.

Example:

> Recommended Package  
> Workflow Architecture Blueprint
>
> Investment  
> $1,250
>
> Includes  
> - Workflow diagnosis review  
> - Future-state workflow map  
> - AI/automation suitability plan  
> - Human review gate design  
> - Implementation sequence  
> - Custom operating recommendations

### Optional Add-ons

Show optional items clearly.

Example:

- Custom Assistant Instruction Kit - $450
- Implementation Support Session - $250
- Ongoing Workflow Stewardship - from $500/month

### Payment Terms

Should include:

- Deposit required
- Balance terms
- Payment method
- When work begins
- What happens if payment is delayed

### Exclusions

Every proposal must include a clear exclusions section.

Example language:

> This proposal does not include live automation deployment, third-party software subscription fees, legal compliance review, custom software engineering, or ongoing monitoring unless listed in the included deliverables.

### Acceptance Instructions

Should include:

- Accept proposal CTA
- Request changes CTA
- Book call CTA
- Proposal expiry date
- Next step after acceptance

---

## Client Proposal Actions

The client proposal page should allow:

- View proposal
- Download PDF after proposal is sent
- Accept proposal
- Request changes
- Book call or contact Axiom

Later versions may include:

- E-signature
- Stripe checkout creation
- Invoice request
- Converted project workspace
- Proposal viewed tracking
- Acceptance timestamp

---

## Proposal-to-Order Conversion

Accepted proposals should be able to convert into a paid order or implementation workspace.

Possible conversion paths:

1. Stripe checkout link generated from proposal total.
2. Manual invoice / bank transfer path.
3. Admin-created order record.
4. Implementation workspace created after payment.

The first build can support a manual conversion note before automating Stripe checkout creation.

Recommended first version:

- Client accepts proposal.
- Proposal status becomes `accepted`.
- Admin sees accepted proposal.
- Admin manually creates payment route or converts to order.
- Later build adds automatic Stripe checkout from proposal total.

---

## Data Model Draft

The exact database schema should be inspected before implementation. The first proposal tables may look like this.

### `axiom_proposals`

- `id`
- `customer_id`
- `source_request_id`
- `proposal_reference`
- `proposal_type`
- `status`
- `workspace_name`
- `recommended_service_route`
- `alternative_service_route`
- `client_summary`
- `current_problem_summary`
- `desired_outcome`
- `scope_summary`
- `included_work_json`
- `deliverables_json`
- `timeline_json`
- `exclusions_json`
- `client_responsibilities_json`
- `pricing_json`
- `internal_pricing_notes`
- `client_price_explanation`
- `payment_terms_json`
- `valid_until`
- `proposal_json`
- `pdf_file_path`
- `pdf_ready`
- `pdf_generated_at`
- `sent_at`
- `viewed_at`
- `accepted_at`
- `changes_requested_at`
- `converted_order_id`
- `created_at`
- `updated_at`

### `pricing_json`

Suggested shape:

```json
{
  "currency": "USD",
  "base_service_price": 750,
  "complexity_level": "standard",
  "complexity_multiplier": 1.5,
  "risk_level": "medium",
  "delivery_depth": "blueprint_plus_implementation_plan",
  "add_ons": [
    {
      "name": "Custom Assistant Instruction Kit",
      "price": 450,
      "included": false
    }
  ],
  "discount": {
    "label": "Launch client adjustment",
    "amount": 0
  },
  "deposit_required": 600,
  "final_total": 1200,
  "payment_schedule": "50% to begin, 50% before final delivery"
}
```

---

## Admin Build Sequence

Do not build PDF generation first. The proposal content and pricing model must come first.

Recommended build sequence:

1. Inspect existing proposal request/client proposal/admin proposal pages.
2. Define proposal data shape in types.
3. Create admin proposal draft page.
4. Add proposal preparation form.
5. Save proposal draft data.
6. Add internal pricing fields and client-facing price explanation.
7. Add proposal status controls.
8. Generate branded proposal PDF from saved proposal data.
9. Add admin preview/regenerate/send flow.
10. Add client proposal view/download flow.
11. Add accept/request changes actions.
12. Add conversion-to-order path.

---

## First Codex Build Task

Use this as the first implementation task:

> Build the proposal preparation data model and admin proposal draft workflow for Axiom Architect. Do not build the PDF first. Use this plan as the source of truth. Inspect current proposal request, admin, client, and database patterns. Create the smallest safe proposal preparation layer that lets admin create, edit, price, and save a proposal draft with internal pricing notes separated from client-facing pricing explanation.

---

## Launch Version Boundary

The first usable version does not need full automation.

Must have:

- Admin can create proposal draft.
- Admin can set price manually.
- Admin can define scope, deliverables, exclusions, timeline, payment terms, and validity.
- Admin can mark proposal ready to send.
- Admin can generate PDF after review.
- Client can view/download only after proposal is sent.
- Client can accept or request changes.

Can wait:

- Automatic Stripe checkout from proposal total.
- E-signature.
- Multi-currency tax logic.
- Proposal analytics.
- Automated AI pricing.
- Automatic conversion to implementation workspace.

---

## Commercial Quality Rules

Every proposal must be:

- Specific to the client.
- Clear about the problem being solved.
- Clear about what Axiom will deliver.
- Clear about what is not included.
- Clear about payment terms.
- Clear about next steps.
- Confident but not hype-driven.
- Precise, calm, premium, and systems-focused.

The client should finish reading the proposal thinking:

> Axiom understands the workflow, the scope is controlled, the price makes sense, and the next step is clear.
