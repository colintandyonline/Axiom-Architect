"use client";

import { useEffect } from "react";

const phraseReplacements = new Map([
  [
    "The next backend phase should store each monthly stewardship cycle separately: client update, evidence supplied, Axiom review notes, revised action brief, report version, delivery status, and cycle dates. That gives the client a retained service history instead of a one-off report archive.",
    "Each monthly review keeps a clear timeline of what changed, what was reviewed, what was decided, and what Axiom recommended next. This gives you a retained improvement history rather than a single one-off report.",
  ],
  ["Data and review history", "Review history"],
  ["Client update window", "Monthly update window"],
  ["Stored history", "Review history"],
  ["source material", "starting point"],
  ["status queue", "preparation stage"],
  ["A report record is created after your intake is submitted.", "Your report appears here after your intake is submitted."],
  ["Your order is attached to this account.", "Your package is ready to begin."],
  ["This account has no paid audit package attached yet. Choose a package to create the order and open the intake workspace.", "Choose a package to open your intake workspace and begin your Axiom Architect review."],
  ["Your workflow intake is locked and the report has moved into the preparation stage.", "Your workflow intake is complete and your report is now being prepared."],
  ["Your workflow intake is locked and the report has moved into the status queue.", "Your workflow intake is complete and your report is now being prepared."],
  ["Schema:", "Form:"],
  ["Schema", "Form"],
  ["Intake schema not found", "Intake form not available"],
  ["This submission is missing its product intake schema. The product record needs an active intake schema before the form can be displayed.", "This intake form is not available yet. Return to your dashboard and contact Axiom if this continues."],
  ["Submission not found", "Intake not found"],
  ["This page needs a valid paid workflow submission ID. Return to the dashboard and open the intake from your audit card.", "This page needs a valid workflow intake link. Return to the dashboard and open the intake from your workspace."],
  ["Report generation begins after the intake is submitted.", "Your review begins after the intake is submitted."],
  ["A monthly stewardship brief is prepared after the update is submitted.", "Axiom prepares your monthly stewardship brief after the update is submitted."],
  ["The submission status is now set to submitted. The next stage is report processing.", "Your intake has been received. The next stage is your Axiom review."],
  ["This Stewardship update was not accepted because the next monthly submission window has not opened yet.", "This monthly update cannot be submitted yet because the next review window has not opened."],
]);

function replaceText(root: ParentNode) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let node = walker.nextNode();

  while (node) {
    nodes.push(node as Text);
    node = walker.nextNode();
  }

  nodes.forEach((textNode) => {
    let nextValue = textNode.nodeValue || "";

    phraseReplacements.forEach((replacement, original) => {
      if (nextValue.includes(original)) {
        nextValue = nextValue.replaceAll(original, replacement);
      }
    });

    if (nextValue !== textNode.nodeValue) {
      textNode.nodeValue = nextValue;
    }
  });
}

function hideAdminLinks() {
  document.querySelectorAll<HTMLAnchorElement>('a[href="/admin"]').forEach((link) => {
    link.hidden = true;
    link.setAttribute("aria-hidden", "true");
    link.style.display = "none";
  });
}

function cleanCustomerPages() {
  replaceText(document.body);
  hideAdminLinks();
}

export function CustomerFacingCopyGuard() {
  useEffect(() => {
    cleanCustomerPages();

    const observer = new MutationObserver(() => {
      cleanCustomerPages();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
