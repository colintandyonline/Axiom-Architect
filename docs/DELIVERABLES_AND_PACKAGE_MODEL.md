# Axiom Architect Deliverables and Package Model

## Purpose

This document defines what Axiom Architect sells, what clients should receive, and how deliverable outcomes should be matched to client specifications.

The goal is to make the customer-facing packages, proposal intake, admin delivery workflow, and client portal deliverables all point to the same operating model.

## Client Types

Axiom Architect now needs to support two client paths.

### 1. Productized package clients

These clients choose a defined Axiom Architect service package. The scope is mostly known before purchase.

Examples:

- Workflow Audit
- Workflow Blueprint
- Custom AI Operating Protocol
- Agent Instruction Kit
- Implementation Workbook
- Custom Operating Pack

These clients should receive a predictable deliverable bundle based on the selected package.

### 2. Bespoke proposal clients

These clients submit a custom workflow, system, tool stack, or operating problem. The exact deliverable bundle is selected after Axiom reviews the proposal details.

The proposal intake already captures the required specification data:

- workflow summary
- current problem
- tools used
- people involved
- desired outcome
- scope type
- support type
- implementation requirement
- implementation scope
- data sensitivity
- guardrails
- timeline
- budget range
- extra notes

These answers should drive what Axiom prepares and releases back into the client portal.

## Core Deliverable Types

These are the standard deliverable outcome types the platform should understand.

| Deliverable Type | Client Outcome | Used For |
| --- | --- | --- |
| `workflow_diagnosis` | Explains the current workflow, friction, gaps, risks, and operating pattern. | Audits, proposals, first-stage reviews |
| `workflow_map` | Visual or structured map of the workflow, handoffs, inputs, outputs, and decision points. | Audit, blueprint, system design |
| `risk_review_matrix` | Shows sensitive areas, human review gates, approval points, and what must not be automated blindly. | AI governance, automation, sensitive workflows |
| `automation_opportunity_map` | Identifies what can be automated, what should stay human, and what needs redesign first. | Automation design, workflow audit |
| `ai_assistant_opportunity_map` | Shows where AI assistants can draft, summarise, route, prepare, classify, or review work. | AI operating protocols, assistant kits |
| `tool_stack_architecture` | Recommends the role of existing tools and where new tooling or integrations may fit. | Operating system design, system build |
| `implementation_sequence` | Prioritised implementation route with phases, dependencies, and safe next actions. | Blueprint, workbook, build prep |
| `ai_operating_protocol` | Rules, instructions, boundaries, review gates, and operating standards for repeated AI-supported work. | Custom protocol package |
| `agent_instruction_kit` | Role-specific assistant instructions, task boundaries, prompts, context rules, and review requirements. | Agent kit package |
| `implementation_workbook` | Practical workbook for applying the blueprint, tracking actions, and assigning ownership. | Workbook or operating pack |
| `developer_build_brief` | Developer-ready implementation brief with scope, surfaces, data boundaries, acceptance criteria, and build sequence. | Developer-ready implementation, system build |
| `handoff_pack` | Final client-ready pack combining key assets, links, instructions, and next steps. | Completed projects |

## Package Ladder

### Package 1: Workflow Audit

Purpose: diagnose one workflow, process, tool stack, or operating problem.

Best for:

- unclear process friction
- manual effort
- repeated decisions
- early AI or automation suitability review
- founders or operators who need clarity before changing tools

Standard deliverables:

- `workflow_diagnosis`
- `workflow_map`
- `risk_review_matrix`
- `automation_opportunity_map`
- `implementation_sequence`

Client receives:

- Audit report PDF
- Workflow map file or section
- Action summary
- Recommended next step

### Package 2: Workflow Blueprint

Purpose: turn a workflow diagnosis into a clear future operating model.

Best for:

- teams ready to redesign a process
- businesses needing role clarity, handoff clarity, or tool-stack structure
- clients who need a practical operating model before implementation

Standard deliverables:

- `workflow_diagnosis`
- `workflow_map`
- `tool_stack_architecture`
- `risk_review_matrix`
- `implementation_sequence`
- `handoff_pack`

Client receives:

- Blueprint PDF
- Current-to-future workflow map
- Role and responsibility breakdown
- Review gate matrix
- Implementation sequence

### Package 3: Custom AI Operating Protocol

Purpose: create rules for using AI safely and repeatedly inside a defined workflow.

Best for:

- clients using AI inconsistently
- teams that need boundaries, review gates, and repeatable AI behaviour
- workflows involving sensitive or quality-critical output

Standard deliverables:

- `workflow_diagnosis`
- `ai_assistant_opportunity_map`
- `risk_review_matrix`
- `ai_operating_protocol`
- `implementation_sequence`

Client receives:

- AI operating protocol PDF
- Approved AI use-case map
- Human review and escalation rules
- Prompt/context rules
- Do-not-automate guidance

### Package 4: Agent Instruction Kit

Purpose: define one or more assistant/agent roles around a real workflow.

Best for:

- clients who want repeatable AI assistants rather than random chat use
- internal support assistants, research assistants, operations assistants, reporting assistants, or intake assistants
- teams needing clear instruction boundaries

Standard deliverables:

- `ai_assistant_opportunity_map`
- `agent_instruction_kit`
- `risk_review_matrix`
- `implementation_sequence`

Client receives:

- Assistant role definitions
- System instruction drafts
- Task boundaries
- Input/output expectations
- Review and approval rules

### Package 5: Implementation Workbook

Purpose: turn an approved audit or blueprint into a practical action workbook.

Best for:

- clients who want to execute internally
- teams needing ownership, checklists, and sequencing
- post-blueprint implementation planning

Standard deliverables:

- `implementation_workbook`
- `implementation_sequence`
- `handoff_pack`

Client receives:

- Workbook PDF or document
- Action checklist
- Ownership matrix
- Milestone sequence
- Review prompts

### Package 6: Custom Operating Pack

Purpose: bundle multiple assets into a ready-to-use operating system pack for a workflow or team.

Best for:

- clients needing a full practical pack but not a full custom build
- operators who need templates, instructions, workflow maps, and review gates

Standard deliverables:

- `workflow_map`
- `ai_operating_protocol`
- `agent_instruction_kit`
- `implementation_workbook`
- `handoff_pack`

Client receives:

- Operating pack PDF
- Workflow map
- AI protocol
- Assistant instructions
- Workbook/checklist
- Handoff notes

### Package 7: AI Workflow System Build

Purpose: design and build the operating system or automation layer around the workflow.

Best for:

- higher-budget bespoke clients
- clients needing implementation, tooling, repository work, automation, dashboards, or integrations
- workflows where architecture must become a working system

Standard deliverables:

- `workflow_diagnosis`
- `tool_stack_architecture`
- `risk_review_matrix`
- `developer_build_brief`
- `implementation_sequence`
- `handoff_pack`

Client receives:

- System architecture brief
- Build scope
- Technical surfaces and boundaries
- Acceptance criteria
- Delivery/handoff pack
- Optional working implementation files or links

## Mapping Proposal Answers to Deliverables

The proposal form should guide the deliverable bundle.

| Proposal Field | How It Should Influence Delivery |
| --- | --- |
| `scope_type` | Determines whether the output is one workflow, team system, multi-tool architecture, automation design, implementation brief, or control stack. |
| `support_type` | Determines the primary package route: audit, blueprint, operating system design, automation design, developer brief, manual support, or full build. |
| `tools_used` | Determines whether a tool-stack architecture or integration map is needed. |
| `people_involved` | Determines role maps, handoff maps, approval gates, and review ownership. |
| `desired_outcome` | Determines the final success criteria and whether the client needs clarity, implementation, automation, governance, or a build brief. |
| `implementation_required` | Determines whether delivery stops at blueprint/protocol or moves toward build-ready implementation. |
| `implementation_scope` | Determines whether developer-facing deliverables are required. |
| `sensitive_data` | Determines the depth of review-gate, governance, and do-not-automate guidance. |
| `guardrail_notes` | Determines what must be excluded, protected, escalated, or kept human-reviewed. |
| `timeline` | Determines delivery sequencing and whether a phased handoff is required. |
| `budget_range` | Determines whether to recommend a light audit, deeper blueprint, operating pack, or full build route. |

## Recommended Admin Delivery Workflow

1. Review proposal or package order.
2. Confirm package route.
3. Request client documents if evidence is missing.
4. Mark uploaded documents as reviewed, needs clarification, or archived.
5. Prepare the package deliverables.
6. Upload each deliverable into the workspace deliverables area.
7. Set visibility status:
   - `preparing` for internal draft
   - `ready_for_review` when the client should review
   - `approved` when approved but not final
   - `delivered` when final
8. Send a client update explaining what was released.
9. Track whether the client has read the update.
10. Move workspace phase/status forward.

## Client Portal Delivery Rules

Client-facing deliverables should always show:

- plain title
- short description
- status
- version
- file name
- release date
- open/download action

Client-facing deliverables should not show:

- internal notes
- internal review focus
- admin-only timeline entries
- private operational assumptions
- incomplete draft context unless intentionally marked ready for review

## Immediate Build Implications

The next build steps should be:

1. Create a package model in code so packages are not hard-coded inconsistently across pages.
2. Update the public package/service page to show package outcomes clearly.
3. Update the client portal so purchased packages and bespoke proposal deliverables use the same outcome language.
4. Add an admin package route selector for bespoke clients.
5. Add deliverable type options that match this model.
6. Add better labels and descriptions to the admin deliverable upload form.
7. Eventually allow a package to pre-fill expected deliverables for a workspace.
