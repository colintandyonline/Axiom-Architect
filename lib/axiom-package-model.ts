export const axiomDeliverableTypes = [
  "workflow_diagnosis",
  "workflow_map",
  "risk_review_matrix",
  "automation_opportunity_map",
  "ai_assistant_opportunity_map",
  "tool_stack_architecture",
  "implementation_sequence",
  "ai_operating_protocol",
  "agent_instruction_kit",
  "implementation_workbook",
  "developer_build_brief",
  "stewardship_review",
  "departmental_architecture_map",
  "enterprise_architecture_report",
  "handoff_pack",
] as const;

export type AxiomDeliverableType = (typeof axiomDeliverableTypes)[number];

export const axiomCheckoutProductSlugs = [
  "workflow-audit",
  "workflow-blueprint",
  "custom-operating-pack",
  "workflow-stewardship",
  "departmental-ecosystem",
  "architect-residency",
] as const;

export type AxiomCheckoutProductSlug = (typeof axiomCheckoutProductSlugs)[number];

export const axiomReportTypes = [
  "workflow_audit_report",
  "workflow_blueprint_report",
  "custom_operating_pack_report",
  "workflow_stewardship_review",
  "departmental_ecosystem_report",
  "enterprise_architecture_system_report",
  "ai_operating_protocol_report",
  "agent_instruction_kit_report",
  "implementation_workbook",
  "developer_build_brief",
  "bespoke_scope_report",
] as const;

export type AxiomReportType = (typeof axiomReportTypes)[number];

export type AxiomServiceRoute = "package" | "proposal" | "both";

export type AxiomDeliverableDefinition = {
  type: AxiomDeliverableType;
  title: string;
  clientOutcome: string;
  adminPurpose: string;
};

export const axiomDeliverableDefinitions: Record<AxiomDeliverableType, AxiomDeliverableDefinition> = {
  workflow_diagnosis: {
    type: "workflow_diagnosis",
    title: "Workflow diagnosis",
    clientOutcome: "A clear explanation of the current workflow, friction points, gaps, risks, and operating pattern.",
    adminPurpose: "Use for first-stage reviews, workflow audits, proposal diagnosis, and scoping decisions.",
  },
  workflow_map: {
    type: "workflow_map",
    title: "Workflow map",
    clientOutcome: "A structured map of workflow inputs, handoffs, decision points, outputs, and ownership.",
    adminPurpose: "Use when a client needs the workflow visualised before redesign or implementation.",
  },
  risk_review_matrix: {
    type: "risk_review_matrix",
    title: "Risk and review matrix",
    clientOutcome: "A breakdown of sensitive areas, approval gates, escalation points, and human review requirements.",
    adminPurpose: "Use for AI, automation, sensitive-data, compliance, quality-control, or high-risk workflows.",
  },
  automation_opportunity_map: {
    type: "automation_opportunity_map",
    title: "Automation opportunity map",
    clientOutcome: "A practical view of what can be automated, what needs redesign first, and what should remain human-led.",
    adminPurpose: "Use for workflow audit, automation design, and operational efficiency recommendations.",
  },
  ai_assistant_opportunity_map: {
    type: "ai_assistant_opportunity_map",
    title: "AI assistant opportunity map",
    clientOutcome: "A map of where AI assistants can support drafting, summarising, routing, classifying, preparation, or review.",
    adminPurpose: "Use before creating assistant roles, AI protocols, or agent instruction kits.",
  },
  tool_stack_architecture: {
    type: "tool_stack_architecture",
    title: "Tool stack architecture",
    clientOutcome: "A recommendation for how current and future tools should fit into the operating system.",
    adminPurpose: "Use for multi-tool workflows, operating system design, integrations, dashboards, and system build planning.",
  },
  implementation_sequence: {
    type: "implementation_sequence",
    title: "Implementation sequence",
    clientOutcome: "A prioritised route showing phases, dependencies, safe next actions, and implementation order.",
    adminPurpose: "Use for blueprint handoff, build preparation, workbook creation, and delivery sequencing.",
  },
  ai_operating_protocol: {
    type: "ai_operating_protocol",
    title: "AI operating protocol",
    clientOutcome: "Rules, boundaries, prompts, review gates, and operating standards for repeated AI-supported work.",
    adminPurpose: "Use when the client needs consistent AI behaviour, governance, quality checks, or repeatable usage rules.",
  },
  agent_instruction_kit: {
    type: "agent_instruction_kit",
    title: "Agent instruction kit",
    clientOutcome: "Role-specific assistant instructions with task boundaries, context rules, outputs, and review requirements.",
    adminPurpose: "Use when creating assistant/agent roles around a defined workflow.",
  },
  implementation_workbook: {
    type: "implementation_workbook",
    title: "Implementation workbook",
    clientOutcome: "A practical workbook for applying the blueprint, assigning ownership, tracking actions, and reviewing progress.",
    adminPurpose: "Use for clients who will implement internally or need a structured action pack.",
  },
  developer_build_brief: {
    type: "developer_build_brief",
    title: "Developer build brief",
    clientOutcome: "A build-ready brief covering scope, technical surfaces, data boundaries, acceptance criteria, and delivery sequence.",
    adminPurpose: "Use for developer-ready implementation, repository work, system builds, or automation builds.",
  },
  stewardship_review: {
    type: "stewardship_review",
    title: "Stewardship review",
    clientOutcome: "A recurring review of workflow drift, tool changes, risks, bottlenecks, and improvement priorities.",
    adminPurpose: "Use for monthly stewardship clients and ongoing optimisation cycles.",
  },
  departmental_architecture_map: {
    type: "departmental_architecture_map",
    title: "Departmental architecture map",
    clientOutcome: "A connected view of multiple workflows, dependencies, handoffs, shared tools, and departmental operating logic.",
    adminPurpose: "Use for departmental ecosystem projects and multi-workflow architecture reviews.",
  },
  enterprise_architecture_report: {
    type: "enterprise_architecture_report",
    title: "Enterprise architecture report",
    clientOutcome: "A full architecture report for complex workflow systems, risk controls, dependencies, automation boundaries, and implementation planning.",
    adminPurpose: "Use for flagship enterprise architecture system projects and high-complexity delivery.",
  },
  handoff_pack: {
    type: "handoff_pack",
    title: "Handoff pack",
    clientOutcome: "A final client-ready pack combining key assets, links, instructions, decisions, and next steps.",
    adminPurpose: "Use when completing a package, approval flow, or project phase.",
  },
};

export const axiomPackageKeys = [
  "workflow_audit",
  "workflow_blueprint",
  "custom_operating_pack",
  "workflow_stewardship",
  "departmental_ecosystem",
  "enterprise_architecture_system",
  "ai_operating_protocol",
  "agent_instruction_kit",
  "implementation_workbook",
  "ai_workflow_system_build",
] as const;

export type AxiomPackageKey = (typeof axiomPackageKeys)[number];

export type AxiomPackageModel = {
  key: AxiomPackageKey;
  name: string;
  publicSlug: string;
  checkoutSlug: AxiomCheckoutProductSlug | null;
  reportType: AxiomReportType;
  serviceRoute: AxiomServiceRoute;
  canBuyDirectly: boolean;
  canRequestAsProposal: boolean;
  status: string;
  shortDescription: string;
  clientSummary: string;
  bestFor: string[];
  standardDeliverables: AxiomDeliverableType[];
  clientReceives: string[];
  adminGuidance: string;
};

export const axiomPackageModels: Record<AxiomPackageKey, AxiomPackageModel> = {
  workflow_audit: {
    key: "workflow_audit",
    name: "Workflow Audit",
    publicSlug: "workflow-audit",
    checkoutSlug: "workflow-audit",
    reportType: "workflow_audit_report",
    serviceRoute: "package",
    canBuyDirectly: true,
    canRequestAsProposal: false,
    status: "Launch package",
    shortDescription: "A focused diagnostic for one workflow, process, tool stack, or operating problem.",
    clientSummary: "Buy this when you need a clear diagnosis before changing tools, adding AI, or automating a workflow.",
    bestFor: [
      "Unclear process friction",
      "Repeated manual effort",
      "Early AI or automation suitability review",
      "Founders and operators who need clarity before changing tools",
    ],
    standardDeliverables: [
      "workflow_diagnosis",
      "workflow_map",
      "risk_review_matrix",
      "automation_opportunity_map",
      "implementation_sequence",
    ],
    clientReceives: [
      "Audit report PDF",
      "Workflow map file or section",
      "Risk and review summary",
      "Automation suitability notes",
      "Recommended next step",
    ],
    adminGuidance: "Use this when the client needs clarity before a deeper blueprint, protocol, or build route.",
  },
  workflow_blueprint: {
    key: "workflow_blueprint",
    name: "Workflow Blueprint",
    publicSlug: "workflow-blueprint",
    checkoutSlug: "workflow-blueprint",
    reportType: "workflow_blueprint_report",
    serviceRoute: "package",
    canBuyDirectly: true,
    canRequestAsProposal: false,
    status: "Blueprint package",
    shortDescription: "A future-state operating model built from a diagnosed workflow.",
    clientSummary: "Buy this when you need the diagnosed workflow turned into a practical operating model and implementation route.",
    bestFor: [
      "Teams ready to redesign a process",
      "Businesses needing role and handoff clarity",
      "Clients needing a practical operating model before implementation",
    ],
    standardDeliverables: [
      "workflow_diagnosis",
      "workflow_map",
      "tool_stack_architecture",
      "risk_review_matrix",
      "implementation_sequence",
      "handoff_pack",
    ],
    clientReceives: [
      "Blueprint PDF",
      "Current-to-future workflow map",
      "Role and responsibility breakdown",
      "Review gate matrix",
      "Implementation sequence",
    ],
    adminGuidance: "Use this when diagnosis needs to become a structured future workflow and delivery plan.",
  },
  custom_operating_pack: {
    key: "custom_operating_pack",
    name: "Custom Operating Pack",
    publicSlug: "custom-operating-pack",
    checkoutSlug: "custom-operating-pack",
    reportType: "custom_operating_pack_report",
    serviceRoute: "package",
    canBuyDirectly: true,
    canRequestAsProposal: true,
    status: "Operating pack",
    shortDescription: "A bundled operating pack for a workflow, team, or business function.",
    clientSummary: "Buy this when you need several practical workflow assets bundled into one operating pack.",
    bestFor: [
      "Clients needing a practical pack but not a full custom build",
      "Operators who need templates, instructions, workflow maps, and review gates",
      "Teams moving from diagnosis into repeatable execution",
    ],
    standardDeliverables: [
      "workflow_map",
      "ai_operating_protocol",
      "agent_instruction_kit",
      "implementation_workbook",
      "handoff_pack",
    ],
    clientReceives: [
      "Operating pack PDF",
      "Workflow map",
      "AI protocol",
      "Assistant instructions",
      "Workbook or checklist",
      "Handoff notes",
    ],
    adminGuidance: "Use this when the client needs several practical operating assets bundled together.",
  },
  workflow_stewardship: {
    key: "workflow_stewardship",
    name: "Workflow Stewardship",
    publicSlug: "workflow-stewardship",
    checkoutSlug: "workflow-stewardship",
    reportType: "workflow_stewardship_review",
    serviceRoute: "package",
    canBuyDirectly: true,
    canRequestAsProposal: true,
    status: "Ongoing optimisation",
    shortDescription: "A recurring review cycle for workflows that keep changing after the first delivery.",
    clientSummary: "Buy this when you need ongoing review, drift checks, and improvement guidance after an initial workflow delivery.",
    bestFor: [
      "Clients whose workflow changes month to month",
      "Teams that need ongoing review instead of a one-off report",
      "Businesses already using an Axiom blueprint or operating pack",
    ],
    standardDeliverables: [
      "stewardship_review",
      "risk_review_matrix",
      "implementation_sequence",
      "handoff_pack",
    ],
    clientReceives: [
      "Monthly stewardship brief",
      "Workflow change review",
      "Updated priority list",
      "Risk-control check",
      "Next-step guidance",
    ],
    adminGuidance: "Use this for retained clients whose workflow needs repeated review and updates.",
  },
  departmental_ecosystem: {
    key: "departmental_ecosystem",
    name: "Departmental Ecosystem",
    publicSlug: "departmental-ecosystem",
    checkoutSlug: "departmental-ecosystem",
    reportType: "departmental_ecosystem_report",
    serviceRoute: "package",
    canBuyDirectly: true,
    canRequestAsProposal: true,
    status: "Multi-workflow system",
    shortDescription: "A departmental architecture package for multiple connected workflows.",
    clientSummary: "Buy this when a team or department needs several workflows mapped into one shared operating system.",
    bestFor: [
      "Teams with several connected workflows",
      "Departments with unclear handoffs or duplicated work",
      "Operators who need a shared workflow architecture",
    ],
    standardDeliverables: [
      "departmental_architecture_map",
      "workflow_map",
      "tool_stack_architecture",
      "risk_review_matrix",
      "implementation_sequence",
      "handoff_pack",
    ],
    clientReceives: [
      "Departmental architecture report",
      "Up to five workflow maps",
      "Cross-workflow handoff logic",
      "Shared tool and data-flow guidance",
      "Quarter roadmap",
    ],
    adminGuidance: "Use this when multiple workflows need to be connected into a single operating model.",
  },
  enterprise_architecture_system: {
    key: "enterprise_architecture_system",
    name: "Axiom Enterprise Architecture System",
    publicSlug: "enterprise-architecture-system",
    checkoutSlug: "architect-residency",
    reportType: "enterprise_architecture_system_report",
    serviceRoute: "both",
    canBuyDirectly: true,
    canRequestAsProposal: true,
    status: "Flagship enterprise product",
    shortDescription: "A fixed-price flagship architecture package for complex workflow systems.",
    clientSummary: "Buy or scope this when the work needs enterprise-level architecture, dependencies, governance, and implementation planning.",
    bestFor: [
      "Complex workflow systems",
      "High-risk or high-dependency operations",
      "Clients needing enterprise-level architecture and implementation direction",
    ],
    standardDeliverables: [
      "enterprise_architecture_report",
      "workflow_diagnosis",
      "tool_stack_architecture",
      "risk_review_matrix",
      "implementation_sequence",
      "handoff_pack",
    ],
    clientReceives: [
      "Enterprise architecture report",
      "Current-state and future-state system map",
      "Risk and exception model",
      "Tool stack and data-flow guidance",
      "Implementation roadmap",
    ],
    adminGuidance: "Use this for the highest-complexity fixed-price architecture route.",
  },
  ai_operating_protocol: {
    key: "ai_operating_protocol",
    name: "Custom AI Operating Protocol",
    publicSlug: "ai-operating-protocol",
    checkoutSlug: null,
    reportType: "ai_operating_protocol_report",
    serviceRoute: "proposal",
    canBuyDirectly: false,
    canRequestAsProposal: true,
    status: "Protocol outcome",
    shortDescription: "Rules for using AI safely and repeatedly inside a defined workflow.",
    clientSummary: "Request this when your team needs clear AI rules, boundaries, review gates, and repeatable usage standards.",
    bestFor: [
      "Teams using AI inconsistently",
      "Sensitive or quality-critical workflows",
      "Clients needing boundaries, review gates, and repeatable AI behaviour",
    ],
    standardDeliverables: [
      "workflow_diagnosis",
      "ai_assistant_opportunity_map",
      "risk_review_matrix",
      "ai_operating_protocol",
      "implementation_sequence",
    ],
    clientReceives: [
      "AI operating protocol PDF",
      "Approved AI use-case map",
      "Human review and escalation rules",
      "Prompt and context rules",
      "Do-not-automate guidance",
    ],
    adminGuidance: "Use this when the main client risk is uncontrolled or inconsistent AI use.",
  },
  agent_instruction_kit: {
    key: "agent_instruction_kit",
    name: "Agent Instruction Kit",
    publicSlug: "agent-instruction-kit",
    checkoutSlug: null,
    reportType: "agent_instruction_kit_report",
    serviceRoute: "proposal",
    canBuyDirectly: false,
    canRequestAsProposal: true,
    status: "Assistant outcome",
    shortDescription: "Role-specific assistant instructions designed around a real workflow and its controls.",
    clientSummary: "Request this when you need assistant roles and instructions built around a real workflow.",
    bestFor: [
      "Clients who want repeatable AI assistants rather than random chat use",
      "Internal support, research, reporting, intake, or operations assistants",
      "Teams needing clear instruction boundaries",
    ],
    standardDeliverables: [
      "ai_assistant_opportunity_map",
      "agent_instruction_kit",
      "risk_review_matrix",
      "implementation_sequence",
    ],
    clientReceives: [
      "Assistant role definitions",
      "System instruction drafts",
      "Task boundaries",
      "Input and output expectations",
      "Review and approval rules",
    ],
    adminGuidance: "Use this after the workflow and assistant opportunity areas are clear.",
  },
  implementation_workbook: {
    key: "implementation_workbook",
    name: "Implementation Workbook",
    publicSlug: "implementation-workbook",
    checkoutSlug: null,
    reportType: "implementation_workbook",
    serviceRoute: "proposal",
    canBuyDirectly: false,
    canRequestAsProposal: true,
    status: "Action outcome",
    shortDescription: "A practical action workbook for applying an approved audit or blueprint.",
    clientSummary: "Request this when you need an implementation workbook rather than a full build.",
    bestFor: [
      "Clients who want to execute internally",
      "Teams needing ownership, checklists, and sequencing",
      "Post-blueprint implementation planning",
    ],
    standardDeliverables: ["implementation_workbook", "implementation_sequence", "handoff_pack"],
    clientReceives: [
      "Workbook PDF or document",
      "Action checklist",
      "Ownership matrix",
      "Milestone sequence",
      "Review prompts",
    ],
    adminGuidance: "Use this when the client needs guided internal execution rather than a custom build.",
  },
  ai_workflow_system_build: {
    key: "ai_workflow_system_build",
    name: "AI Workflow System Build",
    publicSlug: "ai-workflow-system-build",
    checkoutSlug: null,
    reportType: "developer_build_brief",
    serviceRoute: "proposal",
    canBuyDirectly: false,
    canRequestAsProposal: true,
    status: "Bespoke build route",
    shortDescription: "A larger service path for designing and building the operating system around the work.",
    clientSummary: "Request this when architecture needs to become a working implementation, automation layer, dashboard, or connected system.",
    bestFor: [
      "Higher-budget bespoke clients",
      "Clients needing implementation, tooling, repository work, automation, dashboards, or integrations",
      "Workflows where architecture must become a working system",
    ],
    standardDeliverables: [
      "workflow_diagnosis",
      "tool_stack_architecture",
      "risk_review_matrix",
      "developer_build_brief",
      "implementation_sequence",
      "handoff_pack",
    ],
    clientReceives: [
      "System architecture brief",
      "Build scope",
      "Technical surfaces and boundaries",
      "Acceptance criteria",
      "Delivery and handoff pack",
      "Optional working implementation files or links",
    ],
    adminGuidance: "Use this when the proposal requires actual build planning or implementation work.",
  },
};

export const axiomDirectPurchasePackages = axiomPackageKeys.filter(
  (packageKey) => axiomPackageModels[packageKey].canBuyDirectly,
);

export const axiomProposalPackages = axiomPackageKeys.filter(
  (packageKey) => axiomPackageModels[packageKey].canRequestAsProposal,
);

export const axiomCheckoutSlugToPackageKey = Object.fromEntries(
  axiomPackageKeys
    .map((packageKey) => axiomPackageModels[packageKey])
    .filter((packageModel) => packageModel.checkoutSlug)
    .map((packageModel) => [packageModel.checkoutSlug, packageModel.key]),
) as Partial<Record<AxiomCheckoutProductSlug, AxiomPackageKey>>;

export const axiomPublicSlugToPackageKey = Object.fromEntries(
  axiomPackageKeys.map((packageKey) => {
    const packageModel = axiomPackageModels[packageKey];
    return [packageModel.publicSlug, packageModel.key];
  }),
) as Record<string, AxiomPackageKey>;

export function getAxiomPackageModel(packageKey: string | null | undefined) {
  if (!packageKey) return null;
  return axiomPackageModels[packageKey as AxiomPackageKey] || null;
}

export function getAxiomPackageByCheckoutSlug(checkoutSlug: string | null | undefined) {
  if (!checkoutSlug) return null;
  const packageKey = axiomCheckoutSlugToPackageKey[checkoutSlug as AxiomCheckoutProductSlug];
  return packageKey ? axiomPackageModels[packageKey] : null;
}

export function getAxiomPackageByPublicSlug(publicSlug: string | null | undefined) {
  if (!publicSlug) return null;
  const packageKey = axiomPublicSlugToPackageKey[publicSlug];
  return packageKey ? axiomPackageModels[packageKey] : null;
}

export function getAxiomDeliverableDefinition(deliverableType: string | null | undefined) {
  if (!deliverableType) return null;
  return axiomDeliverableDefinitions[deliverableType as AxiomDeliverableType] || null;
}

export function getAxiomPackageDeliverables(packageKey: string | null | undefined) {
  const packageModel = getAxiomPackageModel(packageKey);

  if (!packageModel) {
    return [];
  }

  return packageModel.standardDeliverables.map((deliverableType) => axiomDeliverableDefinitions[deliverableType]);
}

export function recommendAxiomPackageFromProposal({
  supportType,
  scopeType,
  implementationRequired,
  budgetRange,
}: {
  supportType?: string | null;
  scopeType?: string | null;
  implementationRequired?: string | null;
  budgetRange?: string | null;
}) {
  const support = `${supportType || ""}`.toLowerCase();
  const scope = `${scopeType || ""}`.toLowerCase();
  const implementation = `${implementationRequired || ""}`.toLowerCase();
  const budget = `${budgetRange || ""}`.toLowerCase();

  if (support.includes("full guarded system build") || implementation.includes("repository")) {
    return axiomPackageModels.ai_workflow_system_build;
  }

  if (scope.includes("enterprise") || budget.includes("$10,000")) {
    return axiomPackageModels.enterprise_architecture_system;
  }

  if (support.includes("developer-ready") || scope.includes("developer-ready")) {
    return axiomPackageModels.ai_workflow_system_build;
  }

  if (support.includes("operating system design") || scope.includes("multi-tool")) {
    return axiomPackageModels.custom_operating_pack;
  }

  if (support.includes("automation design") || scope.includes("automation")) {
    return axiomPackageModels.workflow_blueprint;
  }

  if (support.includes("manual implementation")) {
    return axiomPackageModels.implementation_workbook;
  }

  if (support.includes("workflow diagnosis") || support.includes("blueprint")) {
    return axiomPackageModels.workflow_blueprint;
  }

  if (support.includes("architecture and proposal only") || budget.includes("under $1,000")) {
    return axiomPackageModels.workflow_audit;
  }

  return axiomPackageModels.workflow_audit;
}
