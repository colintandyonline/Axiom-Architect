export const bespokeProposalScopeTypes = [
  "One complex workflow",
  "Department or team workflow system",
  "Multi-tool operating system",
  "AI automation design",
  "Developer-ready implementation brief",
  "Enterprise AI control stack",
  "Not sure yet",
] as const;

export const bespokeProposalSupportTypes = [
  "Architecture and proposal only",
  "Workflow diagnosis and blueprint",
  "Operating system design",
  "Automation design",
  "Developer-ready implementation brief",
  "Manual implementation support",
  "Full guarded system build",
  "Not sure yet",
] as const;

export const bespokeProposalBudgetRanges = [
  "Under $1,000",
  "$1,000 - $2,500",
  "$2,500 - $5,000",
  "$5,000 - $10,000",
  "$10,000+",
  "Need guidance",
] as const;

export const bespokeProposalTimelineOptions = [
  "Urgent",
  "Within 2 weeks",
  "Within 30 days",
  "This quarter",
  "Planning ahead",
  "Need guidance",
] as const;

export const bespokeProposalSensitivityOptions = [
  "No sensitive data involved",
  "Some business-sensitive information",
  "Customer or client data may be involved",
  "Operational or compliance risk involved",
  "Not sure yet",
] as const;

export type BespokeProposalFieldType = "text" | "email" | "password" | "textarea" | "select" | "checkbox";

export type BespokeProposalField = {
  name: string;
  label: string;
  help?: string;
  type: BespokeProposalFieldType;
  required: boolean;
  section: string;
};

export const bespokeProposalSections = [
  "Client details",
  "Workflow context",
  "Proposal route",
  "Implementation and guardrails",
  "Commercial fit",
  "Agreement",
] as const;

export const bespokeProposalFields: BespokeProposalField[] = [
  {
    name: "name",
    label: "Your name",
    type: "text",
    required: true,
    section: "Client details",
  },
  {
    name: "email",
    label: "Email address",
    type: "email",
    required: true,
    section: "Client details",
  },
  {
    name: "business_name",
    label: "Business name",
    type: "text",
    required: true,
    section: "Client details",
  },
  {
    name: "password",
    label: "Create portal password",
    help: "Use at least 8 characters. This is used only to create your secure client portal login.",
    type: "password",
    required: true,
    section: "Client details",
  },
  {
    name: "confirmPassword",
    label: "Confirm portal password",
    help: "Re-enter the same password so the portal account can be created correctly.",
    type: "password",
    required: true,
    section: "Client details",
  },
  {
    name: "role",
    label: "Your role",
    type: "text",
    required: true,
    section: "Client details",
  },
  {
    name: "website",
    label: "Business website or project link",
    type: "text",
    required: false,
    section: "Client details",
  },
  {
    name: "workflow_summary",
    label: "What workflow, process, or system needs improving?",
    help: "Describe the workflow as it works today. Include the business area, users, and outcome.",
    type: "textarea",
    required: true,
    section: "Workflow context",
  },
  {
    name: "current_problem",
    label: "What is currently broken, slow, risky, repetitive, or unclear?",
    help: "Focus on friction, repeated manual work, decision delays, quality issues, or risk points.",
    type: "textarea",
    required: true,
    section: "Workflow context",
  },
  {
    name: "tools_used",
    label: "What tools, platforms, files, dashboards, or systems are involved?",
    help: "List CRMs, spreadsheets, websites, dashboards, automations, AI tools, documents, repositories, or manual handoff points involved.",
    type: "textarea",
    required: true,
    section: "Workflow context",
  },
  {
    name: "people_involved",
    label: "Who uses the workflow and who needs to review or approve decisions?",
    help: "Include team roles, client roles, review gates, sign-off points, and handoffs.",
    type: "textarea",
    required: true,
    section: "Workflow context",
  },
  {
    name: "desired_outcome",
    label: "What should the proposal or finished system help create?",
    help: "Explain what success looks like. A clearer process, less manual work, safer AI use, better handoffs, faster delivery, or a build brief.",
    type: "textarea",
    required: true,
    section: "Workflow context",
  },
  {
    name: "scope_type",
    label: "What best describes the scope?",
    type: "select",
    required: true,
    section: "Proposal route",
  },
  {
    name: "support_type",
    label: "What type of support do you think you need?",
    type: "select",
    required: true,
    section: "Proposal route",
  },
  {
    name: "implementation_required",
    label: "Will this likely require code, site, repository, automation, or tool configuration work?",
    help: "Explain whether this is planning only or may need build support after proposal approval.",
    type: "textarea",
    required: true,
    section: "Implementation and guardrails",
  },
  {
    name: "implementation_scope",
    label: "If technical or repository work may be needed, what areas should be inspected or changed?",
    help: "Do not include secrets. Mention repositories, file areas, tool surfaces, or limits only at a high level.",
    type: "textarea",
    required: false,
    section: "Implementation and guardrails",
  },
  {
    name: "sensitive_data",
    label: "Data sensitivity",
    type: "select",
    required: true,
    section: "Implementation and guardrails",
  },
  {
    name: "guardrail_notes",
    label: "What must not be touched, exposed, automated, or changed without approval?",
    help: "Include security boundaries, client data concerns, approval gates, payment/auth areas, compliance limits, or human review requirements.",
    type: "textarea",
    required: true,
    section: "Implementation and guardrails",
  },
  {
    name: "timeline",
    label: "Timeline",
    type: "select",
    required: true,
    section: "Commercial fit",
  },
  {
    name: "budget_range",
    label: "Budget range",
    type: "select",
    required: true,
    section: "Commercial fit",
  },
  {
    name: "extra_notes",
    label: "Anything else Axiom Architect should know before preparing the proposal?",
    type: "textarea",
    required: false,
    section: "Commercial fit",
  },
  {
    name: "proposal_terms_confirmed",
    label: "I understand this is a proposal request, not approval for implementation work. I will not submit passwords, API keys, access tokens, payment card details, or unnecessary sensitive data in this form.",
    type: "checkbox",
    required: true,
    section: "Agreement",
  },
];

export function getBespokeProposalOptions(fieldName: string) {
  switch (fieldName) {
    case "scope_type":
      return bespokeProposalScopeTypes;
    case "support_type":
      return bespokeProposalSupportTypes;
    case "sensitive_data":
      return bespokeProposalSensitivityOptions;
    case "timeline":
      return bespokeProposalTimelineOptions;
    case "budget_range":
      return bespokeProposalBudgetRanges;
    default:
      return [];
  }
}
