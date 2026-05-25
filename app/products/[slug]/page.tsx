import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductSystemVisual } from "../../../components/ProductSystemVisual";
import {
  axiomDirectPurchasePackages,
  getAxiomPackageByPublicSlug,
  getAxiomPackageDeliverables,
  type AxiomPackageKey,
  type AxiomPackageModel,
} from "../../../lib/axiom-package-model";

const siteUrl = "https://www.axiom-architect.co";

type ProductVisualKind = Parameters<typeof ProductSystemVisual>[0]["kind"];

type ProductDisplay = {
  price: string;
  label: string;
  visualKind: ProductVisualKind;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  headline: string;
};

const productDisplay: Partial<Record<AxiomPackageKey, ProductDisplay>> = {
  workflow_audit: {
    price: "$49",
    label: "Focused diagnostic",
    visualKind: "workflow-audit",
    seoTitle: "Workflow Audit | AI Workflow Diagnostic",
    seoDescription:
      "A focused AI workflow audit for one messy process. Diagnose bottlenecks, automation suitability, assistant opportunities, review gates, and practical next steps.",
    keywords: ["workflow audit", "AI workflow audit", "workflow diagnostic", "automation suitability", "human review gates"],
    headline: "A clear diagnostic for one messy workflow.",
  },
  workflow_blueprint: {
    price: "$149",
    label: "Implementation plan",
    visualKind: "workflow-blueprint",
    seoTitle: "Workflow Blueprint | AI Implementation Plan",
    seoDescription:
      "A practical workflow blueprint for AI-supported execution, future-state process design, review gates, assistant roles, tool guidance, and operating sequence.",
    keywords: ["workflow blueprint", "AI implementation plan", "future state workflow", "operating blueprint", "workflow architecture"],
    headline: "A practical implementation plan for improving one workflow.",
  },
  custom_operating_pack: {
    price: "$399",
    label: "Operating pack",
    visualKind: "custom-operating-pack",
    seoTitle: "Custom Operating Pack | AI Workflow Protocol",
    seoDescription:
      "A reusable operating pack for one workflow with protocol guidance, assistant instructions, handoff notes, workbook assets, and quality-control checkpoints.",
    keywords: ["custom operating pack", "AI workflow protocol", "assistant instructions", "workflow SOP", "quality control checkpoints"],
    headline: "A reusable operating system for one important workflow.",
  },
  workflow_stewardship: {
    price: "$299/mo",
    label: "Ongoing optimisation",
    visualKind: "workflow-stewardship",
    seoTitle: "Workflow Stewardship | Monthly AI Workflow Review",
    seoDescription:
      "Monthly workflow stewardship for AI-supported operations that need recalibration, tool-change review, risk checks, bottleneck tracking, and updated next actions.",
    keywords: ["workflow stewardship", "monthly workflow review", "AI workflow optimisation", "workflow recalibration", "automation governance"],
    headline: "Monthly stewardship for workflows that keep changing.",
  },
  departmental_ecosystem: {
    price: "$999",
    label: "Multi-workflow system",
    visualKind: "departmental-ecosystem",
    seoTitle: "Departmental Ecosystem | Multi-Workflow Architecture",
    seoDescription:
      "A connected operating model for teams and departments. Map workflows, handoffs, data sources, dependencies, ownership, and implementation priorities.",
    keywords: ["departmental ecosystem", "multi workflow architecture", "workflow handoff mapping", "department operating model", "workflow dependencies"],
    headline: "A connected operating model for a team or department.",
  },
  enterprise_architecture_system: {
    price: "$2,499",
    label: "Flagship enterprise product",
    visualKind: "architect-residency",
    seoTitle: "Axiom Enterprise Architecture System | Enterprise AI Control",
    seoDescription:
      "A flagship enterprise architecture system for complex workflows: dependency mapping, automation boundaries, risk controls, data-flow architecture, review gates, and implementation sequencing.",
    keywords: ["enterprise architecture system", "enterprise AI control", "AI workflow architecture", "automation boundaries", "risk control gates"],
    headline: "A flagship architecture system for complex workflows.",
  },
};

function getDisplay(packageModel: AxiomPackageModel) {
  return productDisplay[packageModel.key] || {
    price: "Scoped",
    label: packageModel.status,
    visualKind: "workflow-audit" as ProductVisualKind,
    seoTitle: `${packageModel.name} | Axiom Architect`,
    seoDescription: packageModel.clientSummary,
    keywords: [packageModel.name, "workflow architecture", "Axiom Architect"],
    headline: packageModel.shortDescription,
  };
}

function checkoutHref(packageModel: AxiomPackageModel) {
  if (!packageModel.checkoutSlug) {
    return "/bespoke/apply";
  }

  return `/signup?tier=${packageModel.checkoutSlug}&account=required`;
}

function actionLabel(packageModel: AxiomPackageModel) {
  return packageModel.canBuyDirectly ? "Start this package" : "Request proposal";
}

function getPublicProduct(slug: string) {
  const packageModel = getAxiomPackageByPublicSlug(slug);

  if (!packageModel || !packageModel.canBuyDirectly) {
    return null;
  }

  return packageModel;
}

export function generateStaticParams() {
  return axiomDirectPurchasePackages.map((packageKey) => {
    const packageModel = getAxiomPackageByPublicSlug(packageKey.replace(/_/g, "-"));

    return {
      slug: packageModel?.publicSlug || packageKey.replace(/_/g, "-"),
    };
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const packageModel = getPublicProduct(slug);

  if (!packageModel) {
    return {
      title: "Product Not Found | Axiom Architect",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const display = getDisplay(packageModel);
  const publicPath = `/products/${packageModel.publicSlug}`;
  const canonicalUrl = `${siteUrl}${publicPath}`;

  return {
    title: display.seoTitle,
    description: display.seoDescription,
    keywords: display.keywords,
    alternates: {
      canonical: publicPath,
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: "Axiom Architect",
      title: `${display.seoTitle} | Axiom Architect`,
      description: display.seoDescription,
      images: [
        {
          url: "/brand/axiom-architect-hero-banner.png",
          width: 1920,
          height: 1080,
          alt: `${packageModel.name} by Axiom Architect`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${display.seoTitle} | Axiom Architect`,
      description: display.seoDescription,
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

function DeliverableList({ packageModel }: { packageModel: AxiomPackageModel }) {
  const deliverables = getAxiomPackageDeliverables(packageModel.key);

  return (
    <section className="border border-[#9ed39f]/28 bg-[#030804] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.24)] sm:p-7">
      <h2 className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">
        Standard deliverables
      </h2>
      <div className="mt-5 grid gap-4">
        {deliverables.map((deliverable) => (
          <article key={deliverable.type} className="border border-[#9ed39f]/18 bg-black/42 p-4">
            <h3 className="text-sm font-black uppercase tracking-[0.14em] text-white">{deliverable.title}</h3>
            <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/70">{deliverable.clientOutcome}</p>
          </article>
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
  const packageModel = getPublicProduct(slug);

  if (!packageModel) {
    notFound();
  }

  const display = getDisplay(packageModel);
  const process = [
    `Choose ${packageModel.name} and create your secure account.`,
    "Complete checkout and open the dashboard intake.",
    "Submit the workflow, tools, handoffs, risks, and desired operating outcome.",
    "Review the report and deliverables in your client workspace.",
  ];

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
              {display.label}
            </p>
            <h1 className="mt-6 max-w-5xl text-[clamp(2.7rem,6vw,5.9rem)] font-black uppercase leading-[0.9] tracking-[-0.075em] text-white">
              {display.headline}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#e6f6e7]/80 sm:text-xl">
              {packageModel.clientSummary}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={checkoutHref(packageModel)}
                className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white sm:min-w-56"
              >
                {actionLabel(packageModel)}
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
            <ProductSystemVisual kind={display.visualKind} />
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-[#9ed39f]/28 bg-[#061008]/88 p-5">
                <p className="text-[0.6rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Package</p>
                <p className="mt-3 text-xl font-black uppercase tracking-[-0.04em] text-white">{packageModel.name}</p>
              </div>
              <div className="border border-[#9ed39f]/28 bg-[#061008]/88 p-5">
                <p className="text-[0.6rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Price</p>
                <p className="mt-3 text-3xl font-black tracking-[-0.06em] text-white">{display.price}</p>
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
            {packageModel.shortDescription}
          </p>
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-5 lg:grid-cols-2">
          <DetailList title="Best for" items={packageModel.bestFor} />
          <DetailList title="What you receive" items={packageModel.clientReceives} />
          <DeliverableList packageModel={packageModel} />
          <DetailList title="How it works" items={process} />
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
              Use your Axiom package as a practical reference for decisions, priorities, review gates, AI support, and workflow improvement. It gives you a clearer way to move forward without guessing what should change first.
            </p>
          </div>
          <DetailList title="Recommended use" items={[packageModel.adminGuidance, "Use the client workspace as the source of truth for intake, reports, deliverables, and follow-up actions.", "Move into custom proposal work when the package reveals deeper implementation, governance, or build needs."]} />
        </div>
      </section>

      <section className="bg-[#9ed39f] px-4 py-14 text-black sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="inline-flex border border-black bg-black px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-[#9ed39f]">
              Next step
            </p>
            <h2 className="mt-5 max-w-4xl text-[clamp(2.2rem,4vw,4rem)] font-black uppercase leading-[0.92] tracking-[-0.06em]">
              Ready to start {packageModel.name}?
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-black/74 sm:text-lg">
              Create your secure account, complete checkout, and submit the intake matched to this package.
            </p>
          </div>
          <a
            href={checkoutHref(packageModel)}
            className="inline-flex min-h-14 items-center justify-center border border-black bg-black px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black sm:min-w-72"
          >
            {actionLabel(packageModel)}
          </a>
        </div>
      </section>
    </main>
  );
}
