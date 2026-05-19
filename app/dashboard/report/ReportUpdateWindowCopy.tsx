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

export function ReportUpdateWindowCopy() {
  useEffect(() => {
    replaceCustomerCopy(document.body);

    const observer = new MutationObserver(() => {
      replaceCustomerCopy(document.body);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
