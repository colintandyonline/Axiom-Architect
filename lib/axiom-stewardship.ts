export type AxiomStewardshipCycleState = {
  isStewardship: boolean;
  baselineSubmitted: boolean;
  canSubmitUpdate: boolean;
  anchorDate: string | null;
  nextSubmissionOpensAt: string | null;
  daysUntilOpen: number | null;
  label: string;
  guidance: string;
};

const stewardshipIntervalDays = 30;

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return nextDate;
}

function parseDate(value?: string | null) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function daysBetween(start: Date, end: Date) {
  const differenceMs = end.getTime() - start.getTime();
  return Math.max(0, Math.ceil(differenceMs / 86_400_000));
}

export function isWorkflowStewardship(tierSlug?: string | null) {
  return tierSlug === "workflow-stewardship";
}

export function formatStewardshipDate(value?: string | null) {
  if (!value) {
    return "Not scheduled yet";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function getStewardshipCycleState({
  tierSlug,
  workflowStatus,
  workflowUpdatedAt,
  reportUpdatedAt,
  now = new Date(),
}: {
  tierSlug?: string | null;
  workflowStatus?: string | null;
  workflowUpdatedAt?: string | null;
  reportUpdatedAt?: string | null;
  now?: Date;
}): AxiomStewardshipCycleState | null {
  if (!isWorkflowStewardship(tierSlug)) {
    return null;
  }

  const baselineSubmitted = Boolean(workflowStatus && workflowStatus !== "draft");

  if (!baselineSubmitted) {
    return {
      isStewardship: true,
      baselineSubmitted: false,
      canSubmitUpdate: true,
      anchorDate: null,
      nextSubmissionOpensAt: null,
      daysUntilOpen: null,
      label: "Baseline intake open",
      guidance:
        "Submit the baseline workflow intake first. This gives Axiom the starting point for monthly stewardship reviews.",
    };
  }

  const anchor = parseDate(reportUpdatedAt) || parseDate(workflowUpdatedAt) || now;
  const nextSubmissionDate = addDays(anchor, stewardshipIntervalDays);
  const canSubmitUpdate = now.getTime() >= nextSubmissionDate.getTime();

  return {
    isStewardship: true,
    baselineSubmitted: true,
    canSubmitUpdate,
    anchorDate: anchor.toISOString(),
    nextSubmissionOpensAt: nextSubmissionDate.toISOString(),
    daysUntilOpen: canSubmitUpdate ? 0 : daysBetween(now, nextSubmissionDate),
    label: canSubmitUpdate ? "Monthly update window open" : "Monthly update window locked",
    guidance: canSubmitUpdate
      ? "Your next monthly stewardship update window is open. Submit workflow changes, issues, examples, and decisions that need review."
      : "Your next monthly stewardship update is not open yet. Use this time to collect changes, issues, examples, metrics, and decisions for the next review.",
  };
}
