export type ProposalServiceRoute =
  | "workflow-blueprint"
  | "custom-operating-pack"
  | "custom-agent-assistant-instruction-kit"
  | "ai-workflow-system-design"
  | "tool-stack-architecture"
  | "team-ai-operating-system-setup"
  | "implementation-support-done-with-you"
  | "done-for-you-system-build"
  | "ongoing-workflow-stewardship-retainer"
  | "workflow-audit"
  | "workflow-stewardship"
  | "departmental-ecosystem"
  | "architect-residency"
  | "bespoke-implementation";

export type ProposalPreset = {
  service_route: ProposalServiceRoute;
  label: string;
  suggested_min_price: number;
  suggested_max_price: number;
  suggested_base_price: number;
  currency: "USD";
  default_complexity_level: string;
  default_complexity_multiplier: number;
  default_risk_level: string;
  default_delivery_depth: string;
  scope_summary: string;
  included_work: string[];
  deliverables: string[];
  timeline: string[];
  exclusions: string[];
  client_responsibilities: string[];
  assumptions: string[];
  payment_terms: string;
  client_price_explanation: string;
  optional_add_ons: string[];
};

export const proposalPresets: ProposalPreset[] = [
  {
    service_route: "workflow-blueprint",
    label: "Workflow Blueprint",
    suggested_min_price: 250,
    suggested_max_price: 750,
    suggested_base_price: 500,
    currency: "USD",
    default_complexity_level: "simple",
    default_complexity_multiplier: 1,
    default_risk_level: "low",
    default_delivery_depth: "blueprint_plus_implementation_plan",
    scope_summary:
      "A focused workflow blueprint that maps the current process, defines a safer future-state workflow, identifies AI or automation suitability, and gives the client a practical implementation sequence.",
    included_work: [
      "Review the submitted workflow context and current friction points.",
      "Map the current workflow steps, handoffs, tools, and decision points.",
      "Design a future-state workflow with clearer ownership and review gates.",
      "Identify where AI or automation support is suitable, unsuitable, or requires human approval.",
      "Prepare a concise implementation sequence for the client to follow.",
    ],
    deliverables: [
      "Workflow Blueprint PDF.",
      "Current-state and future-state workflow map.",
      "AI and automation suitability notes.",
      "Human review gate recommendations.",
      "Prioritised implementation sequence.",
    ],
    timeline: [
      "Admin confirms scope and source material.",
      "Axiom reviews the workflow and prepares the blueprint.",
      "Client receives the final blueprint after admin approval.",
      "Typical delivery window: 3 to 7 working days after required context is available.",
    ],
    exclusions: [
      "Live automation deployment.",
      "Third-party software subscription fees.",
      "Custom software engineering or repository changes.",
      "Ongoing monitoring or stewardship.",
      "Legal, financial, compliance, or regulated professional advice.",
    ],
    client_responsibilities: [
      "Provide accurate workflow context, screenshots, examples, or process notes where useful.",
      "Confirm any sensitive data boundaries before review starts.",
      "Review the delivered blueprint before implementation decisions are made.",
    ],
    assumptions: [
      "The engagement covers one contained workflow or process.",
      "No production system access is required.",
      "The client will validate any operational changes before using them live.",
    ],
    payment_terms: "Payment is due before work begins unless otherwise agreed. Work starts after payment and required context are received.",
    client_price_explanation:
      "The investment reflects the workflow review, future-state design, AI suitability assessment, human review gate planning, and implementation sequence required to produce a controlled blueprint.",
    optional_add_ons: [
      "Implementation support session - from $250.",
      "Custom assistant instruction kit - from $450.",
      "Follow-up review after implementation - from $250.",
    ],
  },
  {
    service_route: "custom-operating-pack",
    label: "Custom Operating Pack",
    suggested_min_price: 500,
    suggested_max_price: 1500,
    suggested_base_price: 950,
    currency: "USD",
    default_complexity_level: "standard",
    default_complexity_multiplier: 1.5,
    default_risk_level: "medium",
    default_delivery_depth: "blueprint_plus_templates_instructions",
    scope_summary:
      "A practical operating pack that turns a workflow into reusable documentation, SOPs, role guidance, review gates, and implementation notes for repeatable execution.",
    included_work: [
      "Review the client workflow, roles, tools, and repeatable operating requirements.",
      "Define practical operating rules and repeatable process instructions.",
      "Create human review gates and quality-control steps.",
      "Prepare reusable workflow instructions and role guidance.",
      "Package the operating model into a structured client-ready deliverable.",
    ],
    deliverables: [
      "Custom Operating Pack PDF.",
      "Process instructions and SOP-style operating guidance.",
      "Role and responsibility guidance.",
      "Review gate and quality-control checklist.",
      "Implementation notes for adoption.",
    ],
    timeline: [
      "Scope and source material confirmed.",
      "Operating rules and workflow documents prepared.",
      "Admin review and revisions completed.",
      "Typical delivery window: 5 to 10 working days after required context is available.",
    ],
    exclusions: [
      "Live tool configuration or deployment.",
      "Staff training sessions unless listed separately.",
      "Custom development work.",
      "Legal or compliance certification.",
      "Ongoing maintenance of the operating pack.",
    ],
    client_responsibilities: [
      "Provide examples of current documents, handoffs, or operating standards.",
      "Confirm who owns each workflow stage.",
      "Review the operating pack before internal rollout.",
    ],
    assumptions: [
      "The client wants a documented operating system rather than a live software build.",
      "The workflow can be described without exposing unnecessary secrets or credentials.",
      "Any regulated or high-risk decisions remain human-controlled.",
    ],
    payment_terms: "50% deposit to begin, with the balance due before final delivery unless otherwise agreed.",
    client_price_explanation:
      "The investment reflects the custom operating documentation, role guidance, review gate design, and reusable process instructions needed to make the workflow repeatable.",
    optional_add_ons: [
      "Implementation support session - from $250.",
      "Team adoption checklist - from $300.",
      "Ongoing stewardship review - from $500/month.",
    ],
  },
  {
    service_route: "custom-agent-assistant-instruction-kit",
    label: "Custom Agent / Assistant Instruction Kit",
    suggested_min_price: 400,
    suggested_max_price: 1200,
    suggested_base_price: 750,
    currency: "USD",
    default_complexity_level: "standard",
    default_complexity_multiplier: 1.5,
    default_risk_level: "medium",
    default_delivery_depth: "blueprint_plus_templates_instructions",
    scope_summary:
      "A custom assistant instruction kit that defines the assistant role, boundaries, context rules, workflows, escalation points, and quality checks required for reliable AI-supported execution.",
    included_work: [
      "Define assistant role, operating boundaries, and intended tasks.",
      "Create instruction blocks for repeatable use.",
      "Define what the assistant must not do.",
      "Map human review and escalation points.",
      "Prepare quality-control guidance and usage notes.",
    ],
    deliverables: [
      "Custom assistant instruction kit.",
      "Role definition and operating rules.",
      "Copy-ready instruction blocks.",
      "Safety, escalation, and human review notes.",
      "Implementation and testing checklist.",
    ],
    timeline: [
      "Confirm assistant use case and workflow boundaries.",
      "Prepare and review instruction structure.",
      "Admin approval and final delivery.",
      "Typical delivery window: 3 to 8 working days after context is available.",
    ],
    exclusions: [
      "Building or deploying a production AI agent.",
      "API integration or repository changes.",
      "Continuous monitoring.",
      "Handling secrets, credentials, or sensitive customer data inside the instructions.",
    ],
    client_responsibilities: [
      "Provide clear examples of desired assistant tasks.",
      "Identify sensitive boundaries and forbidden actions.",
      "Test instructions before relying on them in live work.",
    ],
    assumptions: [
      "The assistant is used as a support tool, not an autonomous decision-maker.",
      "High-risk outputs remain subject to human review.",
      "The client will validate fit inside their own workflow.",
    ],
    payment_terms: "Payment is due before work begins unless otherwise agreed.",
    client_price_explanation:
      "The investment reflects the custom assistant role design, instruction structure, workflow boundaries, review gates, and practical testing guidance needed for safe use.",
    optional_add_ons: [
      "Additional assistant variant - from $250.",
      "Implementation review session - from $250.",
      "Workflow blueprint add-on - from $400.",
    ],
  },
  {
    service_route: "ai-workflow-system-design",
    label: "AI Workflow System Design",
    suggested_min_price: 1000,
    suggested_max_price: 3500,
    suggested_base_price: 1750,
    currency: "USD",
    default_complexity_level: "advanced",
    default_complexity_multiplier: 2.25,
    default_risk_level: "medium",
    default_delivery_depth: "blueprint_plus_implementation_plan",
    scope_summary:
      "A detailed AI-supported workflow system design covering workflow model, control design, tool routing, review gates, AI suitability, and phased implementation planning.",
    included_work: [
      "Assess the workflow and where AI support can safely fit.",
      "Design the target operating model and tool-routing logic.",
      "Define AI support points, human gates, and control boundaries.",
      "Prepare phased rollout recommendations.",
      "Identify implementation risks and operational dependencies.",
    ],
    deliverables: [
      "AI Workflow System Design PDF.",
      "AI suitability map.",
      "Control and review gate design.",
      "Tool-routing and operating model notes.",
      "Phased rollout plan.",
    ],
    timeline: [
      "Discovery context and workflow evidence confirmed.",
      "System design and risk gates prepared.",
      "Admin review and refinement.",
      "Typical delivery window: 7 to 15 working days after required context is available.",
    ],
    exclusions: [
      "Production automation build.",
      "Custom software engineering unless separately scoped.",
      "Third-party AI tool subscriptions.",
      "Compliance certification or legal review.",
      "Ongoing operational monitoring.",
    ],
    client_responsibilities: [
      "Provide workflow examples, tool context, and known constraints.",
      "Identify high-risk decisions and required approvals.",
      "Confirm implementation ownership before rollout.",
    ],
    assumptions: [
      "The engagement produces a system design and implementation plan, not a live production build.",
      "AI support remains bounded by review gates.",
      "Implementation dependencies will be confirmed before any later build phase.",
    ],
    payment_terms: "50% deposit to begin, with the balance due before final delivery unless otherwise agreed.",
    client_price_explanation:
      "The investment reflects the AI workflow model, control design, tool-routing analysis, review gate planning, and phased rollout structure required for a safe operating system.",
    optional_add_ons: [
      "Custom assistant instruction kit - from $450.",
      "Implementation support - from $1,500.",
      "Ongoing workflow stewardship - from $500/month.",
    ],
  },
  {
    service_route: "tool-stack-architecture",
    label: "Tool Stack Architecture",
    suggested_min_price: 750,
    suggested_max_price: 2500,
    suggested_base_price: 1250,
    currency: "USD",
    default_complexity_level: "standard",
    default_complexity_multiplier: 1.5,
    default_risk_level: "medium",
    default_delivery_depth: "blueprint_plus_implementation_plan",
    scope_summary:
      "A tool stack architecture review and design that clarifies system roles, handoffs, data movement, ownership, integration boundaries, and implementation priorities.",
    included_work: [
      "Review the current tools, platforms, files, dashboards, and handoff points.",
      "Map tool roles and duplicated or unclear responsibilities.",
      "Define a cleaner target stack and workflow routing model.",
      "Identify risks, dependencies, and implementation priorities.",
      "Prepare architecture recommendations for staged improvement.",
    ],
    deliverables: [
      "Tool Stack Architecture PDF.",
      "Current stack and future stack map.",
      "Handoff and data movement notes.",
      "Risk and dependency review.",
      "Implementation priority sequence.",
    ],
    timeline: [
      "Confirm current tool list and workflow purpose.",
      "Review stack roles and operating gaps.",
      "Prepare architecture recommendations.",
      "Typical delivery window: 5 to 12 working days after context is available.",
    ],
    exclusions: [
      "Buying, configuring, or migrating third-party tools.",
      "API integration work.",
      "Data migration.",
      "Security or compliance certification.",
      "Ongoing tool administration.",
    ],
    client_responsibilities: [
      "Provide an accurate list of current tools and workflows.",
      "Identify critical systems and access boundaries.",
      "Confirm which recommendations should become implementation work later.",
    ],
    assumptions: [
      "The engagement is architecture and planning only.",
      "No credentials or production access are required.",
      "Implementation is separately scoped if needed.",
    ],
    payment_terms: "50% deposit to begin, with the balance due before final delivery unless otherwise agreed.",
    client_price_explanation:
      "The investment reflects the tool stack review, workflow routing design, risk analysis, and staged architecture recommendations needed to simplify the operating model.",
    optional_add_ons: [
      "Implementation planning workshop - from $350.",
      "Vendor/tool comparison matrix - from $300.",
      "Done-with-you implementation support - from $1,500.",
    ],
  },
  {
    service_route: "team-ai-operating-system-setup",
    label: "Team AI Operating System Setup",
    suggested_min_price: 1500,
    suggested_max_price: 5000,
    suggested_base_price: 2750,
    currency: "USD",
    default_complexity_level: "advanced",
    default_complexity_multiplier: 2.25,
    default_risk_level: "high",
    default_delivery_depth: "blueprint_plus_templates_instructions",
    scope_summary:
      "A team-level AI operating setup that defines safe AI use, workflow roles, assistant patterns, review gates, documentation, and adoption guidance across a team or department.",
    included_work: [
      "Map team workflows and AI support opportunities.",
      "Define safe AI operating rules and team review gates.",
      "Create reusable instruction patterns and usage guidance.",
      "Prepare team adoption documentation and operating notes.",
      "Identify risks, role ownership, and staged rollout priorities.",
    ],
    deliverables: [
      "Team AI Operating System pack.",
      "Team AI usage rules and workflow map.",
      "Assistant patterns and instruction guidance.",
      "Human review gate framework.",
      "Rollout and adoption plan.",
    ],
    timeline: [
      "Confirm team workflows, roles, and risk boundaries.",
      "Prepare operating model and documentation.",
      "Admin review and final delivery.",
      "Typical delivery window: 10 to 20 working days after required context is available.",
    ],
    exclusions: [
      "Enterprise-wide deployment.",
      "Custom software build.",
      "Compliance certification.",
      "Live automation deployment.",
      "Ongoing training or monitoring unless separately scoped.",
    ],
    client_responsibilities: [
      "Provide role and workflow context for the team.",
      "Identify sensitive data and approval constraints.",
      "Assign internal owners for adoption and review.",
    ],
    assumptions: [
      "The scope is limited to the agreed team or department.",
      "AI tools remain governed by human review gates.",
      "Training or live rollout support can be added later if needed.",
    ],
    payment_terms: "50% deposit to begin, with staged balance payments agreed before final delivery.",
    client_price_explanation:
      "The investment reflects team-level workflow mapping, safe AI usage design, review gate creation, reusable instructions, and adoption documentation.",
    optional_add_ons: [
      "Team implementation support - from $1,500.",
      "Custom role-based assistant kits - from $450 each.",
      "Ongoing stewardship - from $750/month.",
    ],
  },
  {
    service_route: "implementation-support-done-with-you",
    label: "Implementation Support / Done-With-You",
    suggested_min_price: 1500,
    suggested_max_price: 5000,
    suggested_base_price: 2500,
    currency: "USD",
    default_complexity_level: "advanced",
    default_complexity_multiplier: 2.25,
    default_risk_level: "high",
    default_delivery_depth: "done_with_you_support",
    scope_summary:
      "Guided implementation support that helps the client translate an approved blueprint or operating design into controlled practical changes, review points, and staged adoption.",
    included_work: [
      "Review existing blueprint or implementation target.",
      "Define staged implementation priorities and ownership.",
      "Support configuration, documentation, or process adoption decisions.",
      "Review implementation outputs and risk points.",
      "Provide guided recommendations during the implementation window.",
    ],
    deliverables: [
      "Implementation support plan.",
      "Session notes or review summaries.",
      "Priority and risk tracking notes.",
      "Updated implementation recommendations.",
      "Final handoff summary.",
    ],
    timeline: [
      "Confirm implementation scope and support window.",
      "Run agreed support sessions or review checkpoints.",
      "Provide updates and final handoff notes.",
      "Typical support window: 2 to 6 weeks depending on scope.",
    ],
    exclusions: [
      "Done-for-you build work unless separately agreed.",
      "Direct production changes without explicit approval.",
      "Ongoing monitoring after the support window.",
      "Third-party subscription or contractor costs.",
    ],
    client_responsibilities: [
      "Own final implementation decisions.",
      "Provide timely access to non-sensitive context and decision-makers.",
      "Test and approve changes before live use.",
    ],
    assumptions: [
      "The client remains responsible for production deployment decisions.",
      "Axiom provides guidance and review, not unrestricted build authority.",
      "High-risk changes require explicit human approval.",
    ],
    payment_terms: "50% deposit to reserve the implementation window, with remaining balance due according to the agreed support schedule.",
    client_price_explanation:
      "The investment reflects guided implementation support, review checkpoints, risk control, and practical translation of the operating design into usable workflow changes.",
    optional_add_ons: [
      "Additional support session - from $250.",
      "Post-implementation review - from $350.",
      "Ongoing stewardship - from $750/month.",
    ],
  },
  {
    service_route: "done-for-you-system-build",
    label: "Done-For-You System Build",
    suggested_min_price: 3000,
    suggested_max_price: 10000,
    suggested_base_price: 5000,
    currency: "USD",
    default_complexity_level: "complex",
    default_complexity_multiplier: 3,
    default_risk_level: "high",
    default_delivery_depth: "done_for_you_implementation",
    scope_summary:
      "A scoped done-for-you system build where Axiom designs and builds defined workflow components, documentation, and controlled implementation assets within agreed boundaries.",
    included_work: [
      "Confirm build scope, risks, dependencies, and approval gates.",
      "Prepare implementation plan and build sequence.",
      "Build defined workflow assets, documentation, or configurations.",
      "Review outputs against agreed acceptance criteria.",
      "Prepare handoff notes and operating guidance.",
    ],
    deliverables: [
      "Scoped system build outputs.",
      "Implementation documentation.",
      "Review and acceptance checklist.",
      "Operating or handoff guide.",
      "Final delivery summary.",
    ],
    timeline: [
      "Confirm build scope and access boundaries.",
      "Complete staged build and review checkpoints.",
      "Admin/client review before final delivery.",
      "Typical delivery window: 3 to 8 weeks depending on scope.",
    ],
    exclusions: [
      "Unscoped software development.",
      "Unlimited revisions or ongoing maintenance.",
      "Third-party costs, licences, subscriptions, or contractor fees.",
      "Legal/compliance certification.",
      "Production changes outside agreed approval gates.",
    ],
    client_responsibilities: [
      "Provide timely approvals and required non-secret context.",
      "Maintain control of credentials and production access.",
      "Review and approve staged outputs.",
    ],
    assumptions: [
      "Build authority is limited to agreed scope and review gates.",
      "Production deployment requires explicit client approval.",
      "Any new requirements are handled as change requests.",
    ],
    payment_terms: "Deposit required to begin, with staged milestone payments agreed before work starts.",
    client_price_explanation:
      "The investment reflects the higher level of build responsibility, staged delivery, risk control, documentation, review gates, and handoff support required for done-for-you implementation.",
    optional_add_ons: [
      "Extended support window - from $1,000.",
      "Additional workflow module - quoted after scope review.",
      "Ongoing stewardship - from $1,000/month.",
    ],
  },
  {
    service_route: "ongoing-workflow-stewardship-retainer",
    label: "Ongoing Workflow Stewardship / Retainer",
    suggested_min_price: 250,
    suggested_max_price: 1500,
    suggested_base_price: 750,
    currency: "USD",
    default_complexity_level: "standard",
    default_complexity_multiplier: 1.5,
    default_risk_level: "medium",
    default_delivery_depth: "ongoing_stewardship",
    scope_summary:
      "An ongoing stewardship retainer for reviewing, maintaining, improving, and safely adapting workflows, AI operating documents, and implementation priorities over time.",
    included_work: [
      "Review agreed workflow or AI operating assets on a recurring basis.",
      "Identify improvements, risks, and maintenance needs.",
      "Provide update recommendations and priority notes.",
      "Support safe iteration of operating documentation.",
      "Maintain a controlled cadence for review and refinement.",
    ],
    deliverables: [
      "Monthly or agreed-cycle stewardship review.",
      "Priority and risk notes.",
      "Workflow improvement recommendations.",
      "Updated operating guidance where agreed.",
      "Review summary and next action list.",
    ],
    timeline: [
      "Confirm stewardship cadence and scope.",
      "Run recurring review cycle.",
      "Deliver review notes and recommended actions.",
      "Typical cadence: monthly unless otherwise agreed.",
    ],
    exclusions: [
      "Unlimited implementation work.",
      "Emergency support unless separately agreed.",
      "Third-party costs or tool administration.",
      "Legal/compliance certification.",
      "Work outside the agreed stewardship scope.",
    ],
    client_responsibilities: [
      "Provide updates on workflow changes and priorities.",
      "Review recommended actions each cycle.",
      "Approve any implementation work separately.",
    ],
    assumptions: [
      "Stewardship is advisory and review-based unless extra implementation support is scoped.",
      "A recurring cadence is agreed before work begins.",
      "The client remains responsible for final operational decisions.",
    ],
    payment_terms: "Monthly retainer paid in advance unless otherwise agreed.",
    client_price_explanation:
      "The investment reflects recurring review, controlled improvement, risk monitoring, and practical maintenance of the workflow operating model.",
    optional_add_ons: [
      "Additional monthly review session - from $250.",
      "Implementation support block - from $750.",
      "Quarterly operating system audit - from $750.",
    ],
  },
];

export const proposalPresetRoutes = proposalPresets.map((preset) => preset.service_route);

export function getProposalPreset(serviceRoute?: string | null) {
  return proposalPresets.find((preset) => preset.service_route === serviceRoute) || null;
}
