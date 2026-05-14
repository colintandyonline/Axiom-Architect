import Image from "next/image";
import type { ReactNode } from "react";

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
    text: "Work is spread across inboxes, chats, documents, meetings, tools, and memory. The operation runs, but the system is hard to see.",
    icon: "messy",
  },
  {
    title: "Unclear AI use",
    text: "AI feels useful, but the right role is unclear: what it should touch, what it should prepare, and where human judgement must stay.",
    icon: "spark",
  },
  {
    title: "Automation risk",
    text: "Automating too early can make weak inputs, unclear handoffs, and missing review gates fail faster at a larger scale.",
    icon: "shield",
  },
];

const methodSteps = [
  {
    number: "01",
    title: "Submit",
    text: "You describe the workflow, tools, pain points, handoffs, review requirements, repeated tasks, and desired outcome.",
    icon: "submit",
  },
  {
    number: "02",
    title: "Diagnose",
    text: "Axiom Architect maps the operating pattern, weak points, bottlenecks, risk areas, and automation suitability.",
    icon: "diagnose",
  },
  {
    number: "03",
    title: "Blueprint",
    text: "You receive a structured operating blueprint showing what should change, where AI belongs, and where controls are needed.",
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
    text: "A clear view of how the process works now, where the work moves, and where it breaks down.",
    icon: "map",
  },
  {
    title: "Bottlenecks and weak points",
    text: "Repeated friction, manual effort, approval delays, missing inputs, and fragile handoffs.",
    icon: "bottleneck",
  },
  {
    title: "Automation opportunities",
    text: "Where automation can safely reduce manual effort without amplifying weak process design.",
    icon: "automation",
  },
  {
    title: "AI assistant opportunities",
    text: "Where assistants can support drafting, sorting, summarising, routing, preparation, or review.",
    icon: "assistant",
  },
  {
    title: "Risk and review requirements",
    text: "Human-in-the-loop controls, quality checks, escalation points, and operational safeguards.",
    icon: "review",
  },
  {
    title: "Implementation blueprint",
    text: "A practical operating model with a recommended sequence for improving the workflow.",
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
    text: "A focused diagnostic for one workflow, process, tool stack, or operating problem.",
    icon: "audit",
  },
  {
    name: "Workflow Blueprint",
    status: "Next layer",
    text: "A deeper operating model with implementation structure, sequencing, and ownership.",
    icon: "blueprint",
  },
  {
    name: "Custom AI Operating Protocol",
    status: "System asset",
    text: "Rules, prompts, review gates, and execution standards for repeated AI-supported work.",
    icon: "protocol",
  },
  {
    name: "Agent Instruction Kit",
    status: "Assistant layer",
    text: "Role-specific assistant instructions designed around the real workflow and controls.",
    icon: "agent",
  },
  {
    name: "Implementation Workbook",
    status: "Action layer",
    text: "A practical workbook for moving from diagnosis into structured operational change.",
    icon: "workbook",
  },
  {
    name: "AI Workflow System Build",
    status: "Build layer",
    text: "A larger service path for designing and building the operating system around the work.",
    icon: "build",
  },
];

const heroSignals = [
  "Workflow diagnostics",
  "Operating blueprints",
  "Review gates",
  "Implementation plans",
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

function SectionLabel({
  icon,
  children,
}: {
  icon: string;
  children: ReactNode;
}) {
  return (
    <p className="inline-flex items-center gap-2 border border-[#9ed39f]/35 bg-[#9ed39f]/12 px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-[#9ed39f]">
      <AxiomIcon kind={icon} className="h-4 w-4" />
      {children}
    </p>
  );
}

function SectionIntro({
  icon,
  label,
  title,
  text,
}: {
  icon: string;
  label: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
      <div>
        <SectionLabel icon={icon}>{label}</SectionLabel>
        <h2 className="mt-5 max-w-5xl text-[clamp(2.55rem,5.6vw,5.8rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">
          {title}
        </h2>
      </div>
      {text ? (
        <p className="max-w-3xl text-base leading-8 text-white/72 sm:text-lg">
          {text}
        </p>
      ) : null}
    </div>
  );
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
      <header className="fixed left-0 top-0 z-50 w-full border-b border-[#9ed39f]/30 bg-black/90 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1920px] items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8">
          <a
            href="#top"
            aria-label="Axiom Architect home"
            className="flex min-w-0 items-center gap-3 sm:gap-4"
          >
            <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden border border-[#9ed39f]/40 bg-black shadow-[0_0_22px_rgba(158,211,159,0.15)] sm:h-14 sm:w-14">
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
              <span className="block max-w-[11rem] truncate text-[0.84rem] font-black uppercase tracking-[0.22em] text-white min-[430px]:max-w-none sm:text-[1.05rem] sm:tracking-[0.28em]">
                Axiom Architect
              </span>
              <span className="mt-1 hidden text-[0.72rem] uppercase tracking-[0.24em] text-[#9ed39f]/86 sm:block sm:text-[0.84rem]">
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
            className="inline-flex min-h-11 shrink-0 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-4 text-center text-[0.68rem] font-black uppercase tracking-[0.18em] text-black transition duration-200 hover:-translate-y-0.5 hover:bg-white sm:min-h-12 sm:px-7 sm:text-[0.72rem] sm:tracking-[0.22em]"
          >
            <span className="hidden min-[430px]:inline">Start Audit</span>
            <span className="min-[430px]:hidden">Start</span>
          </a>
        </div>
      </header>

      <section id="top" className="bg-black pt-[5.15rem] sm:pt-[7.35rem]">
        <div className="border-b border-[#9ed39f]/25 bg-black">
          <h1 className="sr-only">
            Axiom Architect — AI workflow architecture for real business
            operations
          </h1>

          <div className="relative w-full overflow-hidden border-y border-[#9ed39f]/25 bg-black">
            <div className="relative mx-auto aspect-[16/9] w-full max-w-[1920px] bg-black sm:min-h-[520px] lg:min-h-[720px]">
              <Image
                src="/brand/axiom-architect-hero-banner.png"
                alt="Axiom Architect — The architecture behind intelligent work"
                fill
                priority
                sizes="100vw"
                className="object-contain object-center md:object-cover"
              />
            </div>
          </div>

          <div className="bg-[#020503] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="inline-flex items-center gap-2 border border-[#9ed39f]/35 bg-[#9ed39f]/10 px-3 py-2 text-[0.58rem] font-black uppercase tracking-[0.16em] text-[#9ed39f] sm:text-[0.64rem] sm:tracking-[0.22em]">
                  <AxiomIcon kind="diagnose" className="h-3.5 w-3.5" />
                  Workflow diagnostics / operating blueprints / review gates
                </p>
                <p className="mt-5 max-w-4xl text-lg leading-8 text-white/82 sm:text-xl">
                  Axiom Architect turns messy workflows into structured
                  diagnostics, automation opportunities, human review gates, and
                  practical implementation blueprints.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="#start"
                  className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-6 text-center text-[0.72rem] font-black uppercase tracking-[0.22em] text-black transition duration-200 hover:-translate-y-0.5 hover:bg-white sm:min-w-60"
                >
                  Start Workflow Audit
                </a>
                <a
                  href="#deliverables"
                  className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f]/35 bg-black px-6 text-center text-[0.72rem] font-black uppercase tracking-[0.22em] text-white transition duration-200 hover:-translate-y-0.5 hover:border-[#9ed39f] hover:bg-[#9ed39f]/12 hover:text-[#9ed39f] sm:min-w-60"
                >
                  View Deliverables
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#9ed39f]/20 bg-[#9ed39f] px-4 py-16 text-black sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 border border-black/25 bg-black px-3 py-2 text-[0.68rem] font-black uppercase tracking-[0.22em] text-[#9ed39f]">
              <AxiomIcon kind="build" className="h-4 w-4" />
              Axiom Studio connection
            </p>

            <h2 className="mt-5 max-w-4xl text-[clamp(2.65rem,5vw,5.35rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-black">
              From messy process to AI-ready operating system.
            </h2>

            <p className="mt-5 max-w-3xl text-base leading-7 text-black/78 sm:text-lg sm:leading-8">
              Axiom Studio sells structured systems. Axiom Architect applies
              that thinking to your real workflows, tools, handoffs, and
              operational decisions.
            </p>
          </div>

          <div className="border border-black/22 bg-[#b8efb9]/35 p-4 sm:p-5 lg:p-6">
            <a
              href="https://axiom-studio.co/"
              target="_blank"
              rel="noreferrer"
              className="group flex min-h-16 w-full items-center justify-between gap-4 border border-black bg-black px-5 py-4 transition duration-200 hover:-translate-y-0.5 hover:bg-white"
            >
              <span className="flex items-center gap-3 text-[#9ed39f] transition group-hover:text-black">
                <AxiomIcon kind="build" className="h-5 w-5" />
                <span className="text-[0.78rem] font-black uppercase tracking-[0.22em]">
                  Visit Axiom Studio
                </span>
              </span>
              <span className="text-xl font-black text-[#9ed39f] transition group-hover:text-black">
                →
              </span>
            </a>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {studioLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex min-h-16 items-center justify-center gap-3 border border-black/28 bg-[#9ed39f] px-4 py-4 text-center text-[0.72rem] font-black uppercase tracking-[0.2em] text-black transition duration-200 hover:-translate-y-0.5 hover:border-black hover:bg-white"
                >
                  <AxiomIcon kind={link.icon} className="h-4 w-4" />
                  <span>{link.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-b border-[#9ed39f]/20 bg-black px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(158,211,159,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.1)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto max-w-[1440px]">
          <SectionIntro
            icon="messy"
            label="The problem"
            title="AI does not fix a workflow you cannot see."
            text="Before a workflow can be automated, assisted, or rebuilt, it needs to be understood as a system: inputs, decisions, handoffs, risks, controls, tools, and outcomes."
          />

          <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {problemSignals.map((item) => (
              <article
                key={item.title}
                className="group border border-[#9ed39f]/28 bg-[#061008] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#9ed39f]/60 hover:bg-[#0b1d10]"
              >
                <div className="flex h-14 w-14 items-center justify-center border border-[#9ed39f]/40 bg-[#9ed39f]/12 text-[#9ed39f] transition duration-300 group-hover:bg-[#9ed39f] group-hover:text-black">
                  <AxiomIcon kind={item.icon} className="h-6 w-6" />
                </div>
                <h3 className="mt-8 text-2xl font-black uppercase tracking-[-0.03em] text-white">
                  {item.title}
                </h3>
                <p className="mt-4 text-base leading-8 text-white/72">
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
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
          <div>
            <SectionLabel icon="audit">Primary offer</SectionLabel>
            <h2 className="mt-5 text-[clamp(2.7rem,5vw,5.8rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">
              Axiom Workflow Audit
            </h2>
          </div>

          <div className="border border-[#9ed39f]/32 bg-black/70 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.32)] sm:p-8 lg:p-10">
            <p className="text-2xl font-semibold leading-10 text-white lg:text-3xl">
              A focused diagnostic that turns one messy workflow, operating
              process, tool stack, or business problem into a structured
              blueprint for AI-supported execution.
            </p>
            <p className="mt-6 text-base leading-8 text-white/72 sm:text-lg">
              The audit separates useful automation from risky shortcuts. It
              identifies what should be improved, what can be assisted by AI,
              what still needs human review, and what sequence makes sense.
            </p>
          </div>
        </div>
      </section>

      <section
        id="method"
        className="relative border-b border-[#9ed39f]/20 bg-black px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
      >
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.09)_1px,transparent_1px)] [background-size:52px_52px]" />
        <div className="relative mx-auto max-w-[1440px]">
          <SectionIntro
            icon="roadmap"
            label="How it works"
            title="Submit. Diagnose. Blueprint. Implement."
            text="The process is designed to create operational clarity before software, assistants, automations, or implementation work begins."
          />

          <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden border border-[#9ed39f]/30 bg-[#9ed39f]/25 md:grid-cols-2 xl:grid-cols-4">
            {methodSteps.map((step) => (
              <article
                key={step.number}
                className="group bg-[#041008] p-7 transition duration-300 hover:bg-[#0a1c10]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[0.78rem] font-black uppercase tracking-[0.26em] text-[#9ed39f]">
                    {step.number}
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center border border-[#9ed39f]/35 bg-[#9ed39f]/12 text-[#9ed39f] transition duration-300 group-hover:bg-[#9ed39f] group-hover:text-black">
                    <AxiomIcon kind={step.icon} className="h-5 w-5" />
                  </span>
                </div>
                <h3 className="mt-16 text-2xl font-black uppercase tracking-[-0.03em] text-white">
                  {step.title}
                </h3>
                <p className="mt-4 text-base leading-8 text-white/72">
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
        <div className="mx-auto max-w-[1440px]">
          <SectionIntro
            icon="blueprint"
            label="What you receive"
            title="A practical blueprint, not a generic AI answer."
            text="The output is designed so you can brief a team, improve the workflow, configure assistants, or plan the next implementation layer with better judgement."
          />

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {deliverables.map((item) => (
              <article
                key={item.title}
                className="group border border-[#9ed39f]/28 bg-black/78 p-7 transition duration-300 hover:-translate-y-1 hover:border-[#9ed39f]/60 hover:bg-[#06150b]"
              >
                <div className="flex h-14 w-14 items-center justify-center border border-[#9ed39f]/38 bg-[#9ed39f]/12 text-[#9ed39f] transition duration-300 group-hover:bg-[#9ed39f] group-hover:text-black">
                  <AxiomIcon kind={item.icon} className="h-6 w-6" />
                </div>
                <h3 className="mt-7 text-[1.45rem] font-black uppercase tracking-[-0.03em] text-white">
                  {item.title}
                </h3>
                <p className="mt-4 text-base leading-8 text-white/70">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#9ed39f]/20 bg-black px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[1440px]">
          <SectionIntro
            icon="team"
            label="Who it is for"
            title="For people building real operations, not chasing AI noise."
            text="Axiom Architect is for people who need a repeatable operating model, not another scattered collection of prompts."
          />

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {audiences.map((item) => (
              <div
                key={item.name}
                className="group flex items-center gap-3 border border-[#9ed39f]/30 bg-[#061008] px-5 py-5 text-white transition duration-300 hover:-translate-y-1 hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black"
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
        className="relative border-b border-[#9ed39f]/20 bg-[#010302] px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
      >
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(158,211,159,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.1)_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="relative mx-auto max-w-[1440px]">
          <SectionIntro
            icon="build"
            label="Service ladder"
            title="Start with diagnosis. Build toward an operating system."
            text="The Workflow Audit is the entry point. Deeper services can extend the diagnosis into protocols, agent instructions, implementation workbooks, or system builds."
          />

          <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden border border-[#9ed39f]/30 bg-[#9ed39f]/24 md:grid-cols-2 xl:grid-cols-3">
            {serviceLadder.map((service) => (
              <article
                key={service.name}
                className="group bg-[#041008] p-7 transition duration-300 hover:bg-[#0a1c10]"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex border border-[#9ed39f]/30 bg-[#9ed39f]/12 px-4 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-[#9ed39f]">
                    {service.status}
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center border border-[#9ed39f]/35 bg-[#9ed39f]/12 text-[#9ed39f] transition duration-300 group-hover:bg-[#9ed39f] group-hover:text-black">
                    <AxiomIcon kind={service.icon} className="h-5 w-5" />
                  </span>
                </div>
                <h3 className="mt-12 text-[1.5rem] font-black uppercase tracking-[-0.04em] text-white">
                  {service.name}
                </h3>
                <p className="mt-4 text-base leading-8 text-white/70">
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
        <div className="relative mx-auto max-w-[1440px] border border-[#9ed39f]/38 bg-[#041008]/94 p-7 shadow-[0_26px_90px_rgba(0,0,0,0.42)] sm:p-10 lg:p-14">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <SectionLabel icon="audit">Start Workflow Audit</SectionLabel>
              <h2 className="mt-5 max-w-4xl text-[clamp(2.55rem,5vw,5.4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">
                Bring one messy workflow. Leave with a structured plan.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
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
