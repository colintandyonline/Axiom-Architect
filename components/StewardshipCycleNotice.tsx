"use client";

import { useEffect, useMemo, useState } from "react";

type CycleState = {
  baselineSubmitted: boolean;
  canSubmitUpdate: boolean;
  anchorDate: string | null;
  nextSubmissionOpensAt: string | null;
  daysUntilOpen: number | null;
  label: string;
  guidance: string;
  anchorDateLabel: string;
  nextSubmissionOpensAtLabel: string;
};

type CycleResponse = {
  ok?: boolean;
  available?: boolean;
  workflow_id?: string;
  workflow_title?: string | null;
  service_name?: string;
  report_status?: string | null;
  cycle?: CycleState;
};

type StewardshipCycleNoticeProps = {
  placement?: "dashboard" | "intake" | "report";
};

function getPlacementCopy(placement: StewardshipCycleNoticeProps["placement"], cycle: CycleState) {
  if (!cycle.baselineSubmitted) {
    return {
      title: "Submit your baseline workflow first.",
      body: "This opens the first Stewardship cycle. After the baseline report is prepared, your next monthly update window will be scheduled.",
      cta: "Start baseline intake",
    };
  }

  if (cycle.canSubmitUpdate) {
    return {
      title: "Your monthly update window is open.",
      body: "Submit workflow changes, errors, examples, metrics, tool changes, and decisions that need review. Axiom will use this as the source material for the next stewardship brief.",
      cta: "Submit monthly update",
    };
  }

  if (placement === "intake") {
    return {
      title: "Monthly update not open yet.",
      body: `The next Stewardship update can be submitted from ${cycle.nextSubmissionOpensAtLabel}. Until then, use this page to review the current baseline and collect evidence for the next cycle.`,
      cta: "View latest brief",
    };
  }

  if (placement === "report") {
    return {
      title: "Next Stewardship update date.",
      body: `Your latest brief is active. The next monthly update window opens on ${cycle.nextSubmissionOpensAtLabel}. Collect changes, issues, and decisions before that date.`,
      cta: "Review dashboard",
    };
  }

  return {
    title: "Next Stewardship update date.",
    body: `Your next monthly update window opens on ${cycle.nextSubmissionOpensAtLabel}. Prepare changes, examples, metrics, errors, and decisions that need review before then.`,
    cta: "Review intake",
  };
}

export function StewardshipCycleNotice({ placement = "dashboard" }: StewardshipCycleNoticeProps) {
  const [data, setData] = useState<CycleResponse | null>(null);

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams(window.location.search);
    const submissionId = params.get("submission_id");
    const query = submissionId ? `?submission_id=${encodeURIComponent(submissionId)}` : "";

    fetch(`/api/dashboard/stewardship-cycle${query}`, { credentials: "same-origin" })
      .then((response) => (response.ok ? response.json() : null))
      .then((nextData: CycleResponse | null) => {
        if (active) {
          setData(nextData);
        }
      })
      .catch(() => {
        if (active) {
          setData(null);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const cycle = data?.available ? data.cycle : null;
  const copy = useMemo(() => (cycle ? getPlacementCopy(placement, cycle) : null), [cycle, placement]);

  if (!cycle || !copy) {
    return null;
  }

  const intakeHref = data?.workflow_id ? `/dashboard/intake?submission_id=${data.workflow_id}` : "/dashboard/intake";
  const reportHref = data?.workflow_id ? `/dashboard/report?submission_id=${data.workflow_id}` : "/dashboard/report";
  const dashboardHref = "/dashboard";
  const ctaHref = placement === "report" && !cycle.canSubmitUpdate ? dashboardHref : cycle.canSubmitUpdate || !cycle.baselineSubmitted ? intakeHref : reportHref;

  return (
    <section className="border-b border-[#9ed39f]/20 bg-black px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px] rounded-[1.5rem] border border-[#9ed39f]/34 bg-[#030804] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.24)] sm:p-7">
        <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.64rem] font-black uppercase tracking-[0.2em] text-black">
              Stewardship cycle
            </p>
            <h2 className="mt-4 text-[clamp(1.8rem,3vw,3.4rem)] font-black uppercase leading-[0.94] tracking-[-0.06em] text-white">
              {copy.title}
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#e6f6e7]/76 sm:text-base">
              {copy.body}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <article className="border border-[#9ed39f]/22 bg-black/38 p-4">
              <p className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Current status</p>
              <p className="mt-3 text-lg font-black uppercase tracking-[-0.035em] text-white">{cycle.label}</p>
            </article>
            <article className="border border-[#9ed39f]/22 bg-black/38 p-4">
              <p className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Last review anchor</p>
              <p className="mt-3 text-lg font-black uppercase tracking-[-0.035em] text-white">{cycle.anchorDateLabel}</p>
            </article>
            <article className="border border-[#9ed39f]/22 bg-black/38 p-4">
              <p className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Next update opens</p>
              <p className="mt-3 text-lg font-black uppercase tracking-[-0.035em] text-white">{cycle.nextSubmissionOpensAtLabel}</p>
              {cycle.daysUntilOpen !== null && cycle.daysUntilOpen > 0 ? (
                <p className="mt-2 text-sm leading-6 text-[#e6f6e7]/64">{cycle.daysUntilOpen} day(s) remaining.</p>
              ) : null}
            </article>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-[#9ed39f]/18 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="m-0 text-sm leading-6 text-[#e6f6e7]/68">
            Monthly updates are gated so each brief has a stable review period. Early submissions stay locked until the next cycle opens.
          </p>
          <a
            href={ctaHref}
            className="inline-flex min-h-12 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-5 text-center text-[0.68rem] font-black uppercase tracking-[0.16em] text-black transition hover:bg-white sm:min-w-56"
          >
            {copy.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
