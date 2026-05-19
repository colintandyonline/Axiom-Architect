"use client";

import { useEffect } from "react";

type CoreImprovement = {
  area?: string;
  client_input_used?: string;
  improvement_made?: string;
  why_it_matters?: string;
};

type ImprovementSummary = {
  headline?: string;
  before_state?: string;
  improved_state?: string;
  value_created?: string;
  core_improvements?: CoreImprovement[];
};

type ClientActionBrief = {
  first_priority?: string;
  next_7_days?: string[];
  next_30_days?: string[];
  do_not_automate_yet?: string[];
  decision_points_for_client?: string[];
  where_axiom_can_help_next?: string[];
};

type ReportBriefResponse = {
  ok?: boolean;
  available?: boolean;
  improvement_summary?: ImprovementSummary | null;
  client_action_brief?: ClientActionBrief | null;
};

const replacementCopy = new Map([
  ["Your workflow report is being refined.", "Your workflow report is ready."],
  ["Revision in progress", "Report ready"],
  ["Being refined", "30-day update window"],
  [
    "Your report is visible below and may receive final updates after internal review.",
    "Your report is ready and available below. Because AI tools, automation options, and workflow systems change quickly, Axiom Architect may update your report within the next 30 days if a relevant improvement becomes available. If your report is updated, we’ll notify you and send the revised version.",
  ],
]);

function escapeHtml(value?: string) {
  return (value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function safeList(value?: string[]) {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string" && item.trim()) : [];
}

function listHtml(items: string[]) {
  if (items.length === 0) {
    return `<p class="text-sm leading-7 text-[#e6f6e7]/64">No items recorded yet.</p>`;
  }

  return `
    <ul class="grid gap-3">
      ${items
        .map(
          (item) => `
            <li class="flex gap-3 text-sm leading-7 text-[#e6f6e7]/76 sm:text-base">
              <span class="mt-2 h-2 w-2 shrink-0 bg-[#9ed39f]"></span>
              <span>${escapeHtml(item)}</span>
            </li>
          `,
        )
        .join("")}
    </ul>
  `;
}

function replaceCustomerCopy(root: ParentNode) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let currentNode = walker.nextNode();

  while (currentNode) {
    nodes.push(currentNode as Text);
    currentNode = walker.nextNode();
  }

  nodes.forEach((node) => {
    let nextValue = node.nodeValue || "";

    replacementCopy.forEach((replacement, original) => {
      if (nextValue.includes(original)) {
        nextValue = nextValue.replaceAll(original, replacement);
      }
    });

    if (nextValue !== node.nodeValue) {
      node.nodeValue = nextValue;
    }
  });
}

function findTextElement(root: ParentNode, exactText: string) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let currentNode = walker.nextNode();

  while (currentNode) {
    if ((currentNode.nodeValue || "").trim() === exactText) {
      return currentNode.parentElement;
    }

    currentNode = walker.nextNode();
  }

  return null;
}

function createImprovementBriefSection(data: ReportBriefResponse) {
  const improvement = data.improvement_summary;
  const actionBrief = data.client_action_brief;

  if (!improvement && !actionBrief) {
    return null;
  }

  const coreImprovements = Array.isArray(improvement?.core_improvements)
    ? improvement.core_improvements.filter((item) => item && typeof item === "object")
    : [];

  const nextSevenDays = safeList(actionBrief?.next_7_days);
  const nextThirtyDays = safeList(actionBrief?.next_30_days);
  const doNotAutomate = safeList(actionBrief?.do_not_automate_yet);
  const decisionPoints = safeList(actionBrief?.decision_points_for_client);
  const axiomSupport = safeList(actionBrief?.where_axiom_can_help_next);

  const section = document.createElement("section");
  section.setAttribute("data-axiom-dynamic-improvement-brief", "true");
  section.className = "rounded-[1.5rem] border border-[#9ed39f]/30 bg-[#030804] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.24)] sm:p-7";

  section.innerHTML = `
    <p class="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">Improvement brief</p>
    <h2 class="mt-3 text-[clamp(1.8rem,3vw,3.35rem)] font-black uppercase leading-[0.94] tracking-[-0.06em] text-white">
      ${escapeHtml(improvement?.headline || "What Axiom improved for you")}
    </h2>

    <div class="mt-6 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
      <article class="rounded-[1.25rem] border border-[#9ed39f]/24 bg-[#9ed39f] p-5 text-black">
        <p class="text-[0.7rem] font-black uppercase tracking-[0.18em] text-black/70">First priority</p>
        <h3 class="mt-5 text-[clamp(1.65rem,3vw,2.8rem)] font-black uppercase leading-[0.94] tracking-[-0.06em]">
          ${escapeHtml(actionBrief?.first_priority || "Start with the highest-friction workflow step.")}
        </h3>
        <p class="mt-5 text-base leading-8 text-black/76">
          ${escapeHtml(improvement?.value_created || "This report turns the submitted workflow into clearer priorities, safer automation boundaries, and practical next steps.")}
        </p>
      </article>

      <div class="grid gap-4">
        <article class="border border-[#9ed39f]/20 bg-black/40 p-4">
          <p class="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">Before</p>
          <p class="mt-3 text-sm leading-7 text-[#e6f6e7]/76">${escapeHtml(improvement?.before_state)}</p>
        </article>
        <article class="border border-[#9ed39f]/20 bg-black/40 p-4">
          <p class="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">Improved operating model</p>
          <p class="mt-3 text-sm leading-7 text-[#e6f6e7]/76">${escapeHtml(improvement?.improved_state)}</p>
        </article>
      </div>
    </div>

    ${
      coreImprovements.length > 0
        ? `
          <div class="mt-8">
            <p class="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">Core improvements made from your intake</p>
            <div class="mt-4 grid gap-4 lg:grid-cols-2">
              ${coreImprovements
                .map(
                  (item) => `
                    <article class="border border-[#9ed39f]/20 bg-black/40 p-4">
                      <h3 class="text-lg font-black uppercase leading-tight tracking-[-0.035em] text-white">${escapeHtml(item.area)}</h3>
                      <p class="mt-3 text-sm leading-7 text-[#e6f6e7]/72"><strong class="text-[#9ed39f]">Input used:</strong> ${escapeHtml(item.client_input_used)}</p>
                      <p class="mt-3 text-sm leading-7 text-[#e6f6e7]/78"><strong class="text-[#9ed39f]">Improvement made:</strong> ${escapeHtml(item.improvement_made)}</p>
                      <p class="mt-3 text-sm leading-7 text-[#e6f6e7]/72"><strong class="text-[#9ed39f]">Why it matters:</strong> ${escapeHtml(item.why_it_matters)}</p>
                    </article>
                  `,
                )
                .join("")}
            </div>
          </div>
        `
        : ""
    }

    <div class="mt-8 grid gap-5 lg:grid-cols-2">
      <article class="rounded-[1.25rem] border border-[#9ed39f]/22 bg-black/40 p-5">
        <h3 class="text-xl font-black uppercase tracking-[-0.04em] text-white">Next 7 days</h3>
        <div class="mt-4">${listHtml(nextSevenDays)}</div>
      </article>
      <article class="rounded-[1.25rem] border border-[#9ed39f]/22 bg-black/40 p-5">
        <h3 class="text-xl font-black uppercase tracking-[-0.04em] text-white">Next 30 days</h3>
        <div class="mt-4">${listHtml(nextThirtyDays)}</div>
      </article>
      <article class="rounded-[1.25rem] border border-[#9ed39f]/22 bg-black/40 p-5">
        <h3 class="text-xl font-black uppercase tracking-[-0.04em] text-white">Do not automate yet</h3>
        <div class="mt-4">${listHtml(doNotAutomate)}</div>
      </article>
      <article class="rounded-[1.25rem] border border-[#9ed39f]/22 bg-black/40 p-5">
        <h3 class="text-xl font-black uppercase tracking-[-0.04em] text-white">Decisions to confirm</h3>
        <div class="mt-4">${listHtml(decisionPoints)}</div>
      </article>
    </div>

    <article class="mt-8 rounded-[1.25rem] border border-[#9ed39f]/25 bg-[#9ed39f]/10 p-5">
      <h3 class="text-xl font-black uppercase tracking-[-0.04em] text-white">Where Axiom can help next</h3>
      <div class="mt-4">${listHtml(axiomSupport)}</div>
    </article>
  `;

  return section;
}

function hideLegacyAdvisorySection() {
  const legacySection = document.querySelector("[data-axiom-advisory-areas='true']");

  if (legacySection instanceof HTMLElement) {
    legacySection.hidden = true;
    legacySection.setAttribute("aria-hidden", "true");
    legacySection.style.display = "none";
  }
}

function replaceScorecardWithAdvisoryGuidance(root: ParentNode) {
  const scorecardLabel = findTextElement(root, "Scorecard");
  const scorecardSection = scorecardLabel?.closest("section");

  if (!scorecardSection) {
    return;
  }

  scorecardSection.setAttribute("hidden", "true");
  scorecardSection.setAttribute("aria-hidden", "true");
  scorecardSection.setAttribute("style", "display:none !important;");
}

function insertDynamicBrief(data: ReportBriefResponse) {
  if (document.querySelector("[data-axiom-dynamic-improvement-brief='true']")) {
    return;
  }

  const briefSection = createImprovementBriefSection(data);

  if (!briefSection) {
    return;
  }

  const executiveLabel = findTextElement(document.body, "Executive summary");
  const executiveSection = executiveLabel?.closest("section");
  const firstReportSection = document.querySelector("main section:nth-of-type(3) section");
  const insertionTarget = executiveSection || firstReportSection;

  if (insertionTarget) {
    insertionTarget.insertAdjacentElement("beforebegin", briefSection);
  }
}

async function loadDynamicBrief() {
  const params = new URLSearchParams(window.location.search);
  const submissionId = params.get("submission_id");
  const query = submissionId ? `?submission_id=${encodeURIComponent(submissionId)}` : "";
  const response = await fetch(`/api/dashboard/report-brief${query}`, {
    credentials: "same-origin",
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as ReportBriefResponse;
  return data.ok && data.available ? data : null;
}

function refineCustomerReportPage() {
  replaceCustomerCopy(document.body);
  replaceScorecardWithAdvisoryGuidance(document.body);
  hideLegacyAdvisorySection();
}

export function ReportUpdateWindowCopy() {
  useEffect(() => {
    let cancelled = false;

    refineCustomerReportPage();

    loadDynamicBrief().then((data) => {
      if (!data || cancelled) {
        return;
      }

      insertDynamicBrief(data);
      refineCustomerReportPage();
    });

    const observer = new MutationObserver(() => {
      refineCustomerReportPage();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  return null;
}
