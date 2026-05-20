export type ClientPortalNavItem = {
  href: string;
  label: string;
  description: string;
};

export type ClientPortalPanel = {
  title: string;
  label: string;
  text: string;
};

export type ClientPortalMetric = {
  label: string;
  value: string;
  text: string;
};

export type ClientPortalSection = {
  eyebrow: string;
  title: string;
  intro: string;
  items: ClientPortalPanel[];
};

export type ClientPortalAction = {
  title: string;
  text: string;
  href: string;
};

export type ClientPortalPageContent = {
  eyebrow: string;
  title: string;
  intro: string;
  summaryLabel: string;
  summaryTitle: string;
  summaryText: string;
  metrics: ClientPortalMetric[];
  sections: ClientPortalSection[];
  actions?: ClientPortalAction[];
  panels: ClientPortalPanel[];
};

export const clientPortalNav: ClientPortalNavItem[] = [
  {
    href: "/client",
    label: "Overview",
    description: "Your proposal status, workspace position, and next client action.",
  },
  {
    href: "/client/operations",
    label: "Operations",
    description: "Project phases, review gates, decisions, and current operating priorities.",
  },
  {
    href: "/client/documents",
    label: "Documents",
    description: "Requested evidence, supplied material, and files needed for review.",
  },
  {
    href: "/client/deliverables",
    label: "Deliverables",
    description: "Blueprints, reports, protocols, and handoff material produced for the engagement.",
  },
  {
    href: "/client/billing",
    label: "Billing",
    description: "Proposal value, invoices, payment status, and service records.",
  },
  {
    href: "/client/account",
    label: "Account",
    description: "Business identity, primary contact, and client access details.",
  },
];

export const premiumClientTierSlugs = new Set([
  "workflow-stewardship",
  "custom-operating-pack",
  "departmental-ecosystem",
  "architect-residency",
  "enterprise-architecture-system",
]);

export const portalStatusCards: ClientPortalMetric[] = [
  {
    label: "Status",
    value: "Client route",
    text: "This portal is reserved for custom workflow and premium service clients.",
  },
  {
    label: "Identity",
    value: "Account-linked",
    text: "Client records are tied to the signed-in account, not editable form fields.",
  },
  {
    label: "Proposal",
    value: "Protected",
    text: "Detailed proposal intake happens inside the client route after sign-in.",
  },
  {
    label: "Records",
    value: "Connected",
    text: "Service requests, workspaces, and activity are linked to one customer record.",
  },
];

export const overviewContent: ClientPortalPageContent = {
  eyebrow: "Client overview",
  title: "Your Axiom Architect client workspace.",
  intro:
    "A private workspace for your custom proposal, review status, next action, documents, deliverables, billing, and account details.",
  summaryLabel: "Current position",
  summaryTitle: "Proposal workspace opened",
  summaryText:
    "Your account is connected to the client portal. Once you submit a protected proposal, Axiom can review the scope and organise the service request under this workspace.",
  metrics: [
    { label: "Proposal", value: "Ready", text: "Submit the custom proposal intake from the protected client route." },
    { label: "Account", value: "Linked", text: "Name, email, and business are taken from the customer record." },
    { label: "Workspace", value: "Private", text: "Custom work stays separate from standard audit dashboards." },
    { label: "Next step", value: "Submit", text: "Complete the protected proposal intake when ready." },
  ],
  sections: [
    {
      eyebrow: "Your next action",
      title: "Start or continue the custom proposal.",
      intro: "The proposal intake gives Axiom the workflow context needed to judge scope, suitability, risk, and the right service route.",
      items: [
        { label: "Step 01", title: "Open proposal intake", text: "Use the protected proposal form so the request is attached to this account." },
        { label: "Step 02", title: "Describe the workflow", text: "Explain the process, tools, people, risks, and desired outcome without sharing secrets." },
        { label: "Step 03", title: "Wait for review", text: "Axiom reviews the request and prepares the correct next step for the engagement." },
      ],
    },
    {
      eyebrow: "Workspace areas",
      title: "Where each part of the engagement lives.",
      intro: "Each portal area has a distinct job so the client route does not become one vague dashboard.",
      items: [
        { label: "Operations", title: "Phases and decisions", text: "Track review stages, open decisions, client actions, and approval gates." },
        { label: "Documents", title: "Evidence and files", text: "Keep supporting material, document requests, and file status separate from deliverables." },
        { label: "Billing", title: "Commercial record", text: "Use billing for invoices, payment state, proposal value, and service records." },
      ],
    },
  ],
  panels: [],
  actions: [
    { title: "Submit proposal", text: "Open the protected custom proposal intake.", href: "/client/proposal" },
    { title: "Review operations", text: "See current project phases and decisions.", href: "/client/operations" },
    { title: "Check documents", text: "Review evidence and requested material.", href: "/client/documents" },
  ],
};

overviewContent.panels = overviewContent.sections.flatMap((section) => section.items);

export const operationsContent: ClientPortalPageContent = {
  eyebrow: "Operations",
  title: "Project phases, decisions, and review gates.",
  intro:
    "Use this page to understand what stage the custom engagement is in, what is waiting for a decision, and where client approval is required.",
  summaryLabel: "Operational status",
  summaryTitle: "Awaiting proposal review",
  summaryText:
    "After a proposal intake is submitted, Axiom can move the request through discovery, workflow mapping, architecture design, and implementation planning.",
  metrics: [
    { label: "Phase", value: "Discovery", text: "Initial workflow context and business requirements are gathered here." },
    { label: "Decision", value: "Pending", text: "Scope, timeline, and implementation depth are confirmed after review." },
    { label: "Risk", value: "Guarded", text: "Sensitive data, auth, billing, and production systems require approval gates." },
    { label: "Client action", value: "Context", text: "Provide enough detail for a clean proposal decision." },
  ],
  sections: [
    {
      eyebrow: "Engagement phases",
      title: "How the work moves forward.",
      intro: "These are the client-facing stages used to keep custom work controlled and understandable.",
      items: [
        { label: "01", title: "Discovery", text: "Axiom reviews the submitted workflow, business context, tools, constraints, and goals." },
        { label: "02", title: "Workflow mapping", text: "The current process is mapped across people, tools, handoffs, delays, and decision points." },
        { label: "03", title: "Architecture design", text: "A future workflow is shaped around automation suitability, AI support, and human review." },
        { label: "04", title: "Implementation plan", text: "Approved work is converted into staged actions, acceptance criteria, and delivery checkpoints." },
      ],
    },
    {
      eyebrow: "Review gates",
      title: "What needs approval before work changes.",
      intro: "Custom work should never drift into production changes without explicit approval.",
      items: [
        { label: "Scope", title: "Service boundary", text: "Confirm what is included, what is excluded, and what counts as additional work." },
        { label: "Access", title: "System permissions", text: "Any repository, site, database, or third-party tool access must be approved first." },
        { label: "Delivery", title: "Acceptance check", text: "Final outputs should be reviewed against the agreed proposal and deliverables." },
      ],
    },
  ],
  panels: [],
  actions: [
    { title: "Open proposal", text: "Submit or update the proposal context.", href: "/client/proposal" },
    { title: "View documents", text: "Check what evidence may be needed.", href: "/client/documents" },
    { title: "View deliverables", text: "See where outputs will be organised.", href: "/client/deliverables" },
  ],
};

operationsContent.panels = operationsContent.sections.flatMap((section) => section.items);

export const documentsContent: ClientPortalPageContent = {
  eyebrow: "Documents",
  title: "Evidence, files, and review material.",
  intro:
    "The documents area keeps supporting material separate from final outputs. It is for evidence, examples, exports, screenshots, SOPs, and workflow references.",
  summaryLabel: "Document state",
  summaryTitle: "No document request is active",
  summaryText:
    "When Axiom needs evidence, the request should be specific: what file is needed, why it matters, and whether it has been reviewed.",
  metrics: [
    { label: "Uploads", value: "None", text: "No client files are currently attached to this workspace." },
    { label: "Requests", value: "Clear", text: "Future document requests should state exactly what is needed." },
    { label: "Review", value: "Tracked", text: "Files should move from requested to received to reviewed." },
    { label: "Security", value: "Guarded", text: "Do not upload secrets, passwords, tokens, or unnecessary personal data." },
  ],
  sections: [
    {
      eyebrow: "Evidence types",
      title: "Useful material for workflow diagnosis.",
      intro: "Good documents help Axiom understand the real process instead of relying on vague descriptions.",
      items: [
        { label: "Process", title: "SOPs and workflow notes", text: "Current operating steps, checklists, handoff notes, and internal instructions." },
        { label: "Systems", title: "Tool screenshots", text: "Screenshots or exports showing dashboards, forms, automations, and repeated manual steps." },
        { label: "Examples", title: "Real work samples", text: "Redacted examples of typical tasks, exceptions, client requests, or approval flows." },
        { label: "Rules", title: "Policies and constraints", text: "Compliance notes, access limits, approval requirements, or business rules that shape the work." },
      ],
    },
    {
      eyebrow: "Document rules",
      title: "What should not be uploaded.",
      intro: "The portal should support review without collecting unnecessary risk.",
      items: [
        { label: "Secrets", title: "No credentials", text: "Do not upload passwords, API keys, seed phrases, access tokens, or private keys." },
        { label: "Payments", title: "No card data", text: "Do not upload payment card details or unnecessary billing information." },
        { label: "Private data", title: "Redact where possible", text: "Remove client names, personal data, and sensitive records unless clearly required." },
      ],
    },
  ],
  panels: [],
  actions: [
    { title: "Back to overview", text: "Return to current workspace status.", href: "/client" },
    { title: "Open operations", text: "See current review phases.", href: "/client/operations" },
    { title: "View deliverables", text: "Separate final outputs from evidence.", href: "/client/deliverables" },
  ],
};

documentsContent.panels = documentsContent.sections.flatMap((section) => section.items);

export const deliverablesContent: ClientPortalPageContent = {
  eyebrow: "Deliverables",
  title: "Blueprints, protocols, and final outputs.",
  intro:
    "Deliverables are the client-facing outputs of the engagement. This page separates finished work from raw evidence and day-to-day operations.",
  summaryLabel: "Delivery state",
  summaryTitle: "No deliverable released yet",
  summaryText:
    "Once the proposal is reviewed and the work is agreed, approved outputs can be organised here by type, status, and download route.",
  metrics: [
    { label: "Blueprint", value: "Pending", text: "Architecture blueprint appears after review and scoping." },
    { label: "Workflow map", value: "Pending", text: "Process maps are prepared once the current workflow is understood." },
    { label: "Protocol", value: "Pending", text: "AI operating rules and review gates belong in final outputs." },
    { label: "Handoff", value: "Pending", text: "Final files should include status, version, and approval state." },
  ],
  sections: [
    {
      eyebrow: "Output types",
      title: "What may be delivered through this area.",
      intro: "Different services produce different outputs, but each should have a clear purpose and approval state.",
      items: [
        { label: "Blueprint", title: "Workflow architecture", text: "A structured operating model for how the improved workflow should run." },
        { label: "Map", title: "Process sequence", text: "A clear view of stages, handoffs, decisions, systems, and failure points." },
        { label: "Protocol", title: "AI operating rules", text: "Assistant roles, boundaries, review gates, escalation rules, and human control points." },
        { label: "Workbook", title: "Implementation support", text: "A practical guide for applying the blueprint across tools, people, and routines." },
      ],
    },
    {
      eyebrow: "Approval state",
      title: "How deliverables should be controlled.",
      intro: "Client-facing outputs should not be ambiguous. Each file needs a status and next action.",
      items: [
        { label: "Draft", title: "For review", text: "A draft output needs client review before it is treated as final." },
        { label: "Approved", title: "Accepted output", text: "Approved files become the working reference for implementation or handoff." },
        { label: "Superseded", title: "Replaced version", text: "Older files should remain traceable but not treated as the current source." },
      ],
    },
  ],
  panels: [],
  actions: [
    { title: "Open documents", text: "Review supporting material first.", href: "/client/documents" },
    { title: "Open operations", text: "Check project phase and approvals.", href: "/client/operations" },
    { title: "Open billing", text: "Review service and invoice status.", href: "/client/billing" },
  ],
};

deliverablesContent.panels = deliverablesContent.sections.flatMap((section) => section.items);

export const billingContent: ClientPortalPageContent = {
  eyebrow: "Billing",
  title: "Proposal value, invoices, and service status.",
  intro:
    "Billing is kept separate from project operations so commercial records do not get mixed into workflow notes, documents, or deliverables.",
  summaryLabel: "Billing state",
  summaryTitle: "No active invoice shown",
  summaryText:
    "Custom proposal work is priced after review. Any invoice or payment record should connect back to an agreed service request or accepted proposal.",
  metrics: [
    { label: "Proposal", value: "Review first", text: "Pricing follows scope review, not the initial form submission." },
    { label: "Invoice", value: "None", text: "No invoice is displayed for this workspace yet." },
    { label: "Payment", value: "Not due", text: "Payment status changes only after a proposal is accepted." },
    { label: "Service", value: "Pending", text: "Active services should link back to a service request." },
  ],
  sections: [
    {
      eyebrow: "Commercial flow",
      title: "How custom work moves from request to invoice.",
      intro: "Axiom reviews the request first so the commercial record matches the actual work required.",
      items: [
        { label: "01", title: "Proposal request", text: "The client submits workflow context through the protected proposal form." },
        { label: "02", title: "Scope review", text: "Axiom reviews complexity, risk, implementation needs, and deliverables." },
        { label: "03", title: "Proposal sent", text: "The agreed route, timeline, deliverables, and price are sent for approval." },
        { label: "04", title: "Invoice issued", text: "Billing is created only after the client accepts the proposal or agreed next step." },
      ],
    },
    {
      eyebrow: "Billing records",
      title: "What should be visible here.",
      intro: "The billing page should answer practical client questions without exposing private payment data.",
      items: [
        { label: "Invoices", title: "Issued records", text: "Invoice number, amount, status, due date, and related service request." },
        { label: "Payments", title: "Payment status", text: "Paid, due, overdue, refunded, or manually reconciled status." },
        { label: "Services", title: "Commercial scope", text: "The accepted service tier, deliverables, and agreed support window." },
      ],
    },
  ],
  panels: [],
  actions: [
    { title: "Open proposal", text: "Submit scope before pricing is finalised.", href: "/client/proposal" },
    { title: "Open deliverables", text: "Check what outputs are attached to the service.", href: "/client/deliverables" },
    { title: "Open account", text: "Confirm business and contact details.", href: "/client/account" },
  ],
};

billingContent.panels = billingContent.sections.flatMap((section) => section.items);

export const accountContent: ClientPortalPageContent = {
  eyebrow: "Account",
  title: "Client identity and access details.",
  intro:
    "The account page explains which client identity is attached to the workspace and which details should be used for proposals, billing, and communication.",
  summaryLabel: "Account state",
  summaryTitle: "Customer record controls identity",
  summaryText:
    "Name, email, and business should come from the linked customer record. Proposal forms should not ask clients to re-enter or change account identity.",
  metrics: [
    { label: "Identity", value: "Locked", text: "Proposal identity should be taken from the signed-in customer record." },
    { label: "Email", value: "Primary", text: "The customer email is used for portal access and service communication." },
    { label: "Business", value: "Linked", text: "Business name connects proposals, workspaces, and billing records." },
    { label: "Access", value: "Protected", text: "Client pages should require a valid authenticated session." },
  ],
  sections: [
    {
      eyebrow: "Client record",
      title: "What belongs in the account area.",
      intro: "This page should help the client understand the identity connected to the workspace.",
      items: [
        { label: "Name", title: "Primary contact", text: "The person Axiom should treat as the main client contact for this workspace." },
        { label: "Email", title: "Login and communication", text: "The email used for login, account confirmation, and service updates." },
        { label: "Business", title: "Workspace owner", text: "The company, project, or organisation attached to proposals and billing records." },
        { label: "Status", title: "Account standing", text: "Whether the account is active, pending confirmation, or needs support." },
      ],
    },
    {
      eyebrow: "Access rules",
      title: "What must stay controlled.",
      intro: "Account controls should protect the client route without interfering with standard login.",
      items: [
        { label: "Auth", title: "Normal login remains separate", text: "The standard auth route handles sessions and should not be mixed with proposal submission." },
        { label: "Customer", title: "Single customer record", text: "Existing audit clients should reuse the same customer account for custom proposals." },
        { label: "Security", title: "No secrets in forms", text: "Passwords, keys, tokens, and payment data must never be stored in proposal records." },
      ],
    },
  ],
  panels: [],
  actions: [
    { title: "Open proposal", text: "Submit a custom workflow proposal under this account.", href: "/client/proposal" },
    { title: "Open billing", text: "Review commercial records for this client.", href: "/client/billing" },
    { title: "Back to overview", text: "Return to the workspace summary.", href: "/client" },
  ],
};

accountContent.panels = accountContent.sections.flatMap((section) => section.items);
