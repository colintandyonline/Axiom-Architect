import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bespoke AI Workflow Architecture | Axiom Architect",
  description:
    "Request a bespoke Axiom Architect proposal for custom AI workflow architecture, guarded implementation planning, operating systems, automation design, and Codex-assisted delivery briefs.",
  keywords: [
    "bespoke AI workflow architecture",
    "custom workflow architecture",
    "AI operating system design",
    "bespoke automation design",
    "Codex implementation brief",
    "workflow proposal",
    "human review gates",
    "enterprise AI control stack",
  ],
  alternates: {
    canonical: "/bespoke",
  },
  openGraph: {
    title: "Bespoke AI Workflow Architecture | Axiom Architect",
    description:
      "Custom proposal-led workflow architecture for businesses that need guarded AI implementation, operating systems, automation design, or Codex-ready build briefs.",
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
      "Proposal-led custom workflow architecture with guardrails before AI or Codex-assisted implementation begins.",
    images: ["/brand/axiom-architect-hero-banner.png"],
  },
};

const proposalSteps = [
  {
    step: "01",
    title: "Request review",
    text: "Submit the workflow problem, operating context, tool stack, desired outcome, and whether implementation support may be needed.",
  },
  {
    step: "02",
    title: "Scope diagnosis",
    text: "Axiom Architect reviews the request, identifies the likely service route, and decides whether clarification or a formal proposal is needed.",
  },
  {
    step: "03",
    title: "Proposal first",
    text: "You receive a structured proposal covering scope, deliverables, exclusions, guardrails, timeline, price, and acceptance criteria.",
  },
  {
    step: "04",
    title: "Guarded delivery",
    text: "Only after approval does the work move into manual architecture, Codex-assisted implementation support, human review, and client delivery.",
  },
] as const;

const serviceLanes = [
  {
    title: "Bespoke Workflow Architecture",
    text: "For one complex workflow that needs proper diagnosis, redesign, AI suitability review, review gates, and a practical operating blueprint.",
  },
  {
    title: "Bespoke AI Operating System",
    text: "For teams that need repeatable AI-supported operations with assistant roles, protocols, handoff rules, documentation, and quality controls.",
  },
  {
    title: "Bespoke Automation Design",
    text: "For workflows where automation may help, but only after responsibilities, approval points, exception handling, and data boundaries are clear.",
  },
  {
    title: "Codex Implementation Brief",
    text: "For projects where code or repository work may be needed. Axiom defines the approved scope, allowed files, guardrails, tests, and acceptance criteria before Codex or manual build work begins.",
  },
  {
    title: "Enterprise AI Control Stack",
    text: "For businesses that need governance, AI boundaries, risk controls, review gates, data-flow clarity, and operating rules across connected workflows.",
  },
  {
    title: "Bespoke System Build Support",
    text: "For clients who need a controlled implementation route after the architecture is approved, with human QA before anything is treated as complete.",
  },
] as const;

const proposalIncludes = [
  "Client and workflow summary",
  "Current-state diagnosis",
  "Recommended future-state workflow",
  "Proposed service route",
  "Scope of work",
  "Out-of-scope boundaries",
  "Security and data guardrails",
  "Human review gates",
  "Codex/manual implementation method where relevant",
  "Deliverables and acceptance criteria",
  "Timeline and quote",
  "Client responsibilities",
] as const;

const codexGuardrails = [
  "No secrets, API keys, tokens, or .env values are shared with Codex.",
  "Codex only receives approved scope, allowed files, forbidden files, and testing instructions.",
  "Unrelated refactors, pricing changes, auth changes, and security changes stay out of scope unless explicitly approved.",
  "All Codex-assisted work must come back for human review, build/test evidence, and client-safe delivery notes.",
] as const;

function BespokeVisual() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[#9ed39f]/38 bg-[#020503] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.38)] sm:p-7">
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(158,211,159,0.13)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.13)_1px,transparent_1px)] [background-size:38px_38px]" />
      <svg viewBox="0 0 720 520" className="relative h-auto w-full text-[#9ed39f]" fill="none" aria-hidden="true">
        <rect x="54" y="48" width="612" height="424" rx="30" stroke="currentColor" strokeWidth="2" opacity="0.62" />
        <rect x="108" y="102" width="210" height="108" rx="16" stroke="currentColor" strokeWidth="2.4" />
        <rect x="402" y="102" width="210" height="108" rx="16" stroke="currentColor" strokeWidth="2.4" />
        <rect x="255" y="306" width="210" height="108" rx="16" stroke="currentColor" strokeWidth="2.4" />
        <path d="M318 156h84M360 210v96M255 360H174c-30 0-54-24-54-54v-96M465 360h81c30 0 54-24 54-54v-96" stroke="currentColor" strokeWidth="2.2" opacity="0.64" />
        <circle cx="213" cy="156" r="28" stroke="currentColor" strokeWidth="2.6" />
        <circle cx="507" cy="156" r="28" stroke="currentColor" strokeWidth="2.6" />
        <circle cx="360" cy="360" r="31" stroke="currentColor" strokeWidth="2.6" />
        <circle cx="213" cy="156" r="8" fill="currentColor" />
        <circle cx="507" cy="156" r="8" fill="currentColor" />
        <circle cx="360" cy="360" r="9" fill="currentColor" />
        <path d="M150 242h420M176 270h368M204 438h312" stroke="currentColor" strokeWidth="2" opacity="0.35" />
        <path d="M140 132h92M140 184h120M434 132h92M434 184h120M291 336h92M291 390h138" stroke="currentColor" strokeWidth="2" opacity="0.58" />
      </svg>
    </div>
  );
}

export default function BespokePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_34%,#000_76%)] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
              Bespoke AI workflow architecture
            </p>
            <h1 className="mt-6 max-w-5xl text-[clamp(2.7rem,6vw,5.9rem)] font-black uppercase leading-[0.9] tracking-[-0.075em] text-white">
              Custom workflow systems need a proposal before implementation.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#e6f6e7]/80 sm:text-xl">
              Axiom Architect designs the scope, guardrails, review gates, and delivery route before any manual or Codex-assisted implementation work begins.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="/contact" className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white">
                Request bespoke proposal
              </a>
              <a href="/pricing" className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f]/38 bg-black px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-white transition hover:border-[#9ed39f] hover:text-[#9ed39f]">
                View fixed packages
              </a>
            </div>
          </div>
          <BespokeVisual />
        </div>
      </section>

      <section className="border-y border-[#9ed39f]/20 bg-[#9ed39f] px-4 py-14 text-black sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <p className="inline-flex border border-black bg-black px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-[#9ed39f]">
              Proposal-led service
            </p>
            <h2 className="mt-5 max-w-4xl text-[clamp(2.1rem,4vw,3.9rem)] font-black uppercase leading-[0.92] tracking-[-0.06em]">
              The work is scoped before the build starts.
            </h2>
          </div>
          <p className="max-w-4xl text-base leading-8 text-black/76 sm:text-lg">
            Bespoke work is for requests that do not fit neatly into a fixed package. The first deliverable is clarity: what should be built, what should not be touched, what risks need controls, what approval gates are needed, and what outcome will count as complete.
          </p>
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
                Service lanes
              </p>
              <h2 className="mt-5 max-w-4xl text-[clamp(2.15rem,4vw,4rem)] font-black uppercase leading-[0.92] tracking-[-0.06em] text-white">
                Built for messy operational problems, not generic AI advice.
              </h2>
            </div>
            <p className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5 text-base leading-8 text-[#e6f6e7]/78 sm:text-lg">
              Each bespoke route starts with diagnosis and a proposal. Implementation only follows once the scope, evidence, risks, ownership, and handoff model are clear.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {serviceLanes.map((lane) => (
              <article key={lane.title} className="rounded-[2rem] border border-[#9ed39f]/30 bg-[#030804] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.24)] transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black">
                <span className="block h-2 w-2 bg-[#9ed39f]" />
                <h3 className="mt-8 text-2xl font-black uppercase tracking-[-0.04em]">{lane.title}</h3>
                <p className="mt-4 text-base leading-8 text-[#e6f6e7]/76 transition hover:text-black/74">{lane.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#9ed39f]/20 bg-[#041008] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
                Proposal contents
              </p>
              <h2 className="mt-5 max-w-4xl text-[clamp(2.15rem,4vw,4rem)] font-black uppercase leading-[0.92] tracking-[-0.06em] text-white">
                The proposal becomes the control document.
              </h2>
            </div>
            <p className="border border-[#9ed39f]/35 bg-black/55 p-5 text-base leading-8 text-[#e6f6e7]/78 sm:text-lg">
              A bespoke proposal is not just a quote. It defines what will happen, what is excluded, who reviews decisions, and how any implementation work will be safely handed off.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {proposalIncludes.map((item) => (
              <div key={item} className="border border-[#9ed39f]/25 bg-black px-5 py-5 text-sm font-black uppercase tracking-[0.14em] text-white">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
              Codex handoff guardrails
            </p>
            <h2 className="mt-5 text-[clamp(2.1rem,4vw,3.7rem)] font-black uppercase leading-[0.92] tracking-[-0.06em] text-white">
              Codex supports implementation. It does not define the business system.
            </h2>
            <p className="mt-5 text-base leading-8 text-[#e6f6e7]/72 sm:text-lg">
              When a project may need repository or code work, Axiom Architect creates the internal implementation brief first. That brief defines the approved scope, allowed files, forbidden changes, test commands, and review standard before Codex-assisted work starts.
            </p>
          </div>
          <div className="grid gap-4">
            {codexGuardrails.map((rule, index) => (
              <article key={rule} className="border border-[#9ed39f]/28 bg-[#030804] p-5">
                <p className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Guardrail 0{index + 1}</p>
                <p className="mt-3 text-base leading-8 text-[#e6f6e7]/78">{rule}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#9ed39f] px-4 py-14 text-black sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="inline-flex border border-black bg-black px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-[#9ed39f]">
              Start the process
            </p>
            <h2 className="mt-5 max-w-4xl text-[clamp(2.2rem,4vw,4rem)] font-black uppercase leading-[0.92] tracking-[-0.06em]">
              Request a bespoke proposal before the build begins.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-black/74 sm:text-lg">
              Send the workflow problem first. Axiom Architect will review the fit, route the request, and prepare the right proposal path before any implementation work starts.
            </p>
          </div>
          <a href="/contact" className="inline-flex min-h-14 items-center justify-center border border-black bg-black px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black sm:min-w-72">
            Request bespoke proposal
          </a>
        </div>
      </section>
    </main>
  );
}
