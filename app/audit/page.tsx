import type { Metadata } from "next";
import { ProductSystemVisual } from "../../components/ProductSystemVisual";
import {
  axiomDirectPurchasePackages,
  axiomPackageModels,
  getAxiomPackageDeliverables,
  type AxiomPackageKey,
  type AxiomPackageModel,
} from "../../lib/axiom-package-model";

export const metadata: Metadata = {
  title: "Workflow Architecture Packages | AI Workflow Audit & Blueprints",
  description:
    "Compare Axiom Architect workflow architecture packages: AI workflow audit, workflow blueprint, operating pack, stewardship, departmental ecosystem, and enterprise architecture system.",
  keywords: [
    "workflow architecture packages",
    "AI workflow audit",
    "workflow blueprint",
    "automation suitability",
    "operating pack",
    "workflow stewardship",
    "departmental ecosystem",
    "enterprise architecture system",
    "enterprise AI control stack",
  ],
  alternates: {
    canonical: "/audit",
  },
  openGraph: {
    title: "Workflow Architecture Packages | Axiom Architect",
    description:
      "Choose the right level of workflow architecture, from one workflow audit to enterprise AI control architecture.",
    url: "https://www.axiom-architect.co/audit",
    siteName: "Axiom Architect",
    type: "website",
    images: [
      {
        url: "/brand/axiom-architect-hero-banner.png",
        width: 1920,
        height: 1080,
        alt: "Axiom Architect workflow architecture packages",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Workflow Architecture Packages | Axiom Architect",
    description:
      "Compare workflow audits, blueprints, operating packs, stewardship, departmental systems, and enterprise architecture packages.",
    images: ["/brand/axiom-architect-hero-banner.png"],
  },
};

type ProductVisualKind = Parameters<typeof ProductSystemVisual>[0]["kind"];

type AuditDisplay = {
  price: string;
  label: string;
  visualKind: ProductVisualKind;
  recommended?: boolean;
};

const auditDisplay: Partial<Record<AxiomPackageKey, AuditDisplay>> = {
  workflow_audit: {
    price: "$49",
    label: "Entry diagnostic",
    visualKind: "workflow-audit",
    recommended: true,
  },
  workflow_blueprint: {
    price: "$149",
    label: "Implementation plan",
    visualKind: "workflow-blueprint",
  },
  custom_operating_pack: {
    price: "$399",
    label: "Operating pack",
    visualKind: "custom-operating-pack",
  },
  workflow_stewardship: {
    price: "$299/mo",
    label: "Ongoing review",
    visualKind: "workflow-stewardship",
  },
  departmental_ecosystem: {
    price: "$999",
    label: "Team architecture",
    visualKind: "departmental-ecosystem",
  },
  enterprise_architecture_system: {
    price: "$2,499",
    label: "Flagship architecture",
    visualKind: "architect-residency",
  },
};

const directPackages = axiomDirectPurchasePackages.map((packageKey) => axiomPackageModels[packageKey]);

const flowSteps = [
  "Choose package",
  "Create account",
  "Complete checkout",
  "Submit intake",
  "Axiom prepares report",
  "Review deliverables",
];

function packageCheckoutHref(packageModel: AxiomPackageModel) {
  if (!packageModel.checkoutSlug) {
    return "/bespoke/apply";
  }

  return `/signup?tier=${packageModel.checkoutSlug}&account=required`;
}

function PackageCard({ item }: { item: AxiomPackageModel }) {
  const display = auditDisplay[item.key] || {
    price: "Scoped",
    label: item.status,
    visualKind: "workflow-audit" as ProductVisualKind,
  };
  const deliverables = getAxiomPackageDeliverables(item.key).slice(0, 5);

  return (
    <article className="group rounded-[2rem] border border-[#9ed39f]/35 bg-[#030804] p-5 text-white shadow-[0_24px_70px_rgba(0,0,0,0.28)] transition duration-200 hover:border-black hover:bg-[#9ed39f] hover:text-black sm:p-6">
      <ProductSystemVisual kind={display.visualKind} />

      <div className="mt-6 flex flex-wrap gap-2">
        <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.2em] text-black transition duration-200 group-hover:border-black group-hover:bg-black group-hover:text-[#9ed39f]">
          {display.label}
        </p>
        {display.recommended ? (
          <p className="inline-flex border border-white/30 bg-black px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.2em] text-white transition duration-200 group-hover:border-black group-hover:bg-white group-hover:text-black">
            Start here
          </p>
        ) : null}
      </div>

      <div className="mt-5 flex items-start justify-between gap-5">
        <h2 className="text-2xl font-black uppercase tracking-[-0.04em] sm:text-3xl">
          {item.name}
        </h2>
        <p className="shrink-0 text-4xl font-black tracking-[-0.06em]">{display.price}</p>
      </div>

      <p className="mt-5 text-base leading-7 text-[#e6f6e7]/78 transition duration-200 group-hover:text-black/76">
        {item.shortDescription}
      </p>

      <p className="mt-4 text-sm leading-7 text-[#e6f6e7]/66 transition duration-200 group-hover:text-black/70">
        {item.clientSummary}
      </p>

      <ul className="mt-6 space-y-3">
        {deliverables.map((deliverable) => (
          <li key={deliverable.type} className="flex gap-3 text-sm leading-6">
            <span className="mt-1.5 h-2 w-2 shrink-0 bg-[#9ed39f] transition duration-200 group-hover:bg-black" />
            <span>{deliverable.title}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <a
          href={`/products/${item.publicSlug}`}
          className="inline-flex min-h-14 w-full items-center justify-center border border-[#9ed39f]/45 bg-black px-6 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition duration-200 hover:border-black hover:bg-white hover:text-black group-hover:!border-black group-hover:!bg-white group-hover:!text-black"
        >
          Learn more
        </a>
        <a
          href={packageCheckoutHref(item)}
          className="inline-flex min-h-14 w-full items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-6 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition duration-200 hover:bg-black hover:text-white group-hover:!border-black group-hover:!bg-black group-hover:!text-white"
        >
          Start package
        </a>
      </div>
    </article>
  );
}

export default function AuditPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_36%,#000_78%)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />

        <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
              Workflow architecture packages
            </p>
            <h1 className="mt-6 max-w-5xl text-[clamp(2.7rem,6vw,5.9rem)] font-black uppercase leading-[0.9] tracking-[-0.075em] text-white">
              Choose the right level of workflow architecture.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#e6f6e7]/80 sm:text-xl">
              Start with diagnosis, move into implementation planning, build reusable operating assets, or scale into stewardship, departmental architecture, and the flagship enterprise architecture system.
            </p>
          </div>

          <div className="grid gap-5">
            <ProductSystemVisual kind="departmental-ecosystem" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {flowSteps.map((step, index) => (
                <div key={step} className="border border-[#9ed39f]/28 bg-[#061008]/88 px-4 py-4">
                  <span className="block text-[0.56rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">0{index + 1}</span>
                  <span className="mt-2 block text-xs font-black uppercase tracking-[0.12em] text-white">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#9ed39f]/20 bg-[#9ed39f] px-4 py-14 text-black sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="inline-flex border border-black bg-black px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-[#9ed39f]">
              What gets mapped
            </p>
            <h2 className="mt-5 max-w-4xl text-[clamp(2.1rem,4vw,3.8rem)] font-black uppercase leading-[0.92] tracking-[-0.06em]">
              The workflow gets structured before automation is added.
            </h2>
          </div>
          <p className="border border-black/24 bg-[#b8efb9]/45 p-5 text-base leading-8 text-black/74 sm:text-lg">
            Axiom Architect reviews the operating pattern first: inputs, decisions, handoffs, tools, risks, review gates, and outcomes. That creates a cleaner foundation for AI-supported work.
          </p>
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
                Package ladder
              </p>
              <h2 className="mt-5 max-w-4xl text-[clamp(2.15rem,4vw,3.9rem)] font-black uppercase leading-[0.92] tracking-[-0.06em] text-white">
                Start with diagnosis. Scale into architecture.
              </h2>
            </div>
            <p className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5 text-base leading-8 text-[#e6f6e7]/78 sm:text-lg">
              These cards now render from the canonical package model used by pricing, checkout, report generation, and delivery. Display labels and prices are local; names, slugs, summaries, and deliverables come from the shared source of truth.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {directPackages.map((item) => (
              <PackageCard key={item.key} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#9ed39f] px-4 py-14 text-black sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="inline-flex border border-black bg-black px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-[#9ed39f]">
              Recommended path
            </p>
            <h2 className="mt-5 max-w-4xl text-[clamp(2.2rem,4vw,4rem)] font-black uppercase leading-[0.92] tracking-[-0.06em]">
              Start with Workflow Audit.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-black/74 sm:text-lg">
              It gives you the diagnostic foundation before you move into blueprints, operating packs, stewardship, or larger architecture work.
            </p>
          </div>
          <a href="/signup?tier=workflow-audit&account=required" className="inline-flex min-h-14 items-center justify-center border border-black bg-black px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black sm:min-w-72">
            Start Workflow Audit
          </a>
        </div>
      </section>
    </main>
  );
}
