import fs from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";
import {
  formatProposalMoney,
  getProposalPaymentTerms,
  getProposalPricing,
  type ProposalDraftRecord,
} from "./axiom-proposal-drafts";
import { getProposalPreset } from "./axiom-proposal-presets";

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
const footerY = 780;
const pageTotal = 3;

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

export function sanitizeProposalText(value: unknown, fallback = "") {
  if (value === null || value === undefined) {
    return fallback;
  }

  return String(value)
    .normalize("NFKC")
    .replace(/[Ð�]/g, "")
    .replace(/[\uFFFD]/g, "")
    .replace(/[“”]/g, "\"")
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/\u00a0/g, " ")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim() || fallback;
}

function truncateText(value: unknown, maxLength: number, fallback = "To be confirmed.") {
  const text = sanitizeProposalText(value, fallback);

  if (text.length <= maxLength) {
    return text;
  }

  const shortened = text.slice(0, maxLength - 1);
  const cleanBreak = Math.max(shortened.lastIndexOf("."), shortened.lastIndexOf(" "), shortened.lastIndexOf("\n"));
  const safe = cleanBreak > maxLength * 0.65 ? shortened.slice(0, cleanBreak) : shortened;
  return `${safe.trim().replace(/[.,;:]+$/, "")}...`;
}

function safeText(value: unknown, fallback = "To be confirmed.") {
  return sanitizeProposalText(value, fallback);
}

function listFromJson(value: unknown, limit = 6) {
  const items = Array.isArray(value) ? value : [];

  return items
    .map((item) => truncateText(typeof item === "string" ? item : JSON.stringify(item), 180, ""))
    .filter(Boolean)
    .slice(0, limit);
}

function formatDate(value?: string | null) {
  if (!value) {
    return "To be confirmed";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "To be confirmed";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
  }).format(date);
}

function routeLabel(value?: string | null) {
  const preset = getProposalPreset(value);
  return preset?.label || safeText(value, "Recommended service").replace(/[-_]+/g, " ");
}

function drawGrid(doc: PDFKit.PDFDocument, dark = false) {
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
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

function drawFooter(doc: PDFKit.PDFDocument, pageNumber: number) {
  const pageWidth = doc.page.width;

  doc.save();
  doc
    .moveTo(pageMargin, footerY - 10)
    .lineTo(pageWidth - pageMargin, footerY - 10)
    .lineWidth(0.5)
    .strokeColor("#CFE0CF")
    .stroke();
  doc
    .font("Helvetica-Bold")
    .fontSize(7)
    .fillColor(colours.muted)
    .text("Axiom Architect | Proposal", pageMargin, footerY, { width: 260 });
  doc
    .font("Helvetica")
    .fontSize(7)
    .fillColor(colours.muted)
    .text(`${pageNumber} / ${pageTotal}`, pageWidth - 120, footerY, {
      width: 76,
      align: "right",
    });
  doc.restore();
}

function startLightPage(doc: PDFKit.PDFDocument, pageNumber: number, kicker: string, heading: string) {
  const pageWidth = doc.page.width;
  const contentWidth = pageWidth - pageMargin * 2;

  doc.rect(0, 0, pageWidth, doc.page.height).fill(colours.pale);
  drawGrid(doc, false);
  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .fillColor(colours.mintDark)
    .text(kicker.toUpperCase(), pageMargin, 46, { characterSpacing: 1.5 });
  doc
    .font("Helvetica-Bold")
    .fontSize(23)
    .fillColor(colours.text)
    .text(heading.toUpperCase(), pageMargin, 63, {
      width: contentWidth,
      lineGap: 1,
    });
  doc
    .moveTo(pageMargin, 106)
    .lineTo(pageWidth - pageMargin, 106)
    .lineWidth(1)
    .strokeColor(colours.mint)
    .stroke();
  drawFooter(doc, pageNumber);
}

function box(
  doc: PDFKit.PDFDocument,
  x: number,
  y: number,
  width: number,
  height: number,
  label: string,
  body: string,
  options: { dark?: boolean; bodySize?: number; labelColour?: string } = {},
) {
  const dark = options.dark === true;

  doc.save();
  doc.rect(x, y, width, height).fill(dark ? colours.panel : "#F8FCF7");
  doc.rect(x, y, width, height).lineWidth(0.8).strokeColor(dark ? "#2D432F" : colours.line).stroke();
  doc
    .font("Helvetica-Bold")
    .fontSize(7)
    .fillColor(options.labelColour || (dark ? colours.mint : colours.mintDark))
    .text(label.toUpperCase(), x + 13, y + 12, {
      width: width - 26,
      characterSpacing: 1.1,
    });
  doc
    .font("Helvetica")
    .fontSize(options.bodySize || 9.2)
    .fillColor(dark ? colours.ink : colours.text)
    .text(body, x + 13, y + 30, {
      width: width - 26,
      height: height - 40,
      lineGap: 2,
      ellipsis: true,
    });
  doc.restore();
}

function keyValue(
  doc: PDFKit.PDFDocument,
  x: number,
  y: number,
  width: number,
  label: string,
  value: string,
  dark = false,
) {
  doc
    .font("Helvetica-Bold")
    .fontSize(6.7)
    .fillColor(dark ? colours.mint : colours.mintDark)
    .text(label.toUpperCase(), x, y, {
      width,
      characterSpacing: 1.05,
    });
  doc
    .font("Helvetica-Bold")
    .fontSize(9.5)
    .fillColor(dark ? colours.ink : colours.text)
    .text(truncateText(value, 96, "To be confirmed."), x, y + 14, {
      width,
      height: 28,
      lineGap: 1,
      ellipsis: true,
    });
}

function bullets(
  doc: PDFKit.PDFDocument,
  items: string[],
  x: number,
  y: number,
  width: number,
  label: string,
  maxItems: number,
) {
  const cleanItems = items.length > 0 ? items.slice(0, maxItems) : ["To be confirmed."];

  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .fillColor(colours.mintDark)
    .text(label.toUpperCase(), x, y, { width, characterSpacing: 1.1 });

  let cursorY = y + 20;

  cleanItems.forEach((item) => {
    doc.rect(x, cursorY + 4, 5, 5).fill(colours.mintDark);
    doc
      .font("Helvetica")
      .fontSize(8.6)
      .fillColor(colours.text)
      .text(truncateText(item, 180, ""), x + 16, cursorY, {
        width: width - 16,
        height: 30,
        lineGap: 2,
        ellipsis: true,
      });
    cursorY += 34;
  });
}

export async function generateAxiomProposalPdf(proposal: ProposalDraftRecord) {
  const pricing = getProposalPricing(proposal.pricing_json);
  const paymentTerms = getProposalPaymentTerms(proposal.payment_terms_json);
  const clientName = safeText(proposal.client_name, "Axiom client");
  const businessName = safeText(proposal.business_name, "Client organisation");
  const workspaceName = safeText(proposal.workspace_name, "Proposal workspace");
  const recommendedRoute = routeLabel(proposal.recommended_service_route);
  const validUntil = formatDate(proposal.valid_until);
  const reference = safeText(proposal.proposal_reference, proposal.id);
  const finalTotal = pricing.final_total ? formatProposalMoney(pricing.final_total) : "To be confirmed";
  const depositRequired = pricing.deposit_required ? formatProposalMoney(pricing.deposit_required) : "To be confirmed";
  const balanceDue = pricing.balance_amount ? formatProposalMoney(pricing.balance_amount) : "To be confirmed";
  const paymentTermsText = [paymentTerms.payment_schedule, paymentTerms.payment_instructions]
    .map((item) => sanitizeProposalText(item, ""))
    .filter(Boolean)
    .join("\n\n");
  const title = `${businessName} - ${recommendedRoute} Proposal`;
  const doc = new PDFDocument({
    size: "A4",
    margin: pageMargin,
    autoFirstPage: true,
    bufferPages: true,
    info: {
      Title: title,
      Author: "Axiom Architect",
      Subject: "Client proposal",
      Creator: "Axiom Architect",
    },
  });
  const pdfPromise = collectPdfBuffer(doc);
  const logo = brandLogoPath();
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  const contentWidth = pageWidth - pageMargin * 2;
  const columnGap = 16;
  const columnWidth = (contentWidth - columnGap) / 2;

  doc.rect(0, 0, pageWidth, pageHeight).fill(colours.charcoal);
  drawGrid(doc, true);

  if (logo) {
    doc.image(logo, pageMargin, 42, { width: 42 });
  }

  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor(colours.mint)
    .text("AXIOM ARCHITECT", pageMargin, 102, { characterSpacing: 2.1 });
  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor("#CFE0CF")
    .text("THE ARCHITECTURE BEHIND INTELLIGENT WORK", pageMargin, 120, { characterSpacing: 1.2 });
  doc.rect(pageMargin, 152, contentWidth, 2).fill(colours.mint);
  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .fillColor(colours.mint)
    .text(`PREPARED FOR ${clientName.toUpperCase()}`, pageMargin, 176, {
      width: contentWidth,
      characterSpacing: 1.3,
    });
  doc
    .font("Helvetica-Bold")
    .fontSize(34)
    .fillColor(colours.white)
    .text("PROPOSAL SUMMARY", pageMargin, 205, {
      width: contentWidth,
      lineGap: -2,
    });
  doc
    .font("Helvetica-Bold")
    .fontSize(22)
    .fillColor("#DCEADC")
    .text(businessName.toUpperCase(), pageMargin, 251, {
      width: contentWidth,
      height: 58,
      lineGap: -1,
      ellipsis: true,
    });

  const metaY = 334;
  doc.rect(pageMargin, metaY, contentWidth, 118).fill(colours.panel);
  doc.rect(pageMargin, metaY, contentWidth, 118).lineWidth(1).strokeColor("#2D432F").stroke();
  doc.rect(pageMargin, metaY, 5, 118).fill(colours.mint);
  keyValue(doc, pageMargin + 22, metaY + 22, columnWidth - 16, "Workspace", workspaceName, true);
  keyValue(doc, pageMargin + columnWidth + columnGap, metaY + 22, columnWidth - 16, "Recommended route", recommendedRoute, true);
  keyValue(doc, pageMargin + 22, metaY + 68, columnWidth - 16, "Reference", reference, true);
  keyValue(doc, pageMargin + columnWidth + columnGap, metaY + 68, columnWidth - 16, "Valid until", validUntil, true);

  box(doc, pageMargin, 474, columnWidth, 104, "Client situation", truncateText(proposal.client_summary, 650), { dark: true });
  box(doc, pageMargin + columnWidth + columnGap, 474, columnWidth, 104, "Recommended route", truncateText(proposal.client_price_explanation || proposal.scope_summary, 520), { dark: true });
  box(doc, pageMargin, 598, columnWidth, 86, "Desired outcome", truncateText(proposal.desired_outcome, 650), { dark: true });
  box(doc, pageMargin + columnWidth + columnGap, 598, columnWidth, 86, "Investment", finalTotal, { dark: true, bodySize: 20 });
  drawFooter(doc, 1);

  doc.addPage();
  startLightPage(doc, 2, "scope and deliverables", "What is included");
  box(doc, pageMargin, 126, contentWidth, 88, "Scope summary", truncateText(proposal.scope_summary, 500), { bodySize: 9.4 });
  bullets(doc, listFromJson(proposal.included_work_json, 6), pageMargin, 242, columnWidth, "Included work", 6);
  bullets(doc, listFromJson(proposal.deliverables_json, 6), pageMargin + columnWidth + columnGap, 242, columnWidth, "Deliverables", 6);
  bullets(doc, listFromJson(proposal.timeline_json, 5), pageMargin, 514, columnWidth, "Timeline", 5);
  bullets(doc, listFromJson(proposal.client_responsibilities_json, 5), pageMargin + columnWidth + columnGap, 514, columnWidth, "Client responsibilities", 5);

  doc.addPage();
  startLightPage(doc, 3, "terms and next step", "Commercial terms");
  box(doc, pageMargin, 126, contentWidth, 86, "Payment terms", truncateText(paymentTermsText, 500), { bodySize: 9.4 });
  box(doc, pageMargin, 232, columnWidth, 86, "Deposit required", depositRequired, { bodySize: 18 });
  box(doc, pageMargin + columnWidth + columnGap, 232, columnWidth, 86, "Balance due before final delivery", balanceDue, { bodySize: 18 });
  bullets(doc, listFromJson(proposal.exclusions_json, 6), pageMargin, 350, contentWidth, "Exclusions", 6);
  box(
    doc,
    pageMargin,
    608,
    contentWidth,
    74,
    "Next step",
    "To proceed, reply to this proposal or confirm acceptance through the Axiom Architect client workspace when enabled.",
    { dark: true, bodySize: 10.2 },
  );
  box(
    doc,
    pageMargin,
    704,
    contentWidth,
    54,
    "Closing note",
    `This proposal is valid until ${validUntil}. Axiom Architect will keep the engagement focused on the agreed scope, clear review points, and practical outputs that support safer intelligent work.`,
    { bodySize: 9 },
  );

  doc.end();
  return pdfPromise;
}
