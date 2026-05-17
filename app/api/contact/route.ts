import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ContactPayload = {
  name: string;
  email: string;
  business: string;
  inquiryType: string;
  subject: string;
  message: string;
};

function cleanField(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function getAppUrl(request: Request) {
  return (
    process.env.APP_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    new URL(request.url).origin
  );
}

function redirectToContact(request: Request, state: "sent" | "error") {
  const url = new URL("/contact", getAppUrl(request));
  url.searchParams.set(state, "1");
  return NextResponse.redirect(url, 303);
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getRecipient(inquiryType: string) {
  const defaultRecipient = process.env.CONTACT_TO_EMAIL || "hello@axiom-architect.co";
  const supportRecipient = process.env.CONTACT_SUPPORT_EMAIL || defaultRecipient;
  const projectsRecipient = process.env.CONTACT_PROJECTS_EMAIL || defaultRecipient;

  if (inquiryType.toLowerCase().includes("support")) {
    return supportRecipient;
  }

  if (
    inquiryType.toLowerCase().includes("blueprint") ||
    inquiryType.toLowerCase().includes("operating") ||
    inquiryType.toLowerCase().includes("ecosystem") ||
    inquiryType.toLowerCase().includes("residency") ||
    inquiryType.toLowerCase().includes("stewardship")
  ) {
    return projectsRecipient;
  }

  return defaultRecipient;
}

function buildEmailHtml(payload: ContactPayload) {
  const rows = [
    ["Name", payload.name],
    ["Email", payload.email],
    ["Business", payload.business || "Not supplied"],
    ["Enquiry type", payload.inquiryType],
    ["Subject", payload.subject],
  ];

  return `
    <div style="font-family:Arial,sans-serif;background:#020503;color:#f7fff7;padding:32px;line-height:1.6;">
      <div style="max-width:720px;margin:0 auto;border:1px solid rgba(158,211,159,0.45);padding:28px;background:#061008;">
        <p style="margin:0 0 18px 0;color:#9ed39f;text-transform:uppercase;letter-spacing:0.18em;font-size:12px;font-weight:800;">Axiom Architect contact enquiry</p>
        <h1 style="margin:0 0 24px 0;font-size:28px;line-height:1.1;color:#ffffff;">${escapeHtml(payload.subject)}</h1>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          ${rows
            .map(
              ([label, value]) => `
                <tr>
                  <td style="border-top:1px solid rgba(158,211,159,0.2);padding:12px 10px;color:#9ed39f;font-size:12px;text-transform:uppercase;letter-spacing:0.12em;font-weight:800;width:170px;">${escapeHtml(label)}</td>
                  <td style="border-top:1px solid rgba(158,211,159,0.2);padding:12px 10px;color:#ffffff;">${escapeHtml(value)}</td>
                </tr>
              `,
            )
            .join("")}
        </table>
        <div style="border:1px solid rgba(158,211,159,0.25);padding:18px;background:#000000;">
          <p style="margin:0 0 10px 0;color:#9ed39f;text-transform:uppercase;letter-spacing:0.14em;font-size:12px;font-weight:800;">Message</p>
          <div style="white-space:pre-wrap;color:#f7fff7;">${escapeHtml(payload.message)}</div>
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function sendWithResend(payload: ContactPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || "Axiom Architect <hello@axiom-architect.co>";
  const to = getRecipient(payload.inquiryType);

  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: payload.email,
      subject: `Axiom Architect enquiry: ${payload.subject}`,
      html: buildEmailHtml(payload),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend request failed: ${response.status} ${errorText}`);
  }
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const honeypot = cleanField(formData, "company_website");

  if (honeypot) {
    return redirectToContact(request, "sent");
  }

  const payload: ContactPayload = {
    name: cleanField(formData, "name"),
    email: cleanField(formData, "email"),
    business: cleanField(formData, "business"),
    inquiryType: cleanField(formData, "inquiry_type"),
    subject: cleanField(formData, "subject"),
    message: cleanField(formData, "message"),
  };

  if (
    !payload.name ||
    !payload.email ||
    !isValidEmail(payload.email) ||
    !payload.inquiryType ||
    !payload.subject ||
    !payload.message
  ) {
    return redirectToContact(request, "error");
  }

  try {
    await sendWithResend(payload);
    return redirectToContact(request, "sent");
  } catch (error) {
    console.error("Axiom contact form failed", error);
    return redirectToContact(request, "error");
  }
}

export function GET(request: Request) {
  return NextResponse.redirect(new URL("/contact", getAppUrl(request)), 303);
}
