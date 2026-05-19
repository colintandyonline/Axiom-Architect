type SchemaField = {
  key: string;
  label: string;
  type?: "input" | "textarea";
  placeholder?: string;
  required?: boolean;
};

type SchemaStage = {
  number: string;
  title: string;
  description: string;
  fields: SchemaField[];
};

type ExistingSchemaIdentity = {
  id?: string | null;
  version?: number | null;
};

export function isEnterpriseArchitectureSlug(tierSlug?: string | null) {
  return tierSlug === "architect-residency";
}

export function getEnterpriseArchitectureIntakeSchema(existing?: ExistingSchemaIdentity | null) {
  return {
    id: existing?.id || "enterprise-architecture-system",
    schema_key: "enterprise-architecture-system",
    version: existing?.version || 1,
    title: "Axiom Enterprise Architecture System Intake",
    description:
      "Complete the enterprise architecture intake so Axiom can assess your workflow system, dependencies, risks, automation boundaries, tool stack, and implementation sequence.",
    schema_json: {
      stages: enterpriseArchitectureStages,
    },
  };
}

export const enterpriseArchitectureStages: SchemaStage[] = [
  {
    number: "01",
    title: "System overview",
    description:
      "Define the workflow system at a business level so the architecture report can focus on the right operating problem.",
    fields: [
      {
        key: "workflow_title",
        label: "Enterprise workflow system name",
        type: "input",
        placeholder: "Example: Seller verification and fulfilment operating system",
        required: true,
      },
      {
        key: "enterprise_context",
        label: "Business context",
        type: "textarea",
        placeholder:
          "Describe the business area, department, customer journey, or operating function this workflow system supports.",
        required: true,
      },
      {
        key: "workflow_system_scope",
        label: "System scope",
        type: "textarea",
        placeholder:
          "What workflows, handoffs, teams, tools, decisions, or customer-facing steps should be included in this architecture review?",
        required: true,
      },
    ],
  },
  {
    number: "02",
    title: "Current operating model",
    description:
      "Explain how the workflow system currently operates, including people, tools, steps, and pressure points.",
    fields: [
      {
        key: "business_unit_and_users",
        label: "Teams, roles, and users involved",
        type: "textarea",
        placeholder:
          "List the people, teams, roles, customers, suppliers, or partners involved in this workflow system.",
        required: true,
      },
      {
        key: "current_workflow_steps",
        label: "Current workflow steps",
        type: "textarea",
        placeholder:
          "Describe the current process from start to finish. Include manual steps, approvals, queues, checks, and outputs.",
        required: true,
      },
      {
        key: "volume_frequency_complexity",
        label: "Volume, frequency, and complexity",
        type: "textarea",
        placeholder:
          "How often does this process run? What volume does it handle? Which cases are simple, complex, or exception-heavy?",
        required: true,
      },
    ],
  },
  {
    number: "03",
    title: "Tools, data, and dependencies",
    description:
      "Map the systems and information flows the enterprise architecture depends on.",
    fields: [
      {
        key: "tools_and_data_sources",
        label: "Tools and data sources",
        type: "textarea",
        placeholder:
          "List the software, spreadsheets, documents, databases, inboxes, dashboards, AI tools, and data sources used today.",
        required: true,
      },
      {
        key: "handoffs_dependencies",
        label: "Handoffs and dependencies",
        type: "textarea",
        placeholder:
          "Where does work pass between people, tools, teams, customers, suppliers, or systems? What does each stage depend on?",
        required: true,
      },
      {
        key: "customer_or_commercial_impact",
        label: "Customer or commercial impact",
        type: "textarea",
        placeholder:
          "What happens if this system is slow, inconsistent, unclear, or wrong? Describe cost, customer, revenue, quality, or reputation impact.",
        required: false,
      },
    ],
  },
  {
    number: "04",
    title: "Risk, decisions, and control gates",
    description:
      "Identify what must stay controlled before AI or automation is introduced into the system.",
    fields: [
      {
        key: "decision_points_approvals",
        label: "Decision points and approvals",
        type: "textarea",
        placeholder:
          "Which decisions, approvals, checks, exceptions, or sign-offs currently happen in this workflow system?",
        required: true,
      },
      {
        key: "known_risks_exceptions",
        label: "Known risks and exceptions",
        type: "textarea",
        placeholder:
          "List recurring errors, edge cases, compliance concerns, data-quality issues, customer risks, or failure points.",
        required: true,
      },
      {
        key: "constraints_compliance",
        label: "Constraints and compliance needs",
        type: "textarea",
        placeholder:
          "Mention any legal, financial, operational, safety, security, brand, customer, data, or policy constraints Axiom should respect.",
        required: false,
      },
    ],
  },
  {
    number: "05",
    title: "AI and automation direction",
    description:
      "Define where automation is wanted, where it is already being used, and where human control must remain.",
    fields: [
      {
        key: "ai_automation_current_use",
        label: "Current AI or automation use",
        type: "textarea",
        placeholder:
          "Describe any AI assistants, automations, scripts, integrations, templates, or workflow tools already used in this system.",
        required: false,
      },
      {
        key: "automation_goals",
        label: "Automation goals",
        type: "textarea",
        placeholder:
          "What would you like AI or automation to improve? Include speed, consistency, routing, checking, drafting, summarising, reporting, or decision support.",
        required: true,
      },
      {
        key: "what_should_stay_human",
        label: "What should stay human-controlled",
        type: "textarea",
        placeholder:
          "Which decisions, approvals, customer interactions, exceptions, or sensitive steps should not be fully automated?",
        required: true,
      },
    ],
  },
  {
    number: "06",
    title: "Enterprise outcome and priorities",
    description:
      "Set the desired operating outcome so the final report can prioritise the right architecture decisions.",
    fields: [
      {
        key: "success_definition",
        label: "Success definition",
        type: "textarea",
        placeholder:
          "What would a successful enterprise architecture outcome look like? Describe the practical improvement you want to see.",
        required: true,
      },
      {
        key: "implementation_timeline",
        label: "Timeline and urgency",
        type: "textarea",
        placeholder:
          "Is this urgent, planned, exploratory, or linked to a launch, hiring plan, tool migration, client demand, or internal change?",
        required: false,
      },
      {
        key: "priority_questions",
        label: "Priority questions for Axiom",
        type: "textarea",
        placeholder:
          "List the most important questions you want the Axiom Enterprise Architecture System report to answer.",
        required: true,
      },
    ],
  },
];
