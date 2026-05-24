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
  "handoff_pack",
] as const;

export type AxiomDeliverableType = (typeof axiomDeliverableTypes)[number];

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
  "ai_operating_protocol",
  "agent_instruction_kit",
  "implementation_workbook",
  "custom_operating_pack",
  "ai_workflow_system_build",
] as const;

export type AxiomPackageKey = (typeof axiomPackageKeys)[number];

export type AxiomPackageModel = {
  key: AxiomPackageKey;
  name: string;
  status: string;
  shortDescription: string;
  bestFor: string[];
  standardDeliverables: AxiomDeliverableType[];
  clientReceives: string[];
  adminGuidance: string;
};

export const axiomPackageModels: Record<AxiomPackageKey, AxiomPackageModel> = {
  workflow_audit: {
    key: "workflow_audit",
    name: "Workflow Audit",
    status: "Launch package",
    shortDescription: "A focused diagnostic for one workflow, process, tool stack, or operating problem.",
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
    status: "Blueprint package",
    shortDescription: "A future-state operating model built from a diagnosed workflow.",
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
  ai_operating_protocol: {
    key: "ai_operating_protocol",
    name: "Custom AI Operating Protocol",
    status: "Protocol package",
    shortDescription: "Rules for using AI safely and repeatedly inside a defined workflow.",
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
    status: "Assistant package",
    shortDescription: "Role-specific assistant instructions designed around a real workflow and its controls.",
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
    status: "Action package",
    shortDescription: "A practical action workbook for applying an approved audit or blueprint.",
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
  custom_operating_pack: {
    key: "custom_operating_pack",
    name: "Custom Operating Pack",
    status: "Operating pack",
    shortDescription: "A bundled operating pack for a workflow, team, or business function.",
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
  ai_workflow_system_build: {
    key: "ai_workflow_system_build",
    name: "AI Workflow System Build",
    status: "Build package",
    shortDescription: "A larger service path for designing and building the operating system around the work.",
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

export function getAxiomPackageModel(packageKey: string | null | undefined) {
  if (!packageKey) return null;
  return axiomPackageModels[packageKey as AxiomPackageKey] || null;
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

  if (support.includes("full guarded system build") || scope.includes("enterprise") || budget.includes("$10,000")) {
    return axiomPackageModels.ai_workflow_system_build;
  }

  if (support.includes("developer-ready") || scope.includes("developer-ready") || implementation.includes("repository")) {
    return axiomPackageModels.ai_workflow_system_build;
  }

  if (support.includes("operating system design") || scope.includes("multi-tool")) {
    return axiomPackageModels.custom_operating_pack;
  }

  if (support.includes("automation design") || scope.includes("automation")) {
    return axiomPackageModels.workflow_blueprint;
  }

  if (support.includes("workflow diagnosis") || support.includes("blueprint")) {
    return axiomPackageModels.workflow_blueprint;
  }

  if (support.includes("architecture and proposal only") || budget.includes("under $1,000")) {
    return axiomPackageModels.workflow_audit;
  }

  return axiomPackageModels.workflow_audit;
}
