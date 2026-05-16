import Image from "next/image";
import type { Metadata } from "next";
import { AxiomSiteHeader } from "../../components/AxiomSiteHeader";
import { getAxiomAuthContext } from "../../lib/axiom-auth";

export const metadata: Metadata = {
  title: "Pricing | Axiom Architect",
  description:
    "Clear Axiom Architect pricing for workflow audits, workflow blueprints, and custom operating packs.",
};

type TierSlug = "workflow-audit" | "workflow-blueprint" | "custom-operating-pack";

const tiers: Array<{
  slug: TierSlug;
  name: string;
  price: string;
  label: string;
  summary: string;
  includes: string[];
}> = [
  {
    slug: "workflow-audit",
    name: "Workflow Audit",
    price: "$49",
    label: "Focused diagnostic",
    summary:
      "For one workflow that needs a clear diagnosis, friction map, automation suitability review, and practical next steps.",
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
    price: "$149",
    label: "Recommended plan",
    summary:
      "For clients who want the diagnostic plus a structured future-state workflow, review gates, assistant roles, and implementation sequence.",
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
    price: "$399",
    label: "Complete workflow asset",
    summary:
      "For one workflow that needs a full operating pack with protocol structure, reusable instructions, workbook assets, and handoff guidance.",
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
];

export default async function PricingPage() {
  const { user, customer } = await getAxiomAuthContext();
  const isSignedIn = Boolean(user && customer);

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <AxiomSiteHeader />
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_34%,#000_76%)] px-4 py-10 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />

        <div className="relative mx-auto max-w-[1280px] py-10 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
                Transparent pricing
              </p>
              <h1 className="mt-6 max-w-4xl text-[clamp(2.55rem,5.2vw,5rem)] font-black uppercase leading-[0.92] tracking-[-0.07em] text-white">
                Workflow architecture packages with clear scope.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[#e6f6e7]/75 sm:text-lg">
                Choose the level of diagnosis, blueprinting, and implementation support your workflow needs. Every package starts with one real process and ends with a structured operating asset you can use.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href="/audit" className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.2em] text-black transition hover:bg-white">
                  Start audit
                </a>
                <a href="/login" className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f]/35 bg-black px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.2em] text-white transition hover:border-[#9ed39f] hover:text-[#9ed39f]">
                  Client login
                </a>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-[#9ed39f]/42 bg-[#020503] p-4 shadow-[0_28px_90px_rgba(0,0,0,0.42)] sm:p-5">
              <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.12)_1px,transparent_1px)] [background-size:34px_34px]" />
              <div className="relative aspect-[16/10] overflow-hidden rounded-[1.45rem] border border-[#9ed39f]/30 bg-black">
                <Image
                  src="/brand/axiom-architect-hero-banner.png"
                  alt="Axiom Architect workflow architecture visual"
                  fill
                  priority
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  className="object-cover object-center"
                />
              </div>
              <div className="relative mt-4 grid grid-cols-3 gap-3">
                {["Diagnose", "Blueprint", "Implement"].map((item) => (
                  <div key={item} className="border border-[#9ed39f]/25 bg-[#061008]/86 px-3 py-4 text-center">
                    <p className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-5 xl:grid-cols-3">
            {tiers.map((tier) => (
              <article
                key={tier.slug}
                className={
                  tier.slug === "workflow-blueprint"
                    ? "rounded-[2rem] border border-[#9ed39f] bg-[#9ed39f] p-6 text-black shadow-[0_0_60px_rgba(158,211,159,0.22)]"
                    : "rounded-[2rem] border border-[#9ed39f]/34 bg-[#030804] p-6 text-white shadow-[0_24px_70px_rgba(0,0,0,0.28)]"
                }
              >
                <p
                  className={
                    tier.slug === "workflow-blueprint"
                      ? "inline-flex border border-black bg-black px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]"
                      : "inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.2em] text-black"
                  }
                >
                  {tier.label}
                </p>

                <div className="mt-6 flex items-start justify-between gap-5">
                  <h2 className="text-2xl font-black uppercase tracking-[-0.04em] sm:text-3xl">
                    {tier.name}
                  </h2>
                  <p className="text-4xl font-black tracking-[-0.06em]">{tier.price}</p>
                </div>

                <p
                  className={
                    tier.slug === "workflow-blueprint"
                      ? "mt-5 text-base leading-7 text-black/76"
                      : "mt-5 text-base leading-7 text-[#e6f6e7]/78"
                  }
                >
                  {tier.summary}
                </p>

                <ul className="mt-6 space-y-3">
                  {tier.includes.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6">
                      <span
                        className={
                          tier.slug === "workflow-blueprint"
                            ? "mt-1.5 h-2 w-2 shrink-0 bg-black"
                            : "mt-1.5 h-2 w-2 shrink-0 bg-[#9ed39f]"
                        }
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {isSignedIn ? (
                  <form action="/api/checkout" method="post" className="mt-8">
                    <input type="hidden" name="tier" value={tier.slug} />
                    <button
                      type="submit"
                      style={tier.slug === "workflow-blueprint" ? { color: "#ffffff" } : undefined}
                      className={
                        tier.slug === "workflow-blueprint"
                          ? "inline-flex min-h-14 w-full items-center justify-center border border-black bg-black px-6 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#ffffff] transition hover:bg-[#071208]"
                          : "inline-flex min-h-14 w-full items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-6 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white"
                      }
                    >
                      Continue to checkout
                    </button>
                  </form>
                ) : (
                  <a
                    href={`/signup?tier=${tier.slug}&account=required`}
                    style={tier.slug === "workflow-blueprint" ? { color: "#ffffff" } : undefined}
                    className={
                      tier.slug === "workflow-blueprint"
                        ? "mt-8 inline-flex min-h-14 w-full items-center justify-center border border-black bg-black px-6 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#ffffff] transition hover:bg-[#071208]"
                        : "mt-8 inline-flex min-h-14 w-full items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-6 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white"
                    }
                  >
                    Start this package
                  </a>
                )}
              </article>
            ))}
          </div>

          <div className="mt-10 border border-[#9ed39f]/30 bg-[#041008] p-6 text-[#e6f6e7]/78">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">
              How to begin
            </p>
            <p className="mt-4 max-w-4xl text-base leading-8">
              Select a package, create your secure client account, complete checkout, and submit your workflow through the dashboard. Your report workspace opens after payment is confirmed.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
