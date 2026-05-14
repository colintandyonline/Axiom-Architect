import Image from "next/image";

const studioLinks = [
  {
    name: "Protocols",
    href: "https://axiom-studio.co/collections/protocols",
  },
  {
    name: "Agent Kits",
    href: "https://axiom-studio.co/collections/agent-kits",
  },
  {
    name: "Workbooks",
    href: "https://axiom-studio.co/collections/workbooks",
  },
  {
    name: "Operating Packs",
    href: "https://axiom-studio.co/collections/operating-packs",
  },
];
const problemSignals = [
  {
    title: "Messy workflows",
    text: "Processes live across chats, spreadsheets, inboxes, documents, and memory. The work gets done, but the system is hard to see.",
  },
  {
    title: "Unclear AI use",
    text: "Teams know AI could help, but not which steps it should touch, what context it needs, or where human judgment must stay in control.",
  },
  {
    title: "Automation risk",
    text: "Automating too early can amplify weak inputs, unclear approvals, fragile handoffs, and decisions that still need review gates.",
  },
];

const methodSteps = [
  {
    number: "01",
    title: "Submit",
    text: "You describe the workflow, tools, handoffs, bottlenecks, repeated tasks, review points, and desired outcome.",
  },
  {
    number: "02",
    title: "Diagnose",
    text: "Axiom Architect maps the current operating pattern and identifies weak points, friction, risk, and automation suitability.",
  },
  {
    number: "03",
    title: "Blueprint",
    text: "You receive a structured implementation blueprint showing what should change, what AI can support, and what needs control.",
  },
  {
    number: "04",
    title: "Implement",
    text: "Use the blueprint to brief your team, configure assistants, improve tooling, or move into a deeper system build.",
  },
];

const deliverables = [
  "Current workflow diagnosis",
  "Bottlenecks and weak points",
  "Automation opportunities",
  "AI assistant opportunities",
  "Risk and review requirements",
  "Implementation blueprint",
  "Recommended next steps",
];

const audiences = [
  "Founders",
  "Operators",
  "Consultants",
  "Creators",
  "Small teams",
];

const serviceLadder = [
  {
    name: "Workflow Audit",
    status: "Launch offer",
    text: "A focused diagnostic for one workflow, process, or operating problem.",
  },
  {
    name: "Workflow Blueprint",
    status: "Next layer",
    text: "A deeper operating model with implementation structure and sequence.",
  },
  {
    name: "Custom AI Operating Protocol",
    status: "System asset",
    text: "Rules, prompts, review gates, and execution standards for repeated work.",
  },
  {
    name: "Agent Instruction Kit",
    status: "Assistant layer",
    text: "Role-specific assistant instructions designed around your workflow.",
  },
  {
    name: "Implementation Workbook",
    status: "Action layer",
    text: "A practical workbook for moving from diagnosis into structured change.",
  },
  {
    name: "AI Workflow System Build",
    status: "Build layer",
    text: "A larger service path for designing and building the operating system.",
  },
];

const architectureSignals = [
  "Workflow inputs",
  "Decision points",
  "Tool stack",
  "Review gates",
  "Automation fit",
  "Blueprint output",
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white">
      <header className="fixed left-0 top-0 z-50 w-full border-b border-[#9ed39f]/25 bg-black/84 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8">
          <a
            href="#top"
            aria-label="Axiom Architect home"
            className="flex min-w-0 items-center gap-3"
          >
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden border border-[#9ed39f]/35 bg-black sm:h-12 sm:w-12">
              <Image
                src="/brand/axiom-logo.png"
                alt=""
                width={48}
                height={48}
                priority
                className="h-full w-full object-contain"
              />
            </span>
            <span className="min-w-0">
              <span className="block max-w-[11rem] truncate text-[0.72rem] font-black uppercase tracking-[0.24em] text-white min-[430px]:max-w-none sm:text-sm">
                Axiom Architect
              </span>
              <span className="hidden text-[0.68rem] uppercase tracking-[0.22em] text-white/48 min-[620px]:block">
                The architecture behind intelligent work
              </span>
            </span>
          </a>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-7 text-[0.72rem] font-semibold text-[#9ed39f] lg:flex"
          >
            <a
              className="uppercase tracking-[0.16em] transition hover:text-white"
              href="#audit"
            >
              Audit
            </a>
            <a
              className="uppercase tracking-[0.16em] transition hover:text-white"
              href="#method"
            >
              Method
            </a>
            <a
              className="uppercase tracking-[0.16em] transition hover:text-white"
              href="#deliverables"
            >
              Deliverables
            </a>
            <a
              className="uppercase tracking-[0.16em] transition hover:text-white"
              href="#services"
            >
              Services
            </a>

            <div className="group relative">
              <button
                type="button"
                className="flex items-center gap-2 uppercase tracking-[0.16em] text-[#9ed39f] transition hover:text-white"
                aria-haspopup="true"
              >
                Core Systems
                <span className="text-sm leading-none text-[#9ed39f] transition group-hover:text-white">
                  ⌄
                </span>
              </button>

              <div className="invisible absolute left-1/2 top-8 z-50 grid min-w-72 -translate-x-1/2 gap-1 border border-[#9ed39f]/35 bg-black/95 p-2 opacity-0 shadow-2xl shadow-black/70 transition duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                {studioLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="border border-transparent px-4 py-3 text-[0.72rem] font-medium text-[#9ed39f] transition hover:border-[#9ed39f]/35 hover:bg-[#9ed39f]/10 hover:text-white"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>

            <a
              className="uppercase tracking-[0.16em] transition hover:text-white"
              href="https://axiom-studio.co/"
              target="_blank"
              rel="noreferrer"
            >
              Axiom Studio
            </a>
          </nav>

          <a
            href="#start"
            className="inline-flex min-h-10 shrink-0 items-center justify-center border border-[#9ed39f]/55 bg-[#9ed39f] px-4 text-center text-[0.62rem] font-black uppercase tracking-[0.16em] text-black transition hover:bg-white min-[430px]:min-h-11 min-[430px]:px-5 min-[430px]:tracking-[0.18em]"
          >
            <span className="hidden min-[430px]:inline">Start Audit</span>
            <span className="min-[430px]:hidden">Start</span>
          </a>
        </div>
      </header>

      <section
        id="top"
        className="relative isolate overflow-hidden border-b border-[#9ed39f]/20 pt-20 sm:pt-24"
      >
        <div className="absolute inset-0 -z-30 bg-black" />
        <div className="absolute inset-0 -z-20 opacity-45 [background-image:linear-gradient(rgba(158,211,159,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.12)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-64 bg-gradient-to-t from-black via-black/80 to-transparent" />

        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 sm:py-16 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[1.04fr_0.96fr] lg:px-8 lg:py-20">
          <div className="max-w-4xl">
            <p className="!m-0 mb-5 inline-flex max-w-full border border-[#9ed39f]/35 bg-[#9ed39f]/10 px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.24em] text-[#9ed39f] min-[430px]:text-[0.68rem] min-[430px]:tracking-[0.28em]">
              AI workflow architecture
            </p>

            <h1 className="!m-0 !mt-5 !max-w-none !text-[clamp(2.65rem,12.2vw,4.95rem)] !font-black !uppercase !leading-[0.92] !tracking-[-0.08em] text-white sm:!text-[clamp(4.2rem,8vw,7.4rem)] lg:!leading-[0.9]">
              AI workflow architecture for real business operations.
            </h1>

            <p className="!m-0 mt-6 max-w-2xl text-base leading-7 text-white/72 sm:mt-7 sm:text-lg sm:leading-8">
              Axiom Architect turns messy workflows into structured diagnostics,
              automation opportunities, review gates, and practical
              implementation blueprints.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row">
              <a
                href="#start"
                className="inline-flex min-h-13 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-5 py-4 text-center text-[0.68rem] font-black uppercase tracking-[0.2em] text-black transition hover:bg-white sm:min-h-14 sm:min-w-56 sm:px-6 sm:text-xs sm:tracking-[0.22em]"
              >
                Start Workflow Audit
              </a>
              <a
                href="#deliverables"
                className="inline-flex min-h-13 items-center justify-center border border-white/18 bg-white/8 px-5 py-4 text-center text-[0.68rem] font-black uppercase tracking-[0.2em] text-white transition hover:border-[#9ed39f]/70 hover:text-[#9ed39f] sm:min-h-14 sm:min-w-56 sm:px-6 sm:text-xs sm:tracking-[0.22em]"
              >
                View Deliverables
              </a>
            </div>

            <div className="mt-8 grid max-w-2xl grid-cols-1 border border-[#9ed39f]/25 min-[520px]:grid-cols-3 sm:mt-10">
              {["Diagnose", "Design", "Implement"].map((item) => (
                <div
                  key={item}
                  className="border-b border-[#9ed39f]/20 bg-black/46 px-4 py-4 last:border-b-0 min-[520px]:border-b-0 min-[520px]:border-r min-[520px]:last:border-r-0"
                >
                  <span className="block text-[0.58rem] font-black uppercase tracking-[0.22em] text-[#9ed39f] sm:text-[0.64rem]">
                    System step
                  </span>
                  <span className="mt-2 block text-xs font-bold uppercase tracking-[0.16em] text-white sm:text-sm">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative w-full min-w-0">
            <div className="relative overflow-hidden border border-[#9ed39f]/35 bg-[#061008] shadow-2xl shadow-black/60">
              <div className="flex items-center justify-between gap-4 border-b border-[#9ed39f]/25 px-4 py-3 text-[0.56rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] sm:px-5 sm:text-[0.62rem] sm:tracking-[0.22em]">
                <span>Architect interface</span>
                <span>Workflow scan</span>
              </div>

              <div className="relative aspect-[16/10] min-h-[240px] overflow-hidden bg-black sm:min-h-[280px]">
                <Image
                  src="/brand/axiom-architect-header-1920x1080-final.png"
                  alt="Axiom Architect workflow architecture system interface"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="object-cover opacity-88"
                />
                
              </div>

              <div className="grid grid-cols-2 border-t border-[#9ed39f]/25 sm:grid-cols-3">
                {architectureSignals.map((item) => (
                  <div
                    key={item}
                    className="border-b border-r border-[#9ed39f]/18 px-3 py-4 last:border-r-0 sm:px-4"
                  >
                    <span className="block text-[0.56rem] font-black uppercase tracking-[0.18em] text-white/42 sm:text-[0.6rem] sm:tracking-[0.2em]">
                      Mapped
                    </span>
                    <span className="mt-1 block text-[0.68rem] font-bold uppercase tracking-[0.1em] text-white sm:text-xs sm:tracking-[0.12em]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pointer-events-none absolute -bottom-5 -right-5 hidden h-44 w-44 border border-[#9ed39f]/30 lg:block">
              <div className="absolute left-1/2 top-0 h-full w-px bg-[#9ed39f]/20" />
              <div className="absolute left-0 top-1/2 h-px w-full bg-[#9ed39f]/20" />
              <div className="absolute inset-10 border border-[#9ed39f]/25" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#9ed39f]/20 bg-[#9ed39f] px-4 py-12 text-black sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-end">
          <div>
            <p className="!m-0 max-w-3xl text-3xl font-black uppercase leading-none tracking-[-0.06em] sm:text-5xl">
              From messy process to AI-ready operating system.
            </p>
            <p className="!m-0 mt-4 max-w-2xl text-base font-medium leading-7 text-black/72">
              Axiom Studio sells structured systems. Axiom Architect applies
              that thinking to your real workflows, tools, handoffs, and
              operational decisions.
            </p>
          </div>

          <div className="grid gap-3">
            <a
              href="https://axiom-studio.co/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-13 items-center justify-center border border-black bg-black px-5 py-4 text-center text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f] transition hover:bg-white hover:text-black sm:text-xs"
            >
              Visit Axiom Studio
            </a>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {studioLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center justify-center border border-black/35 bg-[#9ed39f] px-4 py-3 text-center text-[0.62rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-b border-[#9ed39f]/20 bg-black px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(158,211,159,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.1)_1px,transparent_1px)] [background-size:36px_36px]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="!m-0 text-[0.68rem] font-black uppercase tracking-[0.28em] text-[#9ed39f]">
              The problem
            </p>
            <h2 className="!m-0 !mt-4 !max-w-none !text-[clamp(2.15rem,5vw,5.2rem)] !font-black !uppercase !leading-[0.95] !tracking-[-0.07em] text-white">
              AI does not fix a workflow you cannot see.
            </h2>
            <p className="!m-0 mt-6 max-w-2xl text-base leading-8 text-white/68">
              Most teams do not need another vague automation idea. They need a
              clear view of the current process, where the risk sits, and where
              AI can support execution without weakening control.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden border border-[#9ed39f]/25 bg-[#9ed39f]/25 lg:grid-cols-3">
            {problemSignals.map((item) => (
              <article key={item.title} className="bg-[#030804] p-6 sm:p-8">
                <span className="mb-10 block h-1 w-16 bg-[#9ed39f]" />
                <h3 className="!m-0 !text-lg !font-black !uppercase !tracking-[-0.02em] text-white">
                  {item.title}
                </h3>
                <p className="!m-0 mt-4 text-sm leading-7 text-white/64">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="audit" className="border-b border-[#9ed39f]/20 bg-[#020503] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="!m-0 text-[0.68rem] font-black uppercase tracking-[0.28em] text-[#9ed39f]">
              Primary offer
            </p>
            <h2 className="!m-0 !mt-4 !max-w-none !text-[clamp(2.15rem,5vw,5.1rem)] !font-black !uppercase !leading-[0.95] !tracking-[-0.07em] text-white">
              Axiom Workflow Audit
            </h2>
          </div>

          <div className="border border-[#9ed39f]/30 bg-black/60 p-6 sm:p-8 lg:p-10">
            <p className="!m-0 text-xl font-semibold leading-9 text-white sm:text-2xl">
              A focused diagnostic that turns one messy workflow, operating
              process, tool stack, or business problem into a structured
              blueprint for AI-supported execution.
            </p>
            <p className="!m-0 mt-6 text-base leading-8 text-white/66">
              The audit separates useful automation from risky shortcuts. It
              identifies what should be improved, what can be assisted by AI,
              what still needs human review, and what sequence makes sense.
            </p>
          </div>
        </div>
      </section>

      <section id="method" className="border-b border-[#9ed39f]/20 bg-black px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="!m-0 text-[0.68rem] font-black uppercase tracking-[0.28em] text-[#9ed39f]">
                How it works
              </p>
              <h2 className="!m-0 !mt-4 !max-w-none !text-[clamp(2.15rem,5vw,5rem)] !font-black !uppercase !leading-[0.95] !tracking-[-0.07em] text-white">
                Submit. Diagnose. Blueprint. Implement.
              </h2>
            </div>
            <p className="!m-0 max-w-lg text-base leading-8 text-white/64">
              The process is designed to create clarity before software,
              assistants, automations, or implementation work begins.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden border border-[#9ed39f]/25 bg-[#9ed39f]/25 md:grid-cols-2 lg:grid-cols-4">
            {methodSteps.map((step) => (
              <article key={step.number} className="bg-[#030804] p-6 sm:p-8">
                <span className="block text-[0.72rem] font-black uppercase tracking-[0.26em] text-[#9ed39f]">
                  {step.number}
                </span>
                <h3 className="!m-0 !mt-12 !text-xl !font-black !uppercase !tracking-[-0.03em] text-white">
                  {step.title}
                </h3>
                <p className="!m-0 mt-4 text-sm leading-7 text-white/64">
                  {step.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="deliverables" className="relative border-b border-[#9ed39f]/20 bg-[#020503] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div>
            <p className="!m-0 text-[0.68rem] font-black uppercase tracking-[0.28em] text-[#9ed39f]">
              What you receive
            </p>
            <h2 className="!m-0 !mt-4 !max-w-none !text-[clamp(2.15rem,5vw,5rem)] !font-black !uppercase !leading-[0.95] !tracking-[-0.07em] text-white">
              A practical blueprint, not a generic AI answer.
            </h2>
            <p className="!m-0 mt-6 max-w-xl text-base leading-8 text-white/66">
              The output is structured so you can brief a team, improve the
              workflow, configure assistants, or plan the next implementation
              layer with better judgment.
            </p>
          </div>

          <div className="border border-[#9ed39f]/30 bg-black">
            <div className="flex items-center justify-between border-b border-[#9ed39f]/25 px-5 py-4 text-[0.62rem] font-black uppercase tracking-[0.22em] text-[#9ed39f]">
              <span>Audit report</span>
              <span>Blueprint output</span>
            </div>

            <div className="divide-y divide-[#9ed39f]/18">
              {deliverables.map((item, index) => (
                <div
                  key={item}
                  className="grid grid-cols-[3.5rem_1fr] items-center gap-4 px-5 py-5"
                >
                  <span className="text-[0.72rem] font-black uppercase tracking-[0.22em] text-[#9ed39f]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-bold uppercase tracking-[0.12em] text-white sm:text-base">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#9ed39f]/20 bg-black px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="!m-0 text-[0.68rem] font-black uppercase tracking-[0.28em] text-[#9ed39f]">
              Who it is for
            </p>
            <h2 className="!m-0 !mt-4 !max-w-none !text-[clamp(2.15rem,5vw,5rem)] !font-black !uppercase !leading-[0.95] !tracking-[-0.07em] text-white">
              For people building real operations, not chasing AI noise.
            </h2>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {audiences.map((item) => (
              <span
                key={item}
                className="border border-[#9ed39f]/35 bg-[#9ed39f]/8 px-5 py-4 text-xs font-black uppercase tracking-[0.2em] text-white"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="border-b border-[#9ed39f]/20 bg-[#020503] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="!m-0 text-[0.68rem] font-black uppercase tracking-[0.28em] text-[#9ed39f]">
                Service ladder
              </p>
              <h2 className="!m-0 !mt-4 !max-w-none !text-[clamp(2.15rem,5vw,5rem)] !font-black !uppercase !leading-[0.95] !tracking-[-0.07em] text-white">
                Start with diagnosis. Build toward an operating system.
              </h2>
            </div>
            <p className="!m-0 max-w-lg text-base leading-8 text-white/64">
              The Workflow Audit is the first entry point. Deeper services can
              extend the diagnosis into protocols, agent instructions,
              implementation workbooks, or system builds.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden border border-[#9ed39f]/25 bg-[#9ed39f]/25 md:grid-cols-2 lg:grid-cols-3">
            {serviceLadder.map((service) => (
              <article key={service.name} className="bg-[#030804] p-6 sm:p-8">
                <span className="inline-flex border border-[#9ed39f]/28 bg-[#9ed39f]/8 px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">
                  {service.status}
                </span>
                <h3 className="!m-0 !mt-8 !text-xl !font-black !uppercase !tracking-[-0.04em] text-white">
                  {service.name}
                </h3>
                <p className="!m-0 mt-4 text-sm leading-7 text-white/64">
                  {service.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="start" className="relative overflow-hidden bg-black px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto max-w-7xl border border-[#9ed39f]/35 bg-[#030804]/92 p-6 sm:p-10 lg:p-14">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="!m-0 text-[0.68rem] font-black uppercase tracking-[0.28em] text-[#9ed39f]">
                Start Workflow Audit
              </p>
              <h2 className="!m-0 !mt-4 !max-w-4xl !text-[clamp(2.15rem,5vw,5.4rem)] !font-black !uppercase !leading-[0.95] !tracking-[-0.07em] text-white">
                Bring one messy workflow. Leave with a structured plan.
              </h2>
              <p className="!m-0 mt-6 max-w-2xl text-base leading-8 text-white/66">
                Axiom Architect begins with a single workflow audit: one process,
                one diagnosis, one practical blueprint for better AI-supported
                execution.
              </p>
            </div>

            <a
              href="mailto:hello@axiom-architect.co?subject=Start%20Workflow%20Audit"
              className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-7 text-center text-xs font-black uppercase tracking-[0.22em] text-black transition hover:bg-white sm:min-w-64"
            >
              Start Workflow Audit
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}



