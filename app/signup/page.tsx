import Image from "next/image";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Secure Your Workflow Audit | Axiom Architect",
  description:
    "Confirm your selected Axiom Architect audit tier, enter your delivery details, and continue to secure payment.",
};

const tiers = {
  "workflow-audit": {
    name: "Workflow Audit",
    price: "$49",
    label: "Launch diagnostic",
    delivery: "Report generated after intake",
    summary:
      "A focused diagnostic for one workflow that needs clarity, scoring, and practical next steps.",
  },
  "workflow-blueprint": {
    name: "Workflow Blueprint",
    price: "$149",
    label: "Recommended",
    delivery: "Report generated after intake",
    summary:
      "A deeper blueprint with future-state workflow design, review gates, assistant roles, and an implementation sequence.",
  },
  "custom-operating-pack": {
    name: "Custom Operating Pack",
    price: "$399",
    label: "Premium buildout",
    delivery: "Report generated after intake",
    summary:
      "A complete operating pack for one workflow, including protocols, instructions, workbook, and handoff assets.",
  },
};

const checkoutFlow = [
  "Enter details",
  "Secure payment",
  "Dashboard opens",
  "Submit workflow",
  "Receive report",
];

const dashboardTabs = [
  "Workflow intake",
  "Report status",
  "Payment details",
  "Account settings",
];

function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <p
      className={
        dark
          ? "inline-flex border border-black bg-black px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-white"
          : "inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black"
      }
    >
      {children}
    </p>
  );
}

function SystemMotif() {
  return (
    <div className="relative min-h-[260px] overflow-hidden rounded-[2rem] border border-[#9ed39f]/55 bg-[#061008]/78 p-6 shadow-[inset_0_0_80px_rgba(158,211,159,0.05)]">
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.14)_1px,transparent_1px)] [background-size:34px_34px]" />
      <svg
        viewBox="0 0 420 260"
        className="relative h-full min-h-[220px] w-full text-[#9ed39f]"
        fill="none"
        aria-hidden="true"
      >
        <rect x="44" y="34" width="332" height="192" rx="18" stroke="currentColor" strokeWidth="2" opacity="0.75" />
        <rect x="126" y="76" width="92" height="118" rx="8" stroke="currentColor" strokeWidth="2.4" opacity="0.7" />
        <rect x="158" y="96" width="92" height="118" rx="8" stroke="currentColor" strokeWidth="2.4" opacity="0.85" />
        <rect x="190" y="118" width="92" height="118" rx="8" stroke="currentColor" strokeWidth="2.8" />
        <path d="M92 116h36M92 146h36M92 176h36M282 154h54" stroke="currentColor" strokeWidth="2" opacity="0.75" />
        <circle cx="350" cy="154" r="13" stroke="currentColor" strokeWidth="3" />
        <path d="M208 154h50M208 178h38M208 202h74" stroke="currentColor" strokeWidth="2.1" opacity="0.85" />
      </svg>
    </div>
  );
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string }>;
}) {
  const params = await searchParams;
  const tierSlug =
    params.tier && params.tier in tiers ? params.tier : "workflow-blueprint";
  const selectedTier = tiers[tierSlug as keyof typeof tiers];

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <section className="relative overflow-hidden border-b border-[#9ed39f]/20 bg-[#020503] px-4 py-6 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.12)_1px,transparent_1px)] [background-size:38px_38px]" />
        <div className="relative mx-auto flex max-w-[1440px] items-center justify-between gap-4">
          <a href="/audit" className="flex items-center gap-3">
            <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden border border-[#9ed39f]/40 bg-black">
              <Image
                src="/brand/axiom-logo.png"
                alt=""
                width={48}
                height={48}
                className="h-full w-full object-contain"
              />
            </span>
            <span>
              <span className="block text-sm font-black uppercase tracking-[0.24em]">
                Axiom Architect
              </span>
              <span className="hidden text-[0.68rem] uppercase tracking-[0.2em] text-[#9ed39f]/80 sm:block">
                Secure audit checkout
              </span>
            </span>
          </a>
          <a
            href="/audit#tiers"
            className="inline-flex min-h-11 items-center justify-center border border-[#9ed39f]/45 bg-black px-4 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black sm:px-6"
          >
            Change tier
          </a>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_36%,#000_78%)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <Eyebrow>Secure your audit</Eyebrow>
            <h1 className="mt-6 max-w-5xl text-[clamp(2.65rem,6vw,5.8rem)] font-black uppercase leading-[0.9] tracking-[-0.075em] text-white">
              Confirm your details and continue to payment.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#e6f6e7]/80 sm:text-xl">
              Enter the details for your receipt, dashboard access, workflow intake, and report delivery. Your client dashboard is created after payment is confirmed.
            </p>
          </div>

          <div className="grid gap-5">
            <SystemMotif />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
              {checkoutFlow.map((step, index) => (
                <div key={step} className="border border-[#9ed39f]/28 bg-[#061008]/88 px-4 py-4">
                  <span className="block text-[0.56rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">
                    0{index + 1}
                  </span>
                  <span className="mt-2 block text-xs font-black uppercase tracking-[0.12em] text-white">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#9ed39f]/20 bg-[#9ed39f] px-4 py-14 text-black sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div>
            <Eyebrow dark>Selected audit</Eyebrow>
            <h2 className="mt-5 max-w-4xl text-[clamp(2.15rem,4vw,3.8rem)] font-black uppercase leading-[0.92] tracking-[-0.06em]">
              {selectedTier.name}
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-black/72 sm:text-lg">
              {selectedTier.summary}
            </p>
          </div>

          <form
            action="/checkout"
            method="get"
            className="rounded-[2rem] border border-black/22 bg-[#b8efb9]/45 p-6 sm:p-7"
          >
            <input type="hidden" name="tier" value={tierSlug} />
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <p className="inline-flex border border-black bg-black px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.2em] text-white">
                  {selectedTier.label}
                </p>
                <p className="mt-5 text-5xl font-black tracking-[-0.07em]">
                  {selectedTier.price}
                </p>
              </div>
              <p className="border border-black/20 px-4 py-3 text-sm font-bold uppercase tracking-[0.12em]">
                {selectedTier.delivery}
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[0.66rem] font-black uppercase tracking-[0.18em] text-black/72">
                  Full name
                </span>
                <input
                  name="name"
                  type="text"
                  required
                  className="min-h-13 w-full border border-black/25 bg-[#e4f6e4] px-4 text-base text-black outline-none transition focus:border-black"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-[0.66rem] font-black uppercase tracking-[0.18em] text-black/72">
                  Email address
                </span>
                <input
                  name="email"
                  type="email"
                  required
                  className="min-h-13 w-full border border-black/25 bg-[#e4f6e4] px-4 text-base text-black outline-none transition focus:border-black"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-[0.66rem] font-black uppercase tracking-[0.18em] text-black/72">
                  Business or project name
                </span>
                <input
                  name="business"
                  type="text"
                  className="min-h-13 w-full border border-black/25 bg-[#e4f6e4] px-4 text-base text-black outline-none transition focus:border-black"
                />
              </label>
            </div>

            <p className="mt-5 text-sm leading-6 text-black/68">
              After payment, your dashboard access and receipt are sent to this email. The dashboard is where you complete the workflow intake and track report delivery.
            </p>

            <button
              type="submit"
              className="mt-7 inline-flex min-h-14 w-full items-center justify-center border border-black bg-black px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black"
            >
              Continue to payment
            </button>
          </form>
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <Eyebrow>After checkout</Eyebrow>
            <h2 className="mt-5 text-[clamp(2.1rem,4vw,3.7rem)] font-black uppercase leading-[0.92] tracking-[-0.06em] text-white">
              Your dashboard becomes the working area.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#e6f6e7]/76 sm:text-lg">
              Payment confirmation opens the client space for your audit. That is where the actual workflow work begins.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {dashboardTabs.map((tab) => (
              <div key={tab} className="rounded-[1.5rem] border border-[#9ed39f]/30 bg-[#041008] p-5">
                <span className="mb-5 block h-2 w-2 bg-[#9ed39f]" />
                <p className="text-base font-black uppercase tracking-[0.08em] text-white">
                  {tab}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
