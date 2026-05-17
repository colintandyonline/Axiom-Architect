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
    headline: "Ongoing review for workflows that keep changing.",
    summary:
      "Workflow Stewardship is for businesses that need periodic recalibration rather than a one-time report. It helps review active AI-supported workflows, identify recurring errors, tune operating logic, reassess tools, and keep the workflow aligned with how the business actually runs.",
    outcome:
      "You finish each review cycle with clearer priorities, updated recommendations, and a more stable operating model for the workflow or workflow set under stewardship.",
    bestFor: [
      "A workflow that changes as the business, team, or tools change.",
      "Teams already using AI-supported processes that need quality control and recalibration.",
      "Operators who want review without rebuilding the system from scratch each time.",
      "Businesses that need a steady improvement rhythm rather than a one-off diagnostic.",
    ],
    questions: [
      "Where is the active workflow drifting from the intended process?",
      "Which errors, delays, or edge cases keep repeating?",
      "Does the tool stack still fit the workflow?",
      "Which instructions, review gates, or operating rules need updating?",
    ],
    deliverables: [
      "Quarterly audit of active workflows.",
      "Error logging and bottleneck analysis.",
      "Priority access for logic updates.",
      "Bi-annual tool stack reassessment.",
      "Performance efficiency dashboard direction.",
      "Ongoing email support for minor workflow questions.",
    ],
    process: [
      "Choose Workflow Stewardship and complete subscription checkout.",
      "Submit the workflow or active operating system that needs ongoing review.",
      "Recurring review cycles identify friction, drift, errors, and improvement priorities.",
      "Updates are delivered as structured recommendations and operating logic improvements.",
    ],
    boundaries: [
      "This is ongoing advisory and optimisation, not unlimited implementation labour.",
      "Major rebuilds, new systems, or custom integrations may require separate scope.",
      "The subscription supports review and improvement, not guaranteed commercial results.",
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
    name: "Architect Residency",
    label: "High-touch deployment",
    price: "$2,499+",
    headline: "A guided architecture partnership for serious implementation.",
    summary:
      "Architect Residency is the high-touch service for clients who need more than reports and templates. It supports guided deployment, workshops, training, technical oversight, leadership strategy, first-run operational review, and custom system design where the workflow requires a deeper partnership.",
    outcome:
      "You finish with guided implementation support and a clearer path from workflow design to real operational deployment.",
    bestFor: [
      "A business or team ready to implement a serious workflow system.",
      "Leaders who need strategic oversight, workshops, and guided deployment.",
      "Operations involving legacy tools, custom integrations, or team-wide adoption.",
      "Clients who need direct architecture support rather than self-guided implementation.",
    ],
    questions: [
      "What does this system need to look like in live operations?",
      "Which tools, APIs, edge functions, or custom components may be required?",
      "How should the team be trained and onboarded?",
      "What needs to be watched during first-run deployment?",
    ],
    deliverables: [
      "Live remote implementation workshop.",
      "On-site option by arrangement.",
      "Legacy hardware or software integration planning.",
      "Team-wide training and onboarding sessions.",
      "Direct oversight of first-run live operations.",
      "Custom-coded private edge functions or APIs where required.",
      "1:1 leadership strategy sessions.",
    ],
    process: [
      "Choose Architect Residency and submit the initial scope through the intake flow.",
      "The project is reviewed for complexity, risks, tools, people, and implementation requirements.",
      "A deployment approach is agreed before deep implementation support begins.",
      "The residency then supports rollout, training, oversight, and operating-system refinement.",
    ],
    boundaries: [
      "The listed price is a starting point; final scope can vary by complexity.",
      "Complex custom builds, travel, on-site work, or integrations may require separate agreement.",
      "Residency support does not remove the client's responsibility for internal approval, compliance, and business decisions.",
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
                <p className="text-[0.6rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Starting at</p>
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
              Each Axiom Architect product is designed to solve a specific level of workflow problem. The right tier depends on whether you need diagnosis, planning, operating assets, ongoing optimisation, ecosystem design, or guided deployment.
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
