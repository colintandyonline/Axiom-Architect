import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Axiom Workflow Audit | Axiom Architect",
  description:
    "Choose an Axiom Workflow Audit tier and turn messy workflows into diagnostics, automation opportunities, review gates, and implementation blueprints.",
};

const tiers = [
  {
    name: "Workflow Audit",
    slug: "workflow-audit",
    price: "$49",
    later: "Later $79-$99",
    badge: "Entry diagnostic",
    href: "/signup?tier=workflow-audit",
    description:
      "One workflow reviewed, scored, and mapped for automation and AI suitability.",
    delivery: "24-72 hours during beta",
    items: [
      "One workflow submission",
      "Workflow diagnosis",
      "Bottlenecks and friction points",
      "Automation suitability score",
      "AI opportunity map",
      "Risk and review notes",
      "Actionable next steps",
      "Branded PDF report",
    ],
  },
  {
    name: "Workflow Blueprint",
    slug: "workflow-blueprint",
    price: "$149",
    later: "Later $249-$349",
    badge: "Recommended",
    href: "/signup?tier=workflow-blueprint",
    featured: true,
    description:
      "The audit plus a practical implementation plan for improving the workflow.",
    delivery: "3-5 business days during beta",
    items: [
      "Everything in Workflow Audit",
      "Future-state workflow design",
      "Step-by-step implementation plan",
      "Recommended AI assistant roles",
      "Review gate structure",
      "Tool stack recommendations",
      "30-day implementation sequence",
    ],
  },
  {
    name: "Custom Operating Pack",
    slug: "custom-operating-pack",
    price: "$399",
    later: "Later $750-$1,500+",
    badge: "Premium beta",
    href: "/contact?tier=custom-operating-pack",
    description:
      "A complete operating system for one workflow, built for founders, consultants, and teams.",
    delivery: "5-10 business days during beta",
    items: [
      "Everything in Workflow Blueprint",
      "Custom operating protocol",
      "Custom agent instruction kit",
      "Implementation workbook",
      "Copy/paste AI instruction blocks",
      "Team handoff guide",
      "Optional review call later",
    ],
  },
];

const steps = [
  "Start audit",
  "Choose tier",
  "Create account",
  "Pay securely",
  "Submit workflow",
  "Receive report",
];

const diagnosisAreas = [
  "Workflow purpose",
  "Current process",
  "Handoffs and tools",
  "Bottlenecks",
  "AI opportunities",
  "Review gates",
];

const deliverables = [
  "Workflow diagnosis",
  "Friction map",
  "Automation suitability score",
  "AI opportunity notes",
  "Risk and review guidance",
  "Implementation next steps",
  "Premium PDF report",
];

const faqs = [
  {
    question: "Why not go straight to checkout?",
    answer:
      "The audit is a diagnostic service. This page explains the value, scope, tiers, and delivery expectation before the client commits.",
  },
  {
    question: "Why create an account before payment?",
    answer:
      "The account keeps the selected tier, payment record, workflow intake, status updates, and final report connected securely.",
  },
  {
    question: "What happens after payment?",
    answer:
      "The client completes a staged workflow intake covering business context, current process, pain points, risk, and desired outcome.",
  },
  {
    question: "Is this fully automated yet?",
    answer:
      "Early beta delivery may include review while the automated report engine matures. The product flow is designed for Stripe, Supabase, Resend, and report delivery.",
  },
];

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.68rem] font-black uppercase tracking-[0.22em] text-black">
      {children}
    </p>
  );
}

export default function AuditPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <section className="relative overflow-hidden border-b border-[#9ed39f]/25 bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.22),#041008_34%,#000_76%)] px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pb-28 lg:pt-32">
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto max-w-[1440px]">
          <a
            href="/"
            className="inline-flex border border-[#9ed39f]/35 bg-black/60 px-4 py-3 text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black"
          >
            Back to Axiom Architect
          </a>

          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div>
              <Badge>Start your audit</Badge>
              <h1 className="mt-6 max-w-5xl text-[clamp(3rem,7vw,7rem)] font-black uppercase leading-[0.88] tracking-[-0.08em] text-white">
                Choose the right workflow diagnostic.
              </h1>
            </div>

            <div className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.32)] sm:p-8">
              <p className="text-xl leading-9 text-[#e7ffe8] sm:text-2xl">
                Axiom Workflow Audit turns messy workflows into structured diagnostics, automation opportunities, human review gates, and practical implementation blueprints.
              </p>
              <p className="mt-6 text-base leading-8 text-white/72">
                This is a professional diagnostic service, not a prompt pack. Choose the depth you need, create an account, pay securely, then complete a staged workflow intake.
              </p>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {steps.map((step, index) => (
              <div key={step} className="border border-[#9ed39f]/28 bg-[#061008] px-4 py-4">
                <span className="block text-[0.58rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">
                  Step {index + 1}
                </span>
                <span className="mt-2 block text-xs font-bold uppercase tracking-[0.14em] text-white">
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#9ed39f]/20 bg-[#9ed39f] px-4 py-16 text-black sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="inline-flex border border-black bg-black px-3 py-2 text-[0.68rem] font-black uppercase tracking-[0.22em] text-[#9ed39f]">
              What gets diagnosed
            </p>
            <h2 className="mt-5 text-[clamp(2.6rem,5vw,5.4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em]">
              From messy process to AI-ready operating system.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-black/76 sm:text-lg">
              The audit maps the workflow as a system: inputs, decisions, handoffs, tools, bottlenecks, risks, review gates, and implementation options.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {diagnosisAreas.map((item) => (
              <div key={item} className="border border-black/24 bg-[#b8efb9]/45 px-5 py-5 text-sm font-black uppercase tracking-[0.14em]">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#9ed39f]/20 bg-[linear-gradient(135deg,#07190c_0%,#020503_44%,#000_100%)] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <Badge>What you receive</Badge>
            <h2 className="mt-5 text-[clamp(2.45rem,5vw,5.2rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">
              A report that gives the workflow structure.
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {deliverables.map((item) => (
              <div key={item} className="border border-[#9ed39f]/28 bg-[#061008] px-5 py-5 text-sm font-black uppercase tracking-[0.14em] text-[#eaffeb]">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#9ed39f]/25 bg-black px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <Badge>Audit tiers</Badge>
              <h2 className="mt-5 text-[clamp(2.6rem,5vw,5.6rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">
                Start with diagnosis. Scale into implementation.
              </h2>
            </div>
            <p className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5 text-base leading-8 text-[#e7ffe8] sm:text-lg">
              Beta pricing gives early clients access to the workflow diagnostic system before the full dashboard and automated reporting stack is live.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 xl:grid-cols-3">
            {tiers.map((tier) => (
              <article
                key={tier.slug}
                className={
                  tier.featured
                    ? "border border-[#9ed39f] bg-[#9ed39f] p-6 text-black shadow-[0_0_44px_rgba(158,211,159,0.24)] sm:p-7"
                    : "border border-[#9ed39f]/34 bg-[linear-gradient(135deg,#0b2211_0%,#030804_72%,#000_100%)] p-6 text-white shadow-[0_18px_54px_rgba(0,0,0,0.24)] sm:p-7"
                }
              >
                <p
                  className={
                    tier.featured
                      ? "inline-flex border border-black bg-black px-3 py-2 text-[0.64rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]"
                      : "inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.64rem] font-black uppercase tracking-[0.2em] text-black"
                  }
                >
                  {tier.badge}
                </p>

                <div className="mt-6 flex items-end justify-between gap-5">
                  <h3 className="text-3xl font-black uppercase tracking-[-0.04em]">
                    {tier.name}
                  </h3>
                  <p className="text-4xl font-black tracking-[-0.06em]">{tier.price}</p>
                </div>

                <p className={tier.featured ? "mt-6 text-base leading-7 text-black/78" : "mt-6 text-base leading-7 text-[#ddf4de]/78"}>
                  {tier.description}
                </p>

                <div className={tier.featured ? "mt-5 border border-black/22 bg-black/8 p-4" : "mt-5 border border-[#9ed39f]/24 bg-[#9ed39f]/8 p-4"}>
                  <p className="text-sm font-bold uppercase tracking-[0.13em]">Delivery: {tier.delivery}</p>
                  <p className={tier.featured ? "mt-2 text-xs font-bold uppercase tracking-[0.13em] text-black/55" : "mt-2 text-xs font-bold uppercase tracking-[0.13em] text-white/45"}>
                    {tier.later}
                  </p>
                </div>

                <ul className="mt-7 space-y-3">
                  {tier.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6">
                      <span className={tier.featured ? "mt-1.5 h-2 w-2 shrink-0 bg-black" : "mt-1.5 h-2 w-2 shrink-0 bg-[#9ed39f]"} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={tier.href}
                  className={
                    tier.featured
                      ? "mt-8 inline-flex min-h-14 w-full items-center justify-center border border-black bg-black px-6 text-center text-[0.72rem] font-black uppercase tracking-[0.22em] text-[#9ed39f] transition hover:bg-white hover:text-black"
                      : "mt-8 inline-flex min-h-14 w-full items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-6 text-center text-[0.72rem] font-black uppercase tracking-[0.22em] text-black transition hover:bg-white"
                  }
                >
                  {tier.slug === "custom-operating-pack" ? "Request Availability" : "Choose This Tier"}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#9ed39f]/20 bg-[#9ed39f] px-4 py-16 text-black sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 md:grid-cols-4">
          {[
            ["01", "Create your Axiom Architect account"],
            ["02", "Pay securely through Stripe"],
            ["03", "Complete the staged workflow intake"],
            ["04", "Receive status updates and report delivery"],
          ].map(([number, text]) => (
            <div key={number} className="border border-black/24 bg-[#b8efb9]/45 p-5">
              <p className="text-[0.72rem] font-black uppercase tracking-[0.24em]">{number}</p>
              <p className="mt-6 text-lg font-black uppercase tracking-[-0.03em]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[linear-gradient(135deg,#07190c_0%,#020503_45%,#000_100%)] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[1100px]">
          <Badge>FAQ / Trust notes</Badge>
          <div className="mt-8 divide-y divide-[#9ed39f]/18 border border-[#9ed39f]/30 bg-[#041008]">
            {faqs.map((item) => (
              <details key={item.question} className="group p-5 sm:p-6">
                <summary className="cursor-pointer list-none text-lg font-black uppercase tracking-[-0.02em] text-white">
                  {item.question}
                </summary>
                <p className="mt-4 max-w-3xl text-base leading-8 text-[#ddf4de]/78">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>

          <div className="mt-10 border border-[#9ed39f] bg-[#9ed39f] p-6 text-black sm:p-8">
            <h2 className="text-3xl font-black uppercase leading-none tracking-[-0.05em] sm:text-5xl">
              Ready to turn one workflow into a structured plan?
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-black/76 sm:text-lg">
              Start with the tier that matches the level of implementation guidance you want. The recommended beta starting point is Workflow Blueprint.
            </p>
            <a
              href="/signup?tier=workflow-blueprint"
              className="mt-7 inline-flex min-h-14 items-center justify-center border border-black bg-black px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.22em] text-[#9ed39f] transition hover:bg-white hover:text-black"
            >
              Choose Workflow Blueprint
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
