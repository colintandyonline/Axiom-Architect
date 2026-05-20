import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Axiom Architect | AI Workflow Architecture Methodology",
  description:
    "Learn how Axiom Architect designs AI-ready workflow architecture with diagnostics, operating blueprints, automation suitability, review gates, and structured implementation plans.",
  keywords: [
    "about Axiom Architect",
    "AI workflow architecture",
    "workflow architecture methodology",
    "business process architecture",
    "automation suitability",
    "human review gates",
    "AI operating systems",
    "operating blueprints",
    "Axiom Studio",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Axiom Architect | The Architecture Behind Intelligent Work",
    description:
      "Axiom Architect turns messy workflows into structured diagnostics, operating blueprints, review gates, and AI-ready implementation plans.",
    url: "https://www.axiom-architect.co/about",
    siteName: "Axiom Architect",
    type: "website",
    images: [
      {
        url: "/brand/axiom-architect-hero-banner.png",
        width: 1920,
        height: 1080,
        alt: "About Axiom Architect workflow architecture methodology",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Axiom Architect | AI Workflow Architecture",
    description:
      "A systems-focused workflow architecture service for diagnostics, automation suitability, review gates, and AI-ready operating models.",
    images: ["/brand/axiom-architect-hero-banner.png"],
  },
};

const principles = [
  {
    title: "Map before automation",
    text: "A workflow should be understood as a system before software, assistants, or automation rules are added.",
  },
  {
    title: "Protect human judgement",
    text: "AI can prepare, route, summarise, draft, and support. Decisions with risk need clear human review gates.",
  },
  {
    title: "Design for repeatability",
    text: "The goal is not a clever one-off prompt. The goal is a workflow people can repeat, inspect, and improve.",
  },
  {
    title: "Tools serve the operating model",
    text: "Axiom Architect starts with the workflow, then recommends tools, assistants, data routes, and controls that fit the system.",
  },
];

const buildAreas = [
  "Workflow diagnostics",
  "Operating blueprints",
  "Review gate design",
  "Assistant instruction kits",
  "Implementation workbooks",
  "Departmental operating systems",
];

function AxiomAboutVisual() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[#9ed39f]/38 bg-[#020503] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.38)] sm:p-7">
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(158,211,159,0.13)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.13)_1px,transparent_1px)] [background-size:38px_38px]" />
      <svg viewBox="0 0 720 520" className="relative h-auto w-full text-[#9ed39f]" fill="none" aria-hidden="true">
        <rect x="48" y="42" width="624" height="436" rx="28" stroke="currentColor" strokeWidth="2" opacity="0.62" />
        <rect x="104" y="92" width="512" height="336" rx="20" stroke="currentColor" strokeWidth="2" opacity="0.38" />
        <circle cx="360" cy="260" r="96" stroke="currentColor" strokeWidth="3" />
        <circle cx="360" cy="260" r="54" stroke="currentColor" strokeWidth="2" opacity="0.72" />
        <circle cx="360" cy="260" r="18" fill="currentColor" />
        <path d="M360 164v192M264 260h192M292 192l136 136M428 192 292 328" stroke="currentColor" strokeWidth="1.8" opacity="0.7" />
        {[
          [360, 118, "diagnose"],
          [502, 260, "review"],
          [360, 402, "operate"],
          [218, 260, "design"],
        ].map(([x, y, label]) => (
          <g key={label as string}>
            <circle cx={x as number} cy={y as number} r="34" stroke="currentColor" strokeWidth="2.5" />
            <circle cx={x as number} cy={y as number} r="8" fill="currentColor" />
            <path d={`M${x} ${y}L360 260`} stroke="currentColor" strokeWidth="1.8" opacity="0.5" />
          </g>
        ))}
        <rect x="96" y="82" width="132" height="50" rx="8" stroke="currentColor" strokeWidth="2" opacity="0.72" />
        <path d="M118 107h72M118 122h46" stroke="currentColor" strokeWidth="2" opacity="0.68" />
        <rect x="492" y="82" width="132" height="50" rx="8" stroke="currentColor" strokeWidth="2" opacity="0.72" />
        <path d="M514 107h72M514 122h46" stroke="currentColor" strokeWidth="2" opacity="0.68" />
        <rect x="96" y="388" width="132" height="50" rx="8" stroke="currentColor" strokeWidth="2" opacity="0.72" />
        <path d="M118 413h72M118 428h46" stroke="currentColor" strokeWidth="2" opacity="0.68" />
        <rect x="492" y="388" width="132" height="50" rx="8" stroke="currentColor" strokeWidth="2" opacity="0.72" />
        <path d="M514 413h72M514 428h46" stroke="currentColor" strokeWidth="2" opacity="0.68" />
      </svg>
    </div>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_34%,#000_76%)] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
              About Axiom Architect
            </p>
            <h1 className="mt-6 max-w-5xl text-[clamp(2.7rem,6vw,5.9rem)] font-black uppercase leading-[0.9] tracking-[-0.075em] text-white">
              The architecture behind intelligent work.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#e6f6e7]/80 sm:text-xl">
              Axiom Architect helps businesses turn scattered processes, unclear AI use, and tool overload into structured operating blueprints with the right review gates.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="/audit" className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white">
                Explore Workflow Audit
              </a>
              <a href="/contact" className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f]/38 bg-black px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-white transition hover:border-[#9ed39f] hover:text-[#9ed39f]">
                Contact Axiom
              </a>
            </div>
          </div>
          <AxiomAboutVisual />
        </div>
      </section>

      <section className="border-y border-[#9ed39f]/20 bg-[#9ed39f] px-4 py-14 text-black sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="inline-flex border border-black bg-black px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-[#9ed39f]">
              Studio to service layer
            </p>
            <h2 className="mt-5 max-w-4xl text-[clamp(2.1rem,4vw,3.9rem)] font-black uppercase leading-[0.92] tracking-[-0.06em]">
              Axiom Studio creates systems. Axiom Architect applies systems thinking to your workflow.
            </h2>
          </div>
          <p className="max-w-4xl text-base leading-8 text-black/76 sm:text-lg">
            Axiom Studio is the product and resource layer. Axiom Architect is the service layer: workflow diagnostics, AI suitability reviews, operating blueprints, implementation packs, and guided system design for real business operations.
          </p>
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
                Operating principles
              </p>
              <h2 className="mt-5 max-w-4xl text-[clamp(2.15rem,4vw,4rem)] font-black uppercase leading-[0.92] tracking-[-0.06em] text-white">
                AI belongs inside a designed workflow, not beside a broken process.
              </h2>
            </div>
            <p className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5 text-base leading-8 text-[#e6f6e7]/78 sm:text-lg">
              The work starts with clarity: what happens, who decides, where risk sits, what can be assisted, and what should stay human-led.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {principles.map((principle) => (
              <article key={principle.title} className="rounded-[2rem] border border-[#9ed39f]/30 bg-[#030804] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.24)] transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black">
                <span className="block h-2 w-2 bg-[#9ed39f]" />
                <h3 className="mt-8 text-2xl font-black uppercase tracking-[-0.04em]">{principle.title}</h3>
                <p className="mt-4 text-base leading-8 text-[#e6f6e7]/76 transition group-hover:text-black/74">{principle.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#9ed39f]/20 bg-[#041008] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
              What we build
            </p>
            <h2 className="mt-5 text-[clamp(2.1rem,4vw,3.7rem)] font-black uppercase leading-[0.92] tracking-[-0.06em] text-white">
              Practical architecture for AI-supported operations.
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {buildAreas.map((area) => (
              <div key={area} className="border border-[#9ed39f]/28 bg-black px-5 py-5 text-sm font-black uppercase tracking-[0.16em] text-white">
                {area}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#9ed39f] px-4 py-14 text-black sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="inline-flex border border-black bg-black px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-[#9ed39f]">
              Next step
            </p>
            <h2 className="mt-5 max-w-4xl text-[clamp(2.2rem,4vw,4rem)] font-black uppercase leading-[0.92] tracking-[-0.06em]">
              Start with one messy workflow.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-black/74 sm:text-lg">
              The fastest way to see the value is to submit a real workflow and turn it into a structured diagnostic and operating plan.
            </p>
          </div>
          <a href="/pricing" className="inline-flex min-h-14 items-center justify-center border border-black bg-black px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black sm:min-w-72">
            View Pricing
          </a>
        </div>
      </section>
    </main>
  );
}
