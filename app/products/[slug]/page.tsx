import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductSystemVisual } from "../../../components/ProductSystemVisual";

type ProductSlug =
  | "workflow-audit"
  | "workflow-blueprint"
  | "custom-operating-pack"
  | "workflow-stewardship"
  | "departmental-ecosystem"
  | "architect-residency";

type ProductInfo = {
  slug: ProductSlug;
  name: string;
  label: string;
  price: string;
  headline: string;
  summary: string;
  outcome: string;
  bestFor: string[];
  questions: string[];
  deliverables: string[];
  process: string[];
  guidance: string[];
};

const siteUrl = "https://www.axiom-architect.co";

const publicProductPaths: Record<ProductSlug, string> = {
  "workflow-audit": "/products/workflow-audit",
  "workflow-blueprint": "/products/workflow-blueprint",
  "custom-operating-pack": "/products/custom-operating-pack",
  "workflow-stewardship": "/products/workflow-stewardship",
  "departmental-ecosystem": "/products/departmental-ecosystem",
  "architect-residency": "/products/enterprise-architecture-system",
};

const productSeo: Record<ProductSlug, { title: string; description: string; keywords: string[] }> = {
  "workflow-audit": {
    title: "Workflow Audit | AI Workflow Diagnostic",
    description:
      "A focused AI workflow audit for one messy process. Diagnose bottlenecks, automation suitability, assistant opportunities, review gates, and practical next steps.",
    keywords: [
      "workflow audit",
      "AI workflow audit",
      "workflow diagnostic",
      "automation suitability",
      "AI assistant opportunity map",
      "human review gates",
    ],
  },
  "workflow-blueprint": {
    title: "Workflow Blueprint | AI Implementation Plan",
    description:
      "A practical workflow blueprint for AI-supported execution, future-state process design, review gates, assistant roles, tool guidance, and a 30-day operating plan.",
    keywords: [
      "workflow blueprint",
      "AI implementation plan",
      "future state workflow",
      "human in the loop controls",
      "operating blueprint",
      "workflow architecture",
    ],
  },
  "custom-operating-pack": {
    title: "Custom Operating Pack | AI Workflow Protocol",
    description:
      "A reusable operating pack for one workflow with protocol guidance, assistant instructions, handoff notes, workbook assets, and quality-control checkpoints.",
    keywords: [
      "custom operating pack",
      "AI workflow protocol",
      "assistant instructions",
      "operating system for workflows",
      "workflow SOP",
      "quality control checkpoints",
    ],
  },
  "workflow-stewardship": {
    title: "Workflow Stewardship | Monthly AI Workflow Review",
    description:
      "Monthly workflow stewardship for AI-supported operations that need recalibration, tool-change review, risk checks, bottleneck tracking, and updated next actions.",
    keywords: [
      "workflow stewardship",
      "monthly workflow review",
      "AI workflow optimisation",
      "workflow recalibration",
      "AI operations review",
      "automation governance",
    ],
  },
  "departmental-ecosystem": {
    title: "Departmental Ecosystem | Multi-Workflow Architecture",
    description:
      "A connected operating model for teams and departments. Map workflows, handoffs, data sources, dependencies, ownership, and implementation priorities.",
    keywords: [
      "departmental ecosystem",
      "multi workflow architecture",
      "workflow handoff mapping",
      "department operating model",
      "business process architecture",
      "workflow dependencies",
    ],
  },
  "architect-residency": {
    title: "Axiom Enterprise Architecture System | Enterprise AI Control",
    description:
      "A flagship enterprise architecture system for complex workflows: dependency mapping, automation boundaries, risk controls, data-flow architecture, review gates, and implementation sequencing.",
    keywords: [
      "enterprise architecture system",
      "enterprise AI control",
      "AI workflow architecture",
      "automation boundaries",
      "risk control gates",
      "enterprise AI operating system",
      "enterprise AI control stack",
    ],
  },
};

const products: Record<ProductSlug, ProductInfo> = {
  "workflow-audit": {
    slug: "workflow-audit",
    name: "Workflow Audit",
    label: "Focused diagnostic",
    price: "$49",
    headline: "A clear diagnostic for one messy workflow.",
    summary:
      "Workflow Audit turns one unclear process into a practical diagnosis. It shows what is slowing the workflow down, where AI may help, what needs human review, and what should happen next.",
    outcome:
      "You finish with a clear read on one workflow: what is broken, what can be improved, what should stay human, and what to do next.",
    bestFor: [
      "A single workflow that feels slow, inconsistent, manual, or hard to explain.",
      "A founder, operator, consultant, or small team that wants clarity before buying tools or building automations.",
      "A process that already exists but has never been properly mapped.",
      "A first step before moving into a deeper blueprint or operating pack.",
    ],
    questions: [
      "Where is this workflow losing time or quality?",
      "Which parts could AI support without replacing judgement?",
      "Where are the risk points, approval gates, and handoffs?",
      "What should be fixed first before tools are added?",
    ],
    deliverables: [
      "Current-state workflow diagnosis.",
      "Bottleneck and friction-point map.",
      "Automation suitability notes.",
      "AI assistant opportunity map.",
      "Human review and risk requirements.",
      "Recommended next steps.",
      "Branded audit report.",
    ],
    process: [
      "Choose Workflow Audit and complete checkout.",
      "Submit one workflow through your dashboard intake.",
      "Axiom reviews the workflow for clarity, risk, handoffs, AI support, and improvement potential.",
      "Your dashboard receives a focused diagnostic report.",
    ],
    guidance: [
      "Use the report to decide what to fix first.",
      "Share it with anyone involved in the workflow so everyone works from the same map.",
      "Move into a Blueprint when you are ready for a fuller implementation plan.",
    ],
  },
  "workflow-blueprint": {
    slug: "workflow-blueprint",
    name: "Workflow Blueprint",
    label: "Recommended plan",
    price: "$149",
    headline: "A practical implementation plan for improving one workflow.",
    summary:
      "Workflow Blueprint turns diagnosis into a future-state operating plan. It shows how the workflow should run, where AI support belongs, which review gates protect quality, and what sequence makes the change realistic.",
    outcome:
      "You finish with a clear implementation blueprint that shows how the workflow should operate, who or what supports each stage, and how to move from current state to future state.",
    bestFor: [
      "A workflow you already know needs more than diagnosis.",
      "Teams that need a step-by-step operating plan before implementation.",
      "Businesses comparing tools, assistants, or automations but needing structure first.",
      "Clients who want the recommended middle tier before deeper custom assets.",
    ],
    questions: [
      "What should the future workflow look like?",
      "Where should AI assistants support drafting, summarising, routing, or checking?",
      "Which decisions need human review gates?",
      "What is the safest order of implementation?",
    ],
    deliverables: [
      "Everything in Workflow Audit.",
      "Future-state workflow design.",
      "Recommended assistant roles.",
      "Human-in-the-loop review gate structure.",
      "Tool stack recommendations.",
      "Implementation sequence.",
      "30-day operating plan.",
      "Branded blueprint report.",
    ],
    process: [
      "Choose Workflow Blueprint and complete checkout.",
      "Submit the workflow intake with enough operational detail for diagnosis and planning.",
      "Axiom maps the workflow into current-state and future-state views.",
      "Your dashboard receives a blueprint you can use to plan the next improvement phase.",
    ],
    guidance: [
      "Use the blueprint to align your team before changing tools or process steps.",
      "Start with the first 7-day actions before moving into larger workflow changes.",
      "Use the review gates as protection before adding automation.",
    ],
  },
  "custom-operating-pack": {
    slug: "custom-operating-pack",
    name: "Custom Operating Pack",
    label: "Complete workflow asset",
    price: "$399",
    headline: "A reusable operating system for one important workflow.",
    summary:
      "Custom Operating Pack turns your workflow plan into usable operating assets: protocol, assistant guidance, reusable instruction blocks, handoff notes, workbook-style guidance, and quality-control checkpoints.",
    outcome:
      "You finish with a practical operating pack that can help you run, brief, delegate, or standardise the workflow with more consistency.",
    bestFor: [
      "A workflow that repeats often enough to justify a reusable operating asset.",
      "Teams that want clear instructions rather than only strategic recommendations.",
      "Consultants, operators, or founders who need a branded internal system for execution.",
      "Clients preparing to use AI assistants with consistent instructions and review rules.",
    ],
    questions: [
      "What exact protocol should this workflow follow?",
      "What instructions should an AI assistant use in this process?",
      "What should the human operator check before output is used?",
      "How can this workflow be handed to another person without losing quality?",
    ],
    deliverables: [
      "Everything in Workflow Blueprint.",
      "Custom operating protocol.",
      "Reusable instruction blocks.",
      "Agent or assistant guidance.",
      "Implementation workbook assets.",
      "Team handoff guide.",
      "Quality-control checkpoints.",
      "Branded operating pack.",
    ],
    process: [
      "Choose Custom Operating Pack and complete checkout.",
      "Submit the workflow details, current process, tools, handoffs, and desired operating outcome.",
      "Axiom converts the workflow into a structured protocol and supporting operating assets.",
      "Your dashboard receives a pack designed to be reused, shared, and improved over time.",
    ],
    guidance: [
      "Use the pack as the operating source of truth for the workflow.",
      "Use the assistant guidance to keep AI support consistent.",
      "Use the checkpoints to protect quality before outputs are used.",
    ],
  },
  "workflow-stewardship": {
    slug: "workflow-stewardship",
    name: "Workflow Stewardship",
    label: "Ongoing optimisation",
    price: "$299/mo",
    headline: "Monthly stewardship for workflows that keep changing.",
    summary:
      "Workflow Stewardship gives active AI-supported workflows a monthly review rhythm. Each cycle captures what changed, what broke, what improved, and what needs attention next.",
    outcome:
      "You finish each monthly cycle with a clear stewardship brief: what changed, what needs attention, what should be updated, what should remain human-controlled, and what Axiom recommends before the next review cycle.",
    bestFor: [
      "A workflow that changes as tools, AI capabilities, business rules, or team behaviour changes.",
      "Businesses already using AI-supported processes that need ongoing quality control and recalibration.",
      "Teams that want a monthly operating rhythm rather than a one-off report.",
      "Clients who need their workflow report, review gates, and next actions kept current as systems evolve.",
    ],
    questions: [
      "What changed in the workflow this month?",
      "Which errors, delays, edge cases, or exceptions repeated?",
      "Do any AI tools, automations, or review gates need updating?",
      "What should be prepared before the next monthly review?",
    ],
    deliverables: [
      "Monthly stewardship intake request in the dashboard.",
      "Review of workflow changes, errors, bottlenecks, and recurring exceptions.",
      "Updated action priorities for the next 7 and 30 days.",
      "AI/tool change scan for relevant workflow improvements.",
      "Human review gate and risk-control check.",
      "Dashboard-visible stewardship brief and cycle status.",
      "Review history so each cycle builds on the previous one.",
      "Light email support for minor workflow questions during the active subscription.",
    ],
    process: [
      "Choose Workflow Stewardship and complete subscription checkout.",
      "Submit the starting workflow through the dashboard intake so Axiom has a baseline.",
      "Each month, the dashboard asks for changes, issues, metrics, tool updates, incidents, and decisions needing review.",
      "Your dashboard receives a monthly stewardship brief with updated guidance and next actions.",
    ],
    guidance: [
      "Use the monthly update window to capture real workflow changes while they are fresh.",
      "Keep examples, issues, and decisions ready before the next cycle opens.",
      "Use each stewardship brief as the next operating checkpoint for the workflow.",
    ],
  },
  "departmental-ecosystem": {
    slug: "departmental-ecosystem",
    name: "Departmental Ecosystem",
    label: "Multi-workflow system",
    price: "$999",
    headline: "A connected operating model for a team or department.",
    summary:
      "Departmental Ecosystem maps several workflows together so your team can see how work moves across people, tools, data, handoffs, and decisions.",
    outcome:
      "You finish with a department-level architecture map that shows how workflows connect, where responsibility sits, where AI support belongs, and what sequence makes implementation realistic.",
    bestFor: [
      "A team, department, or business unit with several connected workflows.",
      "Operations where handoffs, ownership, and shared information create friction.",
      "Businesses preparing to standardise internal systems across a small team.",
      "Leaders who need a quarterly implementation roadmap rather than a single workflow report.",
    ],
    questions: [
      "How do the department's workflows connect?",
      "Where do handoffs fail, repeat, or create confusion?",
      "Which data sources should become central rather than scattered?",
      "What should be implemented first, second, and third across the department?",
    ],
    deliverables: [
      "Up to five core workflow maps.",
      "Cross-departmental handoff logic.",
      "Centralised data source strategy.",
      "Interdependency mapping.",
      "Universal Axiom documentation guide.",
      "Master implementation roadmap for the quarter.",
    ],
    process: [
      "Choose Departmental Ecosystem and complete checkout.",
      "Submit department context, core workflows, team structure, tools, and current friction points.",
      "Axiom maps the workflows together as one operating ecosystem.",
      "Your dashboard receives a connected roadmap that helps the team improve in sequence rather than through isolated fixes.",
    ],
    guidance: [
      "Use the map to reduce confusion between workflows, teams, and tools.",
      "Start with the highest-friction handoffs before wider process changes.",
      "Use the roadmap as a quarterly operating reference.",
    ],
  },
  "architect-residency": {
    slug: "architect-residency",
    name: "Axiom Enterprise Architecture System",
    label: "Flagship enterprise product",
    price: "$2,499",
    headline: "A flagship architecture system for complex workflows.",
    summary:
      "Axiom Enterprise Architecture System is the top-tier Axiom Architect product. It turns complex workflow information into a clear enterprise operating map, showing how the system should be structured, where risk controls belong, where AI can support safely, and what sequence should come next.",
    outcome:
      "You finish with a premium enterprise architecture roadmap that gives you a clearer system map, safer automation boundaries, stronger review gates, and a practical route from current workflow complexity to a more controlled operating model.",
    bestFor: [
      "Complex workflow systems that need deeper analysis than a single audit, blueprint, or operating pack.",
      "Businesses with multiple tools, handoffs, teams, decisions, risks, or customer-facing consequences.",
      "Operators who need a premium architecture roadmap before changing systems, tools, or process ownership.",
      "Teams that want clarity on what to improve first, what to protect, and where AI support belongs.",
    ],
    questions: [
      "How should this workflow system be structured at a higher level?",
      "Which dependencies, handoffs, tools, data flows, and risk points need clearer control?",
      "Where can AI or automation support the system safely?",
      "What implementation sequence gives the business the cleanest path forward?",
    ],
    deliverables: [
      "Expanded enterprise intake sequence.",
      "Complex workflow and dependency architecture review.",
      "Current-state and future-state system map.",
      "Advanced AI and automation suitability model.",
      "Risk, exception, and human review gate design.",
      "Tool stack and data-flow architecture guidance.",
      "Enterprise implementation roadmap.",
      "Dashboard-delivered architecture report.",
    ],
    process: [
      "Choose Axiom Enterprise Architecture System and complete checkout.",
      "Submit the expanded enterprise intake through your dashboard.",
      "Axiom reviews the workflow system for complexity, risk, dependencies, tool fit, automation suitability, and operating sequence.",
      "Your dashboard receives a flagship architecture report with a system map, control points, and practical roadmap.",
    ],
    guidance: [
      "Use the roadmap to align leadership, operations, tools, and workflow ownership around one clear system view.",
      "Use the risk gates to decide what should stay human-reviewed before automation is introduced.",
      "Use the implementation sequence to prioritise what changes first, what waits, and what needs further planning.",
      "Use the report as the foundation for future operating packs, stewardship, or separate implementation work if needed.",
    ],
  },
};

const productSlugs = Object.keys(products) as ProductSlug[];

function getProduct(slug: string) {
  return productSlugs.includes(slug as ProductSlug) ? products[slug as ProductSlug] : null;
}

export function generateStaticParams() {
  return productSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found | Axiom Architect",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const seo = productSeo[product.slug];
  const publicPath = publicProductPaths[product.slug];
  const canonicalUrl = `${siteUrl}${publicPath}`;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: publicPath,
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: "Axiom Architect",
      title: `${seo.title} | Axiom Architect`,
      description: seo.description,
      images: [
        {
          url: "/brand/axiom-architect-hero-banner.png",
          width: 1920,
          height: 1080,
          alt: `${product.name} by Axiom Architect`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${seo.title} | Axiom Architect`,
      description: seo.description,
      images: ["/brand/axiom-architect-hero-banner.png"],
    },
  };
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="border border-[#9ed39f]/28 bg-[#030804] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.24)] sm:p-7">
      <h2 className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">
        {title}
      </h2>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <p key={item} className="m-0 flex gap-3 text-sm leading-7 text-[#e6f6e7]/78 sm:text-base">
            <span className="mt-2 h-2 w-2 shrink-0 bg-[#9ed39f]" />
            <span>{item}</span>
          </p>
        ))}
      </div>
    </section>
  );
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_34%,#000_76%)] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-[0.92fr_0.78fr] lg:items-center">
          <div>
            <a
              href="/pricing"
              className="inline-flex border border-[#9ed39f]/45 bg-black px-4 py-3 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black"
            >
              Back to pricing
            </a>
            <p className="mt-8 inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
              {product.label}
            </p>
            <h1 className="mt-6 max-w-5xl text-[clamp(2.7rem,6vw,5.9rem)] font-black uppercase leading-[0.9] tracking-[-0.075em] text-white">
              {product.headline}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#e6f6e7]/80 sm:text-xl">
              {product.summary}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={`/signup?tier=${product.slug}&account=required`}
                className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white sm:min-w-56"
              >
                Start this package
              </a>
              <a
                href="/pricing"
                className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f]/45 bg-black px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black sm:min-w-44"
              >
                Compare packages
              </a>
            </div>
          </div>

          <aside className="grid gap-5">
            <ProductSystemVisual kind={product.slug} />
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-[#9ed39f]/28 bg-[#061008]/88 p-5">
                <p className="text-[0.6rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Package</p>
                <p className="mt-3 text-xl font-black uppercase tracking-[-0.04em] text-white">{product.name}</p>
              </div>
              <div className="border border-[#9ed39f]/28 bg-[#061008]/88 p-5">
                <p className="text-[0.6rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Fixed price</p>
                <p className="mt-3 text-3xl font-black tracking-[-0.06em] text-white">{product.price}</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-y border-[#9ed39f]/20 bg-[#9ed39f] px-4 py-14 text-black sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
          <div>
            <p className="inline-flex border border-black bg-black px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-[#9ed39f]">
              Core outcome
            </p>
            <h2 className="mt-5 text-[clamp(2.1rem,4vw,3.7rem)] font-black uppercase leading-[0.92] tracking-[-0.06em]">
              What this gives you.
            </h2>
          </div>
          <p className="border border-black/24 bg-[#b8efb9]/45 p-5 text-base leading-8 text-black/74 sm:text-lg">
            {product.outcome}
          </p>
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-5 lg:grid-cols-2">
          <DetailList title="Best for" items={product.bestFor} />
          <DetailList title="Questions it answers" items={product.questions} />
          <DetailList title="What you receive" items={product.deliverables} />
          <DetailList title="How it works" items={product.process} />
        </div>
      </section>

      <section className="border-y border-[#9ed39f]/20 bg-[linear-gradient(135deg,#07190c_0%,#020503_42%,#000_100%)] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div>
            <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
              How to use it
            </p>
            <h2 className="mt-5 max-w-3xl text-[clamp(2.1rem,4vw,3.7rem)] font-black uppercase leading-[0.92] tracking-[-0.06em] text-white">
              Turn the report into a cleaner operating path.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#e6f6e7]/72 sm:text-lg">
              Use your Axiom report as a practical reference for decisions, priorities, review gates, AI support, and workflow improvement. It gives you a clearer way to move forward without guessing what should change first.
            </p>
          </div>
          <DetailList title="Recommended use" items={product.guidance} />
        </div>
      </section>

      <section className="bg-[#9ed39f] px-4 py-14 text-black sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="inline-flex border border-black bg-black px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-[#9ed39f]">
              Next step
            </p>
            <h2 className="mt-5 max-w-4xl text-[clamp(2.2rem,4vw,4rem)] font-black uppercase leading-[0.92] tracking-[-0.06em]">
              Ready to start {product.name}?
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-black/74 sm:text-lg">
              Create your secure account, complete checkout, and submit the intake matched to this package.
            </p>
          </div>
          <a
            href={`/signup?tier=${product.slug}&account=required`}
            className="inline-flex min-h-14 items-center justify-center border border-black bg-black px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black sm:min-w-72"
          >
            Start this package
          </a>
        </div>
      </section>
    </main>
  );
}
