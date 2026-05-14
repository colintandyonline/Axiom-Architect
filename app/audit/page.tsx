import Image from "next/image";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Axiom Workflow Audit | Axiom Architect",
  description:
    "Choose an Axiom Workflow Audit tier and turn one messy workflow into a clear operating blueprint for AI-supported execution.",
};

const tiers = [
  {
    name: "Workflow Audit",
    slug: "workflow-audit",
    price: "$49",
    label: "Launch diagnostic",
    href: "/signup?tier=workflow-audit",
    summary:
      "For one workflow that needs clarity, scoring, and a practical next-step plan.",
    delivery: "24-72 hours",
    motif: "checklist",
    includes: [
      "One workflow submission",
      "Current workflow diagnosis",
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
    label: "Recommended",
    href: "/signup?tier=workflow-blueprint",
    featured: true,
    summary:
      "For a stronger plan: diagnosis, future-state design, sequence, roles, and review gates.",
    delivery: "3-5 business days",
    motif: "layers",
    includes: [
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
    label: "Premium buildout",
    href: "/contact?tier=custom-operating-pack",
    summary:
      "For a complete operating system around one workflow, with reusable instructions and handoff assets.",
    delivery: "5-10 business days",
    motif: "radar",
    includes: [
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

const flowSteps = [
  "Choose tier",
  "Create account",
  "Pay securely",
  "Submit workflow",
  "Track status",
  "Receive report",
];

const diagnosisAreas = [
  "Workflow purpose",
  "Current process",
  "Inputs and outputs",
  "Handoffs and tools",
  "Bottlenecks",
  "AI opportunities",
  "Automation suitability",
  "Review gates",
];

const deliverables = [
  {
    title: "Diagnostic map",
    text: "A clear view of how the workflow currently moves, where it slows down, and where control is missing.",
    motif: "checklist",
  },
  {
    title: "Opportunity model",
    text: "A practical read on what AI can prepare, summarise, route, draft, or support without taking over judgement.",
    motif: "radar",
  },
  {
    title: "Implementation path",
    text: "A sequence of next moves so the workflow can become more structured without creating operational risk.",
    motif: "layers",
  },
];

const faqs = [
  {
    question: "Why begin with an audit page?",
    answer:
      "Because this is a diagnostic service. The page gives the client scope, value, tier choice, and delivery expectations before they commit.",
  },
  {
    question: "What should I submit?",
    answer:
      "One real workflow, process, tool stack, handoff, or operating problem. The more specific the workflow, the better the report.",
  },
  {
    question: "Does AI make the final decisions?",
    answer:
      "No. The audit identifies where AI can support work and where human approval, brand judgement, legal review, or financial control should remain in place.",
  },
  {
    question: "What happens after payment?",
    answer:
      "You complete a staged intake. Your submission is then reviewed and turned into a report, with status updates as the service layer matures.",
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

function SystemMotif({ kind = "layers" }: { kind?: string }) {
  return (
    <div className="relative flex min-h-[230px] items-center justify-center overflow-hidden rounded-[2rem] border border-[#9ed39f]/55 bg-[#061008]/78 p-6 shadow-[inset_0_0_80px_rgba(158,211,159,0.05)]">
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.14)_1px,transparent_1px)] [background-size:34px_34px]" />
      <svg
        viewBox="0 0 420 260"
        className="relative h-full min-h-[190px] w-full max-w-[420px] text-[#9ed39f]"
        fill="none"
        aria-hidden="true"
      >
        {kind === "radar" ? (
          <>
            <rect x="48" y="24" width="324" height="212" rx="18" stroke="currentColor" strokeWidth="2" opacity="0.75" />
            <circle cx="210" cy="130" r="86" stroke="currentColor" strokeWidth="2" />
            <circle cx="210" cy="130" r="54" stroke="currentColor" strokeWidth="2" opacity="0.75" />
            <circle cx="210" cy="130" r="20" stroke="currentColor" strokeWidth="3" />
            <path d="M210 44v172M124 130h172M149 69l122 122M271 69 149 191" stroke="currentColor" strokeWidth="1.6" opacity="0.72" />
            {["210,44", "296,130", "210,216", "124,130", "271,69", "149,69", "271,191", "149,191"].map((point) => {
              const [cx, cy] = point.split(",");
              return <circle key={point} cx={cx} cy={cy} r="8" fill="currentColor" />;
            })}
          </>
        ) : kind === "checklist" ? (
          <>
            <rect x="52" y="26" width="316" height="208" rx="18" stroke="currentColor" strokeWidth="2" opacity="0.75" />
            <rect x="108" y="26" width="204" height="208" rx="12" stroke="currentColor" strokeWidth="2.4" />
            {[70, 115, 160].map((y, index) => (
              <g key={y}>
                <rect x="132" y={y - 13} width="26" height="26" rx="4" stroke="currentColor" strokeWidth="2.4" />
                {index !== 1 ? <path d={`M138 ${y}l7 7 16-18`} stroke="currentColor" strokeWidth="2.6" /> : null}
                <path d={`M178 ${y - 4}h104M178 ${y + 13}h72`} stroke="currentColor" strokeWidth="2" opacity="0.8" />
              </g>
            ))}
          </>
        ) : (
          <>
            <rect x="44" y="34" width="332" height="192" rx="18" stroke="currentColor" strokeWidth="2" opacity="0.75" />
            <rect x="126" y="76" width="92" height="118" rx="8" stroke="currentColor" strokeWidth="2.4" opacity="0.7" />
            <rect x="158" y="96" width="92" height="118" rx="8" stroke="currentColor" strokeWidth="2.4" opacity="0.85" />
            <rect x="190" y="118" width="92" height="118" rx="8" stroke="currentColor" strokeWidth="2.8" />
            <path d="M92 116h36M92 146h36M92 176h36M282 154h54" stroke="currentColor" strokeWidth="2" opacity="0.75" />
            <circle cx="350" cy="154" r="13" stroke="currentColor" strokeWidth="3" />
            <path d="M208 154h50M208 178h38M208 202h74" stroke="currentColor" strokeWidth="2.1" opacity="0.85" />
          </>
        )}
      </svg>
    </div>
  );
}

function TierCard({ tier }: { tier: (typeof tiers)[number] }) {
  return (
    <article
      className={
        tier.featured
          ? "relative overflow-hidden rounded-[2rem] border border-[#9ed39f] bg-[#9ed39f] p-5 text-black shadow-[0_0_60px_rgba(158,211,159,0.22)] sm:p-6"
          : "relative overflow-hidden rounded-[2rem] border border-[#9ed39f]/35 bg-[#030804] p-5 text-white shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-6"
      }
    >
      <SystemMotif kind={tier.motif} />
      <div className="mt-6 flex items-start justify-between gap-5">
        <div>
          <p
            className={
              tier.featured
                ? "inline-flex border border-black bg-black px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]"
                : "inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.2em] text-black"
            }
          >
            {tier.label}
          </p>
          <h3 className="mt-5 text-2xl font-black uppercase tracking-[-0.04em] sm:text-3xl">
            {tier.name}
          </h3>
        </div>
        <p className="text-4xl font-black tracking-[-0.06em]">{tier.price}</p>
      </div>

      <p className={tier.featured ? "mt-5 text-base leading-7 text-black/76" : "mt-5 text-base leading-7 text-[#e6f6e7]/78"}>
        {tier.summary}
      </p>

      <div className={tier.featured ? "mt-5 border border-black/20 bg-black/8 p-4" : "mt-5 border border-[#9ed39f]/24 bg-[#9ed39f]/8 p-4"}>
        <p className="text-sm font-bold uppercase tracking-[0.13em]">Delivery: {tier.delivery}</p>
      </div>

      <ul className="mt-6 space-y-3">
        {tier.includes.map((item) => (
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
            ? "mt-8 inline-flex min-h-14 w-full items-center justify-center border border-black bg-black px-6 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black"
            : "mt-8 inline-flex min-h-14 w-full items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-6 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white"
        }
      >
        {tier.slug === "custom-operating-pack" ? "Request availability" : "Choose this tier"}
      </a>
    </article>
  );
}

export default function AuditPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <section className="relative overflow-hidden border-b border-[#9ed39f]/20 bg-[#020503] px-4 py-6 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.12)_1px,transparent_1px)] [background-size:38px_38px]" />
        <div className="relative mx-auto flex max-w-[1440px] items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-3">
            <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden border border-[#9ed39f]/40 bg-black">
              <Image src="/brand/axiom-logo.png" alt="" width={48} height={48} className="h-full w-full object-contain" />
            </span>
            <span>
              <span className="block text-sm font-black uppercase tracking-[0.24em]">Axiom Architect</span>
              <span className="hidden text-[0.68rem] uppercase tracking-[0.2em] text-[#9ed39f]/80 sm:block">Workflow diagnostic service</span>
            </span>
          </a>
          <a href="#tiers" className="inline-flex min-h-11 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-4 text-[0.68rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white sm:px-6">
            View tiers
          </a>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_36%,#000_78%)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <Eyebrow>Start your audit</Eyebrow>
            <h1 className="mt-6 max-w-5xl text-[clamp(2.7rem,6vw,5.9rem)] font-black uppercase leading-[0.9] tracking-[-0.075em] text-white">
              Choose the right workflow diagnostic.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#e6f6e7]/80 sm:text-xl">
              Turn one messy workflow into a clear operating blueprint: what to improve, where AI belongs, what needs review, and what to implement next.
            </p>
          </div>

          <div className="grid gap-5">
            <SystemMotif kind="radar" />
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
                <SystemMotif kind={item.motif} />
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
              <Eyebrow>Audit tiers</Eyebrow>
              <h2 className="mt-5 max-w-4xl text-[clamp(2.15rem,4vw,3.9rem)] font-black uppercase leading-[0.92] tracking-[-0.06em] text-white">
                Start with diagnosis. Scale into implementation.
              </h2>
            </div>
            <p className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5 text-base leading-8 text-[#e6f6e7]/78 sm:text-lg">
              Workflow Blueprint is the clearest starting point for most clients because it turns the audit into a practical implementation sequence.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 xl:grid-cols-3">
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
            Choose Workflow Blueprint
          </a>
        </div>
      </section>
    </main>
  );
}
