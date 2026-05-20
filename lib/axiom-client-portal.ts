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
    description: "Your current status, next action, and latest update.",
  },
  {
    href: "/client/operations",
    label: "Operations",
    description: "The plan, priorities, decisions, and approvals for the work.",
  },
  {
    href: "/client/documents",
    label: "Documents",
    description: "Files and examples that help explain the workflow.",
  },
  {
    href: "/client/deliverables",
    label: "Deliverables",
    description: "Reports, maps, blueprints, and finished handoff material.",
  },
  {
    href: "/client/billing",
    label: "Billing",
    description: "Proposal value, invoices, payments, and service history.",
  },
  {
    href: "/client/account",
    label: "Account",
    description: "Your contact, business, and access details.",
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
  eyebrow: "Client workspace",
  title: "Welcome back.",
  intro:
    "Your proposal, updates, files, outputs, and billing all live here. Start with the status below, then move to the area you need.",
  summaryLabel: "Now",
  summaryTitle: "Your request is in review.",
  summaryText:
    "Axiom is checking the scope, timing, and best route for the work. The next action will appear here when it changes.",
  metrics: [
    { label: "Proposal", value: "In review", text: "Your submitted request is being checked." },
    { label: "Stage", value: "Discovery", text: "Axiom is understanding the workflow and context." },
    { label: "Action", value: "No action", text: "Nothing else is needed from you right now." },
    { label: "Updates", value: "Active", text: "New updates will appear in this workspace." },
  ],
  sections: [
    {
      eyebrow: "How this works",
      title: "Simple next steps.",
      intro: "The portal is here to keep the work clear and easy to follow.",
      items: [
        { label: "1", title: "Review", text: "Axiom checks the workflow, goals, constraints, and timing." },
        { label: "2", title: "Recommend", text: "You get the right proposed route for the work." },
        { label: "3", title: "Approve", text: "Work only moves forward once the next step is agreed." },
      ],
    },
    {
      eyebrow: "Portal guide",
      title: "What each area is for.",
      intro: "Use the menu to jump straight to the part of the engagement you need.",
      items: [
        { label: "Plan", title: "Operations", text: "Progress, priorities, decisions, and approvals." },
        { label: "Files", title: "Documents", text: "Requested files, examples, and supporting material." },
        { label: "Outputs", title: "Deliverables", text: "Reports, maps, blueprints, and handoff files." },
      ],
    },
  ],
  panels: [],
  actions: [
    { title: "Open proposal", text: "View the proposal intake.", href: "/client/proposal" },
    { title: "View operations", text: "Check the working plan.", href: "/client/operations" },
    { title: "View documents", text: "Check files and requests.", href: "/client/documents" },
  ],
};

overviewContent.panels = overviewContent.sections.flatMap((section) => section.items);

export const operationsContent: ClientPortalPageContent = {
  eyebrow: "Operations",
  title: "Work in motion.",
  intro:
    "This is the working plan for your engagement: current stage, priorities, decisions, approvals, and next action.",
  summaryLabel: "Current stage",
  summaryTitle: "Discovery.",
  summaryText:
    "Axiom is reviewing the request before recommending the best path forward.",
  metrics: [
    { label: "Stage", value: "Discovery", text: "Understanding the work and desired outcome." },
    { label: "Focus", value: "Review", text: "Checking fit, complexity, and next step." },
    { label: "Decision", value: "Pending", text: "The proposal route has not been confirmed yet." },
    { label: "Approval", value: "Required", text: "You approve the next step before work moves forward." },
  ],
  sections: [
    {
      eyebrow: "Flow",
      title: "How the work moves.",
      intro: "Custom work stays clear by moving through defined stages.",
      items: [
        { label: "1", title: "Discovery", text: "Understand the workflow, goals, tools, and limits." },
        { label: "2", title: "Mapping", text: "Break the process into stages, decisions, and handoffs." },
        { label: "3", title: "Design", text: "Shape the future workflow and the role AI or automation should play." },
        { label: "4", title: "Plan", text: "Turn the approved direction into actions, outputs, and checkpoints." },
      ],
    },
    {
      eyebrow: "Control points",
      title: "Where approval matters.",
      intro: "Important decisions are kept visible before anything moves forward.",
      items: [
        { label: "Scope", title: "What is included", text: "The agreed work, exclusions, and any optional extras." },
        { label: "Access", title: "What can be viewed", text: "Any sites, files, tools, or accounts that need permission first." },
        { label: "Sign-off", title: "What counts as done", text: "The agreed output and completion point for the work." },
      ],
    },
  ],
  panels: [],
  actions: [
    { title: "Open proposal", text: "Review the submitted proposal details.", href: "/client/proposal" },
    { title: "View documents", text: "Check requested files and examples.", href: "/client/documents" },
    { title: "View deliverables", text: "See where outputs will appear.", href: "/client/deliverables" },
  ],
};

operationsContent.panels = operationsContent.sections.flatMap((section) => section.items);

export const documentsContent: ClientPortalPageContent = {
  eyebrow: "Documents",
  title: "Files and context.",
  intro:
    "Use this area for screenshots, process notes, examples, and files that help explain how the work currently happens.",
  summaryLabel: "Files",
  summaryTitle: "Nothing requested yet.",
  summaryText:
    "When Axiom needs material from you, the request will appear here with a clear reason and status.",
  metrics: [
    { label: "Files", value: "None", text: "No files have been added yet." },
    { label: "Requests", value: "None", text: "No file requests are open right now." },
    { label: "Review", value: "Not started", text: "Files will show when they are being reviewed." },
    { label: "Privacy", value: "Careful", text: "Only share what is needed for the work." },
  ],
  sections: [
    {
      eyebrow: "Helpful files",
      title: "What to share when asked.",
      intro: "Good examples help Axiom see the real workflow quickly.",
      items: [
        { label: "Steps", title: "Process notes", text: "Current steps, checklists, handoffs, or standard ways of working." },
        { label: "Screens", title: "Tool examples", text: "Screenshots or exports showing forms, dashboards, queues, or repeated tasks." },
        { label: "Samples", title: "Real examples", text: "Redacted examples of common requests, issues, approvals, or exceptions." },
        { label: "Rules", title: "Requirements", text: "Policies, limits, approval rules, or compliance points that affect the work." },
      ],
    },
    {
      eyebrow: "Privacy",
      title: "Keep it clean.",
      intro: "Share useful context without exposing information that is not needed.",
      items: [
        { label: "No", title: "Passwords", text: "Never upload passwords, private keys, recovery phrases, or access tokens." },
        { label: "No", title: "Card details", text: "Do not upload card numbers or unnecessary payment information." },
        { label: "Yes", title: "Redactions", text: "Remove private names, client details, and sensitive personal data where possible." },
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
  title: "Outputs.",
  intro:
    "Reports, blueprints, maps, protocols, and handoff files will appear here when they are ready.",
  summaryLabel: "Delivery",
  summaryTitle: "No outputs released yet.",
  summaryText:
    "Deliverables appear here after the proposal is agreed and the work reaches the right stage.",
  metrics: [
    { label: "Blueprint", value: "Pending", text: "Not prepared yet." },
    { label: "Map", value: "Pending", text: "Not prepared yet." },
    { label: "Protocol", value: "Pending", text: "Not prepared yet." },
    { label: "Handoff", value: "Pending", text: "Not prepared yet." },
  ],
  sections: [
    {
      eyebrow: "Output types",
      title: "What may appear here.",
      intro: "The exact files depend on the approved proposal.",
      items: [
        { label: "Blueprint", title: "System design", text: "The recommended structure for the improved workflow." },
        { label: "Map", title: "Workflow sequence", text: "The steps, handoffs, decisions, and review points." },
        { label: "Protocol", title: "AI rules", text: "Instructions, boundaries, and review gates for AI-supported work." },
        { label: "Guide", title: "Implementation notes", text: "Practical steps for using the agreed approach." },
      ],
    },
    {
      eyebrow: "Status",
      title: "Know what is ready.",
      intro: "Each output will show whether it is a draft, ready for review, approved, or final.",
      items: [
        { label: "Draft", title: "Needs review", text: "Shared for feedback before it is final." },
        { label: "Approved", title: "Accepted", text: "Confirmed as the working reference." },
        { label: "Final", title: "Delivered", text: "Ready to use, archive, or hand over." },
      ],
    },
  ],
  panels: [],
  actions: [
    { title: "View documents", text: "Check supporting files.", href: "/client/documents" },
    { title: "View operations", text: "Check the working stage.", href: "/client/operations" },
    { title: "View billing", text: "Check proposal and invoice status.", href: "/client/billing" },
  ],
};

deliverablesContent.panels = deliverablesContent.sections.flatMap((section) => section.items);

export const billingContent: ClientPortalPageContent = {
  eyebrow: "Billing",
  title: "Pricing and invoices.",
  intro:
    "Proposal value, invoices, payments, and service history will appear here when available.",
  summaryLabel: "Billing",
  summaryTitle: "No payment due.",
  summaryText:
    "Pricing is confirmed after the request has been reviewed and the next step is agreed.",
  metrics: [
    { label: "Proposal", value: "In review", text: "Pricing has not been confirmed yet." },
    { label: "Invoice", value: "None", text: "No invoice has been issued." },
    { label: "Payment", value: "Not due", text: "No payment is currently due." },
    { label: "Service", value: "Pending", text: "Service details appear after approval." },
  ],
  sections: [
    {
      eyebrow: "Billing flow",
      title: "How payment works.",
      intro: "Custom work is priced after review, not before the scope is understood.",
      items: [
        { label: "1", title: "Review", text: "Axiom checks the request and confirms the best route." },
        { label: "2", title: "Proposal", text: "You receive scope, timing, outputs, and price." },
        { label: "3", title: "Approval", text: "You approve the next step before billing begins." },
        { label: "4", title: "Invoice", text: "Any invoice appears here with its status." },
      ],
    },
    {
      eyebrow: "Billing details",
      title: "What you will see.",
      intro: "This page keeps commercial information simple and separate from the work itself.",
      items: [
        { label: "Invoice", title: "Amount and due date", text: "Clear payment details when an invoice is issued." },
        { label: "Status", title: "Paid or due", text: "The current payment state for the engagement." },
        { label: "Service", title: "Agreed work", text: "The approved service and any related billing notes." },
      ],
    },
  ],
  panels: [],
  actions: [
    { title: "Open proposal", text: "Review proposal context.", href: "/client/proposal" },
    { title: "View deliverables", text: "Check outputs connected to the work.", href: "/client/deliverables" },
    { title: "View account", text: "Confirm your details.", href: "/client/account" },
  ],
};

billingContent.panels = billingContent.sections.flatMap((section) => section.items);

export const accountContent: ClientPortalPageContent = {
  eyebrow: "Account",
  title: "Your details.",
  intro:
    "The contact and business details used for this Axiom Architect workspace.",
  summaryLabel: "Profile",
  summaryTitle: "Details connected.",
  summaryText:
    "These details are used for communication, proposal review, billing, and access to this workspace.",
  metrics: [
    { label: "Name", value: "Confirmed", text: "Your main contact name." },
    { label: "Email", value: "Primary", text: "Used for login and updates." },
    { label: "Business", value: "Connected", text: "Used for proposals and billing." },
    { label: "Access", value: "Private", text: "Only signed-in clients can view this area." },
  ],
  sections: [
    {
      eyebrow: "Profile",
      title: "Your workspace profile.",
      intro: "A clear view of the details attached to this engagement.",
      items: [
        { label: "Name", title: "Primary contact", text: "The person Axiom contacts about the work." },
        { label: "Email", title: "Service email", text: "Used for sign-in, updates, and communication." },
        { label: "Business", title: "Workspace owner", text: "The company or project attached to the engagement." },
        { label: "Status", title: "Access state", text: "Shows whether the account is active or needs attention." },
      ],
    },
    {
      eyebrow: "Safety",
      title: "Keep access private.",
      intro: "This area is private to the signed-in client account.",
      items: [
        { label: "Login", title: "Protected", text: "Sign in before viewing the client workspace." },
        { label: "Updates", title: "Email", text: "Important service updates use your account email." },
        { label: "Data", title: "Share carefully", text: "Do not submit passwords, keys, or unnecessary sensitive data." },
      ],
    },
  ],
  panels: [],
  actions: [
    { title: "Open proposal", text: "Review proposal context.", href: "/client/proposal" },
    { title: "View billing", text: "Check proposal and invoice status.", href: "/client/billing" },
    { title: "Back to overview", text: "Return to your workspace summary.", href: "/client" },
  ],
};

accountContent.panels = accountContent.sections.flatMap((section) => section.items);
