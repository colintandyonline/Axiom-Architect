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

export type ClientPortalAction = {
  title: string;
  text: string;
  href: string;
};

export type ClientPortalPageContent = {
  eyebrow: string;
  title: string;
  intro: string;
  panels: ClientPortalPanel[];
  actions?: ClientPortalAction[];
};

export const clientPortalNav: ClientPortalNavItem[] = [
  {
    href: "/client",
    label: "Overview",
    description: "Engagement status, next actions, and key workspace shortcuts.",
  },
  {
    href: "/client/operations",
    label: "Operations",
    description: "Project phases, decisions, review gates, and operational priorities.",
  },
  {
    href: "/client/documents",
    label: "Documents",
    description: "Workflow evidence, uploaded files, and supporting project material.",
  },
  {
    href: "/client/deliverables",
    label: "Deliverables",
    description: "Blueprints, reports, protocols, workbooks, and final outputs.",
  },
  {
    href: "/client/billing",
    label: "Billing",
    description: "Invoices, payment records, active services, and account billing status.",
  },
  {
    href: "/client/account",
    label: "Account",
    description: "Business details, contact information, and workspace access settings.",
  },
];

export const premiumClientTierSlugs = new Set([
  "workflow-stewardship",
  "custom-operating-pack",
  "departmental-ecosystem",
  "architect-residency",
  "enterprise-architecture-system",
]);

export const portalStatusCards = [
  {
    label: "Workspace",
    value: "Client portal",
    text: "A private area for the engagement, separate from standard audit dashboards.",
  },
  {
    label: "Operations",
    value: "Structured",
    text: "Phases, review points, decisions, and client actions stay visible in one place.",
  },
  {
    label: "Documents",
    value: "Evidence-led",
    text: "Files and workflow material will be organised around the work being reviewed.",
  },
  {
    label: "Billing",
    value: "Account-ready",
    text: "Invoices, payments, and active services have a dedicated client area.",
  },
];

export const overviewContent: ClientPortalPageContent = {
  eyebrow: "Client overview",
  title: "Your Axiom Architect workspace.",
  intro:
    "Use this portal to keep the engagement organised: current priorities, operational review areas, documents, deliverables, billing, and account details all sit under a dedicated client URL structure.",
  panels: [
    {
      label: "Current engagement",
      title: "Workspace summary",
      text: "The overview keeps the most important project information visible without mixing it into the standard workflow audit dashboard.",
    },
    {
      label: "Next action",
      title: "What needs attention",
      text: "Client actions, requested documents, open decisions, and review items will be surfaced here as the engagement progresses.",
    },
    {
      label: "Axiom review",
      title: "What is being worked on",
      text: "Operational analysis, architecture design, workflow mapping, and deliverable preparation will be tracked from the workspace.",
    },
    {
      label: "Shortcuts",
      title: "Move quickly",
      text: "Jump into operations, documents, deliverables, billing, or account settings from the navigation above.",
    },
  ],
  actions: [
    { title: "Open operations", text: "View phases and project priorities.", href: "/client/operations" },
    { title: "Open documents", text: "Review the workspace document area.", href: "/client/documents" },
    { title: "Open billing", text: "View billing and invoice records.", href: "/client/billing" },
  ],
};

export const operationsContent: ClientPortalPageContent = {
  eyebrow: "Operations",
  title: "Project control for the engagement.",
  intro:
    "The operations area is for phases, open decisions, review gates, workstream priorities, and the practical operating details that keep remote work controlled.",
  panels: [
    {
      label: "Phase 01",
      title: "Discovery",
      text: "Collect business context, current process details, tools, constraints, examples, and operating evidence.",
    },
    {
      label: "Phase 02",
      title: "Workflow mapping",
      text: "Map the current workflow, handoffs, decision points, bottlenecks, exceptions, and review gates.",
    },
    {
      label: "Phase 03",
      title: "Architecture design",
      text: "Define the future workflow, AI support points, automation boundaries, ownership, and risk controls.",
    },
    {
      label: "Phase 04",
      title: "Implementation blueprint",
      text: "Turn the design into staged actions, responsibilities, deliverables, and review checkpoints.",
    },
  ],
};

export const documentsContent: ClientPortalPageContent = {
  eyebrow: "Documents",
  title: "Evidence and supporting material.",
  intro:
    "Documents should support the real operating picture: SOPs, screenshots, exports, workflow diagrams, spreadsheets, policies, system notes, and examples of current work.",
  panels: [
    {
      label: "Document vault",
      title: "Uploaded material",
      text: "No documents have been uploaded to this workspace yet. Files linked to the engagement will appear here once available.",
    },
    {
      label: "Evidence categories",
      title: "Organised by purpose",
      text: "Material can be grouped by current workflow, bottlenecks, tool stack, team roles, customer journey, risk, and automation opportunities.",
    },
    {
      label: "Review state",
      title: "Clear file status",
      text: "Documents should show whether they are uploaded, under review, reviewed, or require clarification.",
    },
    {
      label: "Security",
      title: "Controlled access",
      text: "Workspace documents should be handled through protected storage, signed routes, and client-level access checks.",
    },
  ],
};

export const deliverablesContent: ClientPortalPageContent = {
  eyebrow: "Deliverables",
  title: "Blueprints, reports, and project outputs.",
  intro:
    "This area is for the professional outputs of the engagement: architecture blueprints, workflow maps, automation reviews, operating protocols, implementation workbooks, and final handoff material.",
  panels: [
    {
      label: "Architecture blueprint",
      title: "Future-state system design",
      text: "Your architecture blueprint will appear here when prepared by Axiom.",
    },
    {
      label: "Workflow map",
      title: "Operating sequence",
      text: "Workflow maps and process structures will appear here when available for review.",
    },
    {
      label: "AI operating protocol",
      title: "Instructions and boundaries",
      text: "Assistant roles, review gates, escalation points, and safe-use rules will be stored here when produced.",
    },
    {
      label: "Final handoff",
      title: "Delivery record",
      text: "Final downloads, approval state, and handoff notes will appear in this section.",
    },
  ],
};

export const billingContent: ClientPortalPageContent = {
  eyebrow: "Billing",
  title: "Payments, invoices, and service records.",
  intro:
    "Billing is separated from operations so clients can manage account records without searching through project material.",
  panels: [
    {
      label: "Active service",
      title: "Current engagement",
      text: "The active service linked to this portal will appear here with its payment and delivery status.",
    },
    {
      label: "Invoices",
      title: "Invoice records",
      text: "Invoices linked to this workspace will appear here once available.",
    },
    {
      label: "Payments",
      title: "Payment history",
      text: "Completed payments, outstanding balances, and related receipts will be shown in this area.",
    },
    {
      label: "Additional work",
      title: "Upgrade options",
      text: "Additional consulting, implementation, or retained support options can be surfaced here when relevant.",
    },
  ],
};

export const accountContent: ClientPortalPageContent = {
  eyebrow: "Account",
  title: "Business and access details.",
  intro:
    "The account area is where clients should manage the information Axiom uses for the engagement and future workspace access.",
  panels: [
    {
      label: "Business profile",
      title: "Company details",
      text: "Business name, contact details, and engagement information should be visible here for review.",
    },
    {
      label: "Primary contact",
      title: "Client contact record",
      text: "The primary contact and email linked to the portal should be easy to confirm from this page.",
    },
    {
      label: "Access",
      title: "Login and security",
      text: "Password, session, and team access controls can be added here as the portal matures.",
    },
    {
      label: "Preferences",
      title: "Notifications",
      text: "Client notification settings can be added here for updates, deliverables, invoices, and review requests.",
    },
  ],
};
