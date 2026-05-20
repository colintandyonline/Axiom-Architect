import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom AI Workflow Systems | Axiom Architect",
  description:
    "Custom AI workflow system design for businesses that need workflow mapping, operating models, automation boundaries, review gates, implementation planning, and delivery-ready blueprints.",
  keywords: [
    "custom AI workflow systems",
    "workflow architecture service",
    "AI workflow implementation plan",
    "automation boundary design",
    "workflow operating model",
    "implementation blueprint",
    "human review gates",
    "enterprise AI control stack",
  ],
  alternates: {
    canonical: "/bespoke",
  },
  openGraph: {
    title: "Custom AI Workflow Systems | Axiom Architect",
    description:
      "Axiom Architect designs custom AI-ready workflow systems with operating blueprints, automation boundaries, review gates, and implementation-ready delivery plans.",
    url: "https://www.axiom-architect.co/bespoke",
    siteName: "Axiom Architect",
    type: "website",
    images: [
      {
        url: "/brand/axiom-architect-header-1920x1080-final.png",
        width: 1920,
        height: 1080,
        alt: "Custom AI workflow systems by Axiom Architect",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom AI Workflow Systems | Axiom Architect",
    description:
      "Workflow mapping, AI boundaries, review gates, implementation planning, and delivery-ready blueprints for complex business operations.",
    images: ["/brand/axiom-architect-header-1920x1080-final.png"],
  },
};

const systemOutputs = [
  {
    title: "Workflow architecture",
    text: "A clear map of how the work should move: inputs, owners, tools, handoffs, decisions, outputs, and escalation points.",
  },
  {
    title: "Operating model",
    text: "A practical structure for who does what, where AI supports the work, where automation belongs, and where human judgement stays in control.",
  },
  {
    title: "Control framework",
    text: "Review gates, approval rules, quality checks, exception handling, data boundaries, and safeguards before the system touches real operations.",
  },
  {
    title: "Implementation blueprint",
    text: "A delivery-ready plan that can guide your internal team, external developer, automation builder, or future implementation phase.",
  },
] as const;

const capabilityAreas = [
  "workflow mapping",
  "business process design",
  "tool-stack planning",
  "AI-supported execution",
  "automation suitability",
  "client delivery systems",
  "internal operations",
  "review and approval gates",
  "data and handoff logic",
  "reporting workflows",
  "content operations",
  "service delivery systems",
  "team operating models",
  "implementation roadmaps",
  "quality-control checkpoints",
  "system build handoff briefs",
] as const;

const engagementSteps = [
  {
    number: "01",
    title: "Submit the operating problem",
    text: "Describe the workflow, process, department, platform, client delivery path, or system that needs proper structure.",
  },
  {
    number: "02",
    title: "Axiom maps the system",
    text: "We identify the moving parts, weak points, owners, decisions, tools, risks, automation potential, and review requirements.",
  },
  {
    number: "03",
    title: "You receive a scoped proposal",
    text: "The proposal explains the recommended service route, deliverables, timeline, quote, boundaries, and what will count as complete.",
  },
  {
    number: "04",
    title: "Build from controlled clarity",
    text: "Once approved, the blueprint can move into implementation planning, handoff documentation, system build support, or ongoing workflow stewardship.",
  },
] as const;

const proposalIncludes = [
  "current-state workflow map",
  "future-state operating model",
  "automation boundary design",
  "AI-support opportunities",
  "human review gates",
  "risk and exception rules",
  "tool and handoff logic",
  "implementation sequence",
  "delivery responsibilities",
  "acceptance criteria",
] as const;

const useCases = [
  {
    title: "A workflow is too messy to automate safely",
    text: "The current process relies on memory, manual movement, unclear ownership, or scattered tools. Axiom turns it into a controlled operating model first.",
  },
  {
    title: "A team needs a repeatable AI-supported system",
    text: "The business wants AI involved, but needs rules for where it helps, where humans review, and how outputs are checked before use.",
  },
  {
    title: "A build needs a proper business blueprint",
    text: "Before developers, operators, or automation specialists start changing tools, Axiom defines the workflow logic and implementation boundaries.",
  },
] as const;

function BrandedSystemVisual() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[#9ed39f]/38 bg-[#020503] p-3 shadow-[0_28px_90px_rgba(0,0,0,0.38)] sm:p-4">
      <div className="absolute inset-0 z-10 bg-[linear-gradient(135deg,rgba(0,0,0,0.18),rgba(0,0,0,0.84))]" />
      <Image
        src="/brand/axiom-architect-header-1920x1080-final.png"
        alt="Axiom Architect workflow architecture system visual"
        width={1920}
        height={1080}
        priority
        className="relative h-auto w-full rounded-[1.55rem] object-cover"
      />
      <div className="absolute inset-4 z-20 rounded-[1.55rem] border border-[#9ed39f]/24" />
      <div className="absolute bottom-7 left-7 right-7 z-30 grid gap-3 sm:grid-cols-3">
        {[
          "Map",
          "Control",
          "Implement",
        ].map((item) => (
          <div key={item} className="border border-[#9ed39f]/34 bg-black/72 px-4 py-3 backdrop-blur-md">
            <p className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BespokePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_34%,#000_76%)] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <div>
            <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
              Custom workflow systems
            </p>
            <h1 className="mt-6 max-w-5xl text-[clamp(2.65rem,6vw,5.9rem)] font-black uppercase leading-[0.9] tracking-[-0.075em] text-white">
              Build the operating system behind the work.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#e6f6e7]/80 sm:text-xl">
              Axiom Architect designs custom AI-ready workflow systems for business operations that need structure, control, handoff clarity, automation boundaries, and implementation planning before anything is built or changed.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="/bespoke/apply" className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white">
                Request custom proposal
              </a>
              <a href="/pricing" className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f]/38 bg-black px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-white transition hover:border-[#9ed39f] hover:text-[#9ed39f]">
                View fixed packages
              </a>
            </div>
          </div>
          <BrandedSystemVisual />
        </div>
      </section>

      <section className="border-y border-[#9ed39f]/20 bg-[#9ed39f] px-4 py-14 text-black sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <p className="inline-flex border border-black bg-black px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-[#9ed39f]">
              The offer
            </p>
            <h2 className="mt-5 max-w-4xl text-[clamp(2.1rem,4vw,3.9rem)] font-black uppercase leading-[0.92] tracking-[-0.06em]">
              A designed workflow system, not loose advice.
            </h2>
          </div>
          <p className="max-w-4xl text-base leading-8 text-black/76 sm:text-lg">
            This service is for any business workflow that needs proper architecture before it becomes an AI-assisted process, automation project, internal operating system, client delivery route, or implementation brief. The scope is shaped around the actual work, not a fixed template.
          </p>
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
                What Axiom designs
              </p>
              <h2 className="mt-5 max-w-4xl text-[clamp(2.15rem,4vw,4rem)] font-black uppercase leading-[0.92] tracking-[-0.06em] text-white">
                The system layer between messy work and reliable execution.
              </h2>
            </div>
            <p className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5 text-base leading-8 text-[#e6f6e7]/78 sm:text-lg">
              Axiom Architect can work across operations, delivery, content, sales, support, reporting, admin, product, marketplace, internal team, or platform workflows where the process needs to be mapped and controlled before implementation.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {systemOutputs.map((output) => (
              <article key={output.title} className="border border-[#9ed39f]/28 bg-[#030804] p-5">
                <span className="block h-2 w-2 bg-[#9ed39f]" />
                <h3 className="mt-8 text-2xl font-black uppercase tracking-[-0.04em] text-white">{output.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#e6f6e7]/72">{output.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#9ed39f]/20 bg-[#041008] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-[0.74fr_1.26fr]">
          <div>
            <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
              Scope range
            </p>
            <h2 className="mt-5 text-[clamp(2.1rem,4vw,3.7rem)] font-black uppercase leading-[0.92] tracking-[-0.06em] text-white">
              Built around the workflow you actually need fixed.
            </h2>
            <p className="mt-5 text-base leading-8 text-[#e6f6e7]/72 sm:text-lg">
              The service is not limited to one department, one tool, or one type of process. If the work can be mapped, structured, controlled, handed off, improved, or prepared for implementation, it can be assessed through the custom proposal route.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {capabilityAreas.map((area) => (
              <div key={area} className="border border-[#9ed39f]/22 bg-black px-4 py-4 text-xs font-black uppercase tracking-[0.14em] text-white">
                {area}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
                Service flow
              </p>
              <h2 className="mt-5 max-w-4xl text-[clamp(2.15rem,4vw,4rem)] font-black uppercase leading-[0.92] tracking-[-0.06em] text-white">
                From unclear process to controlled plan.
              </h2>
            </div>
            <p className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5 text-base leading-8 text-[#e6f6e7]/78 sm:text-lg">
              The proposal exists to protect the work: it defines scope, deliverables, boundaries, review gates, responsibilities, timeline, and the implementation route before the build phase begins.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-4">
            {engagementSteps.map((step) => (
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
              Use cases
            </p>
            <h2 className="mt-5 text-[clamp(2.1rem,4vw,3.7rem)] font-black uppercase leading-[0.92] tracking-[-0.06em] text-white">
              For work that needs architecture before action.
            </h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {useCases.map((item) => (
              <article key={item.title} className="rounded-[2rem] border border-[#9ed39f]/30 bg-black p-6">
                <span className="block h-2 w-2 bg-[#9ed39f]" />
                <h3 className="mt-8 text-2xl font-black uppercase tracking-[-0.04em] text-white">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#e6f6e7]/72">{item.text}</p>
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
                Proposal output
              </p>
              <h2 className="mt-5 max-w-4xl text-[clamp(2.15rem,4vw,4rem)] font-black uppercase leading-[0.92] tracking-[-0.06em] text-white">
                A precise scope before the work starts.
              </h2>
            </div>
            <p className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5 text-base leading-8 text-[#e6f6e7]/78 sm:text-lg">
              The proposal is the control document. It explains what Axiom will design, what is outside scope, what information is needed, how implementation should be handled, and how completion will be assessed.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {proposalIncludes.map((item) => (
              <div key={item} className="border border-[#9ed39f]/25 bg-[#030804] px-4 py-5 text-xs font-black uppercase tracking-[0.14em] text-white">
                {item}
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
              Request a custom workflow proposal.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-black/74 sm:text-lg">
              Send the workflow, operating problem, system idea, or implementation challenge. Axiom Architect will assess the scope and prepare the right proposal route.
            </p>
          </div>
          <a href="/bespoke/apply" className="inline-flex min-h-14 items-center justify-center border border-black bg-black px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black sm:min-w-72">
            Start custom proposal
          </a>
        </div>
      </section>
    </main>
  );
}
