import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AxiomSiteHeader } from "../../components/AxiomSiteHeader";
import { ProductSystemVisual } from "../../components/ProductSystemVisual";

export const metadata: Metadata = {
  title: "Axiom Workflow Audit | Axiom Architect",
  description:
    "Choose an Axiom Architect product and turn messy workflows into diagnostics, blueprints, operating packs, retainers, ecosystem maps, or guided deployments.",
};

const tiers = [
  {
    name: "Workflow Audit",
    slug: "workflow-audit",
    price: "$49",
    label: "Launch diagnostic",
    href: "/signup?tier=workflow-audit",
    summary:
      "Diagnose one workflow and identify bottlenecks, AI opportunities, risks, and practical next steps.",
    delivery: "Report generated after intake",
    includes: [
      "One workflow submission",
      "Current workflow diagnosis",
      "Bottlenecks and friction points",
      "Automation suitability score",
      "Assistant opportunity map",
      "Risk and review notes",
      "Actionable next steps",
      "Branded PDF report",
    ],
  },
  {
    name: "Workflow Blueprint",
    slug: "workflow-blueprint",
    price: "$149",
    label: "Recommended",
    href: "/signup?tier=workflow-blueprint",
    featured: true,
    summary:
      "Turn the audit into a practical implementation plan with review gates, assistant roles, tool recommendations, and a 30-day sequence.",
    delivery: "Report generated after intake",
    includes: [
      "Everything in Workflow Audit",
      "Future-state workflow design",
      "Step-by-step implementation plan",
      "Recommended assistant roles",
      "Review gate structure",
      "Tool stack recommendations",
      "30-day implementation sequence",
    ],
  },
  {
    name: "Custom Operating Pack",
    slug: "custom-operating-pack",
    price: "$399",
    label: "Premium buildout",
    href: "/signup?tier=custom-operating-pack",
    summary:
      "Build the full workflow system: protocol, assistant instructions, workbook assets, handoff guidance, and quality-control checkpoints.",
    delivery: "Report generated after intake",
    includes: [
      "Everything in Workflow Blueprint",
      "Custom operating protocol",
      "Custom agent instruction kit",
      "Implementation workbook",
      "Copy/paste instruction blocks",
      "Team handoff guide",
      "Optional review call later",
    ],
  },
  {
    name: "Workflow Stewardship",
    slug: "workflow-stewardship",
    price: "$299/mo",
    label: "Ongoing optimisation",
    href: "/signup?tier=workflow-stewardship",
    summary:
      "Quarterly recalibration and performance tuning for AI-supported workflows that need ongoing review and improvement.",
    delivery: "Monthly retainer after intake",
    includes: [
      "Quarterly audit of active workflows",
      "Error logging and bottleneck analysis",
      "Priority access for logic updates",
      "Bi-annual tool stack reassessment",
      "Performance efficiency dashboard",
      "Ongoing email support for minor workflow questions",
    ],
  },
  {
    name: "Departmental Ecosystem",
    slug: "departmental-ecosystem",
    price: "$999",
    label: "Multi-workflow system",
    href: "/signup?tier=departmental-ecosystem",
    summary:
      "Map and connect up to five core workflows into one shared operating model for a team, department, or scaling unit.",
    delivery: "Ecosystem report after intake",
    includes: [
      "Up to five core workflow maps",
      "Cross-departmental handoff logic",
      "Centralised data source strategy",
      "Interdependency mapping",
      "Universal Axiom documentation guide",
      "Master implementation roadmap for the quarter",
    ],
  },
  {
    name: "Architect Residency",
    slug: "architect-residency",
    price: "$2,499+",
    label: "High-touch deployment",
    href: "/signup?tier=architect-residency",
    summary:
      "High-touch implementation partnership for guided deployment, workshops, training, technical oversight, and custom system design.",
    delivery: "Residency intake and deployment scope",
    includes: [
      "Live remote implementation workshop",
      "On-site available by arrangement",
      "Legacy system integration planning",
      "Team-wide training and onboarding",
      "First-run live operations oversight",
      "Private edge functions or APIs where required",
      "1:1 leadership strategy sessions",
    ],
  },
] as const;

const flowSteps = [
  "Choose tier",
  "Enter details",
  "Secure payment",
  "Dashboard opens",
  "Submit workflow",
  "Receive report",
];

const diagnosisAreas = [
  "Workflow purpose",
  "Current process",
  "Inputs and outputs",
  "Handoffs and tools",
  "Bottlenecks",
  "Assistant opportunities",
  "Automation suitability",
  "Review gates",
];

const deliverables = [
  {
    title: "Diagnostic map",
    text: "A clear view of how the workflow currently moves, where it slows down, and where control is missing.",
    visual: "workflow-audit",
  },
  {
    title: "Opportunity model",
    text: "A practical read on what assistants can prepare, summarise, route, draft, or support without taking over judgement.",
    visual: "custom-operating-pack",
  },
  {
    title: "Implementation path",
    text: "A sequence of next moves so the workflow can become more structured without creating operational risk.",
    visual: "workflow-blueprint",
  },
] as const;

const faqs = [
  {
    question: "What happens after I buy?",
    answer:
      "You are taken to your dashboard, where you complete the intake matched to the product you purchased. Once submitted, the report or delivery workspace is queued.",
  },
  {
    question: "What should I submit?",
    answer:
      "Submit the real workflow, department, system, or operating challenge attached to the product you selected. The more specific the input, the better the report.",
  },
  {
    question: "What should automation never decide?",
    answer:
      "The intake and report highlight where human approval, brand judgement, legal review, financial control, or client-facing decisions should stay protected.",
  },
  {
    question: "Where do I complete the intake?",
    answer:
      "Your dashboard opens after payment. That is where you enter the product-specific details, track status, and access the final deliverable.",
  },
];

function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <p
      className={
        dark
          ? "inline-flex border border-black bg-black px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-[#9ed39f]"
          : "inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black"
      }
    >
      {children}
    </p>
  );
}

function TierCard({ tier }: { tier: (typeof tiers)[number] }) {
  return (
    <article className="group relative overflow-hidden rounded-[2rem] border border-[#9ed39f]/35 bg-[#030804] p-5 text-white shadow-[0_24px_70px_rgba(0,0,0,0.28)] transition duration-200 hover:border-black hover:bg-[#9ed39f] hover:text-black hover:shadow-[0_0_70px_rgba(158,211,159,0.24)] sm:p-6">
      <ProductSystemVisual kind={tier.slug} />
      <div className="mt-6 flex items-start justify-between gap-5">
        <div>
          <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.2em] text-black transition duration-200 group-hover:border-black group-hover:bg-black group-hover:text-[#9ed39f]">
            {tier.label}
          </p>
          <h3 className="mt-5 text-2xl font-black uppercase tracking-[-0.04em] sm:text-3xl">
            {tier.name}
          </h3>
        </div>
        <p className="text-4xl font-black tracking-[-0.06em]">{tier.price}</p>
      </div>

      <p className="mt-5 text-base leading-7 text-[#e6f6e7]/78 transition duration-200 group-hover:text-black/74">
        {tier.summary}
      </p>

      <div className="mt-5 border border-[#9ed39f]/24 bg-[#9ed39f]/8 p-4 transition duration-200 group-hover:border-black/20 group-hover:bg-black/8">
        <p className="text-sm font-bold uppercase tracking-[0.13em]">{tier.delivery}</p>
      </div>

      <ul className="mt-6 space-y-3">
        {tier.includes.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6">
            <span className="mt-1.5 h-2 w-2 shrink-0 bg-[#9ed39f] transition duration-200 group-hover:bg-black" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <a
          href={`/products/${tier.slug}`}
          className="inline-flex min-h-14 w-full items-center justify-center border border-[#9ed39f]/45 bg-black px-6 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition duration-200 hover:border-black hover:bg-white hover:text-black group-hover:!border-black group-hover:!bg-white group-hover:!text-black"
        >
          Learn more
        </a>
        <a
          href={tier.href}
          className="inline-flex min-h-14 w-full items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-6 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition duration-200 hover:bg-black hover:text-white group-hover:!border-black group-hover:!bg-black group-hover:!text-white"
        >
          {tier.slug === "architect-residency" ? "Start residency" : "Buy now"}
        </a>
      </div>
    </article>
  );
}

export default function AuditPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <AxiomSiteHeader />

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_36%,#000_78%)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <Eyebrow>Start your audit</Eyebrow>
            <h1 className="mt-6 max-w-5xl text-[clamp(2.7rem,6vw,5.9rem)] font-black uppercase leading-[0.9] tracking-[-0.075em] text-white">
              Choose the right workflow diagnostic.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#e6f6e7]/80 sm:text-xl">
              Turn messy workflows into structured diagnostics, implementation blueprints, operating packs, stewardship cycles, ecosystem maps, or guided deployment plans.
            </p>
          </div>

          <div className="grid gap-5">
            <ProductSystemVisual kind="departmental-ecosystem" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {flowSteps.map((step, index) => (
                <div key={step} className="border border-[#9ed39f]/28 bg-[#061008]/88 px-4 py-4">
                  <span className="block text-[0.56rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">0{index + 1}</span>
                  <span className="mt-2 block text-xs font-black uppercase tracking-[0.12em] text-white">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#9ed39f]/20 bg-[#9ed39f] px-4 py-14 text-black sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <Eyebrow dark>What gets diagnosed</Eyebrow>
            <h2 className="mt-5 max-w-4xl text-[clamp(2.1rem,4vw,3.8rem)] font-black uppercase leading-[0.92] tracking-[-0.06em]">
              The workflow gets mapped before anything gets automated.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-black/72 sm:text-lg">
              Axiom Architect looks at the operating pattern first: inputs, decisions, handoffs, tools, risks, and outcomes.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {diagnosisAreas.map((item) => (
              <div key={item} className="rounded-2xl border border-black/22 bg-[#b8efb9]/45 px-5 py-5 text-sm font-black uppercase tracking-[0.13em]">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <Eyebrow>What you receive</Eyebrow>
              <h2 className="mt-5 max-w-4xl text-[clamp(2.15rem,4vw,3.9rem)] font-black uppercase leading-[0.92] tracking-[-0.06em] text-white">
                A premium report, not another loose prompt list.
              </h2>
            </div>
            <p className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5 text-base leading-8 text-[#e6f6e7]/78 sm:text-lg">
              The output is designed to help you brief a team, improve a process, configure assistants, or decide whether a deeper system build makes sense.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {deliverables.map((item) => (
              <article key={item.title} className="rounded-[2rem] border border-[#9ed39f]/34 bg-[#030804] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.24)] sm:p-6">
                <ProductSystemVisual kind={item.visual} />
                <h3 className="mt-6 text-2xl font-black uppercase tracking-[-0.04em] text-white">{item.title}</h3>
                <p className="mt-4 text-base leading-8 text-[#e6f6e7]/76">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="tiers" className="border-y border-[#9ed39f]/20 bg-[linear-gradient(135deg,#07190c_0%,#020503_42%,#000_100%)] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <Eyebrow>Product ladder</Eyebrow>
              <h2 className="mt-5 max-w-4xl text-[clamp(2.15rem,4vw,3.9rem)] font-black uppercase leading-[0.92] tracking-[-0.06em] text-white">
                Start with diagnosis. Scale into implementation.
              </h2>
            </div>
            <p className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5 text-base leading-8 text-[#e6f6e7]/78 sm:text-lg">
              Choose the level of scope: one workflow, one full operating pack, ongoing stewardship, a departmental system, or a high-touch residency.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {tiers.map((tier) => (
              <TierCard key={tier.slug} tier={tier} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <Eyebrow>Trust notes</Eyebrow>
            <h2 className="mt-5 text-[clamp(2.1rem,4vw,3.7rem)] font-black uppercase leading-[0.92] tracking-[-0.06em] text-white">
              Clear scope before commitment.
            </h2>
          </div>
          <div className="divide-y divide-[#9ed39f]/18 overflow-hidden rounded-[2rem] border border-[#9ed39f]/30 bg-[#041008]">
            {faqs.map((item) => (
              <details key={item.question} className="group p-5 sm:p-6">
                <summary className="cursor-pointer list-none text-base font-black uppercase tracking-[0.04em] text-white sm:text-lg">
                  {item.question}
                </summary>
                <p className="mt-4 max-w-3xl text-base leading-8 text-[#e6f6e7]/76">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#9ed39f] px-4 py-14 text-black sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <Eyebrow dark>Recommended path</Eyebrow>
            <h2 className="mt-5 max-w-4xl text-[clamp(2.2rem,4vw,4rem)] font-black uppercase leading-[0.92] tracking-[-0.06em]">
              Start with Workflow Blueprint.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-black/74 sm:text-lg">
              It gives you the diagnostic plus the implementation structure needed to turn the findings into a usable operating plan.
            </p>
          </div>
          <a href="/signup?tier=workflow-blueprint" className="inline-flex min-h-14 items-center justify-center border border-black bg-black px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black sm:min-w-72">
            Buy now
          </a>
        </div>
      </section>
    </main>
  );
}
