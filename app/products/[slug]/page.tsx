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
  boundaries: string[];
};

const products: Record<ProductSlug, ProductInfo> = {
  "workflow-audit": {
    slug: "workflow-audit",
    name: "Workflow Audit",
    label: "Focused diagnostic",
    price: "$49",
    headline: "A clear diagnostic for one messy workflow.",
    summary:
      "Workflow Audit is the entry point for turning a real operational process into a structured diagnosis. It maps what happens now, where the workflow slows down, where AI may help, where automation would be unsafe, and what the next practical steps should be.",
    outcome:
      "You finish with a clear read on one workflow: what is broken, what can be improved, what should stay human, and what should happen next.",
    bestFor: [
      "A single workflow that feels slow, inconsistent, manual, or hard to explain.",
      "A founder, operator, consultant, or small team that wants clarity before buying tools or building automations.",
      "A process that already exists but has never been properly mapped.",
      "A first step before committing to a deeper blueprint or operating pack.",
    ],
    questions: [
      "Where is this workflow losing time or quality?",
      "Which parts could AI support without taking over judgement?",
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
      "Choose the Workflow Audit package and complete checkout.",
      "Submit one workflow through the structured dashboard intake.",
      "The workflow is reviewed against process, risk, handoff, tool, and AI-support criteria.",
      "A diagnostic report is produced so you can decide what to change next.",
    ],
    boundaries: [
      "This is a diagnostic, not a full implementation build.",
      "It does not configure your tools or write a complete operating manual.",
      "It focuses on one workflow, not a full department or business-wide system.",
    ],
  },
  "workflow-blueprint": {
    slug: "workflow-blueprint",
    name: "Workflow Blueprint",
    label: "Recommended plan",
    price: "$149",
    headline: "A practical implementation plan for improving one workflow.",
    summary:
      "Workflow Blueprint builds on the diagnostic layer and turns the findings into a future-state operating plan. It defines the improved workflow, where AI support belongs, which review gates protect quality, what tools may be useful, and how the change can be introduced over a realistic 30-day sequence.",
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
      "The workflow is mapped into current-state and future-state views.",
      "You receive a blueprint that can guide tool setup, team briefing, or the next implementation phase.",
    ],
    boundaries: [
      "This is an implementation plan, not a done-for-you technical build.",
      "It does not guarantee that a third-party tool will support every recommendation exactly.",
      "It should be reviewed before being applied to regulated, financial, legal, or safety-critical workflows.",
    ],
  },
  "custom-operating-pack": {
    slug: "custom-operating-pack",
    name: "Custom Operating Pack",
    label: "Complete workflow asset",
    price: "$399",
    headline: "A reusable operating system for one important workflow.",
    summary:
      "Custom Operating Pack turns the workflow plan into usable operating assets. It is for clients who need more than a report: a protocol, assistant guidance, reusable instruction blocks, workbook-style implementation support, handoff notes, and quality-control checkpoints.",
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
      "The workflow is converted into a structured protocol and supporting operating assets.",
      "You receive a pack designed to be reused, shared, and improved over time.",
    ],
    boundaries: [
      "This creates operating assets, not a custom software application.",
      "It does not replace staff training, legal review, or regulated compliance procedures.",
      "Tool implementation may still require separate setup work depending on your stack.",
    ],
  },
  "workflow-stewardship": {
    slug: "workflow-stewardship",
    name: "Workflow Stewardship",
    label: "Ongoing optimisation",
    price: "$299/mo",
    headline: "Monthly stewardship for workflows that keep changing.",
    summary:
      "Workflow Stewardship is an ongoing monthly review service for active AI-supported workflows. Each month, the client submits what changed, what broke, what improved, what tools shifted, and what decisions need review. Axiom turns that evidence into a monthly stewardship brief with updated priorities, safer automation boundaries, and next-step guidance.",
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
      "What should the client submit before the next monthly review?",
      "Which actions should happen before the next billing cycle?",
    ],
    deliverables: [
      "Monthly stewardship intake request in the client dashboard.",
      "Monthly review of workflow changes, errors, bottlenecks, and recurring exceptions.",
      "Updated action priorities for the next 7 and 30 days.",
      "AI/tool change scan for relevant workflow improvements.",
      "Human review gate and risk-control check.",
      "Dashboard-visible stewardship brief and cycle status.",
      "Stored review history so each cycle builds on the previous one.",
      "Light email support for minor workflow questions during the active subscription.",
    ],
    process: [
      "Choose Workflow Stewardship and complete subscription checkout.",
      "Submit the starting workflow through the dashboard intake so Axiom has a baseline.",
      "Each month, the dashboard asks for a stewardship update: changes, issues, metrics, tool updates, incidents, and decisions needing review.",
      "Axiom reviews the new evidence against the previous report, current AI/tool changes, risk boundaries, and operating priorities.",
      "The dashboard receives a monthly stewardship brief with updated guidance, required client actions, and what Axiom can help with next.",
    ],
    boundaries: [
      "This is ongoing advisory, review, and operating guidance; it is not unlimited implementation labour.",
      "Major rebuilds, new software systems, custom integrations, migrations, or hands-on tool setup may require separate scope.",
      "A monthly subscription does not guarantee commercial outcomes, uptime, speed improvements, or third-party tool performance.",
      "The client remains responsible for providing accurate monthly updates, internal approvals, compliance review, and final business decisions.",
    ],
  },
  "departmental-ecosystem": {
    slug: "departmental-ecosystem",
    name: "Departmental Ecosystem",
    label: "Multi-workflow system",
    price: "$999",
    headline: "A connected operating model for a team or department.",
    summary:
      "Departmental Ecosystem is for mapping several workflows together rather than treating each process in isolation. It looks at up to five core workflows, handoffs between people or functions, shared data sources, tool dependencies, review points, and the operating model needed to make the department work as one system.",
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
      "Submit department context, core workflows, team structure, tools, and current failure points.",
      "The workflows are mapped together as one operating ecosystem.",
      "You receive a connected roadmap that helps the team improve in sequence rather than through isolated fixes.",
    ],
    boundaries: [
      "This maps and designs a departmental operating model; it is not a full enterprise transformation programme.",
      "It covers up to five core workflows unless separately scoped.",
      "Technical implementation, migrations, and custom builds may require separate project work.",
    ],
  },
  "architect-residency": {
    slug: "architect-residency",
    name: "Axiom Enterprise Architecture System",
    label: "Flagship enterprise product",
    price: "$2,499",
    headline: "A flagship enterprise architecture system for complex workflows.",
    summary:
      "Axiom Enterprise Architecture System is the top-tier Axiom Architect product. It is a fixed-price, dashboard-delivered architecture package for complex workflow systems that need enterprise-level structure, dependency mapping, automation boundaries, risk controls, tool-stack guidance, and a complete operating roadmap.",
    outcome:
      "You finish with a detailed enterprise architecture roadmap that clarifies how the workflow system should be structured, where risk and review gates belong, where AI or automation can safely support the operation, and what implementation sequence should come next.",
    bestFor: [
      "Complex workflow systems that need deeper analysis than a single audit, blueprint, or operating pack.",
      "Businesses that want a premium enterprise-style architecture report without arranging live sessions or on-site delivery.",
      "Operations involving multiple tools, handoffs, dependencies, risks, decision points, or customer-facing consequences.",
      "Clients who need a flagship dashboard-delivered roadmap before deciding whether to scope separate implementation work.",
    ],
    questions: [
      "How should this workflow system be structured at an enterprise level?",
      "Which dependencies, handoffs, tools, data flows, and risk points need to be controlled?",
      "Where can AI or automation support the system without taking over sensitive decisions?",
      "What sequence should be followed before any technical build, team rollout, or wider operational change?",
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
      "Submit the expanded enterprise intake through the client dashboard.",
      "Axiom reviews the workflow system for complexity, risk, dependencies, tool fit, automation suitability, and operating sequence.",
      "Your dashboard receives a flagship architecture report with guidance, boundaries, and a practical enterprise implementation roadmap.",
    ],
    boundaries: [
      "This product is delivered through the dashboard and does not include on-site work.",
      "It does not include live workshops, team training sessions, or 1:1 consulting calls unless separately agreed in writing.",
      "It does not include hands-on tool setup, custom software development, integrations, migrations, or managed implementation unless separately scoped.",
      "The client remains responsible for internal approvals, compliance review, staff training, tool access, and final business decisions.",
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
    };
  }

  return {
    title: `${product.name} | Axiom Architect`,
    description: product.summary,
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
              What this product helps the client understand.
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
              Scope control
            </p>
            <h2 className="mt-5 max-w-3xl text-[clamp(2.1rem,4vw,3.7rem)] font-black uppercase leading-[0.92] tracking-[-0.06em] text-white">
              Clear boundaries keep the service useful.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#e6f6e7]/72 sm:text-lg">
              Each Axiom Architect product is designed to solve a specific level of workflow problem. The right tier depends on whether you need diagnosis, planning, operating assets, ongoing optimisation, ecosystem design, or flagship enterprise architecture guidance.
            </p>
          </div>
          <DetailList title="What this product does not automatically include" items={product.boundaries} />
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
              Create a secure client account, complete checkout, and submit the intake matched to this product.
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
