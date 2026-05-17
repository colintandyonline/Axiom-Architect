import { createHash } from "crypto";
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

type ContactMeta = {
  ipAddress: string;
  userAgent: string;
  fingerprint: string;
};

const allowedInquiryTypes = new Set([
  "Workflow Audit",
  "Workflow Blueprint",
  "Custom Operating Pack",
  "Workflow Stewardship",
  "Departmental Ecosystem",
  "Architect Residency",
  "Support",
  "General enquiry",
]);

const blockedPhrases = [
  "remote access",
  "nigerian prince",
  "crypto investment",
  "casino",
  "viagra",
  "loan approval",
  "free money",
  "seo backlinks",
  "guest post",
  "forex",
  "telegram",
  "whatsapp only",
  "recover your funds",
  "hack",
  "malware",
  "porn",
  "adult dating",
];

function cleanField(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

function cleanMessage(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim().replace(/\r\n/g, "\n") : "";
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
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 180;
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const vercelIp = request.headers.get("x-vercel-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return (forwardedFor || vercelIp || realIp || "unknown").split(",")[0].trim();
}

function createFingerprint(payload: ContactPayload, ipAddress: string) {
  return createHash("sha256")
    .update([
      payload.email.toLowerCase(),
      payload.subject.toLowerCase(),
      payload.message.toLowerCase(),
      ipAddress,
    ].join("|"))
    .digest("hex");
}

function hasTooManyLinks(message: string) {
  const linkMatches = message.match(/https?:\/\/|www\.|\.com|\.net|\.org|\.info|\.xyz/gi);
  return (linkMatches?.length || 0) > 2;
}

function hasRepeatedNoise(value: string) {
  return /(.)\1{9,}/.test(value) || /\b([a-z]{3,})\b(?:\s+\1\b){4,}/i.test(value);
}

function containsBlockedPhrase(payload: ContactPayload) {
  const combined = `${payload.name} ${payload.business} ${payload.subject} ${payload.message}`.toLowerCase();
  return blockedPhrases.some((phrase) => combined.includes(phrase));
}

function isMessageQualityValid(payload: ContactPayload) {
  const wordCount = payload.message.split(/\s+/).filter(Boolean).length;

  if (payload.name.length < 2 || payload.name.length > 140) {
    return false;
  }

  if (payload.business.length > 180 || payload.subject.length < 6 || payload.subject.length > 180) {
    return false;
  }

  if (payload.message.length < 40 || payload.message.length > 4500 || wordCount < 8) {
    return false;
  }

  if (!allowedInquiryTypes.has(payload.inquiryType)) {
    return false;
  }

  if (hasTooManyLinks(payload.message) || hasRepeatedNoise(payload.message) || containsBlockedPhrase(payload)) {
    return false;
  }

  return true;
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

function buildEmailHtml(payload: ContactPayload, meta: ContactMeta) {
  const rows = [
    ["Name", payload.name],
    ["Email", payload.email],
    ["Business", payload.business || "Not supplied"],
    ["Enquiry type", payload.inquiryType],
    ["Subject", payload.subject],
    ["IP address", meta.ipAddress],
    ["User agent", meta.userAgent || "Not supplied"],
    ["Fingerprint", meta.fingerprint],
  ];

  return `
    <div style="font-family:Arial,sans-serif;background:#020503;color:#f7fff7;padding:32px;line-height:1.6;">
      <div style="max-width:760px;margin:0 auto;border:1px solid rgba(158,211,159,0.45);padding:28px;background:#061008;">
        <p style="margin:0 0 18px 0;color:#9ed39f;text-transform:uppercase;letter-spacing:0.18em;font-size:12px;font-weight:800;">Axiom Architect contact enquiry</p>
        <h1 style="margin:0 0 24px 0;font-size:28px;line-height:1.1;color:#ffffff;">${escapeHtml(payload.subject)}</h1>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          ${rows
            .map(
              ([label, value]) => `
                <tr>
                  <td style="border-top:1px solid rgba(158,211,159,0.2);padding:12px 10px;color:#9ed39f;font-size:12px;text-transform:uppercase;letter-spacing:0.12em;font-weight:800;width:170px;">${escapeHtml(label)}</td>
                  <td style="border-top:1px solid rgba(158,211,159,0.2);padding:12px 10px;color:#ffffff;word-break:break-word;">${escapeHtml(value)}</td>
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
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getCookieValue(request: Request, name: string) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

async function sendWithResend(payload: ContactPayload, meta: ContactMeta) {
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
      subject: `[${payload.inquiryType}] ${payload.subject}`,
      html: buildEmailHtml(payload, meta),
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
    console.warn("Axiom contact form honeypot triggered", {
      ipAddress: getClientIp(request),
      userAgent: request.headers.get("user-agent") || "",
    });
    return redirectToContact(request, "sent");
  }

  const payload: ContactPayload = {
    name: cleanField(formData, "name"),
    email: cleanField(formData, "email"),
    business: cleanField(formData, "business"),
    inquiryType: cleanField(formData, "inquiry_type"),
    subject: cleanField(formData, "subject"),
    message: cleanMessage(formData, "message"),
  };

  const ipAddress = getClientIp(request);
  const fingerprint = createFingerprint(payload, ipAddress);
  const lastFingerprint = getCookieValue(request, "axiom_contact_fp");
  const meta: ContactMeta = {
    ipAddress,
    userAgent: request.headers.get("user-agent") || "",
    fingerprint,
  };

  if (lastFingerprint && lastFingerprint === fingerprint) {
    console.warn("Axiom contact duplicate blocked", meta);
    return redirectToContact(request, "sent");
  }

  if (!payload.email || !isValidEmail(payload.email) || !isMessageQualityValid(payload)) {
    console.warn("Axiom contact form rejected", {
      ...meta,
      email: payload.email,
      inquiryType: payload.inquiryType,
      subjectLength: payload.subject.length,
      messageLength: payload.message.length,
    });
    return redirectToContact(request, "error");
  }

  try {
    await sendWithResend(payload, meta);
    const response = redirectToContact(request, "sent");
    response.cookies.set("axiom_contact_fp", fingerprint, {
      httpOnly: true,
      maxAge: 60 * 20,
      path: "/contact",
      sameSite: "lax",
      secure: true,
    });
    return response;
  } catch (error) {
    console.error("Axiom contact form failed", error);
    return redirectToContact(request, "error");
  }
}

export function GET(request: Request) {
  return NextResponse.redirect(new URL("/contact", getAppUrl(request)), 303);
}
