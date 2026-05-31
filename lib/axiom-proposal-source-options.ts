type JsonRecord = Record<string, unknown>;

export type ProposalSourceOption = {
  customer_id: string | null;
  source_record_id: string;
  source_record_type: "service_request" | "workflow_submission";
  title: string;
  type_label: string;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
  workspace_name: string;
  client_summary: string;
  current_problem_summary: string;
  desired_outcome: string;
  scope_summary: string;
  assumptions: string[];
  client_responsibilities: string[];
  source_context: string;
};

export type ServiceRequestSourceRecord = {
  id: string;
  customer_id: string | null;
  request_type: string | null;
  source: string | null;
  status: string | null;
  proposal_status: string | null;
  contact_name: string | null;
  email: string | null;
  business_name: string | null;
  role: string | null;
  website: string | null;
  scope_type: string | null;
  support_type: string | null;
  budget_range: string | null;
  timeline: string | null;
  sensitive_data: string | null;
  summary_message: string | null;
  request_payload: JsonRecord | null;
  created_at: string | null;
  updated_at: string | null;
};

export type WorkflowSubmissionSourceRecord = {
  id: string;
  customer_id: string | null;
  order_id: string | null;
  tier_slug: string | null;
  workflow_title: string | null;
  status: string | null;
  intake_payload: JsonRecord | null;
  created_at: string | null;
  updated_at: string | null;
  submitted_at: string | null;
};

function cleanText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function payloadText(payload: JsonRecord | null | undefined, key: string) {
  return cleanText(payload?.[key]);
}

function intakeFields(payload: JsonRecord | null | undefined) {
  const fields = payload?.fields;
  return fields && typeof fields === "object" && !Array.isArray(fields)
    ? (fields as JsonRecord)
    : {};
}

function firstText(payload: JsonRecord | null | undefined, keys: string[]) {
  for (const key of keys) {
    const value = payloadText(payload, key);
    if (value) {
      return value;
    }
  }

  return "";
}

function compactList(items: Array<string | null | undefined>) {
  return items
    .map((item) => item?.trim())
    .filter((item): item is string => Boolean(item));
}

function contextLine(label: string, value: string | null | undefined) {
  return value ? `${label}: ${value}` : "";
}

function serviceRequestToSourceOption(record: ServiceRequestSourceRecord): ProposalSourceOption {
  const payload = record.request_payload || {};
  const workflowSummary = firstText(payload, ["workflow_summary", "workflow_context", "workflow_description"]);
  const currentProblem = firstText(payload, ["current_problem", "problem_summary", "workflow_problem"]);
  const desiredOutcome = firstText(payload, ["desired_outcome", "target_outcome", "success_definition"]);
  const toolsUsed = payloadText(payload, "tools_used");
  const peopleInvolved = payloadText(payload, "people_involved");
  const implementationRequired = payloadText(payload, "implementation_required");
  const implementationScope = payloadText(payload, "implementation_scope");
  const guardrailNotes = payloadText(payload, "guardrail_notes");
  const extraNotes = payloadText(payload, "extra_notes");
  const title = record.business_name || workflowSummary || record.summary_message || "Proposal request";
  const workspaceName = record.business_name ? `${record.business_name} proposal` : `${title} proposal`;

  return {
    customer_id: record.customer_id,
    source_record_id: record.id,
    source_record_type: "service_request",
    title,
    type_label: "Proposal request",
    status: record.proposal_status || record.status,
    created_at: record.created_at,
    updated_at: record.updated_at,
    workspace_name: workspaceName,
    client_summary: compactList([
      record.summary_message,
      workflowSummary,
      contextLine("Role", record.role),
      contextLine("Website", record.website),
    ]).join("\n\n"),
    current_problem_summary: currentProblem,
    desired_outcome: desiredOutcome,
    scope_summary: compactList([
      contextLine("Scope", record.scope_type),
      contextLine("Support requested", record.support_type),
      implementationRequired,
      implementationScope,
    ]).join("\n\n"),
    assumptions: compactList([
      contextLine("Timeline", record.timeline),
      contextLine("Budget range", record.budget_range),
      contextLine("Data sensitivity", record.sensitive_data),
      guardrailNotes ? `Guardrails to respect: ${guardrailNotes}` : "",
      extraNotes ? `Additional client notes: ${extraNotes}` : "",
    ]),
    client_responsibilities: compactList([
      toolsUsed ? `Confirm the tools and platforms involved: ${toolsUsed}` : "",
      peopleInvolved ? `Identify reviewers and workflow users: ${peopleInvolved}` : "",
      guardrailNotes ? "Confirm approval boundaries before any implementation work begins." : "",
    ]),
    source_context: compactList([
      contextLine("Source", record.source || "client proposal form"),
      contextLine("Request type", record.request_type),
      contextLine("Status", record.status),
      contextLine("Proposal status", record.proposal_status),
      contextLine("Timeline", record.timeline),
      contextLine("Budget", record.budget_range),
      contextLine("Sensitive data", record.sensitive_data),
      toolsUsed ? `Tools/systems: ${toolsUsed}` : "",
      peopleInvolved ? `People/reviewers: ${peopleInvolved}` : "",
    ]).join("\n"),
  };
}

function workflowSubmissionToSourceOption(record: WorkflowSubmissionSourceRecord): ProposalSourceOption {
  const fields = intakeFields(record.intake_payload);
  const title = record.workflow_title || payloadText(fields, "workflow_title") || "Workflow intake";
  const workflowSummary = firstText(fields, [
    "workflow_summary",
    "workflow_context",
    "workflow_description",
    "current_workflow",
    "business_context",
  ]);
  const currentProblem = firstText(fields, [
    "current_problem",
    "friction_points",
    "workflow_problem",
    "main_challenge",
    "risk_points",
    "pain_points",
  ]);
  const desiredOutcome = firstText(fields, [
    "desired_outcome",
    "target_outcome",
    "future_state",
    "success_definition",
    "ideal_outcome",
  ]);
  const tools = firstText(fields, ["tools_used", "systems_used", "tools", "platforms", "software_used"]);
  const people = firstText(fields, ["people_involved", "users", "reviewers", "stakeholders"]);
  const constraints = firstText(fields, ["constraints", "guardrails", "risk_controls", "approval_gates"]);

  return {
    customer_id: record.customer_id,
    source_record_id: record.id,
    source_record_type: "workflow_submission",
    title,
    type_label: "Workflow intake",
    status: record.status,
    created_at: record.created_at,
    updated_at: record.updated_at || record.submitted_at,
    workspace_name: `${title} proposal`,
    client_summary: workflowSummary || title,
    current_problem_summary: currentProblem,
    desired_outcome: desiredOutcome,
    scope_summary: compactList([
      contextLine("Workflow", title),
      contextLine("Package/intake route", record.tier_slug),
      tools ? `Tools and systems involved: ${tools}` : "",
    ]).join("\n\n"),
    assumptions: compactList([
      record.tier_slug ? `Proposal context is based on the submitted ${record.tier_slug} intake.` : "",
      constraints ? `Client constraints or guardrails: ${constraints}` : "",
    ]),
    client_responsibilities: compactList([
      tools ? `Confirm tool access boundaries: ${tools}` : "",
      people ? `Confirm workflow users and reviewers: ${people}` : "",
    ]),
    source_context: compactList([
      contextLine("Source", "workflow intake"),
      contextLine("Submission status", record.status),
      contextLine("Tier", record.tier_slug),
      contextLine("Submitted", record.submitted_at),
      tools ? `Tools/systems: ${tools}` : "",
      people ? `People/reviewers: ${people}` : "",
      constraints ? `Constraints/guardrails: ${constraints}` : "",
    ]).join("\n"),
  };
}

export function buildProposalSourceOptions({
  serviceRequests,
  workflowSubmissions,
}: {
  serviceRequests: ServiceRequestSourceRecord[];
  workflowSubmissions: WorkflowSubmissionSourceRecord[];
}) {
  return [
    ...serviceRequests.map(serviceRequestToSourceOption),
    ...workflowSubmissions.map(workflowSubmissionToSourceOption),
  ].sort((a, b) => {
    const aTime = new Date(a.updated_at || a.created_at || 0).getTime();
    const bTime = new Date(b.updated_at || b.created_at || 0).getTime();
    return bTime - aTime;
  });
}
