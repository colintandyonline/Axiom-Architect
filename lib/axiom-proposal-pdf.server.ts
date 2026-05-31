import fs from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";
import {
  formatProposalMoney,
  getProposalPaymentTerms,
  getProposalPricing,
  type ProposalDraftRecord,
} from "./axiom-proposal-drafts";

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

function safeText(value: unknown, fallback = "Not specified") {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed || fallback;
}

function listFromJson(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }

      return JSON.stringify(item);
    })
    .filter(Boolean);
}

function formatDate(value?: string | null) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function routeLabel(value?: string | null) {
  return safeText(value, "Not selected").replace(/[-_]+/g, " ");
}

export async function generateAxiomProposalPdf(proposal: ProposalDraftRecord) {
  const pricing = getProposalPricing(proposal.pricing_json);
  const paymentTerms = getProposalPaymentTerms(proposal.payment_terms_json);
  const clientName = safeText(proposal.client_name, "Axiom client");
  const businessName = safeText(proposal.business_name, "Client organisation");
  const workspaceName = safeText(proposal.workspace_name, "Proposal workspace");
  const recommendedRoute = routeLabel(proposal.recommended_service_route);
  const preparedDate = formatDate(new Date().toISOString());
  const validUntil = formatDate(proposal.valid_until);
  const reference = safeText(proposal.proposal_reference, proposal.id);
  const title = `${businessName} - ${workspaceName} - ${recommendedRoute} Proposal`;
  const doc = new PDFDocument({
    size: "A4",
    margin: pageMargin,
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
      .text("  |  PROPOSAL PREPARATION", { continued: false });
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

  function addLightPage(kicker: string, heading: string) {
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
      .text(heading.toUpperCase(), pageMargin, doc.y + 12, {
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
      addLightPage("continued", "Proposal detail");
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

  function addList(items: string[]) {
    if (items.length === 0) {
      addParagraph("No items recorded.");
      return;
    }

    items.forEach((item) => {
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
    const bodyHeight = doc.heightOfString(body, { width: contentWidth - 28, lineGap: 3 });
    const height = Math.max(72, bodyHeight + 46);
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
        .fontSize(10.5)
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
  doc.font("Helvetica-Bold").fontSize(8).fillColor(colours.mint).text(`PREPARED FOR ${clientName.toUpperCase()}`, pageMargin, 188, {
    width: contentWidth,
    characterSpacing: 1.4,
  });
  doc.font("Helvetica-Bold").fontSize(39).fillColor(colours.white).text(businessName.toUpperCase(), pageMargin, 218, {
    width: contentWidth,
    lineGap: -2,
  });
  doc.font("Helvetica-Bold").fontSize(31).fillColor("#DCEADC").text(workspaceName.toUpperCase(), pageMargin, doc.y + 4, {
    width: contentWidth,
    lineGap: -2,
  });
  doc.font("Helvetica-Bold").fontSize(25).fillColor(colours.white).text(`${recommendedRoute} Proposal`.toUpperCase(), pageMargin, doc.y + 5, {
    width: contentWidth,
    lineGap: -2,
  });

  const coverPanelY = 454;
  const coverPanelHeight = 150;
  doc.rect(pageMargin, coverPanelY, contentWidth, coverPanelHeight).fill(colours.panel);
  doc.rect(pageMargin, coverPanelY, contentWidth, coverPanelHeight).lineWidth(1).strokeColor("#2D432F").stroke();
  doc.rect(pageMargin, coverPanelY, 5, coverPanelHeight).fill(colours.mint);

  [
    ["CLIENT", clientName],
    ["BUSINESS", businessName],
    ["WORKSPACE", workspaceName],
    ["ROUTE", recommendedRoute],
    ["REFERENCE", reference],
    ["VALID UNTIL", validUntil],
  ].forEach(([key, value], index) => {
    const columnWidth = (contentWidth - 58) / 2;
    const x = pageMargin + 22 + (index % 2) * (columnWidth + 22);
    const y = coverPanelY + 23 + Math.floor(index / 2) * 42;
    doc.font("Helvetica-Bold").fontSize(7).fillColor(colours.mint).text(key, x, y, {
      width: columnWidth,
      characterSpacing: 1.35,
    });
    doc.font("Helvetica").fontSize(9.5).fillColor(colours.ink).text(value, x, y + 15, {
      width: columnWidth,
      lineGap: 2,
    });
  });

  doc.font("Helvetica").fontSize(8).fillColor("#AEBBAE").text("Admin-review proposal PDF. Not sent to client until proposal release is completed.", pageMargin, pageHeight - 72, {
    width: contentWidth,
  });

  addLightPage("control page", "Proposal control summary");
  addKeyValueGrid([
    ["Client", clientName],
    ["Business", businessName],
    ["Email", proposal.client_email],
    ["Proposal type", routeLabel(proposal.proposal_type)],
    ["Status", routeLabel(proposal.status)],
    ["Recommended route", recommendedRoute],
    ["Valid until", validUntil],
    ["Reference", reference],
  ]);

  addLightPage("client situation", "Client situation summary");
  addCallout("What we understand", proposal.client_summary || proposal.current_problem_summary);
  addCallout("Current problem summary", proposal.current_problem_summary);
  addCallout("Desired outcome", proposal.desired_outcome, true);

  addLightPage("recommended route", "Service route and commercial explanation");
  addKeyValueGrid([
    ["Recommended route", recommendedRoute],
    ["Alternative route", proposal.alternative_service_route ? routeLabel(proposal.alternative_service_route) : "Not proposed"],
  ]);
  addCallout("Client-facing price explanation", proposal.client_price_explanation);

  addLightPage("scope of work", "Included work and deliverables");
  addCallout("Scope summary", proposal.scope_summary);
  addSubheading("Included work");
  addList(listFromJson(proposal.included_work_json));
  addSubheading("Deliverables");
  addList(listFromJson(proposal.deliverables_json));
  addSubheading("Timeline");
  addList(listFromJson(proposal.timeline_json));
  addSubheading("Client responsibilities");
  addList(listFromJson(proposal.client_responsibilities_json));
  addSubheading("Assumptions");
  addList(listFromJson(proposal.assumptions_json));

  addLightPage("investment", "Investment and payment terms");
  addKeyValueGrid([
    ["Final total", formatProposalMoney(pricing.final_total)],
    ["Currency", "GBP"],
    ["Deposit required", formatProposalMoney(pricing.deposit_required)],
    ["Discount", pricing.discount_amount ? formatProposalMoney(pricing.discount_amount) : "No discount recorded"],
  ]);
  addCallout("Payment schedule", paymentTerms.payment_schedule || "Payment schedule to be confirmed before client release.");
  addCallout("Add-ons", pricing.add_ons_text || "No optional add-ons recorded.");

  addLightPage("scope boundary", "Exclusions and boundary notes");
  addSubheading("Exclusions");
  addList(listFromJson(proposal.exclusions_json));
  addCallout(
    "Important scope boundary",
    "This proposal covers only the work listed in the included scope and deliverables. Live automation deployment, third-party subscriptions, legal compliance review, custom software engineering, or ongoing monitoring are excluded unless specifically listed.",
    true,
  );

  addLightPage("next steps", "Review and next steps");
  addCallout("Proposal validity", `This proposal is valid until ${validUntil}.`);
  addCallout(
    "Admin-approved next step",
    "Once Axiom Architect marks this proposal ready to send, the client can be invited to review the proposal through the controlled client proposal flow.",
  );
  addCallout(
    "Acceptance placeholder",
    "Client acceptance, request-changes, email delivery, and Stripe conversion are intentionally not enabled in this PDF generation step.",
    true,
  );

  const range = doc.bufferedPageRange();
  for (let index = range.start; index < range.start + range.count; index += 1) {
    doc.switchToPage(index);
    drawFooter(index + 1, range.count);
  }

  doc.end();
  return pdfPromise;
}
