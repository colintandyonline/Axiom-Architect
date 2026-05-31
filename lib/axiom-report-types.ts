export type AxiomProductSlug =
  | "workflow-audit"
  | "workflow-blueprint"
  | "custom-operating-pack"
  | "workflow-stewardship"
  | "departmental-ecosystem"
  | "architect-residency";

export type AxiomReportType =
  | "diagnostic_report"
  | "implementation_blueprint"
  | "operating_pack"
  | "optimisation_review"
  | "ecosystem_architecture"
  | "enterprise_architecture_system";

export type AxiomHumanReviewLevel = "low" | "medium" | "high" | "critical";

export type AxiomReportStatus =
  | "draft"
  | "generated"
  | "needs_review"
  | "approved"
  | "delivered";

export type AxiomReportQualityStatus = "ready" | "needs_fixes" | "blocked";

export type AxiomScoreName =
  | "workflow_clarity"
  | "bottleneck_severity"
  | "automation_suitability"
  | "ai_assistant_fit"
  | "human_review_requirement"
  | "tool_stack_fit"
  | "implementation_difficulty"
  | "operating_maturity"
  | "ecosystem_dependency"
  | "deployment_complexity";

export type AxiomReportScore = {
  name: AxiomScoreName;
  label: string;
  score: number;
  rationale: string;
  client_meaning: string;
};

export type AxiomReportFinding = {
  title: string;
  observation: string;
  evidence: string[];
  implication: string;
  recommended_response: string;
};

export type AxiomReportAction = {
  title: string;
  priority: "low" | "medium" | "high";
  owner_type: "client" | "axiom" | "shared";
  expected_outcome: string;
  implementation_note: string;
};

export type AxiomAssistantOpportunity = {
  workflow_step: string;
  assistant_role: string;
  suitable_tasks: string[];
  must_not_do: string[];
  review_gate: string;
};

export type AxiomAutomationSuitability = {
  summary: string;
  suitable_now: string[];
  suitable_later: string[];
  not_recommended: string[];
  reasoned_boundary: string;
};

export type AxiomRiskReviewGate = {
  risk: string;
  level: AxiomHumanReviewLevel;
  why_it_matters: string;
  review_gate: string;
};

export type AxiomFutureWorkflowStep = {
  step: string;
  owner: string;
  ai_support: string;
  human_review: string;
  output: string;
};

export type AxiomUpgradeRecommendation = {
  recommended_product_slug: AxiomProductSlug | "none";
  recommendation: string;
  evidence: string[];
  why_now_or_why_not: string;
};

export type AxiomQualityControl = {
  clarity: number;
  completeness: number;
  evidence: number;
  assumptions: number;
  risk_control: number;
  actionability: number;
  total: number;
  status: AxiomReportQualityStatus;
  reviewer_notes: string[];
};

export type AxiomImprovementSummary = {
  headline: string;
  before_state: string;
  improved_state: string;
  value_created: string;
  core_improvements: {
    area: string;
    client_input_used: string;
    improvement_made: string;
    why_it_matters: string;
  }[];
};

export type AxiomClientActionBrief = {
  first_priority: string;
  next_7_days: string[];
  next_30_days: string[];
  do_not_automate_yet: string[];
  decision_points_for_client: string[];
  where_axiom_can_help_next: string[];
};

export type AxiomReportJson = {
  schema_version: 2;
  product_slug: AxiomProductSlug;
  report_type: AxiomReportType;
  report_status: AxiomReportStatus;
  generated_at: string;
  client: {
    name: string | null;
    email: string | null;
    business_name: string | null;
  };
  submission: {
    id: string;
    workflow_title: string;
    tier_slug: AxiomProductSlug;
    intake_schema_version: number | null;
    submitted_at: string | null;
  };
  improvement_summary: AxiomImprovementSummary;
  client_action_brief: AxiomClientActionBrief;
  executive_summary: {
    headline: string;
    plain_english_summary: string;
    strongest_opportunity: string;
    primary_constraint: string;
    next_best_action: string;
  };
  current_state: {
    workflow_purpose: string;
    current_workflow_map: string[];
    tools_and_systems: string[];
    human_roles: string[];
    known_constraints: string[];
  };
  diagnosis: {
    findings: AxiomReportFinding[];
    assumptions: string[];
    missing_information: string[];
  };
  scorecard: {
    scores: AxiomReportScore[];
    overall_readiness_score: number;
    overall_readiness_label: string;
  };
  assistant_opportunity_map: AxiomAssistantOpportunity[];
  automation_suitability: AxiomAutomationSuitability;
  risk_review: {
    human_review_level: AxiomHumanReviewLevel;
    review_gates: AxiomRiskReviewGate[];
  };
  future_state: {
    summary: string;
    workflow_steps: AxiomFutureWorkflowStep[];
  };
  implementation_plan: {
    immediate_actions: AxiomReportAction[];
    next_30_days: AxiomReportAction[];
    later_actions: AxiomReportAction[];
  };
  upgrade_recommendation: AxiomUpgradeRecommendation;
  quality_control: AxiomQualityControl;
  delivery: {
    dashboard_summary: string;
    client_expectation_note: string;
    pdf_ready: boolean;
    email_ready: boolean;
    pdf_generated_at?: string;
    pdf_file_path?: string;
    pdf_download_url?: string;
  };
};

export type AxiomReportValidationIssue = {
  path: string;
  message: string;
};

export type AxiomReportValidationResult = {
  valid: boolean;
  issues: AxiomReportValidationIssue[];
};
