import fs from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";
import type {
  AxiomAssistantOpportunity,
  AxiomFutureWorkflowStep,
  AxiomReportAction,
  AxiomReportFinding,
  AxiomReportJson,
  AxiomRiskReviewGate,
} from "./axiom-report-types";

type ReportPdfSource = {
  reportId: string;
  reportJson: Partial<AxiomReportJson>;
  customerName?: string | null;
  customerBusiness?: string | null;
  customerEmail?: string | null;
  workflowTitle?: string | null;
  serviceName?: string | null;
  generatedAt?: string | null;
};

const colours = {
  ink: "#F4F7F2",
  mint: "#9ED39F",
  mintDark: "#5E9D68",
  charcoal: "#070907",
  panel: "#111611",
  grid: "#263528",
  text: "#1B211C",
  muted: "#657066",
  line: "#D8E5D8",
  pale: "#EEF7EE",
  white: "#FFFFFF",
};

const pageMargin = 44;
const bottomMargin = 58;

function safeText(value: unknown, fallback = "Not specified") {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed || fallback;
}

function safeArray<T>(value: T[] | undefined | null): T[] {
  return Array.isArray(value) ? value : [];
}

function formatDate(value?: string | null) {
  if (!value) {
    return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date());
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function titleCase(value?: string | null) {
  if (!value) {
    return "Workflow Audit";
  }

  return value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function collectPdfBuffer(doc: PDFKit.PDFDocument) {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });
}

function brandLogoPath() {
  const logoPath = path.join(process.cwd(), "public", "brand", "axiom-logo.png");
  return fs.existsSync(logoPath) ? logoPath : null;
}

export async function generateAxiomReportPdf(source: ReportPdfSource) {
  const metadataTitle = `${safeText(
    source.customerBusiness ||
      source.customerName ||
      source.reportJson.client?.business_name ||
      source.reportJson.client?.name,
    "Axiom Client",
  )} - ${safeText(
    source.workflowTitle || source.reportJson.submission?.workflow_title,
    "Workflow",
  )} - Axiom Architect Report`;

  const doc = new PDFDocument({
    size: "A4",
    margin: pageMargin,
    bufferPages: true,
    info: {
      Title: metadataTitle,
      Author: "Axiom Architect",
      Subject: "Workflow architecture diagnostic report",
      Creator: "Axiom Architect",
    },
  });
  const pdfPromise = collectPdfBuffer(doc);
  const logo = brandLogoPath();
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  const contentWidth = pageWidth - pageMargin * 2;

  function drawGrid(dark = false) {
    const stroke = dark ? colours.grid : "#DCEADC";
    doc.save();
    doc.lineWidth(0.35).strokeColor(stroke).opacity(dark ? 0.38 : 0.62);

    for (let x = 0; x <= pageWidth; x += 34) {
      doc.moveTo(x, 0).lineTo(x, pageHeight).stroke();
    }

    for (let y = 0; y <= pageHeight; y += 34) {
      doc.moveTo(0, y).lineTo(pageWidth, y).stroke();
    }

    doc.restore();
  }

  function drawFooter(pageNumber?: number, pageTotal?: number) {
    doc.save();
    doc
      .moveTo(pageMargin, pageHeight - 42)
      .lineTo(pageWidth - pageMargin, pageHeight - 42)
      .lineWidth(0.5)
      .strokeColor("#CFE0CF")
      .stroke();
    doc
      .font("Helvetica-Bold")
      .fontSize(7)
      .fillColor(colours.muted)
      .text("AXIOM ARCHITECT", pageMargin, pageHeight - 30, { continued: true });
    doc
      .font("Helvetica")
      .fillColor(colours.muted)
      .text(`  |  THE ARCHITECTURE BEHIND INTELLIGENT WORK`, { continued: false });
    doc
      .font("Helvetica")
      .fontSize(7)
      .fillColor(colours.muted)
      .text(`PAGE ${pageNumber || 1} / ${pageTotal || 1}`, pageWidth - 120, pageHeight - 30, {
        width: 76,
        align: "right",
      });
    doc.restore();
  }

  function addLightPage(kicker: string, title: string) {
    doc.addPage();
    doc.rect(0, 0, pageWidth, pageHeight).fill(colours.pale);
    drawGrid(false);
    doc.y = pageMargin;
    doc
      .font("Helvetica-Bold")
      .fontSize(8)
      .fillColor(colours.mintDark)
      .text(kicker.toUpperCase(), pageMargin, doc.y, { characterSpacing: 1.6 });
    doc
      .font("Helvetica-Bold")
      .fontSize(24)
      .fillColor(colours.text)
      .text(title.toUpperCase(), pageMargin, doc.y + 12, {
        width: contentWidth,
        lineGap: 1,
      });
    doc
      .moveTo(pageMargin, doc.y + 8)
      .lineTo(pageWidth - pageMargin, doc.y + 8)
      .lineWidth(1)
      .strokeColor(colours.mint)
      .stroke();
    doc.moveDown(1.25);
  }

  function ensureSpace(height: number) {
    if (doc.y + height > pageHeight - bottomMargin) {
      addLightPage("continued", "Report detail");
    }
  }

  function addSectionDivider(kicker: string, title: string, body?: string) {
    doc.addPage();
    doc.rect(0, 0, pageWidth, pageHeight).fill(colours.charcoal);
    drawGrid(true);
    doc.rect(pageMargin, 90, contentWidth, pageHeight - 180).lineWidth(1).strokeColor("#2D432F").stroke();
    doc.rect(pageMargin, 90, 10, pageHeight - 180).fill(colours.mint);
    doc
      .font("Helvetica-Bold")
      .fontSize(8)
      .fillColor(colours.mint)
      .text(kicker.toUpperCase(), pageMargin + 30, 130, { characterSpacing: 1.7 });
    doc
      .font("Helvetica-Bold")
      .fontSize(44)
      .fillColor(colours.white)
      .text(title.toUpperCase(), pageMargin + 30, 160, {
        width: contentWidth - 60,
        lineGap: -2,
      });

    if (body) {
      doc
        .font("Helvetica")
        .fontSize(12)
        .fillColor("#DCEADC")
        .text(body, pageMargin + 30, doc.y + 18, {
          width: contentWidth - 80,
          lineGap: 4,
        });
    }
  }

  function addParagraph(value?: string | null) {
    const text = safeText(value, "");

    if (!text) {
      return;
    }

    ensureSpace(doc.heightOfString(text, { width: contentWidth, lineGap: 4 }) + 18);
    doc
      .font("Helvetica")
      .fontSize(10.5)
      .fillColor(colours.text)
      .text(text, pageMargin, doc.y, {
        width: contentWidth,
        lineGap: 4,
      });
    doc.moveDown(0.8);
  }

  function addSubheading(value: string) {
    ensureSpace(40);
    doc
      .font("Helvetica-Bold")
      .fontSize(13)
      .fillColor(colours.text)
      .text(value.toUpperCase(), pageMargin, doc.y, { width: contentWidth });
    doc.moveDown(0.4);
  }

  function addList(items?: string[] | null) {
    const values = safeArray(items).filter(Boolean);

    if (values.length === 0) {
      addParagraph("No items recorded.");
      return;
    }

    values.forEach((item) => {
      const height = Math.max(32, doc.heightOfString(item, { width: contentWidth - 26, lineGap: 3 }) + 12);
      ensureSpace(height);
      const startY = doc.y;
      doc.rect(pageMargin, startY + 4, 6, 6).fill(colours.mintDark);
      doc
        .font("Helvetica")
        .fontSize(9.5)
        .fillColor(colours.text)
        .text(item, pageMargin + 22, startY, {
          width: contentWidth - 22,
          lineGap: 3,
        });
      doc.moveDown(0.45);
    });
  }

  function addCallout(label: string, value?: string | null, dark = false) {
    const body = safeText(value);
    const labelHeight = 15;
    const bodyHeight = doc.heightOfString(body, { width: contentWidth - 28, lineGap: 3 });
    const height = Math.max(72, labelHeight + bodyHeight + 30);
    ensureSpace(height + 12);
    const y = doc.y;
    doc.rect(pageMargin, y, contentWidth, height).fill(dark ? colours.panel : "#F8FCF7");
    doc.rect(pageMargin, y, contentWidth, height).lineWidth(0.8).strokeColor(colours.line).stroke();
    doc
      .font("Helvetica-Bold")
      .fontSize(7)
      .fillColor(dark ? colours.mint : colours.mintDark)
      .text(label.toUpperCase(), pageMargin + 14, y + 14, {
        width: contentWidth - 28,
        characterSpacing: 1.2,
      });
    doc
      .font("Helvetica")
      .fontSize(9.5)
      .fillColor(dark ? colours.ink : colours.text)
      .text(body, pageMargin + 14, y + 33, {
        width: contentWidth - 28,
        lineGap: 3,
      });
    doc.y = y + height + 12;
  }

  function addKeyValueGrid(items: Array<[string, string | number | null | undefined]>) {
    const gap = 10;
    const columnWidth = (contentWidth - gap) / 2;
    let x = pageMargin;
    let y = doc.y;

    items.forEach(([key, value], index) => {
      if (index % 2 === 0) {
        ensureSpace(70);
        x = pageMargin;
        y = doc.y;
      }

      doc.rect(x, y, columnWidth, 62).fill("#F8FCF7");
      doc.rect(x, y, columnWidth, 62).lineWidth(0.7).strokeColor(colours.line).stroke();
      doc
        .font("Helvetica-Bold")
        .fontSize(7)
        .fillColor(colours.mintDark)
        .text(key.toUpperCase(), x + 12, y + 12, {
          width: columnWidth - 24,
          characterSpacing: 1.1,
        });
      doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .fillColor(colours.text)
        .text(String(value || "Not specified"), x + 12, y + 30, {
          width: columnWidth - 24,
          lineGap: 2,
        });

      if (index % 2 === 0) {
        x += columnWidth + gap;
      } else {
        doc.y = y + 74;
      }
    });

    if (items.length % 2 === 1) {
      doc.y = y + 74;
    }
  }

  function addActionList(title: string, actions?: AxiomReportAction[] | null) {
    addSubheading(title);

    safeArray(actions).forEach((action, index) => {
      const body = `${action.expected_outcome}\n${action.implementation_note}`;
      const height = Math.max(96, doc.heightOfString(body, { width: contentWidth - 28, lineGap: 3 }) + 70);
      ensureSpace(height + 10);
      const y = doc.y;
      doc.rect(pageMargin, y, contentWidth, height).fill("#F8FCF7");
      doc.rect(pageMargin, y, contentWidth, height).lineWidth(0.7).strokeColor(colours.line).stroke();
      doc
        .font("Helvetica-Bold")
        .fontSize(7)
        .fillColor(colours.mintDark)
        .text(`${String(index + 1).padStart(2, "0")} / ${action.priority.toUpperCase()} / ${action.owner_type.toUpperCase()}`, pageMargin + 14, y + 14, {
          width: contentWidth - 28,
          characterSpacing: 1.1,
        });
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor(colours.text)
        .text(action.title.toUpperCase(), pageMargin + 14, y + 31, {
          width: contentWidth - 28,
        });
      doc
        .font("Helvetica")
        .fontSize(9.5)
        .fillColor(colours.text)
        .text(body, pageMargin + 14, y + 53, {
          width: contentWidth - 28,
          lineGap: 3,
        });
      doc.y = y + height + 10;
    });

    if (safeArray(actions).length === 0) {
      addParagraph("No actions recorded.");
    }
  }

  function coverLineSize(value: string, baseSize: number) {
    const length = value.length;

    if (length > 42) {
      return baseSize - 10;
    }

    if (length > 32) {
      return baseSize - 7;
    }

    if (length > 24) {
      return baseSize - 4;
    }

    return baseSize;
  }

  function addCoverTitleLine(value: string, y: number, baseSize: number, colour = colours.white) {
    const text = safeText(value, "").toUpperCase();

    if (!text) {
      return y;
    }

    doc
      .font("Helvetica-Bold")
      .fontSize(coverLineSize(text, baseSize))
      .fillColor(colour)
      .text(text, pageMargin, y, {
        width: contentWidth,
        lineGap: -2,
      });

    return doc.y + 2;
  }

  const report = source.reportJson;
  const clientName = safeText(source.customerName || report.client?.name, "Axiom client");
  const businessName = safeText(source.customerBusiness || report.client?.business_name, "Client organisation");
  const clientEmail = safeText(source.customerEmail || report.client?.email, "Not supplied");
  const workflowTitle = safeText(source.workflowTitle || report.submission?.workflow_title, "Workflow Audit Report");
  const serviceName = safeText(source.serviceName || titleCase(report.product_slug), "Axiom Workflow Audit");
  const generatedAt = formatDate(source.generatedAt || report.generated_at);
  const coverBusinessTitle = businessName === "Client organisation" ? clientName : businessName;

  doc.rect(0, 0, pageWidth, pageHeight).fill(colours.charcoal);
  drawGrid(true);

  if (logo) {
    doc.image(logo, pageMargin, 48, { width: 44 });
  }

  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor(colours.mint)
    .text("AXIOM ARCHITECT", pageMargin, 108, { characterSpacing: 2.1 });
  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor("#CFE0CF")
    .text("THE ARCHITECTURE BEHIND INTELLIGENT WORK", pageMargin, 126, { characterSpacing: 1.2 });

  doc.rect(pageMargin, 164, contentWidth, 2).fill(colours.mint);
  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .fillColor(colours.mint)
    .text(`PREPARED FOR ${clientName.toUpperCase()}`, pageMargin, 188, {
      width: contentWidth,
      characterSpacing: 1.4,
    });

  let titleY = 214;
  titleY = addCoverTitleLine(coverBusinessTitle, titleY, 39);
  titleY = addCoverTitleLine(workflowTitle, titleY, 35, "#DCEADC");
  titleY = addCoverTitleLine("Workflow Architecture Report", titleY, 31);

  doc.rect(pageMargin, titleY + 12, 92, 2).fill(colours.mint);
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#CFE0CF")
    .text(`${serviceName} | Client-ready diagnostic report`, pageMargin, titleY + 28, {
      width: contentWidth,
      lineGap: 3,
    });

  const coverPanelY = 438;
  const coverPanelHeight = 156;
  doc.rect(pageMargin, coverPanelY, contentWidth, coverPanelHeight).fill(colours.panel);
  doc.rect(pageMargin, coverPanelY, contentWidth, coverPanelHeight).lineWidth(1).strokeColor("#2D432F").stroke();
  doc.rect(pageMargin, coverPanelY, 5, coverPanelHeight).fill(colours.mint);

  [
    ["PREPARED FOR", clientName],
    ["BUSINESS", businessName],
    ["REPORT WORKSPACE", workflowTitle],
    ["SERVICE", serviceName],
    ["PREPARED", generatedAt],
    ["REPORT REFERENCE", source.reportId],
  ].forEach(([key, value], index) => {
    const columnWidth = (contentWidth - 58) / 2;
    const x = pageMargin + 22 + (index % 2) * (columnWidth + 22);
    const y = coverPanelY + 24 + Math.floor(index / 2) * 43;
    doc.font("Helvetica-Bold").fontSize(7).fillColor(colours.mint).text(key, x, y, {
      width: columnWidth,
      characterSpacing: 1.35,
    });
    doc.font("Helvetica").fontSize(9.5).fillColor(colours.ink).text(value, x, y + 15, {
      width: columnWidth,
      lineGap: 2,
    });
  });

  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor("#AEBBAE")
    .text("Prepared by Axiom Architect for structured workflow review and implementation planning.", pageMargin, pageHeight - 72, {
      width: contentWidth,
    });

  addLightPage("control page", "Client and workflow summary");
  addKeyValueGrid([
    ["Client", clientName],
    ["Business", businessName],
    ["Email", clientEmail],
    ["Service", serviceName],
    ["Workflow", workflowTitle],
    ["Report type", titleCase(report.report_type)],
  ]);
  addCallout("Dashboard summary", report.delivery?.dashboard_summary || report.executive_summary?.plain_english_summary);
  addCallout("Client expectation note", report.delivery?.client_expectation_note);

  addSectionDivider(
    "diagnostic map",
    "Readiness and executive summary",
    "This section converts the submitted intake into a concise operating diagnosis and readiness view.",
  );
  addLightPage("scorecard", "Workflow readiness");
  addKeyValueGrid([
    ["Overall score", report.scorecard?.overall_readiness_score ?? "Not scored"],
    ["Overall label", report.scorecard?.overall_readiness_label || "Not labelled"],
    ["Quality status", report.quality_control?.status || "Not reviewed"],
    ["Human review level", report.risk_review?.human_review_level || "Not set"],
  ]);
  safeArray(report.scorecard?.scores).forEach((score) => {
    addCallout(`${score.label} / ${score.score}`, `${score.rationale}\n\nClient meaning: ${score.client_meaning}`);
  });

  addLightPage("executive summary", safeText(report.executive_summary?.headline, "Workflow diagnosis"));
  addParagraph(report.executive_summary?.plain_english_summary);
  addCallout("Strongest opportunity", report.executive_summary?.strongest_opportunity);
  addCallout("Primary constraint", report.executive_summary?.primary_constraint);
  addCallout("Next best action", report.executive_summary?.next_best_action, true);

  addSectionDivider("operating diagnosis", "Findings and current workflow", "Findings are tied to the intake evidence and translated into practical response points.");
  addLightPage("diagnosis", "Findings");
  safeArray(report.diagnosis?.findings as AxiomReportFinding[]).forEach((finding, index) => {
    addSubheading(`Finding ${String(index + 1).padStart(2, "0")}: ${finding.title}`);
    addParagraph(finding.observation);
    addCallout("Implication", finding.implication);
    addCallout("Recommended response", finding.recommended_response);
    addSubheading("Evidence");
    addList(finding.evidence);
  });

  addLightPage("current workflow", "Workflow map and constraints");
  addCallout("Workflow purpose", report.current_state?.workflow_purpose);
  addSubheading("Current workflow map");
  addList(report.current_state?.current_workflow_map);
  addSubheading("Tools and systems");
  addList(report.current_state?.tools_and_systems);
  addSubheading("Human roles");
  addList(report.current_state?.human_roles);
  addSubheading("Known constraints");
  addList(report.current_state?.known_constraints);

  addSectionDivider("control model", "Automation, AI support, and risk gates", "This section separates safe AI support from areas that should remain human-controlled.");
  addLightPage("automation suitability", "Automation boundaries");
  addParagraph(report.automation_suitability?.summary);
  addSubheading("Suitable now");
  addList(report.automation_suitability?.suitable_now);
  addSubheading("Suitable later");
  addList(report.automation_suitability?.suitable_later);
  addSubheading("Not recommended");
  addList(report.automation_suitability?.not_recommended);
  addCallout("Reasoned boundary", report.automation_suitability?.reasoned_boundary, true);

  addLightPage("AI support map", "Assistant opportunity map");
  safeArray(report.assistant_opportunity_map as AxiomAssistantOpportunity[]).forEach((item, index) => {
    addSubheading(`${String(index + 1).padStart(2, "0")}: ${item.workflow_step}`);
    addCallout("Assistant role", item.assistant_role);
    addSubheading("Suitable tasks");
    addList(item.suitable_tasks);
    addSubheading("Must not do");
    addList(item.must_not_do);
    addCallout("Review gate", item.review_gate, true);
  });

  addLightPage("risk review", "Human gates");
  addCallout("Human review level", report.risk_review?.human_review_level);
  safeArray(report.risk_review?.review_gates as AxiomRiskReviewGate[]).forEach((gate, index) => {
    addSubheading(`${String(index + 1).padStart(2, "0")}: ${gate.risk}`);
    addCallout("Level", gate.level);
    addCallout("Why it matters", gate.why_it_matters);
    addCallout("Review gate", gate.review_gate, true);
  });

  addSectionDivider("future operating model", "Future workflow and implementation plan", "The final report layer translates diagnosis into a controlled next sequence.");
  addLightPage("future workflow", "Improved workflow shape");
  addParagraph(report.future_state?.summary);
  safeArray(report.future_state?.workflow_steps as AxiomFutureWorkflowStep[]).forEach((step, index) => {
    addSubheading(`${String(index + 1).padStart(2, "0")}: ${step.step}`);
    addKeyValueGrid([
      ["Owner", step.owner],
      ["Output", step.output],
      ["AI support", step.ai_support],
      ["Human review", step.human_review],
    ]);
  });

  addLightPage("implementation plan", "Priority sequence");
  addActionList("Immediate actions", report.implementation_plan?.immediate_actions);
  addActionList("Next 30 days", report.implementation_plan?.next_30_days);
  addActionList("Later actions", report.implementation_plan?.later_actions);

  addLightPage("context", "Assumptions and missing information");
  addSubheading("Assumptions");
  addList(report.diagnosis?.assumptions);
  addSubheading("Missing information");
  addList(report.diagnosis?.missing_information);

  addLightPage("final brief", "Upgrade recommendation and client action brief");
  addCallout("Upgrade recommendation", report.upgrade_recommendation?.recommendation);
  addCallout("Why now or why not", report.upgrade_recommendation?.why_now_or_why_not);
  addSubheading("Evidence");
  addList(report.upgrade_recommendation?.evidence);
  addSubheading("First priority");
  addParagraph(report.client_action_brief?.first_priority);
  addSubheading("Next 7 days");
  addList(report.client_action_brief?.next_7_days);
  addSubheading("Next 30 days");
  addList(report.client_action_brief?.next_30_days);
  addSubheading("Do not automate yet");
  addList(report.client_action_brief?.do_not_automate_yet);
  addSubheading("Decision points");
  addList(report.client_action_brief?.decision_points_for_client);
  addSubheading("Where Axiom can help next");
  addList(report.client_action_brief?.where_axiom_can_help_next);

  const range = doc.bufferedPageRange();
  for (let index = range.start; index < range.start + range.count; index += 1) {
    doc.switchToPage(index);
    drawFooter(index + 1, range.count);
  }

  doc.end();
  return pdfPromise;
}
