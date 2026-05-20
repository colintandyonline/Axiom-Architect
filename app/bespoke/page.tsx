import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bespoke AI Workflow Architecture | Axiom Architect",
  description:
    "Request a bespoke Axiom Architect proposal for custom AI workflow architecture, guarded implementation planning, operating systems, automation design, and Codex-ready delivery briefs.",
  keywords: [
    "bespoke AI workflow architecture",
    "custom workflow architecture",
    "AI operating system design",
    "bespoke automation design",
    "workflow proposal",
    "Codex implementation brief",
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
  "Bespoke Workflow Architecture",
  "Bespoke AI Operating System",
  "Bespoke Automation Design",
  "Codex Implementation Brief",
  "Enterprise AI Control Stack",
  "Bespoke System Build Support",
] as const;

const proposalIncludes = [
  "Client and workflow summary",
  "Current-state diagnosis",
  "Recommended future-state workflow",
  "Scope of work",
  "Out-of-scope boundaries",
  "Security and data guardrails",
  "Human review gates",
  "Implementation method",
  "Deliverables",
  "Acceptance criteria",
  "Timeline",
  "Quote",
] as const;

const guardrails = [
  "No secrets, API keys, tokens, or .env values are shared in the onboarding flow.",
  "Implementation does not begin until the proposal scope and acceptance criteria are approved.",
  "Codex only receives an approved implementation brief with allowed files, forbidden files, test commands, and review standards.",
  "All Codex-assisted work comes back for human QA before client delivery.",
] as const;

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

          <div className="relative overflow-hidden rounded-[2rem] border border-[#9ed39f]/38 bg-[#020503] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.38)] sm:p-7">
            <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(158,211,159,0.13)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.13)_1px,transparent_1px)] [background-size:38px_38px]" />
            <div className="relative grid gap-4">
              {proposalSteps.map((item) => (
                <div key={item.step} className="border border-[#9ed39f]/25 bg-black/60 p-5">
                  <p className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">
                    {item.step}
                  </p>
                  <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.04em] text-white">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72">
                    {item.text}
                  </p>
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
              Proposal-led service
            </p>
            <h2 className="mt-5 max-w-4xl text-[clamp(2.1rem,4vw,3.9rem)] font-black uppercase leading-[0.92] tracking-[-0.06em]">
              The work is scoped before the build starts.
            </h2>
          </div>
          <p className="max-w-4xl text-base leading-8 text-black/76 sm:text-lg">
            Bespoke work is for requests that do not fit neatly into a fixed package. The proposal defines what should be built, what should not be touched, what risks need controls, what approval gates are needed, and what outcome will count as complete.
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

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {serviceLanes.map((lane) => (
              <article key={lane} className="rounded-[2rem] border border-[#9ed39f]/30 bg-[#030804] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.24)] transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black">
                <span className="block h-2 w-2 bg-[#9ed39f]" />
                <h3 className="mt-8 text-2xl font-black uppercase tracking-[-0.04em]">
                  {lane}
                </h3>
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
              A bespoke proposal is not just a quote. It defines what will happen, what is excluded, who reviews decisions, and how implementation work will be safely handed off.
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
          </div>
          <div className="grid gap-4">
            {guardrails.map((rule, index) => (
              <article key={rule} className="border border-[#9ed39f]/28 bg-[#030804] p-5">
                <p className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">
                  Guardrail 0{index + 1}
                </p>
                <p className="mt-3 text-base leading-8 text-[#e6f6e7]/78">
                  {rule}
                </p>
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