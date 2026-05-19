import type { Metadata } from "next";
import { ProductSystemVisual } from "../../components/ProductSystemVisual";
import { getAxiomAuthContext } from "../../lib/axiom-auth";

export const metadata: Metadata = {
  title: "Pricing | Axiom Architect",
  description:
    "Clear Axiom Architect pricing for workflow audits, workflow blueprints, operating packs, retainers, departmental systems, and flagship enterprise architecture systems.",
};

type ProductSlug =
  | "workflow-audit"
  | "workflow-blueprint"
  | "custom-operating-pack"
  | "workflow-stewardship"
  | "departmental-ecosystem"
  | "architect-residency";

const tiers: Array<{
  slug: ProductSlug;
  name: string;
  header: string;
  price: string;
  label: string;
  summary: string;
  includes: string[];
  featured?: boolean;
}> = [
  {
    slug: "workflow-audit",
    name: "Workflow Audit",
    header: "Entry diagnostic",
    price: "$49",
    label: "Focused diagnostic",
    summary:
      "Diagnose one workflow and identify bottlenecks, AI opportunities, risks, and practical next steps.",
    includes: [
      "One workflow submission",
      "Current workflow diagnosis",
      "Bottlenecks and weak points",
      "Automation suitability notes",
      "AI assistant opportunity map",
      "Risk and review requirements",
      "Recommended next steps",
      "Branded audit report",
    ],
  },
  {
    slug: "workflow-blueprint",
    name: "Workflow Blueprint",
    header: "Implementation plan",
    price: "$149",
    label: "Recommended plan",
    summary:
      "Turn the audit into a practical implementation plan with review gates, assistant roles, tool recommendations, and a 30-day sequence.",
    featured: true,
    includes: [
      "Everything in Workflow Audit",
      "Future-state workflow design",
      "Recommended assistant roles",
      "Human-in-the-loop review gates",
      "Tool stack recommendations",
      "Implementation sequence",
      "30-day operating plan",
      "Branded blueprint report",
    ],
  },
  {
    slug: "custom-operating-pack",
    name: "Custom Operating Pack",
    header: "Complete workflow system",
    price: "$399",
    label: "Complete workflow asset",
    summary:
      "Build the full workflow system: protocol, assistant instructions, workbook assets, handoff guidance, and quality-control checkpoints.",
    includes: [
      "Everything in Workflow Blueprint",
      "Custom operating protocol",
      "Reusable instruction blocks",
      "Agent or assistant guidance",
      "Implementation workbook assets",
      "Team handoff guide",
      "Quality-control checkpoints",
      "Branded operating pack",
    ],
  },
  {
    slug: "workflow-stewardship",
    name: "Workflow Stewardship",
    header: "Monthly workflow stewardship",
    price: "$299/mo",
    label: "Ongoing optimisation",
    summary:
      "A monthly operating review for AI-supported workflows that keep changing. Each cycle collects updates from the client, reviews drift, risks, tool changes, bottlenecks, and improvement opportunities, then turns them into a clear stewardship brief.",
    includes: [
      "Monthly stewardship intake prompt",
      "Review of workflow changes, errors, and bottlenecks",
      "AI/tool update scan for relevant improvements",
      "Updated priority list and next-step guidance",
      "Human review gate and risk-control check",
      "Monthly stewardship brief in the dashboard",
      "30-day improvement window for relevant report updates",
      "Light email support for minor workflow questions",
    ],
  },
  {
    slug: "departmental-ecosystem",
    name: "Departmental Ecosystem",
    header: "Departmental ecosystem",
    price: "$999",
    label: "Multi-workflow system",
    summary:
      "Map and connect up to five core workflows into a shared operating system for a team, department, or scaling business unit.",
    includes: [
      "Up to five core workflow maps",
      "Cross-departmental handoff logic",
      "Centralised data source strategy",
      "Interdependency mapping",
      "Universal Axiom documentation guide",
      "Master implementation roadmap for the quarter",
    ],
  },
  {
    slug: "architect-residency",
    name: "Axiom Enterprise Architecture System",
    header: "Flagship enterprise architecture",
    price: "$2,499",
    label: "Flagship enterprise product",
    summary:
      "A fixed-price flagship architecture package for complex workflow systems that need enterprise-level structure, dependency mapping, automation boundaries, risk controls, tool-stack guidance, and a complete dashboard-delivered operating roadmap.",
    includes: [
      "Expanded enterprise intake sequence",
      "Complex workflow and dependency architecture review",
      "Current-state and future-state system map",
      "Advanced AI and automation suitability model",
      "Risk, exception, and human review gate design",
      "Tool stack and data-flow architecture guidance",
      "Enterprise implementation roadmap",
      "Dashboard-delivered architecture report",
    ],
  },
];

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
                Six-product ladder
              </p>
              <h1 className="mt-6 max-w-4xl text-[clamp(2.55rem,5.2vw,5rem)] font-black uppercase leading-[0.92] tracking-[-0.07em] text-white">
                Workflow architecture packages with clear upgrade paths.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[#e6f6e7]/75 sm:text-lg">
                Start with diagnosis, move into implementation planning, build operating assets, then scale into ongoing support, departmental architecture, or a fixed-price flagship enterprise architecture system.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href="/signup" className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.2em] text-black transition hover:bg-white">
                  Start audit
                </a>
                <a href="/login" className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f]/35 bg-black px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.2em] text-white transition hover:border-[#9ed39f] hover:text-[#9ed39f]">
                  Client login
                </a>
              </div>
            </div>

            <div className="grid gap-5">
              <ProductSystemVisual kind="architect-residency" />
              <div className="grid grid-cols-3 gap-3">
                {["Diagnose", "Systemise", "Scale"].map((item) => (
                  <div key={item} className="border border-[#9ed39f]/25 bg-[#061008]/86 px-3 py-4 text-center">
                    <p className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {tiers.map((tier) => (
              <article
                key={tier.slug}
                className="group rounded-[2rem] border border-[#9ed39f]/34 bg-[#030804] p-6 text-white shadow-[0_24px_70px_rgba(0,0,0,0.28)] transition duration-200 hover:border-black hover:bg-[#9ed39f] hover:text-black hover:shadow-[0_0_70px_rgba(158,211,159,0.24)]"
              >
                <ProductSystemVisual kind={tier.slug} />

                <p className="mt-6 inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.2em] text-black transition duration-200 group-hover:border-black group-hover:bg-black group-hover:text-[#9ed39f]">
                  {tier.label}
                </p>

                <p className="mt-5 text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f] transition duration-200 group-hover:text-black/64">
                  {tier.header}
                </p>

                <div className="mt-3 flex items-start justify-between gap-5">
                  <h2 className="text-2xl font-black uppercase tracking-[-0.04em] sm:text-3xl">
                    {tier.name}
                  </h2>
                  <p className="text-4xl font-black tracking-[-0.06em]">{tier.price}</p>
                </div>

                <p className="mt-5 text-base leading-7 text-[#e6f6e7]/78 transition duration-200 group-hover:text-black/76">
                  {tier.summary}
                </p>

                <ul className="mt-6 space-y-3">
                  {tier.includes.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6">
                      <span className="mt-1.5 h-2 w-2 shrink-0 bg-[#9ed39f] transition duration-200 group-hover:bg-black" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {isSignedIn ? (
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    <a
                      href={`/products/${tier.slug}`}
                      className="inline-flex min-h-14 w-full items-center justify-center border border-[#9ed39f]/45 bg-black px-6 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition duration-200 hover:border-black hover:bg-white hover:text-black group-hover:!border-black group-hover:!bg-white group-hover:!text-black"
                    >
                      Learn more
                    </a>
                    <form action="/api/checkout" method="post">
                      <input type="hidden" name="tier" value={tier.slug} />
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
                      href={`/products/${tier.slug}`}
                      className="inline-flex min-h-14 w-full items-center justify-center border border-[#9ed39f]/45 bg-black px-6 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition duration-200 hover:border-black hover:bg-white hover:text-black group-hover:!border-black group-hover:!bg-white group-hover:!text-black"
                    >
                      Learn more
                    </a>
                    <a
                      href={`/signup?tier=${tier.slug}&account=required`}
                      className="inline-flex min-h-14 w-full items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-6 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition duration-200 hover:bg-black hover:text-white group-hover:!border-black group-hover:!bg-black group-hover:!text-white"
                    >
                      Start this package
                    </a>
                  </div>
                )}
              </article>
            ))}
          </div>

          <div className="mt-10 border border-[#9ed39f]/30 bg-[#041008] p-6 text-[#e6f6e7]/78">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">
              How to begin
            </p>
            <p className="mt-4 max-w-4xl text-base leading-8">
              Select a package, create your secure client account, complete checkout, and submit the intake matched to that product. Your report workspace opens after payment is confirmed.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
