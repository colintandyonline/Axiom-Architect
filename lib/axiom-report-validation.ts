import type {
  AxiomReportJson,
  AxiomReportQualityStatus,
  AxiomReportValidationIssue,
  AxiomReportValidationResult,
} from "./axiom-report-types";

const allowedQualityStatuses = new Set<AxiomReportQualityStatus>([
  "ready",
  "needs_fixes",
  "blocked",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function isNumberInRange(value: unknown, min: number, max: number) {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
}

function addIssue(issues: AxiomReportValidationIssue[], path: string, message: string) {
  issues.push({ path, message });
}

function requireString(
  issues: AxiomReportValidationIssue[],
  record: Record<string, unknown>,
  key: string,
  path: string,
) {
  if (!isNonEmptyString(record[key])) {
    addIssue(issues, `${path}.${key}`, "Expected a non-empty string.");
  }
}

function requireStringArray(
  issues: AxiomReportValidationIssue[],
  value: unknown,
  path: string,
  minItems = 1,
) {
  if (!Array.isArray(value)) {
    addIssue(issues, path, "Expected an array of strings.");
    return;
  }

  if (value.length < minItems) {
    addIssue(issues, path, `Expected at least ${minItems} item(s).`);
    return;
  }

  value.forEach((item, index) => {
    if (!isNonEmptyString(item)) {
      addIssue(issues, `${path}[${index}]`, "Expected a non-empty string.");
    }
  });
}

function requireActionArray(
  issues: AxiomReportValidationIssue[],
  value: unknown,
  path: string,
  minItems = 1,
) {
  if (!Array.isArray(value)) {
    addIssue(issues, path, "Expected an array of implementation actions.");
    return;
  }

  if (value.length < minItems) {
    addIssue(issues, path, `Expected at least ${minItems} action(s).`);
    return;
  }

  value.forEach((item, index) => {
    if (!isRecord(item)) {
      addIssue(issues, `${path}[${index}]`, "Expected an action object.");
      return;
    }

    requireString(issues, item, "title", `${path}[${index}]`);
    requireString(issues, item, "expected_outcome", `${path}[${index}]`);
    requireString(issues, item, "implementation_note", `${path}[${index}]`);
  });
}

function validateQualityControl(
  issues: AxiomReportValidationIssue[],
  value: unknown,
) {
  if (!isRecord(value)) {
    addIssue(issues, "quality_control", "Expected quality_control object.");
    return;
  }

  const scoreKeys = [
    "clarity",
    "completeness",
    "evidence",
    "assumptions",
    "risk_control",
    "actionability",
  ];

  scoreKeys.forEach((key) => {
    if (!isNumberInRange(value[key], 0, 2)) {
      addIssue(issues, `quality_control.${key}`, "Expected a score from 0 to 2.");
    }
  });

  if (!isNumberInRange(value.total, 0, 12)) {
    addIssue(issues, "quality_control.total", "Expected a total score from 0 to 12.");
  }

  if (typeof value.status !== "string" || !allowedQualityStatuses.has(value.status as AxiomReportQualityStatus)) {
    addIssue(issues, "quality_control.status", "Expected ready, needs_fixes, or blocked.");
  }

  requireStringArray(issues, value.reviewer_notes, "quality_control.reviewer_notes", 1);
}

export function validateAxiomReportJson(report: unknown): AxiomReportValidationResult {
  const issues: AxiomReportValidationIssue[] = [];

  if (!isRecord(report)) {
    return {
      valid: false,
      issues: [{ path: "report", message: "Expected a report object." }],
    };
  }

  if (report.schema_version !== 1) {
    addIssue(issues, "schema_version", "Expected schema_version 1.");
  }

  requireString(issues, report, "product_slug", "report");
  requireString(issues, report, "report_type", "report");
  requireString(issues, report, "report_status", "report");
  requireString(issues, report, "generated_at", "report");

  const executiveSummary = report.executive_summary;
  if (!isRecord(executiveSummary)) {
    addIssue(issues, "executive_summary", "Expected executive_summary object.");
  } else {
    requireString(issues, executiveSummary, "headline", "executive_summary");
    requireString(issues, executiveSummary, "plain_english_summary", "executive_summary");
    requireString(issues, executiveSummary, "strongest_opportunity", "executive_summary");
    requireString(issues, executiveSummary, "primary_constraint", "executive_summary");
    requireString(issues, executiveSummary, "next_best_action", "executive_summary");
  }

  const currentState = report.current_state;
  if (!isRecord(currentState)) {
    addIssue(issues, "current_state", "Expected current_state object.");
  } else {
    requireString(issues, currentState, "workflow_purpose", "current_state");
    requireStringArray(issues, currentState.current_workflow_map, "current_state.current_workflow_map", 2);
    requireStringArray(issues, currentState.tools_and_systems, "current_state.tools_and_systems", 1);
    requireStringArray(issues, currentState.human_roles, "current_state.human_roles", 1);
    requireStringArray(issues, currentState.known_constraints, "current_state.known_constraints", 1);
  }

  const diagnosis = report.diagnosis;
  if (!isRecord(diagnosis)) {
    addIssue(issues, "diagnosis", "Expected diagnosis object.");
  } else {
    if (!Array.isArray(diagnosis.findings) || diagnosis.findings.length < 2) {
      addIssue(issues, "diagnosis.findings", "Expected at least two evidence-backed findings.");
    }

    requireStringArray(issues, diagnosis.assumptions, "diagnosis.assumptions", 1);
    requireStringArray(issues, diagnosis.missing_information, "diagnosis.missing_information", 1);
  }

  const scorecard = report.scorecard;
  if (!isRecord(scorecard)) {
    addIssue(issues, "scorecard", "Expected scorecard object.");
  } else {
    if (!Array.isArray(scorecard.scores) || scorecard.scores.length < 4) {
      addIssue(issues, "scorecard.scores", "Expected at least four report scores.");
    }

    if (!isNumberInRange(scorecard.overall_readiness_score, 0, 100)) {
      addIssue(issues, "scorecard.overall_readiness_score", "Expected a score from 0 to 100.");
    }

    requireString(issues, scorecard, "overall_readiness_label", "scorecard");
  }

  if (!Array.isArray(report.assistant_opportunity_map) || report.assistant_opportunity_map.length < 1) {
    addIssue(issues, "assistant_opportunity_map", "Expected at least one assistant opportunity.");
  }

  const automationSuitability = report.automation_suitability;
  if (!isRecord(automationSuitability)) {
    addIssue(issues, "automation_suitability", "Expected automation_suitability object.");
  } else {
    requireString(issues, automationSuitability, "summary", "automation_suitability");
    requireStringArray(issues, automationSuitability.suitable_now, "automation_suitability.suitable_now", 1);
    requireStringArray(issues, automationSuitability.not_recommended, "automation_suitability.not_recommended", 1);
    requireString(issues, automationSuitability, "reasoned_boundary", "automation_suitability");
  }

  const riskReview = report.risk_review;
  if (!isRecord(riskReview)) {
    addIssue(issues, "risk_review", "Expected risk_review object.");
  } else {
    requireString(issues, riskReview, "human_review_level", "risk_review");
    if (!Array.isArray(riskReview.review_gates) || riskReview.review_gates.length < 1) {
      addIssue(issues, "risk_review.review_gates", "Expected at least one review gate.");
    }
  }

  const futureState = report.future_state;
  if (!isRecord(futureState)) {
    addIssue(issues, "future_state", "Expected future_state object.");
  } else {
    requireString(issues, futureState, "summary", "future_state");
    if (!Array.isArray(futureState.workflow_steps) || futureState.workflow_steps.length < 2) {
      addIssue(issues, "future_state.workflow_steps", "Expected at least two future workflow steps.");
    }
  }

  const implementationPlan = report.implementation_plan;
  if (!isRecord(implementationPlan)) {
    addIssue(issues, "implementation_plan", "Expected implementation_plan object.");
  } else {
    requireActionArray(issues, implementationPlan.immediate_actions, "implementation_plan.immediate_actions", 1);
    requireActionArray(issues, implementationPlan.next_30_days, "implementation_plan.next_30_days", 1);
  }

  const upgradeRecommendation = report.upgrade_recommendation;
  if (!isRecord(upgradeRecommendation)) {
    addIssue(issues, "upgrade_recommendation", "Expected upgrade_recommendation object.");
  } else {
    requireString(issues, upgradeRecommendation, "recommendation", "upgrade_recommendation");
    requireStringArray(issues, upgradeRecommendation.evidence, "upgrade_recommendation.evidence", 1);
    requireString(issues, upgradeRecommendation, "why_now_or_why_not", "upgrade_recommendation");
  }

  validateQualityControl(issues, report.quality_control);

  const delivery = report.delivery;
  if (!isRecord(delivery)) {
    addIssue(issues, "delivery", "Expected delivery object.");
  } else {
    requireString(issues, delivery, "dashboard_summary", "delivery");
    requireString(issues, delivery, "client_expectation_note", "delivery");

    if (typeof delivery.pdf_ready !== "boolean") {
      addIssue(issues, "delivery.pdf_ready", "Expected boolean pdf_ready.");
    }

    if (typeof delivery.email_ready !== "boolean") {
      addIssue(issues, "delivery.email_ready", "Expected boolean email_ready.");
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

export function assertAxiomReportJson(report: unknown): asserts report is AxiomReportJson {
  const result = validateAxiomReportJson(report);

  if (!result.valid) {
    throw new Error(
      `Axiom report validation failed: ${result.issues
        .map((issue) => `${issue.path}: ${issue.message}`)
        .join("; ")}`,
    );
  }
}
