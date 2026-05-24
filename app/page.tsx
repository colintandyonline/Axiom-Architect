import Image from "next/image";

const auditSignupHref = "/signup?tier=workflow-audit&account=required";

const navLinks = [
  { label: "Audit", href: "#audit" },
  { label: "Process", href: "#process" },
  { label: "Packages", href: "#packages" },
  { label: "Deliverables", href: "#deliverables" },
];

const problemSignals = [
  {
    title: "The workflow is hard to see",
    text: "Work moves through inboxes, chats, documents, tools, people, and assumptions. The first job is to make the operating pattern visible.",
  },
  {
    title: "AI use is unclear",
    text: "Not every task should be automated. The audit separates useful assistant work from decisions, checks, and controls that should stay human-led.",
  },
  {
    title: "Automation can amplify weak process",
    text: "Axiom looks for safe sequencing: what to simplify first, where review gates belong, and what should not be automated yet.",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Choose the route",
    text: "Start with the Workflow Audit, compare package depth, or request a custom proposal for larger operational work.",
  },
  {
    number: "02",
    title: "Submit the workflow",
    text: "Use the secure intake to describe the current process, tools, handoffs, pain points, repeated tasks, and constraints.",
  },
  {
    number: "03",
    title: "Receive the diagnosis",
    text: "Your report identifies weak points, automation suitability, AI assistant opportunities, review gates, and the recommended sequence.",
  },
  {
    number: "04",
    title: "Use the blueprint",
    text: "Open reports and deliverables in your client workspace, then use them to brief, configure, improve, or commission the next build layer.",
  },
];

const packageRoutes = [
  {
    title: "Workflow Audit",
    label: "Entry package",
    text: "A focused diagnosis for one workflow, process, tool stack, or operational problem.",
    href: auditSignupHref,
  },
  {
    title: "Workflow Blueprint",
    label: "Implementation package",
    text: "A deeper operating plan with workflow structure, sequencing, ownership, and practical next steps.",
    href: "/pricing?tier=workflow-blueprint",
  },
  {
    title: "Custom Operating Pack",
    label: "Handoff package",
    text: "A structured pack for teams that need repeatable instructions, controls, and operating references.",
    href: "/pricing?tier=custom-operating-pack",
  },
  {
    title: "Workflow Stewardship",
    label: "Review package",
    text: "Ongoing review support for improving, adjusting, and maintaining AI-supported workflows over time.",
    href: "/pricing?tier=workflow-stewardship",
  },
  {
    title: "Departmental Ecosystem",
    label: "Team architecture",
    text: "A wider architecture review across a department, tool stack, handoffs, risks, and operating layers.",
    href: "/pricing?tier=departmental-ecosystem",
  },
  {
    title: "Architect Residency",
    label: "Strategic layer",
    text: "A deeper advisory and architecture path for larger operating systems, governance, and implementation planning.",
    href: "/pricing?tier=architect-residency",
  },
];

const deliverables = [
  "Current workflow diagnosis",
  "Bottleneck and weak-point map",
  "Automation opportunity review",
  "AI assistant suitability notes",
  "Risk and review gate recommendations",
  "Implementation sequence",
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function NodeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
      <circle cx="6" cy="7" r="2.5" />
      <circle cx="18" cy="7" r="2.5" />
      <circle cx="12" cy="18" r="2.5" />
      <path d="M8.2 8.4 11 15.7" />
      <path d="M15.8 8.4 13 15.7" />
      <path d="M8.5 7h7" />
    </svg>
  );
}

function SectionEyebrow({ children }: { children: string }) {
  return (
    <p className="inline-flex items-center gap-2 border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
      <NodeIcon />
      {children}
    </p>
  );
}

function PrimaryButton({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} className="inline-flex min-h-14 items-center justify-center gap-3 border border-[#9ed39f] bg-[#9ed39f] px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.2em] text-black transition hover:-translate-y-0.5 hover:bg-white">
      {children}
      <ArrowIcon />
    </a>
  );
}

function SecondaryButton({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} className="inline-flex min-h-14 items-center justify-center gap-3 border border-[#9ed39f]/42 bg-black px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5 hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black">
      {children}
      <ArrowIcon />
    </a>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <header className="fixed left-0 top-0 z-50 w-full border-b border-[#9ed39f]/30 bg-black/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1920px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <a href="#top" aria-label="Axiom Architect home" className="flex min-w-0 items-center gap-3">
            <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden border border-[#9ed39f]/42 bg-black shadow-[0_0_22px_rgba(158,211,159,0.16)] sm:h-14 sm:w-14">
              <Image src="/brand/axiom-logo.png" alt="" width={56} height={56} priority className="h-full w-full object-contain" />
            </span>
            <span className="min-w-0">
              <span className="block max-w-[12rem] truncate text-[0.84rem] font-black uppercase tracking-[0.2em] text-white sm:max-w-none sm:text-[1.05rem] sm:tracking-[0.26em]">
                Axiom Architect
              </span>
              <span className="mt-1 hidden text-[0.72rem] uppercase tracking-[0.2em] text-[#9ed39f]/84 sm:block">
                The architecture behind intelligent work
              </span>
            </span>
          </a>

          <nav aria-label="Homepage navigation" className="hidden items-center gap-7 text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#9ed39f] lg:flex">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="transition hover:text-white">
                {link.label}
              </a>
            ))}
            <a href="https://axiom-studio.co/" target="_blank" rel="noreferrer" className="transition hover:text-white">
              Axiom Studio
            </a>
          </nav>

          <a href={auditSignupHref} className="inline-flex min-h-11 shrink-0 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-4 text-center text-[0.66rem] font-black uppercase tracking-[0.16em] text-black transition hover:bg-white sm:min-h-12 sm:px-6">
            <span className="hidden min-[430px]:inline">Start Audit</span>
            <span className="min-[430px]:hidden">Start</span>
          </a>
        </div>
      </header>

      <section id="top" className="bg-black pt-[5rem] sm:pt-[7rem]">
        <div className="relative w-full overflow-hidden border-y border-[#9ed39f]/25 bg-black">
          <div className="relative mx-auto aspect-[16/9] w-full max-w-[1920px] bg-black sm:min-h-[520px] lg:min-h-[720px]">
            <Image src="/brand/axiom-architect-hero-banner.png" alt="Axiom Architect — The architecture behind intelligent work" fill priority sizes="100vw" className="object-contain object-center md:object-cover" />
          </div>
        </div>

        <div className="border-b border-[#9ed39f]/24 bg-[#020503] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <div>
              <h1 className="max-w-5xl text-[clamp(2.9rem,6.4vw,7.4rem)] font-black uppercase leading-[0.86] tracking-[-0.08em] text-white">
                Turn messy work into an operating blueprint.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[#e6f6e7]/78 sm:text-xl sm:leading-9">
                Axiom Architect diagnoses real workflows, identifies where AI and automation belong, defines human review gates, and turns scattered process into structured operational plans.
              </p>
            </div>

            <div className="border border-[#9ed39f]/34 bg-[#9ed39f]/10 p-5 sm:p-6">
              <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">Customer path</p>
              <div className="mt-5 grid gap-3 text-sm font-semibold leading-6 text-[#e6f6e7]/78">
                <p className="border border-[#9ed39f]/20 bg-black/44 p-4">1. Choose Workflow Audit or a deeper package.</p>
                <p className="border border-[#9ed39f]/20 bg-black/44 p-4">2. Complete secure intake after checkout.</p>
                <p className="border border-[#9ed39f]/20 bg-black/44 p-4">3. Review report and deliverables in your client workspace.</p>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <PrimaryButton href={auditSignupHref}>Start Workflow Audit</PrimaryButton>
                <SecondaryButton href="/pricing">Compare Packages</SecondaryButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="audit" className="border-b border-[#9ed39f]/24 bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.17),#041008_34%,#000_78%)] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <SectionEyebrow>Workflow Audit</SectionEyebrow>
              <h2 className="mt-5 max-w-5xl text-[clamp(2.4rem,5vw,5.5rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">
                Before you automate, understand the system.
              </h2>
            </div>
            <p className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5 text-base leading-8 text-[#e7ffe8] sm:p-6 sm:text-lg">
              The Workflow Audit is the entry point. It is built for one real workflow: where work starts, how it moves, what slows it down, what AI can safely support, and where review gates are required.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {problemSignals.map((item) => (
              <article key={item.title} className="border border-[#9ed39f]/30 bg-[linear-gradient(135deg,#102b17_0%,#061008_62%,#020503_100%)] p-6 shadow-[0_18px_54px_rgba(0,0,0,0.24)]">
                <span className="flex h-12 w-12 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] text-black"><NodeIcon /></span>
                <h3 className="mt-7 text-2xl font-black uppercase tracking-[-0.05em] text-white">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#ddf4de]/76 sm:text-base sm:leading-8">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="border-b border-[#9ed39f]/24 bg-[#9ed39f] px-4 py-16 text-black sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1fr] lg:items-end">
            <div>
              <p className="inline-flex border border-black bg-black px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-[#9ed39f]">Process</p>
              <h2 className="mt-5 max-w-4xl text-[clamp(2.4rem,5vw,5.4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-black">A clear route from purchase to delivery.</h2>
            </div>
            <p className="text-base font-semibold leading-8 text-black/72 sm:text-lg">The customer flow now follows the operational model: package selection, secure intake, report preparation, workspace delivery, and optional custom proposal work.</p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden border border-black/34 bg-black/34 md:grid-cols-2 xl:grid-cols-4">
            {processSteps.map((step) => (
              <article key={step.number} className="bg-[#b8efb9] p-6 text-black">
                <p className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-black/56">{step.number}</p>
                <h3 className="mt-8 text-2xl font-black uppercase tracking-[-0.05em]">{step.title}</h3>
                <p className="mt-4 text-sm font-semibold leading-7 text-black/72">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="packages" className="border-b border-[#9ed39f]/24 bg-[linear-gradient(135deg,#000_0%,#061108_48%,#0c2613_100%)] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <SectionEyebrow>Packages</SectionEyebrow>
              <h2 className="mt-5 max-w-5xl text-[clamp(2.4rem,5vw,5.5rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">Choose the depth of architecture you need.</h2>
            </div>
            <p className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5 text-base leading-8 text-[#e7ffe8] sm:p-6 sm:text-lg">Start with a focused audit, move into blueprint or operating-pack depth, or request a custom proposal when the scope needs human review before pricing.</p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden border border-[#9ed39f]/42 bg-[#9ed39f]/34 md:grid-cols-2 xl:grid-cols-3">
            {packageRoutes.map((service) => (
              <article key={service.title} className="group flex min-h-full flex-col bg-[linear-gradient(135deg,#0d2a14_0%,#041008_70%,#020503_100%)] p-7 transition hover:bg-[#102f18]">
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex border border-[#9ed39f]/30 bg-[#9ed39f]/12 px-4 py-2 text-[0.66rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">{service.label}</span>
                  <span className="flex h-12 w-12 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] text-black"><NodeIcon /></span>
                </div>
                <h3 className="mt-10 text-[1.5rem] font-black uppercase tracking-[-0.04em] text-white">{service.title}</h3>
                <p className="mt-4 flex-1 text-base leading-8 text-[#ddf4de]/76">{service.text}</p>
                <a href={service.href} className="mt-8 inline-flex min-h-12 items-center justify-center gap-3 border border-[#9ed39f]/42 px-5 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition group-hover:bg-[#9ed39f] group-hover:text-black">
                  Open route <ArrowIcon />
                </a>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-4 border border-[#9ed39f]/30 bg-[#030804] p-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">Need a custom scope?</p>
              <h3 className="mt-3 text-3xl font-black uppercase tracking-[-0.06em] text-white">Use the proposal route for complex systems.</h3>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#e6f6e7]/72 sm:text-base">For multi-workflow, departmental, governance, or implementation-heavy work, submit a custom proposal request before payment.</p>
            </div>
            <SecondaryButton href="/bespoke/apply">Custom Proposal</SecondaryButton>
          </div>
        </div>
      </section>

      <section id="deliverables" className="border-b border-[#9ed39f]/24 bg-[radial-gradient(circle_at_center,rgba(158,211,159,0.15),#041008_38%,#000_78%)] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <SectionEyebrow>Deliverables</SectionEyebrow>
              <h2 className="mt-5 max-w-5xl text-[clamp(2.4rem,5vw,5.5rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">Outputs that customers can actually use.</h2>
            </div>
            <p className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5 text-base leading-8 text-[#e7ffe8] sm:p-6 sm:text-lg">Reports and files are delivered through the client workspace so the customer can track progress, open deliverables, and keep the work connected to the original intake.</p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {deliverables.map((item) => (
              <div key={item} className="flex items-center gap-4 border border-[#9ed39f]/30 bg-black/72 p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] text-black">✓</span>
                <p className="text-sm font-black uppercase tracking-[0.14em] text-white">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="start" className="relative overflow-hidden bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(158,211,159,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.12)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto max-w-[1440px] border border-[#9ed39f]/38 bg-[#041008]/94 p-7 shadow-[0_26px_90px_rgba(0,0,0,0.42)] sm:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <SectionEyebrow>Start Workflow Audit</SectionEyebrow>
              <h2 className="mt-5 max-w-4xl text-[clamp(2.4rem,5vw,5.4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">Bring one messy workflow. Leave with a structured plan.</h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#ddf4de]/78 sm:text-lg">Create your account, choose the Workflow Audit, complete checkout, then submit the workflow through the dashboard intake.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <PrimaryButton href={auditSignupHref}>Start Workflow Audit</PrimaryButton>
              <SecondaryButton href="/bespoke/apply">Request Custom Scope</SecondaryButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
