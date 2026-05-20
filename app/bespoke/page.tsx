import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bespoke AI Workflow Architecture | Axiom Architect",
  description:
    "Request a bespoke Axiom Architect proposal for custom AI workflow architecture, operating system design, automation boundaries, review gates, and Codex-ready implementation briefs.",
  keywords: [
    "bespoke AI workflow architecture",
    "custom workflow architecture",
    "AI operating system design",
    "workflow proposal",
    "Codex implementation brief",
    "automation suitability",
    "human review gates",
    "enterprise AI control stack",
  ],
  alternates: {
    canonical: "/bespoke",
  },
  openGraph: {
    title: "Bespoke AI Workflow Architecture | Axiom Architect",
    description:
      "Proposal-led custom workflow architecture for businesses that need guardrails before AI, automation, or Codex-assisted implementation begins.",
    url: "https://www.axiom-architect.co/bespoke",
    siteName: "Axiom Architect",
    type: "website",
    images: [
      {
        url: "/brand/axiom-architect-hero-banner.png",
        width: 1920,
        height: 1080,
        alt: "Bespoke AI workflow architecture by Axiom Architect",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bespoke AI Workflow Architecture | Axiom Architect",
    description:
      "Custom workflow architecture, proposal scoping, review gates, and guarded implementation planning.",
    images: ["/brand/axiom-architect-hero-banner.png"],
  },
};

const flowSteps = [
  {
    number: "01",
    title: "Structured request",
    text: "The client submits the workflow, current friction, tools involved, desired outcome, implementation risk, and guardrail requirements.",
  },
  {
    number: "02",
    title: "Proposal diagnosis",
    text: "Axiom Architect reviews the scope and decides the right proposal route before any implementation work is accepted.",
  },
  {
    number: "03",
    title: "Controlled proposal",
    text: "The proposal defines deliverables, exclusions, review gates, timeline, quote, implementation method, and acceptance criteria.",
  },
  {
    number: "04",
    title: "Guarded handoff",
    text: "Manual or Codex-assisted implementation only begins after the proposal is approved and the handoff guardrails are clear.",
  },
] as const;

const serviceRoutes = [
  {
    title: "Bespoke Workflow Architecture",
    text: "For one complex workflow that needs diagnosis, redesign, automation suitability, and a future-state operating blueprint.",
  },
  {
    title: "Bespoke AI Operating System",
    text: "For teams that need repeatable AI-supported work with assistant roles, handoff rules, review gates, and quality controls.",
  },
  {
    title: "Codex Implementation Brief",
    text: "For projects where code may be needed later. Axiom defines approved scope, allowed files, forbidden changes, tests, and QA standards first.",
  },
] as const;

const proposalControls = [
  "Client summary and workflow context",
  "Current-state diagnosis",
  "Recommended future-state system",
  "AI and automation suitability",
  "Human review gates",
  "Security and data guardrails",
  "Implementation method",
  "Out-of-scope boundaries",
  "Deliverables and acceptance criteria",
  "Timeline and quote",
] as const;

const formSignals = [
  "Workflow summary",
  "Current problem",
  "Tools involved",
  "People and approvals",
  "Desired outcome",
  "Scope type",
  "Support type",
  "Implementation risk",
  "Codex relevance",
  "Guardrails",
  "Timeline",
  "Budget range",
] as const;

export default function BespokePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_34%,#000_76%)] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <div>
            <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
              Bespoke proposal service
            </p>
            <h1 className="mt-6 max-w-5xl text-[clamp(2.65rem,6vw,5.9rem)] font-black uppercase leading-[0.9] tracking-[-0.075em] text-white">
              Custom workflow systems need scope before build.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#e6f6e7]/80 sm:text-xl">
              Axiom Architect turns a bespoke workflow request into a structured proposal before manual work, automation design, or Codex-assisted implementation begins.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="/bespoke/apply" className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white">
                Request bespoke proposal
              </a>
              <a href="/pricing" className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f]/38 bg-black px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-white transition hover:border-[#9ed39f] hover:text-[#9ed39f]">
                View fixed packages
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#9ed39f]/38 bg-[#020503] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.38)] sm:p-7">
            <p className="text-[0.66rem] font-black uppercase tracking-[0.22em] text-[#9ed39f]">
              Proposal intake model
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {formSignals.map((signal) => (
                <div key={signal} className="border border-[#9ed39f]/22 bg-black/60 px-4 py-4 text-xs font-black uppercase tracking-[0.14em] text-white">
                  {signal}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#9ed39f]/20 bg-[#9ed39f] px-4 py-14 text-black sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <p className="inline-flex border border-black bg-black px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-[#9ed39f]">
              Proposal first
            </p>
            <h2 className="mt-5 max-w-4xl text-[clamp(2.1rem,4vw,3.9rem)] font-black uppercase leading-[0.92] tracking-[-0.06em]">
              No vague AI build. No uncontrolled handoff.
            </h2>
          </div>
          <p className="max-w-4xl text-base leading-8 text-black/76 sm:text-lg">
            Bespoke work starts by defining the operating problem, the risk boundaries, the review gates, the implementation route, and the exact standard for completion. That proposal becomes the control document.
          </p>
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
                Flow
              </p>
              <h2 className="mt-5 max-w-4xl text-[clamp(2.15rem,4vw,4rem)] font-black uppercase leading-[0.92] tracking-[-0.06em] text-white">
                From request to controlled delivery route.
              </h2>
            </div>
            <p className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5 text-base leading-8 text-[#e6f6e7]/78 sm:text-lg">
              The form is intentionally detailed because the proposal must be accurate enough to protect scope, security, quality, and implementation decisions.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-4">
            {flowSteps.map((step) => (
              <article key={step.number} className="border border-[#9ed39f]/28 bg-[#030804] p-5">
                <p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">{step.number}</p>
                <h3 className="mt-8 text-2xl font-black uppercase tracking-[-0.04em] text-white">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#e6f6e7]/72">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#9ed39f]/20 bg-[#041008] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-[0.74fr_1.26fr]">
          <div>
            <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
              Bespoke routes
            </p>
            <h2 className="mt-5 text-[clamp(2.1rem,4vw,3.7rem)] font-black uppercase leading-[0.92] tracking-[-0.06em] text-white">
              Choose the route after the workflow is understood.
            </h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {serviceRoutes.map((route) => (
              <article key={route.title} className="rounded-[2rem] border border-[#9ed39f]/30 bg-black p-6">
                <span className="block h-2 w-2 bg-[#9ed39f]" />
                <h3 className="mt-8 text-2xl font-black uppercase tracking-[-0.04em] text-white">{route.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#e6f6e7]/72">{route.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
                Proposal controls
              </p>
              <h2 className="mt-5 max-w-4xl text-[clamp(2.15rem,4vw,4rem)] font-black uppercase leading-[0.92] tracking-[-0.06em] text-white">
                The proposal defines the work before the work begins.
              </h2>
            </div>
            <p className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5 text-base leading-8 text-[#e6f6e7]/78 sm:text-lg">
              This protects both sides: no surprise build scope, no loose automation promises, and no Codex handoff until boundaries and acceptance criteria are clear.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {proposalControls.map((control) => (
              <div key={control} className="border border-[#9ed39f]/25 bg-[#030804] px-4 py-5 text-xs font-black uppercase tracking-[0.14em] text-white">
                {control}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#9ed39f] px-4 py-14 text-black sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="inline-flex border border-black bg-black px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-[#9ed39f]">
              Start
            </p>
            <h2 className="mt-5 max-w-4xl text-[clamp(2.2rem,4vw,4rem)] font-black uppercase leading-[0.92] tracking-[-0.06em]">
              Request the proposal. Then decide the build route.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-black/74 sm:text-lg">
              The application form collects the information needed to prepare the proposal and identify whether implementation, automation, or Codex-assisted support belongs in scope.
            </p>
          </div>
          <a href="/bespoke/apply" className="inline-flex min-h-14 items-center justify-center border border-black bg-black px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black sm:min-w-72">
            Open proposal form
          </a>
        </div>
      </section>
    </main>
  );
}
