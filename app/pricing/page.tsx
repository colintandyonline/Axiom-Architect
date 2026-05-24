import type { Metadata } from "next";
import { ProductSystemVisual } from "../../components/ProductSystemVisual";
import { getAxiomAuthContext } from "../../lib/axiom-auth";
import {
  axiomDirectPurchasePackages,
  axiomPackageModels,
  getAxiomPackageDeliverables,
  type AxiomPackageKey,
} from "../../lib/axiom-package-model";

export const metadata: Metadata = {
  title: "Axiom Architect Pricing | AI Workflow Architecture Packages",
  description:
    "Compare Axiom Architect pricing for AI workflow audits, workflow blueprints, operating packs, monthly stewardship, departmental ecosystems, and enterprise architecture systems.",
  keywords: [
    "Axiom Architect pricing",
    "AI workflow audit pricing",
    "workflow blueprint pricing",
    "workflow architecture packages",
    "workflow stewardship subscription",
    "departmental ecosystem pricing",
    "enterprise architecture system pricing",
    "enterprise AI control stack",
    "automation suitability pricing",
  ],
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Axiom Architect Pricing | AI Workflow Architecture Packages",
    description:
      "Compare workflow architecture packages from $49 diagnostics to the $2,499 Axiom Enterprise Architecture System.",
    url: "https://www.axiom-architect.co/pricing",
    siteName: "Axiom Architect",
    type: "website",
    images: [
      {
        url: "/brand/axiom-architect-hero-banner.png",
        width: 1920,
        height: 1080,
        alt: "Axiom Architect pricing for AI workflow architecture packages",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Axiom Architect Pricing | AI Workflow Architecture Packages",
    description:
      "Compare AI workflow audit, blueprint, operating pack, stewardship, departmental ecosystem, and enterprise architecture pricing.",
    images: ["/brand/axiom-architect-hero-banner.png"],
  },
};

type ProductVisualKind = Parameters<typeof ProductSystemVisual>[0]["kind"];

type PricingDisplay = {
  header: string;
  price: string;
  label: string;
  visualKind: ProductVisualKind;
  featured?: boolean;
};

const pricingDisplay: Partial<Record<AxiomPackageKey, PricingDisplay>> = {
  workflow_audit: {
    header: "Entry diagnostic",
    price: "$49",
    label: "Focused diagnostic",
    visualKind: "workflow-audit",
  },
  workflow_blueprint: {
    header: "Implementation plan",
    price: "$149",
    label: "Recommended plan",
    visualKind: "workflow-blueprint",
    featured: true,
  },
  custom_operating_pack: {
    header: "Complete workflow system",
    price: "$399",
    label: "Complete workflow asset",
    visualKind: "custom-operating-pack",
  },
  workflow_stewardship: {
    header: "Monthly workflow stewardship",
    price: "$299/mo",
    label: "Ongoing optimisation",
    visualKind: "workflow-stewardship",
  },
  departmental_ecosystem: {
    header: "Departmental ecosystem",
    price: "$999",
    label: "Multi-workflow system",
    visualKind: "departmental-ecosystem",
  },
  enterprise_architecture_system: {
    header: "Flagship enterprise architecture",
    price: "$2,499",
    label: "Flagship enterprise product",
    visualKind: "architect-residency",
  },
};

const directPackageModels = axiomDirectPurchasePackages.map((packageKey) => axiomPackageModels[packageKey]);

export default async function PricingPage() {
  const { user, customer } = await getAxiomAuthContext();
  const isSignedIn = Boolean(user && customer);

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_34%,#000_76%)] px-4 py-10 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />

        <div className="relative mx-auto max-w-[1400px] py-10 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
                Defined packages and custom proposals
              </p>
              <h1 className="mt-6 max-w-4xl text-[clamp(2.55rem,5.2vw,5rem)] font-black uppercase leading-[0.92] tracking-[-0.07em] text-white">
                Choose a fixed package or request a bespoke workflow proposal.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[#e6f6e7]/75 sm:text-lg">
                Buy a defined package when the service level is clear. Request a custom proposal when the workflow needs to be scoped before the right plan, price, and deliverables are confirmed.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href="/signup?tier=workflow-audit&account=required" className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.2em] text-black transition hover:bg-white">
                  Start Workflow Audit
                </a>
                <a href="/bespoke/apply" className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f]/45 bg-black px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.2em] text-white transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black">
                  Request custom proposal
                </a>
              </div>
            </div>

            <div className="grid gap-5">
              <ProductSystemVisual kind="architect-residency" />
              <div className="grid grid-cols-3 gap-3">
                {["Package", "Proposal", "Deliver"].map((item) => (
                  <div key={item} className="border border-[#9ed39f]/25 bg-[#061008]/86 px-3 py-4 text-center">
                    <p className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <section className="mt-12 grid gap-5 lg:grid-cols-2">
            <article className="rounded-[2rem] border border-[#9ed39f]/34 bg-[#030804] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
              <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.2em] text-black">
                Route one
              </p>
              <h2 className="mt-5 text-3xl font-black uppercase leading-tight tracking-[-0.05em] text-white">
                Buy a defined package
              </h2>
              <p className="mt-4 text-base leading-8 text-[#e6f6e7]/76">
                Choose this when you already know the level of help you need: audit, blueprint, operating pack, stewardship, departmental system, or enterprise architecture system.
              </p>
              <div className="mt-5 grid gap-3 text-sm leading-7 text-[#e6f6e7]/72 sm:grid-cols-2">
                <p><strong className="text-[#9ed39f]">Starts with:</strong> checkout and guided intake.</p>
                <p><strong className="text-[#9ed39f]">Best for:</strong> clear fixed-scope needs.</p>
                <p><strong className="text-[#9ed39f]">You receive:</strong> the deliverables listed in the package.</p>
                <p><strong className="text-[#9ed39f]">Next step:</strong> choose a package below.</p>
              </div>
            </article>

            <article className="rounded-[2rem] border border-[#9ed39f]/34 bg-[#030804] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
              <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.2em] text-black">
                Route two
              </p>
              <h2 className="mt-5 text-3xl font-black uppercase leading-tight tracking-[-0.05em] text-white">
                Request a custom proposal
              </h2>
              <p className="mt-4 text-base leading-8 text-[#e6f6e7]/76">
                Choose this when the work needs shaping first: complex workflows, sensitive data, technical implementation, multi-tool systems, or unclear requirements.
              </p>
              <div className="mt-5 grid gap-3 text-sm leading-7 text-[#e6f6e7]/72 sm:grid-cols-2">
                <p><strong className="text-[#9ed39f]">Starts with:</strong> a short project brief.</p>
                <p><strong className="text-[#9ed39f]">Best for:</strong> bespoke or uncertain scope.</p>
                <p><strong className="text-[#9ed39f]">You receive:</strong> a recommended route before work begins.</p>
                <p><strong className="text-[#9ed39f]">Next step:</strong> request a proposal.</p>
              </div>
            </article>
          </section>

          <div className="mt-12 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {directPackageModels.map((packageModel) => {
              const checkoutSlug = packageModel.checkoutSlug;
              const display = pricingDisplay[packageModel.key];

              if (!checkoutSlug || !display) {
                return null;
              }

              const deliverables = getAxiomPackageDeliverables(packageModel.key);
              const includes = [
                ...packageModel.clientReceives,
                ...deliverables.slice(0, 4).map((deliverable) => deliverable.title),
              ];

              return (
                <article
                  key={packageModel.key}
                  className="group rounded-[2rem] border border-[#9ed39f]/34 bg-[#030804] p-6 text-white shadow-[0_24px_70px_rgba(0,0,0,0.28)] transition duration-200 hover:border-black hover:bg-[#9ed39f] hover:text-black hover:shadow-[0_0_70px_rgba(158,211,159,0.24)]"
                >
                  <ProductSystemVisual kind={display.visualKind} />

                  <p className="mt-6 inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.2em] text-black transition duration-200 group-hover:border-black group-hover:bg-black group-hover:text-[#9ed39f]">
                    {display.label}
                  </p>

                  <p className="mt-5 text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f] transition duration-200 group-hover:text-black/64">
                    {display.header}
                  </p>

                  <div className="mt-3 flex items-start justify-between gap-5">
                    <h2 className="text-2xl font-black uppercase tracking-[-0.04em] sm:text-3xl">
                      {packageModel.name}
                    </h2>
                    <p className="text-4xl font-black tracking-[-0.06em]">{display.price}</p>
                  </div>

                  <p className="mt-5 text-base leading-7 text-[#e6f6e7]/78 transition duration-200 group-hover:text-black/76">
                    {packageModel.clientSummary}
                  </p>

                  <div className="mt-6 border border-[#9ed39f]/22 bg-black/30 p-4 transition duration-200 group-hover:border-black/20 group-hover:bg-black/10">
                    <p className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition duration-200 group-hover:text-black/68">
                      Best for
                    </p>
                    <ul className="mt-3 space-y-2">
                      {packageModel.bestFor.slice(0, 3).map((item) => (
                        <li key={item} className="flex gap-3 text-sm leading-6">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#9ed39f] transition duration-200 group-hover:bg-black" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6">
                    <p className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition duration-200 group-hover:text-black/68">
                      Client receives
                    </p>
                    <ul className="mt-3 space-y-3">
                      {includes.map((item) => (
                        <li key={item} className="flex gap-3 text-sm leading-6">
                          <span className="mt-1.5 h-2 w-2 shrink-0 bg-[#9ed39f] transition duration-200 group-hover:bg-black" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {isSignedIn ? (
                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                      <a
                        href={`/products/${packageModel.publicSlug}`}
                        className="inline-flex min-h-14 w-full items-center justify-center border border-[#9ed39f]/45 bg-black px-6 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition duration-200 hover:border-black hover:bg-white hover:text-black group-hover:!border-black group-hover:!bg-white group-hover:!text-black"
                      >
                        Learn more
                      </a>
                      <form action="/api/checkout" method="post">
                        <input type="hidden" name="tier" value={checkoutSlug} />
                        <button
                          type="submit"
                          className="inline-flex min-h-14 w-full items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-6 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition duration-200 hover:bg-black hover:text-white group-hover:!border-black group-hover:!bg-black group-hover:!text-white"
                        >
                          Continue to checkout
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                      <a
                        href={`/products/${packageModel.publicSlug}`}
                        className="inline-flex min-h-14 w-full items-center justify-center border border-[#9ed39f]/45 bg-black px-6 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition duration-200 hover:border-black hover:bg-white hover:text-black group-hover:!border-black group-hover:!bg-white group-hover:!text-black"
                      >
                        Learn more
                      </a>
                      <a
                        href={`/signup?tier=${checkoutSlug}&account=required`}
                        className="inline-flex min-h-14 w-full items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-6 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition duration-200 hover:bg-black hover:text-white group-hover:!border-black group-hover:!bg-black group-hover:!text-white"
                      >
                        Start this package
                      </a>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <div className="mt-10 border border-[#9ed39f]/30 bg-[#041008] p-6 text-[#e6f6e7]/78">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">
              How to begin
            </p>
            <p className="mt-4 max-w-4xl text-base leading-8">
              Choose a package if you know what you need. Request a proposal if you want Axiom Architect to help define the right route first.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
