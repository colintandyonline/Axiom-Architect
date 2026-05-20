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
    description: "A clear view of your proposal, current phase, and next action.",
  },
  {
    href: "/client/operations",
    label: "Operations",
    description: "The working plan, review stages, decisions, and approvals for your engagement.",
  },
  {
    href: "/client/documents",
    label: "Documents",
    description: "Files, examples, notes, and supporting material connected to your work.",
  },
  {
    href: "/client/deliverables",
    label: "Deliverables",
    description: "Blueprints, reports, protocols, maps, and handoff material prepared for you.",
  },
  {
    href: "/client/billing",
    label: "Billing",
    description: "Your proposal value, invoices, payment status, and service history.",
  },
  {
    href: "/client/account",
    label: "Account",
    description: "Your contact details, business profile, and access information.",
  },
];

export const premiumClientTierSlugs = new Set([
  "workflow-stewardship",
  "custom-operating-pack",
  "departmental-ecosystem",
  "architect-residency",
  "enterprise-architecture-system",
]);

export const portalStatusCards: ClientPortalMetric[] = [];

export const overviewContent: ClientPortalPageContent = {
  eyebrow: "Client overview",
  title: "Your workspace.",
  intro:
    "A private place to follow your Axiom Architect engagement, see what is happening now, and move to the next step without digging through emails.",
  summaryLabel: "Current position",
  summaryTitle: "Proposal received.",
  summaryText:
    "Your workspace shows the latest review status, current phase, next action, and any updates connected to your engagement.",
  metrics: [
    { label: "Proposal", value: "In review", text: "Axiom is reviewing your submitted workflow context." },
    { label: "Phase", value: "Discovery", text: "The first stage focuses on understanding the work, tools, and constraints." },
    { label: "Next step", value: "Review", text: "Axiom will confirm the right proposal route before work begins." },
    { label: "Workspace", value: "Open", text: "Your engagement activity will appear in this portal as it progresses." },
  ],
  sections: [
    {
      eyebrow: "What happens next",
      title: "From proposal to plan.",
      intro: "Axiom reviews the request, checks fit, and turns the messy workflow context into a clear next step.",
      items: [
        { label: "01", title: "Scope review", text: "Your workflow, goals, timeline, and constraints are reviewed before any proposal is prepared." },
        { label: "02", title: "Proposal direction", text: "Axiom confirms whether the work is best handled as a blueprint, operating pack, build, or retained support." },
        { label: "03", title: "Client decision", text: "You receive a clear next step before any paid implementation work begins." },
      ],
    },
    {
      eyebrow: "Workspace guide",
      title: "Where to find things.",
      intro: "Each area of the portal has a practical purpose during the engagement.",
      items: [
        { label: "Operations", title: "Plan and progress", text: "Use this for phases, priorities, decisions, and approvals." },
        { label: "Documents", title: "Supporting material", text: "Use this for files, examples, screenshots, and workflow evidence." },
        { label: "Deliverables", title: "Finished outputs", text: "Use this for reports, blueprints, protocols, and handoff material." },
      ],
    },
  ],
  panels: [],
  actions: [
    { title: "Open proposal", text: "View or submit the detailed proposal intake.", href: "/client/proposal" },
    { title: "View operations", text: "Check the current working stage.", href: "/client/operations" },
    { title: "View documents", text: "See supporting material and file requests.", href: "/client/documents" },
  ],
};

overviewContent.panels = overviewContent.sections.flatMap((section) => section.items);

export const operationsContent: ClientPortalPageContent = {
  eyebrow: "Operations",
  title: "The working plan.",
  intro:
    "This page shows how the engagement is moving forward: the current stage, current focus, open decisions, and what needs attention next.",
  summaryLabel: "Current stage",
  summaryTitle: "Discovery underway.",
  summaryText:
    "Axiom is reviewing your workflow context and shaping the right approach before recommending implementation steps.",
  metrics: [
    { label: "Phase", value: "Discovery", text: "Understanding the current process and the outcome you want." },
    { label: "Focus", value: "Proposal review", text: "Checking fit, complexity, risks, and the likely service route." },
    { label: "Decision", value: "Pending", text: "The next decision is the correct proposal direction." },
    { label: "Approval", value: "Required", text: "No implementation work begins without clear client approval." },
  ],
  sections: [
    {
      eyebrow: "Engagement flow",
      title: "How the work moves.",
      intro: "Custom work moves in stages so the scope stays clear and controlled.",
      items: [
        { label: "01", title: "Discovery", text: "Axiom reviews the current workflow, goals, tools, constraints, and examples." },
        { label: "02", title: "Mapping", text: "The process is broken into stages, handoffs, decisions, bottlenecks, and risks." },
        { label: "03", title: "Design", text: "The future workflow is shaped around better structure, automation fit, and safe AI use." },
        { label: "04", title: "Plan", text: "The agreed direction becomes a clear plan with actions, responsibilities, and checkpoints." },
      ],
    },
    {
      eyebrow: "Approval points",
      title: "Where you stay in control.",
      intro: "Key decisions stay visible so work does not move ahead without agreement.",
      items: [
        { label: "Scope", title: "What is included", text: "The proposal confirms what is included, what is excluded, and what would be extra." },
        { label: "Access", title: "What can be inspected", text: "Any access to sites, files, tools, or systems must be agreed first." },
        { label: "Delivery", title: "What counts as complete", text: "Finished work is checked against the agreed outputs and next action." },
      ],
    },
  ],
  panels: [],
  actions: [
    { title: "Open proposal", text: "Review the proposal intake.", href: "/client/proposal" },
    { title: "View documents", text: "Check supporting material.", href: "/client/documents" },
    { title: "View deliverables", text: "See where final outputs will appear.", href: "/client/deliverables" },
  ],
};

operationsContent.panels = operationsContent.sections.flatMap((section) => section.items);

export const documentsContent: ClientPortalPageContent = {
  eyebrow: "Documents",
  title: "Supporting material.",
  intro:
    "Use this area for files, screenshots, process notes, examples, and references that help Axiom understand the real workflow.",
  summaryLabel: "Document status",
  summaryTitle: "No files requested yet.",
  summaryText:
    "When supporting material is needed, the request will be clear: what to provide, why it helps, and what happens after review.",
  metrics: [
    { label: "Files", value: "None yet", text: "No files are currently attached to this workspace." },
    { label: "Requests", value: "None open", text: "Document requests will appear here when needed." },
    { label: "Review", value: "Not started", text: "Uploaded material will show a clear review state." },
    { label: "Privacy", value: "Careful", text: "Only share material that is needed for the engagement." },
  ],
  sections: [
    {
      eyebrow: "Useful material",
      title: "What helps the review.",
      intro: "Good examples make the proposal sharper and reduce guesswork.",
      items: [
        { label: "Process", title: "Current steps", text: "Checklists, process notes, standard operating steps, or internal instructions." },
        { label: "Tools", title: "Screenshots and exports", text: "Screenshots or examples showing forms, dashboards, tools, and repeated manual tasks." },
        { label: "Examples", title: "Typical work", text: "Redacted examples of common requests, exceptions, handoffs, or approval moments." },
        { label: "Rules", title: "Limits and requirements", text: "Policies, constraints, approval rules, or compliance notes that affect the workflow." },
      ],
    },
    {
      eyebrow: "Before uploading",
      title: "Keep sensitive data out.",
      intro: "Share enough to explain the workflow without exposing information that is not needed.",
      items: [
        { label: "Access", title: "No passwords", text: "Never upload passwords, access keys, recovery phrases, or private credentials." },
        { label: "Payments", title: "No card data", text: "Do not upload card numbers or unnecessary payment information." },
        { label: "Privacy", title: "Redact where possible", text: "Remove names, private client details, and sensitive personal information where possible." },
      ],
    },
  ],
  panels: [],
  actions: [
    { title: "Back to overview", text: "Return to your workspace summary.", href: "/client" },
    { title: "View operations", text: "Check the current working stage.", href: "/client/operations" },
    { title: "View deliverables", text: "See where finished outputs will appear.", href: "/client/deliverables" },
  ],
};

documentsContent.panels = documentsContent.sections.flatMap((section) => section.items);

export const deliverablesContent: ClientPortalPageContent = {
  eyebrow: "Deliverables",
  title: "Your outputs.",
  intro:
    "This area is where finished or review-ready material appears: blueprints, reports, workflow maps, protocols, and handoff files.",
  summaryLabel: "Delivery status",
  summaryTitle: "No outputs released yet.",
  summaryText:
    "Deliverables appear here once the proposal is agreed and the work reaches the right stage.",
  metrics: [
    { label: "Blueprint", value: "Pending", text: "Your architecture blueprint will appear here when prepared." },
    { label: "Workflow map", value: "Pending", text: "Workflow maps will appear here when ready for review." },
    { label: "Protocol", value: "Pending", text: "AI operating rules and review gates will appear here if included." },
    { label: "Handoff", value: "Pending", text: "Final material will be organised here when complete." },
  ],
  sections: [
    {
      eyebrow: "Output types",
      title: "What may appear here.",
      intro: "The final outputs depend on the agreed proposal and service route.",
      items: [
        { label: "Blueprint", title: "Workflow architecture", text: "A clear operating model for the improved workflow." },
        { label: "Map", title: "Process sequence", text: "A visual or written structure showing stages, handoffs, decisions, and review points." },
        { label: "Protocol", title: "AI operating rules", text: "Clear instructions, boundaries, review gates, and escalation rules for AI-assisted work." },
        { label: "Workbook", title: "Implementation guide", text: "Practical steps for applying the plan across people, tools, and routines." },
      ],
    },
    {
      eyebrow: "Review status",
      title: "Know what is ready.",
      intro: "Outputs will show whether they are being prepared, ready for review, approved, or delivered.",
      items: [
        { label: "Draft", title: "For review", text: "Draft material is shared for feedback before final approval." },
        { label: "Approved", title: "Accepted", text: "Approved outputs become the working reference for the engagement." },
        { label: "Delivered", title: "Final", text: "Delivered files are ready to use or hand over." },
      ],
    },
  ],
  panels: [],
  actions: [
    { title: "View documents", text: "Check supporting material first.", href: "/client/documents" },
    { title: "View operations", text: "Check the current working stage.", href: "/client/operations" },
    { title: "View billing", text: "Review proposal and invoice status.", href: "/client/billing" },
  ],
};

deliverablesContent.panels = deliverablesContent.sections.flatMap((section) => section.items);

export const billingContent: ClientPortalPageContent = {
  eyebrow: "Billing",
  title: "Billing and proposal value.",
  intro:
    "This area shows proposal value, invoices, payment status, and service history for the engagement.",
  summaryLabel: "Billing status",
  summaryTitle: "No invoice due.",
  summaryText:
    "Pricing is confirmed after review. Any invoice or payment request will appear here with clear status and next action.",
  metrics: [
    { label: "Proposal", value: "Review first", text: "Pricing follows scope review and agreement." },
    { label: "Invoice", value: "None", text: "No invoice is currently shown for this workspace." },
    { label: "Payment", value: "Not due", text: "Payment status changes only after a proposal is accepted." },
    { label: "Service", value: "Pending", text: "Accepted work will appear here with its billing status." },
  ],
  sections: [
    {
      eyebrow: "Commercial flow",
      title: "From proposal to invoice.",
      intro: "Custom work is priced after the request has been reviewed properly.",
      items: [
        { label: "01", title: "Request received", text: "Your workflow context is reviewed before pricing is prepared." },
        { label: "02", title: "Scope confirmed", text: "Axiom confirms the right route, timeline, and outputs." },
        { label: "03", title: "Proposal sent", text: "You receive the proposed scope, price, and next step." },
        { label: "04", title: "Invoice issued", text: "Billing is issued only after the agreed proposal or next step." },
      ],
    },
    {
      eyebrow: "What appears here",
      title: "Clear billing information.",
      intro: "This page is for practical billing visibility, not project notes.",
      items: [
        { label: "Invoices", title: "Issued invoices", text: "Invoice number, amount, status, and due date." },
        { label: "Payments", title: "Payment status", text: "Paid, due, overdue, refunded, or manually reconciled." },
        { label: "Services", title: "Accepted work", text: "The agreed service, support window, and related outputs." },
      ],
    },
  ],
  panels: [],
  actions: [
    { title: "Open proposal", text: "Review your submitted proposal context.", href: "/client/proposal" },
    { title: "View deliverables", text: "Check outputs connected to the work.", href: "/client/deliverables" },
    { title: "View account", text: "Confirm your client details.", href: "/client/account" },
  ],
};

billingContent.panels = billingContent.sections.flatMap((section) => section.items);

export const accountContent: ClientPortalPageContent = {
  eyebrow: "Account",
  title: "Your account details.",
  intro:
    "This page shows the contact and business details connected to your Axiom Architect workspace.",
  summaryLabel: "Account status",
  summaryTitle: "Details connected.",
  summaryText:
    "Your name, email, and business details are used for communication, proposal review, billing, and workspace access.",
  metrics: [
    { label: "Identity", value: "Confirmed", text: "Your workspace is connected to your signed-in account." },
    { label: "Email", value: "Primary", text: "This email is used for access and service updates." },
    { label: "Business", value: "Connected", text: "Your business name is used across proposals and billing." },
    { label: "Access", value: "Private", text: "Only signed-in clients can view this portal." },
  ],
  sections: [
    {
      eyebrow: "Profile",
      title: "Your client profile.",
      intro: "These details help Axiom keep the engagement connected to the right person and business.",
      items: [
        { label: "Name", title: "Primary contact", text: "The person Axiom contacts about this workspace." },
        { label: "Email", title: "Service email", text: "The email used for login, updates, and communication." },
        { label: "Business", title: "Workspace owner", text: "The company or project attached to this engagement." },
        { label: "Status", title: "Account standing", text: "Shows whether the account is active or needs attention." },
      ],
    },
    {
      eyebrow: "Access",
      title: "Private workspace access.",
      intro: "This portal is reserved for signed-in clients connected to an active workspace.",
      items: [
        { label: "Login", title: "Protected access", text: "You must be signed in to view the client portal." },
        { label: "Updates", title: "Service communication", text: "Axiom uses your account email for important updates." },
        { label: "Security", title: "Sensitive information", text: "Do not share passwords, private keys, or unnecessary sensitive data in forms." },
      ],
    },
  ],
  panels: [],
  actions: [
    { title: "Open proposal", text: "Review or submit your proposal context.", href: "/client/proposal" },
    { title: "View billing", text: "Check proposal and invoice status.", href: "/client/billing" },
    { title: "Back to overview", text: "Return to your workspace summary.", href: "/client" },
  ],
};

accountContent.panels = accountContent.sections.flatMap((section) => section.items);
