import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Axiom Architect",
  description:
    "Terms for using Axiom Architect, purchasing workflow audits, ordering blueprints, and engaging digital workflow architecture services.",
};

const sections = [
  {
    title: "1. What these terms cover",
    text: [
      "These Terms of Service apply when you visit Axiom Architect, create an account, submit a workflow intake, purchase a digital service, or contact us about workflow architecture services.",
      "Axiom Architect provides workflow diagnostics, operating blueprints, implementation plans, custom operating packs, retainers, and related advisory or implementation services. The service is designed to support better operational decisions, not to replace your own business judgement, legal advice, financial advice, compliance review, or professional responsibilities.",
    ],
  },
  {
    title: "2. Purchases and payment",
    text: [
      "Paid services may be purchased through Stripe checkout or another approved payment process. Prices, package details, and billing terms are shown before purchase.",
      "Workflow Audit, Workflow Blueprint, Custom Operating Pack, Departmental Ecosystem, and Architect Residency services are generally sold as one-time service purchases unless stated otherwise. Workflow Stewardship is sold as a subscription or retainer-style service when offered through subscription checkout.",
      "You are responsible for providing accurate billing details, contact details, and the information needed to deliver the service.",
    ],
  },
  {
    title: "3. Client responsibilities",
    text: [
      "You are responsible for the accuracy of the workflow information, business context, files, links, and instructions you submit. The quality and usefulness of the output depends on the quality of the intake.",
      "You must not submit confidential information you are not authorised to share, unlawful material, third-party secrets, payment card details inside free-text fields, or content that infringes another person’s rights.",
      "You remain responsible for reviewing any recommendations before applying them inside your business, team, client work, software tools, or automation stack.",
    ],
  },
  {
    title: "4. Digital service delivery",
    text: [
      "Axiom Architect delivers digital service outputs such as reports, blueprint pages, files, written recommendations, implementation plans, and service correspondence. Delivery may happen through your account, email, dashboard, shared links, or another agreed method.",
      "Delivery times are estimates unless a specific delivery date is agreed in writing. More complex services may require clarification, additional information, or staged review before completion.",
    ],
  },
  {
    title: "5. Accounts and access",
    text: [
      "Some services require an account or dashboard access. You are responsible for keeping your login details secure and for telling us promptly if you believe your account has been accessed without permission.",
      "We may restrict access where we reasonably believe an account is being misused, payment has failed, a security issue exists, or these terms have been breached.",
    ],
  },
  {
    title: "6. Use of outputs",
    text: [
      "After full payment, you may use the delivered service output inside your own business or organisation for internal planning, implementation, training, and workflow improvement.",
      "You must not resell Axiom Architect reports, templates, written systems, or custom outputs as standalone products unless we agree that in writing.",
    ],
  },
  {
    title: "7. No guaranteed business outcome",
    text: [
      "Axiom Architect provides structured workflow analysis and practical recommendations. We do not guarantee revenue growth, cost savings, automation performance, compliance outcomes, software performance, or any specific commercial result.",
      "Any implementation decision remains your responsibility, especially where changes affect staff, customers, regulated activity, contracts, data handling, or business-critical operations.",
    ],
  },
  {
    title: "8. Third-party services",
    text: [
      "Axiom Architect may use trusted service providers for payment processing, hosting, customer records, email delivery, authentication, analytics, or operational tooling. These providers help us run the service but do not control your business decisions or workflow implementation.",
      "If we recommend a third-party tool, platform, or integration, you are responsible for checking its suitability, terms, pricing, data handling, and security before using it.",
    ],
  },
  {
    title: "9. Changes to these terms",
    text: [
      "We may update these terms as the service develops. The version published on this page is the version that applies from the date it is posted, unless a separate written agreement applies to a specific project.",
    ],
  },
  {
    title: "10. Contact",
    text: [
      "Questions about these terms can be sent to hello@axiom-architect.co.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_34%,#000_76%)] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto max-w-[1120px]">
          <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
            Legal framework
          </p>
          <h1 className="mt-6 max-w-5xl text-[clamp(2.7rem,6vw,5.7rem)] font-black uppercase leading-[0.9] tracking-[-0.075em] text-white">
            Terms of Service
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#e6f6e7]/80 sm:text-xl">
            Practical terms for using Axiom Architect, buying workflow architecture services, and submitting operational information for review.
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
