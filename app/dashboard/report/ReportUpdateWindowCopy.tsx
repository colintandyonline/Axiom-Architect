"use client";

import { useEffect } from "react";

const replacementCopy = new Map([
  ["Your workflow report is being refined.", "Your workflow report is ready."],
  ["Revision in progress", "Report ready"],
  ["Being refined", "30-day update window"],
  [
    "Your report is visible below and may receive final updates after internal review.",
    "Your report is ready and available below. Because AI tools, automation options, and workflow systems change quickly, Axiom Architect may update your report within the next 30 days if a relevant improvement becomes available. If your report is updated, we’ll notify you and send the revised version.",
  ],
]);

const advisoryAreas = [
  {
    title: "Workflow clarity",
    text: "We turn the submitted workflow details into a clearer operating view: the purpose, handoffs, constraints, and decision points that need structure before automation.",
  },
  {
    title: "Immediate priorities",
    text: "The report separates what should be fixed first from what can wait, so the client is not left with a long list of disconnected ideas.",
  },
  {
    title: "Automation suitability",
    text: "We identify which parts of the workflow can be supported by AI or automation, and which parts need better inputs or controls first.",
  },
  {
    title: "Human review gates",
    text: "The report marks the approvals, exceptions, disputes, payouts, risks, and quality checks that should remain human-controlled.",
  },
  {
    title: "Implementation sequence",
    text: "The guidance is ordered into practical next steps so the client knows what to do first, what to prepare next, and what not to rush.",
  },
  {
    title: "30-day update window",
    text: "If a relevant AI tool, automation option, or workflow improvement becomes available within 30 days, we may update the report and notify the client.",
  },
];

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

function createAdvisoryAreasSection() {
  const section = document.createElement("section");
  section.setAttribute("data-axiom-advisory-areas", "true");
  section.className = "rounded-[1.5rem] border border-[#9ed39f]/30 bg-[#030804] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.24)] sm:p-7";

  const cards = advisoryAreas
    .map(
      (area) => `
        <article class="border border-[#9ed39f]/20 bg-black/40 p-4">
          <span class="mb-4 block h-2 w-2 bg-[#9ed39f]"></span>
          <h3 class="text-lg font-black uppercase tracking-[-0.03em] text-white">${area.title}</h3>
          <p class="mt-3 text-sm leading-7 text-[#e6f6e7]/72">${area.text}</p>
        </article>
      `,
    )
    .join("");

  section.innerHTML = `
    <p class="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">Advisory summary</p>
    <h2 class="mt-3 text-[clamp(1.8rem,3vw,3.1rem)] font-black uppercase leading-[0.94] tracking-[-0.06em] text-white">
      What this report improves for you
    </h2>
    <div class="mt-6 grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
      <div class="rounded-[1.25rem] border border-[#9ed39f]/24 bg-[#9ed39f] p-5 text-black">
        <p class="text-[0.7rem] font-black uppercase tracking-[0.18em] text-black/70">How to read this report</p>
        <h3 class="mt-5 text-[clamp(1.8rem,3vw,3.2rem)] font-black uppercase leading-[0.94] tracking-[-0.06em]">
          This is not a pass/fail score.
        </h3>
        <p class="mt-5 text-base leading-8 text-black/76">
          This is an advisory blueprint. It uses the workflow information submitted in the intake to clarify what should change, what needs stronger control, what can be supported by AI, and what the client should do next.
        </p>
      </div>
      <div class="grid gap-4 md:grid-cols-2">
        ${cards}
      </div>
    </div>
  `;

  return section;
}

function replaceScorecardWithAdvisoryGuidance(root: ParentNode) {
  if (document.querySelector("[data-axiom-advisory-areas='true']")) {
    return;
  }

  const scorecardLabel = findTextElement(root, "Scorecard");
  const scorecardSection = scorecardLabel?.closest("section");

  if (!scorecardSection) {
    return;
  }

  scorecardSection.insertAdjacentElement("beforebegin", createAdvisoryAreasSection());
  scorecardSection.setAttribute("hidden", "true");
  scorecardSection.setAttribute("aria-hidden", "true");
  scorecardSection.setAttribute("style", "display:none !important;");
}

function refineCustomerReportPage() {
  replaceCustomerCopy(document.body);
  replaceScorecardWithAdvisoryGuidance(document.body);
}

export function ReportUpdateWindowCopy() {
  useEffect(() => {
    refineCustomerReportPage();

    const observer = new MutationObserver(() => {
      refineCustomerReportPage();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
