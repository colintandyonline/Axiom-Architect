import Image from "next/image";

const studioLinks = [
  {
    name: "Protocols",
    href: "https://axiom-studio.co/collections/protocols",
    icon: "protocol",
  },
  {
    name: "Agent Kits",
    href: "https://axiom-studio.co/collections/agent-kits",
    icon: "agent",
  },
  {
    name: "Workbooks",
    href: "https://axiom-studio.co/collections/workbooks",
    icon: "workbook",
  },
  {
    name: "Operating Packs",
    href: "https://axiom-studio.co/collections/operating-packs",
    icon: "operating",
  },
];

const problemSignals = [
  {
    title: "Messy workflows",
    text: "Processes live across chats, spreadsheets, inboxes, documents, and memory. The work gets done, but the system is hard to see.",
    icon: "messy",
  },
  {
    title: "Unclear AI use",
    text: "Teams know AI could help, but not which steps it should touch, what context it needs, or where human judgment must stay in control.",
    icon: "spark",
  },
  {
    title: "Automation risk",
    text: "Automating too early can amplify weak inputs, unclear approvals, fragile handoffs, and decisions that still need review gates.",
    icon: "shield",
  },
];

const methodSteps = [
  {
    number: "01",
    title: "Submit",
    text: "You describe the workflow, tools, handoffs, bottlenecks, repeated tasks, review points, and desired outcome.",
    icon: "submit",
  },
  {
    number: "02",
    title: "Diagnose",
    text: "Axiom Architect maps the current operating pattern and identifies weak points, friction, risk, and automation suitability.",
    icon: "diagnose",
  },
  {
    number: "03",
    title: "Blueprint",
    text: "You receive a structured implementation blueprint showing what should change, what AI can support, and what needs control.",
    icon: "blueprint",
  },
  {
    number: "04",
    title: "Implement",
    text: "Use the blueprint to brief your team, configure assistants, improve tooling, or move into a deeper system build.",
    icon: "implement",
  },
];

const deliverables = [
  {
    title: "Current workflow diagnosis",
    text: "A clear view of the process, current shape, handoffs, and where the system weakens.",
    icon: "map",
  },
  {
    title: "Bottlenecks and weak points",
    text: "Friction, repeated manual effort, approval slowdowns, and process breakpoints.",
    icon: "bottleneck",
  },
  {
    title: "Automation opportunities",
    text: "Where automation can support execution without amplifying weak inputs.",
    icon: "automation",
  },
  {
    title: "AI assistant opportunities",
    text: "Where assistants can support drafting, sorting, summarising, routing, or preparation.",
    icon: "assistant",
  },
  {
    title: "Risk and review requirements",
    text: "Human-in-the-loop review gates, quality control, and operational safeguards.",
    icon: "review",
  },
  {
    title: "Implementation blueprint",
    text: "A structured operating model with recommended next steps and execution sequence.",
    icon: "roadmap",
  },
];

const audiences = [
  { name: "Founders", icon: "founder" },
  { name: "Operators", icon: "operator" },
  { name: "Consultants", icon: "consultant" },
  { name: "Creators", icon: "creator" },
  { name: "Small teams", icon: "team" },
];

const serviceLadder = [
  {
    name: "Workflow Audit",
    status: "Launch offer",
    text: "A focused diagnostic for one workflow, process, or operating problem.",
    icon: "audit",
  },
  {
    name: "Workflow Blueprint",
    status: "Next layer",
    text: "A deeper operating model with implementation structure and sequence.",
    icon: "blueprint",
  },
  {
    name: "Custom AI Operating Protocol",
    status: "System asset",
    text: "Rules, prompts, review gates, and execution standards for repeated work.",
    icon: "protocol",
  },
  {
    name: "Agent Instruction Kit",
    status: "Assistant layer",
    text: "Role-specific assistant instructions designed around your workflow.",
    icon: "agent",
  },
  {
    name: "Implementation Workbook",
    status: "Action layer",
    text: "A practical workbook for moving from diagnosis into structured change.",
    icon: "workbook",
  },
  {
    name: "AI Workflow System Build",
    status: "Build layer",
    text: "A larger service path for designing and building the operating system.",
    icon: "build",
  },
];

const heroSignals = [
  "Workflow diagnostics",
  "Operating blueprints",
  "AI system design",
  "Review gates",
];

function AxiomIcon({
  kind,
  className = "",
}: {
  kind: string;
  className?: string;
}) {
  const baseProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };

  switch (kind) {
    case "protocol":
      return (
        <svg {...baseProps}>
          <path d="M8 3h8l4 4v14H8z" />
          <path d="M16 3v5h5" />
          <path d="M11 12h6" />
          <path d="M11 16h6" />
          <path d="M11 8h2" />
        </svg>
      );
    case "agent":
      return (
        <svg {...baseProps}>
          <rect x="5" y="7" width="14" height="10" rx="2" />
          <path d="M9 21h6" />
          <path d="M12 17v4" />
          <circle cx="12" cy="12" r="2" />
          <path d="M8 3l4 2 4-2" />
        </svg>
      );
    case "workbook":
      return (
        <svg {...baseProps}>
          <path d="M6 4h11a2 2 0 0 1 2 2v14H8a2 2 0 0 0-2 2z" />
          <path d="M6 4a2 2 0 0 0-2 2v14" />
          <path d="M10 9h5" />
          <path d="M10 13h5" />
        </svg>
      );
    case "operating":
      return (
        <svg {...baseProps}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M7 9h10" />
          <path d="M7 13h5" />
          <path d="M15.5 13h1" />
          <path d="M7 17h3" />
        </svg>
      );
    case "messy":
      return (
        <svg {...baseProps}>
          <path d="M4 7h7" />
          <path d="M13 7h7" />
          <path d="M4 12h4" />
          <path d="M10 12h10" />
          <path d="M4 17h9" />
          <path d="M15 17h5" />
        </svg>
      );
    case "spark":
      return (
        <svg {...baseProps}>
          <path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8z" />
          <path d="M19 4v3" />
          <path d="M20.5 5.5h-3" />
        </svg>
      );
    case "shield":
      return (
        <svg {...baseProps}>
          <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z" />
          <path d="M9.5 12l1.6 1.6 3.4-3.6" />
        </svg>
      );
    case "submit":
      return (
        <svg {...baseProps}>
          <path d="M12 3v14" />
          <path d="M7 8l5-5 5 5" />
          <path d="M5 21h14" />
        </svg>
      );
    case "diagnose":
      return (
        <svg {...baseProps}>
          <circle cx="11" cy="11" r="6" />
          <path d="M20 20l-4.2-4.2" />
          <path d="M11 8v3l2 2" />
        </svg>
      );
    case "blueprint":
      return (
        <svg {...baseProps}>
          <rect x="4" y="5" width="16" height="14" rx="1" />
          <path d="M8 9h4" />
          <path d="M8 13h8" />
          <path d="M8 17h5" />
        </svg>
      );
    case "implement":
      return (
        <svg {...baseProps}>
          <path d="M14 4l6 6-9 9H5v-6z" />
          <path d="M13 5l6 6" />
        </svg>
      );
    case "map":
      return (
        <svg {...baseProps}>
          <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z" />
          <path d="M9 4v14" />
          <path d="M15 6v14" />
        </svg>
      );
    case "bottleneck":
      return (
        <svg {...baseProps}>
          <path d="M4 6h16" />
          <path d="M8 10h8" />
          <path d="M10 14h4" />
          <path d="M11 18h2" />
        </svg>
      );
    case "automation":
      return (
        <svg {...baseProps}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3" />
          <path d="M12 19v3" />
          <path d="M2 12h3" />
          <path d="M19 12h3" />
          <path d="M5 5l2 2" />
          <path d="M17 17l2 2" />
          <path d="M19 5l-2 2" />
          <path d="M7 17l-2 2" />
        </svg>
      );
    case "assistant":
      return (
        <svg {...baseProps}>
          <rect x="5" y="6" width="14" height="10" rx="3" />
          <circle cx="10" cy="11" r="1" />
          <circle cx="14" cy="11" r="1" />
          <path d="M9 16v2h6v-2" />
        </svg>
      );
    case "review":
      return (
        <svg {...baseProps}>
          <path d="M9 11l2 2 4-4" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
    case "roadmap":
      return (
        <svg {...baseProps}>
          <path d="M5 19V5" />
          <path d="M19 19V9" />
          <path d="M5 7h8l2 2h4" />
          <circle cx="5" cy="19" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="19" cy="9" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      );
    case "founder":
      return (
        <svg {...baseProps}>
          <path d="M12 3l2.1 4.3 4.7.7-3.4 3.3.8 4.7-4.2-2.2-4.2 2.2.8-4.7L5.2 8l4.7-.7z" />
        </svg>
      );
    case "operator":
      return (
        <svg {...baseProps}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 7v5l3 3" />
        </svg>
      );
    case "consultant":
      return (
        <svg {...baseProps}>
          <path d="M6 18h12" />
          <path d="M8 18V9l4-4 4 4v9" />
        </svg>
      );
    case "creator":
      return (
        <svg {...baseProps}>
          <path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
        </svg>
      );
    case "team":
      return (
        <svg {...baseProps}>
          <circle cx="9" cy="10" r="2.5" />
          <circle cx="16" cy="9" r="2" />
          <path d="M5.5 18a4 4 0 0 1 7 0" />
          <path d="M14.2 18a3.4 3.4 0 0 1 4.3-2.8" />
        </svg>
      );
    case "audit":
      return (
        <svg {...baseProps}>
          <path d="M8 3h8l4 4v12H8z" />
          <path d="M16 3v5h5" />
          <path d="M10 12h6" />
          <path d="M10 16h4" />
        </svg>
      );
    case "build":
      return (
        <svg {...baseProps}>
          <path d="M14 5l5 5-8 8-5 1 1-5z" />
          <path d="M13 6l5 5" />
        </svg>
      );
    default:
      return (
        <svg {...baseProps}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}

function DropdownCard({
  name,
  href,
  icon,
}: {
  name: string;
  href: string;
  icon: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center gap-3 border border-[#9ed39f]/15 px-4 py-3 text-[0.74rem] font-semibold tracking-[0.04em] text-[#9ed39f] transition duration-200 hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black"
    >
      <span className="flex h-9 w-9 items-center justify-center border border-current/30 bg-black/20 transition group-hover:bg-white/20">
        <AxiomIcon kind={icon} className="h-4 w-4" />
      </span>
      <span>{name}</span>
    </a>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <header className="fixed left-0 top-0 z-50 w-full border-b border-[#9ed39f]/30 bg-black/88 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1920px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <a
            href="#top"
            aria-label="Axiom Architect home"
            className="flex min-w-0 items-center gap-4"
          >
            <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden border border-[#9ed39f]/40 bg-black shadow-[0_0_22px_rgba(158,211,159,0.15)]">
              <Image
                src="/brand/axiom-logo.png"
                alt=""
                width={56}
                height={56}
                priority
                className="h-full w-full object-contain"
              />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-black uppercase tracking-[0.28em] text-white sm:text-[1.05rem]">
                Axiom Architect
              </span>
              <span className="mt-1 block text-[0.72rem] uppercase tracking-[0.24em] text-[#9ed39f]/82 sm:text-[0.84rem]">
                The architecture behind intelligent work
              </span>
            </span>
          </a>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-8 text-[0.76rem] font-semibold text-[#9ed39f] lg:flex"
          >
            <a
              className="uppercase tracking-[0.18em] transition duration-200 hover:text-white"
              href="#audit"
            >
              Audit
            </a>
            <a
              className="uppercase tracking-[0.18em] transition duration-200 hover:text-white"
              href="#method"
            >
              Method
            </a>
            <a
              className="uppercase tracking-[0.18em] transition duration-200 hover:text-white"
              href="#deliverables"
            >
              Deliverables
            </a>
            <a
              className="uppercase tracking-[0.18em] transition duration-200 hover:text-white"
              href="#services"
            >
              Services
            </a>

            <div className="group relative">
              <button
                type="button"
                className="flex items-center gap-2 uppercase tracking-[0.18em] text-[#9ed39f] transition duration-200 hover:text-white"
                aria-haspopup="true"
              >
                Core Systems
                <span className="text-[0.9rem] leading-none transition duration-200 group-hover:translate-y-[1px] group-hover:text-white">
                  ˅
                </span>
              </button>

              <div className="invisible absolute left-1/2 top-9 z-50 grid min-w-80 -translate-x-1/2 gap-2 border border-[#9ed39f]/35 bg-black/96 p-3 opacity-0 shadow-[0_22px_60px_rgba(0,0,0,0.55)] transition duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                {studioLinks.map((link) => (
                  <DropdownCard
                    key={link.name}
                    name={link.name}
                    href={link.href}
                    icon={link.icon}
                  />
                ))}
              </div>
            </div>

            <a
              className="uppercase tracking-[0.18em] transition duration-200 hover:text-white"
              href="https://axiom-studio.co/"
              target="_blank"
              rel="noreferrer"
            >
              Axiom Studio
            </a>
          </nav>

          <a
            href="#start"
            className="inline-flex min-h-12 shrink-0 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-5 text-center text-[0.72rem] font-black uppercase tracking-[0.22em] text-black transition duration-200 hover:-translate-y-0.5 hover:bg-white sm:px-7"
          >
            <span className="hidden min-[430px]:inline">Start Audit</span>
            <span className="min-[430px]:hidden">Start</span>
          </a>
        </div>
      </header>

      <section id="top" className="pt-[6.6rem] sm:pt-[7.2rem]">
        <div className="border-b border-[#9ed39f]/25 bg-black px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
          <div className="mx-auto max-w-[1920px]">
            <div className="overflow-hidden border border-[#9ed39f]/32 bg-[#020503] shadow-[0_26px_90px_rgba(0,0,0,0.45)]">
              <div className="relative aspect-[16/10] min-h-[320px] sm:aspect-[16/8] sm:min-h-[420px] lg:aspect-[16/6.8] xl:aspect-[16/5.7]">
                <Image
                  src="/brand/axiom-architect-header-1920x1080-final.png"
                  alt="Axiom Architect system banner"
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-center"
                />

                <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/16" />

                <div className="absolute left-0 top-0 z-10 flex flex-wrap gap-2 p-4 sm:p-5 lg:p-6">
                  <span className="inline-flex items-center gap-2 border border-[#9ed39f]/40 bg-black/72 px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.22em] text-[#9ed39f] backdrop-blur-sm">
                    <AxiomIcon kind="diagnose" className="h-3.5 w-3.5" />
                    AI workflow architecture
                  </span>
                  <span className="inline-flex items-center gap-2 border border-[#9ed39f]/32 bg-[#9ed39f]/16 px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.22em] text-[#9ed39f] backdrop-blur-sm">
                    <AxiomIcon kind="audit" className="h-3.5 w-3.5" />
                    Axiom Workflow Audit
                  </span>
                </div>
              </div>

              <div className="border-t border-[#9ed39f]/32 bg-[#020503] p-5 sm:p-7 lg:p-9">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
                  <div>
                    <h1 className="max-w-5xl text-[clamp(2.8rem,7vw,6.8rem)] font-black uppercase leading-[0.9] tracking-[-0.08em] text-white">
                      AI workflow architecture for real business operations.
                    </h1>
                    <p className="mt-5 max-w-3xl text-base leading-7 text-white/82 sm:text-lg sm:leading-8">
                      Axiom Architect turns messy workflows into structured
                      diagnostics, automation opportunities, review gates, and
                      practical implementation blueprints.
                    </p>
                  </div>

                  <div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                      {heroSignals.map((item) => (
                        <div
                          key={item}
                          className="border border-[#9ed39f]/28 bg-[#061008] px-3 py-3 transition duration-200 hover:-translate-y-0.5 hover:border-[#9ed39f]/55 hover:bg-[#9ed39f]/10"
                        >
                          <span className="block text-[0.56rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]/78">
                            Signal
                          </span>
                          <span className="mt-1 block text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <a
                        href="#start"
                        className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-6 text-center text-[0.72rem] font-black uppercase tracking-[0.22em] text-black transition duration-200 hover:-translate-y-0.5 hover:bg-white sm:min-w-56"
                      >
                        Start Workflow Audit
                      </a>
                      <a
                        href="#deliverables"
                        className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f]/32 bg-black/35 px-6 text-center text-[0.72rem] font-black uppercase tracking-[0.22em] text-white transition duration-200 hover:-translate-y-0.5 hover:border-[#9ed39f] hover:bg-[#9ed39f]/12 hover:text-[#9ed39f] sm:min-w-56"
                      >
                        View Deliverables
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#9ed39f]/20 bg-[#9ed39f] px-4 py-14 text-black sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1920px] grid-cols-1 gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <div>
            <p className="text-[clamp(2.7rem,5vw,5.6rem)] font-black uppercase leading-[0.9] tracking-[-0.07em]">
              From messy process to AI-ready operating system.
            </p>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-black/78">
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
              className="inline-flex min-h-14 items-center justify-center border border-black bg-black px-6 text-center text-[0.74rem] font-black uppercase tracking-[0.22em] text-[#9ed39f] transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-black"
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
                  className="group inline-flex min-h-14 items-center justify-center gap-3 border border-black/18 bg-[#9ed39f] px-4 py-3 text-center text-[0.72rem] font-black uppercase tracking-[0.2em] text-black transition duration-200 hover:-translate-y-0.5 hover:bg-white"
                >
                  <AxiomIcon kind={link.icon} className="h-4 w-4" />
                  <span>{link.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#9ed39f]/20 bg-black px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[1920px]">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 border border-[#9ed39f]/30 bg-[#9ed39f]/10 px-3 py-2 text-[0.68rem] font-black uppercase tracking-[0.24em] text-[#9ed39f]">
              <AxiomIcon kind="messy" className="h-4 w-4" />
              The problem
            </p>
            <h2 className="mt-5 text-[clamp(2.2rem,5vw,5.3rem)] font-black uppercase leading-[0.93] tracking-[-0.07em] text-white">
              AI does not fix a workflow you cannot see.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70">
              Most teams do not need another vague automation idea. They need a
              clear view of the current process, where the risk sits, and where
              AI can support execution without weakening control.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 xl:grid-cols-3">
            {problemSignals.map((item) => (
              <article
                key={item.title}
                className="group border border-[#9ed39f]/25 bg-[#030804] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#9ed39f]/55 hover:bg-[#07120a]"
              >
                <div className="flex h-14 w-14 items-center justify-center border border-[#9ed39f]/35 bg-[#9ed39f]/10 text-[#9ed39f] transition duration-300 group-hover:bg-[#9ed39f] group-hover:text-black">
                  <AxiomIcon kind={item.icon} className="h-6 w-6" />
                </div>
                <h3 className="mt-7 text-2xl font-black uppercase tracking-[-0.03em] text-white">
                  {item.title}
                </h3>
                <p className="mt-4 text-base leading-8 text-white/68">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="audit"
        className="border-b border-[#9ed39f]/20 bg-[#020503] px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
      >
        <div className="mx-auto grid max-w-[1920px] grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <p className="inline-flex items-center gap-2 border border-[#9ed39f]/30 bg-[#9ed39f]/10 px-3 py-2 text-[0.68rem] font-black uppercase tracking-[0.24em] text-[#9ed39f]">
              <AxiomIcon kind="audit" className="h-4 w-4" />
              Primary offer
            </p>
            <h2 className="mt-5 text-[clamp(2.2rem,5vw,5.2rem)] font-black uppercase leading-[0.93] tracking-[-0.07em] text-white">
              Axiom Workflow Audit
            </h2>
          </div>

          <div className="border border-[#9ed39f]/30 bg-black/70 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.3)] sm:p-8 lg:p-10">
            <p className="text-xl font-semibold leading-9 text-white sm:text-2xl">
              A focused diagnostic that turns one messy workflow, operating
              process, tool stack, or business problem into a structured
              blueprint for AI-supported execution.
            </p>
            <p className="mt-6 text-base leading-8 text-white/68">
              The audit separates useful automation from risky shortcuts. It
              identifies what should be improved, what can be assisted by AI,
              what still needs human review, and what sequence makes sense.
            </p>
          </div>
        </div>
      </section>

      <section
        id="method"
        className="border-b border-[#9ed39f]/20 bg-black px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
      >
        <div className="mx-auto max-w-[1920px]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 border border-[#9ed39f]/30 bg-[#9ed39f]/10 px-3 py-2 text-[0.68rem] font-black uppercase tracking-[0.24em] text-[#9ed39f]">
                <AxiomIcon kind="roadmap" className="h-4 w-4" />
                How it works
              </p>
              <h2 className="mt-5 text-[clamp(2.2rem,5vw,5rem)] font-black uppercase leading-[0.93] tracking-[-0.07em] text-white">
                Submit. Diagnose. Blueprint. Implement.
              </h2>
            </div>
            <p className="max-w-lg text-base leading-8 text-white/66">
              The process is designed to create clarity before software,
              assistants, automations, or implementation work begins.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden border border-[#9ed39f]/25 bg-[#9ed39f]/25 md:grid-cols-2 xl:grid-cols-4">
            {methodSteps.map((step) => (
              <article
                key={step.number}
                className="group bg-[#031007] p-8 transition duration-300 hover:bg-[#07150c]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[0.74rem] font-black uppercase tracking-[0.26em] text-[#9ed39f]">
                    {step.number}
                  </span>
                  <span className="flex h-11 w-11 items-center justify-center border border-[#9ed39f]/30 bg-[#9ed39f]/10 text-[#9ed39f] transition duration-300 group-hover:bg-[#9ed39f] group-hover:text-black">
                    <AxiomIcon kind={step.icon} className="h-5 w-5" />
                  </span>
                </div>
                <h3 className="mt-14 text-2xl font-black uppercase tracking-[-0.03em] text-white">
                  {step.title}
                </h3>
                <p className="mt-4 text-base leading-8 text-white/66">
                  {step.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="deliverables"
        className="border-b border-[#9ed39f]/20 bg-[#020503] px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
      >
        <div className="mx-auto max-w-[1920px]">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 border border-[#9ed39f]/30 bg-[#9ed39f]/10 px-3 py-2 text-[0.68rem] font-black uppercase tracking-[0.24em] text-[#9ed39f]">
              <AxiomIcon kind="blueprint" className="h-4 w-4" />
              What you receive
            </p>
            <h2 className="mt-5 text-[clamp(2.2rem,5vw,5rem)] font-black uppercase leading-[0.93] tracking-[-0.07em] text-white">
              A practical blueprint, not a generic AI answer.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/68">
              The output is structured so you can brief a team, improve the
              workflow, configure assistants, or plan the next implementation
              layer with better judgment.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {deliverables.map((item) => (
              <article
                key={item.title}
                className="group border border-[#9ed39f]/25 bg-black/75 p-7 transition duration-300 hover:-translate-y-1 hover:border-[#9ed39f]/55 hover:bg-[#051109]"
              >
                <div className="flex h-14 w-14 items-center justify-center border border-[#9ed39f]/35 bg-[#9ed39f]/12 text-[#9ed39f] transition duration-300 group-hover:bg-[#9ed39f] group-hover:text-black">
                  <AxiomIcon kind={item.icon} className="h-6 w-6" />
                </div>
                <h3 className="mt-7 text-[1.55rem] font-black uppercase tracking-[-0.03em] text-white">
                  {item.title}
                </h3>
                <p className="mt-4 text-base leading-8 text-white/66">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#9ed39f]/20 bg-black px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[1920px]">
          <div className="max-w-4xl">
            <p className="inline-flex items-center gap-2 border border-[#9ed39f]/30 bg-[#9ed39f]/10 px-3 py-2 text-[0.68rem] font-black uppercase tracking-[0.24em] text-[#9ed39f]">
              <AxiomIcon kind="team" className="h-4 w-4" />
              Who it is for
            </p>
            <h2 className="mt-5 text-[clamp(2.3rem,6vw,5.6rem)] font-black uppercase leading-[0.93] tracking-[-0.07em] text-white">
              For people building real operations, not chasing AI noise.
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {audiences.map((item) => (
              <div
                key={item.name}
                className="group flex items-center gap-3 border border-[#9ed39f]/28 bg-[#051008] px-5 py-5 text-white transition duration-300 hover:-translate-y-1 hover:border-[#9ed39f]/55 hover:bg-[#9ed39f] hover:text-black"
              >
                <AxiomIcon kind={item.icon} className="h-5 w-5 shrink-0" />
                <span className="text-sm font-black uppercase tracking-[0.22em]">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="services"
        className="border-b border-[#9ed39f]/20 bg-[#010302] px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
      >
        <div className="mx-auto max-w-[1920px]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 border border-[#9ed39f]/30 bg-[#9ed39f]/10 px-3 py-2 text-[0.68rem] font-black uppercase tracking-[0.24em] text-[#9ed39f]">
                <AxiomIcon kind="build" className="h-4 w-4" />
                Service ladder
              </p>
              <h2 className="mt-5 text-[clamp(2.2rem,5vw,5rem)] font-black uppercase leading-[0.93] tracking-[-0.07em] text-white">
                Start with diagnosis. Build toward an operating system.
              </h2>
            </div>
            <p className="max-w-lg text-base leading-8 text-white/66">
              The Workflow Audit is the first entry point. Deeper services can
              extend the diagnosis into protocols, agent instructions,
              implementation workbooks, or system builds.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden border border-[#9ed39f]/25 bg-[#9ed39f]/20 xl:grid-cols-3">
            {serviceLadder.map((service) => (
              <article
                key={service.name}
                className="group bg-[#031007] p-8 transition duration-300 hover:bg-[#08170e]"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex border border-[#9ed39f]/28 bg-[#9ed39f]/10 px-4 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-[#9ed39f]">
                    {service.status}
                  </span>
                  <span className="flex h-11 w-11 items-center justify-center border border-[#9ed39f]/30 bg-[#9ed39f]/10 text-[#9ed39f] transition duration-300 group-hover:bg-[#9ed39f] group-hover:text-black">
                    <AxiomIcon kind={service.icon} className="h-5 w-5" />
                  </span>
                </div>
                <h3 className="mt-12 text-[1.55rem] font-black uppercase tracking-[-0.04em] text-white">
                  {service.name}
                </h3>
                <p className="mt-4 text-base leading-8 text-white/66">
                  {service.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="start"
        className="relative overflow-hidden bg-black px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
      >
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(158,211,159,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.12)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto max-w-[1920px] border border-[#9ed39f]/35 bg-[#031007]/92 p-7 shadow-[0_26px_90px_rgba(0,0,0,0.42)] sm:p-10 lg:p-14">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="inline-flex items-center gap-2 border border-[#9ed39f]/30 bg-[#9ed39f]/10 px-3 py-2 text-[0.68rem] font-black uppercase tracking-[0.24em] text-[#9ed39f]">
                <AxiomIcon kind="audit" className="h-4 w-4" />
                Start Workflow Audit
              </p>
              <h2 className="mt-5 max-w-4xl text-[clamp(2.2rem,5vw,5.4rem)] font-black uppercase leading-[0.93] tracking-[-0.07em] text-white">
                Bring one messy workflow. Leave with a structured plan.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/68">
                Axiom Architect begins with a single workflow audit: one
                process, one diagnosis, one practical blueprint for better
                AI-supported execution.
              </p>
            </div>

            <a
              href="mailto:hello@axiom-architect.co?subject=Start%20Workflow%20Audit"
              className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-8 text-center text-[0.72rem] font-black uppercase tracking-[0.22em] text-black transition duration-200 hover:-translate-y-0.5 hover:bg-white sm:min-w-72"
            >
              Start Workflow Audit
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

