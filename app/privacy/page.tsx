import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Axiom Architect Client Data & Workflow Intake",
  description:
    "Privacy information for Axiom Architect users, clients, workflow intake submissions, account records, orders, reports, contact forms, analytics, and service delivery data.",
  keywords: [
    "Axiom Architect privacy policy",
    "workflow intake data",
    "client account records",
    "workflow report data",
    "AI workflow service privacy",
    "service delivery records",
    "contact form privacy",
  ],
  alternates: {
    canonical: "/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const sections = [
  {
    title: "1. Information we collect",
    text: [
      "Axiom Architect collects information you provide when you contact us, create an account, buy a service, submit a workflow intake, request support, or communicate with us about a project.",
      "This may include your name, email address, business name, role, payment status, account details, selected service, workflow descriptions, tools used, pain points, desired outcomes, support messages, and service delivery records.",
    ],
  },
  {
    title: "2. Workflow and project information",
    text: [
      "Workflow submissions can include operational details about your process, tool stack, risks, review requirements, handoffs, repeated tasks, and business context. Please only submit information you are authorised to share.",
      "Do not place passwords, payment card details, private access tokens, unnecessary personal data, or highly sensitive information inside free-text workflow fields.",
    ],
  },
  {
    title: "3. How we use information",
    text: [
      "We use information to provide the service, process orders, manage accounts, respond to enquiries, prepare workflow diagnostics, produce reports, deliver files, send service messages, improve the site, prevent misuse, and maintain business records.",
      "We may use submitted workflow information to prepare recommendations, automation suitability notes, review gate structures, operating blueprints, and related service outputs.",
    ],
  },
  {
    title: "4. Payments and service providers",
    text: [
      "Payments are processed through Stripe. Axiom Architect does not need to store full payment card numbers on its own systems.",
      "We may use service providers such as hosting, database, authentication, email delivery, payment, analytics, and operational tools to run the service. Providers are used to support delivery, security, communication, and business administration.",
    ],
  },
  {
    title: "5. Contact forms and email",
    text: [
      "When you send a contact form or support request, we use the information to read, route, and respond to your message. The message may be handled through email delivery and support tools used by Axiom Architect.",
      "You should avoid including unnecessary confidential data in a general contact form. Project-sensitive details are better provided through the appropriate intake or agreed delivery channel.",
    ],
  },
  {
    title: "6. Account, order, and report records",
    text: [
      "We keep records needed to operate the service, including account status, order status, product selected, intake status, report status, and service correspondence.",
      "These records help us deliver purchased services, provide support, manage refunds or service questions, and maintain an accurate operational history.",
    ],
  },
  {
    title: "7. Cookies and analytics",
    text: [
      "The site may use cookies or similar technologies for basic site operation, account sessions, security, checkout flow, analytics, and service improvement. More detail is provided in the Cookie Policy.",
    ],
  },
  {
    title: "8. Sharing information",
    text: [
      "We do not sell your personal information. We may share information with service providers who help us operate the site, process payments, manage data, send email, provide support, or deliver the service.",
      "We may also disclose information if required by law, to protect the service, to prevent misuse, or to enforce applicable terms.",
    ],
  },
  {
    title: "9. Retention",
    text: [
      "We keep information for as long as needed to provide services, maintain business records, resolve disputes, meet legal or tax obligations, protect the service, and support client history.",
      "If you want to ask about deletion or access to your information, contact us at hello@axiom-architect.co. Some records may need to be retained where required for legitimate business, legal, security, or accounting reasons.",
    ],
  },
  {
    title: "10. Contact",
    text: [
      "Privacy questions can be sent to hello@axiom-architect.co.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_34%,#000_76%)] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto max-w-[1120px]">
          <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
            Data handling
          </p>
          <h1 className="mt-6 max-w-5xl text-[clamp(2.7rem,6vw,5.7rem)] font-black uppercase leading-[0.9] tracking-[-0.075em] text-white">
            Privacy Policy
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#e6f6e7]/80 sm:text-xl">
            How Axiom Architect handles contact details, account records, orders, workflow intake information, and report delivery data.
          </p>
          <p className="mt-6 text-sm font-bold uppercase tracking-[0.16em] text-[#9ed39f]/86">
            Last updated: 17 May 2026
          </p>
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1120px] gap-5">
          {sections.map((section) => (
            <article key={section.title} className="border border-[#9ed39f]/28 bg-[#030804] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.24)] sm:p-7">
              <h2 className="text-2xl font-black uppercase tracking-[-0.04em] text-white">
                {section.title}
              </h2>
              <div className="mt-4 grid gap-4 text-base leading-8 text-[#e6f6e7]/76">
                {section.text.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
