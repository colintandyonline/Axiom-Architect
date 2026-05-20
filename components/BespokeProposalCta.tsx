"use client";

import { usePathname } from "next/navigation";

const ctaByPath: Record<
  string,
  {
    eyebrow: string;
    title: string;
    text: string;
    secondaryHref: string;
    secondaryLabel: string;
  }
> = {
  "/": {
    eyebrow: "Custom workflow systems",
    title: "Have an operating problem that needs more than a fixed package?",
    text: "Request a custom proposal for workflow architecture, automation boundaries, review gates, implementation planning, or a guarded operating system build.",
    secondaryHref: "/pricing",
    secondaryLabel: "Compare packages",
  },
  "/audit": {
    eyebrow: "Custom scope available",
    title: "Need more than one workflow audit?",
    text: "Use the custom proposal route when the workflow involves multiple tools, implementation risk, technical handoff, automation design, or enterprise-level review gates.",
    secondaryHref: "/pricing",
    secondaryLabel: "View package ladder",
  },
  "/pricing": {
    eyebrow: "Custom service path",
    title: "Not sure which package fits the work?",
    text: "Submit a custom proposal request and Axiom Architect will assess the workflow, required guardrails, implementation route, timeline, and suitable scope before any build work begins.",
    secondaryHref: "/audit",
    secondaryLabel: "View workflow packages",
  },
};

export function BespokeProposalCta() {
  const pathname = usePathname();
  const content = ctaByPath[pathname];

  if (!content) {
    return null;
  }

  return (
    <section className="border-y border-[#9ed39f]/24 bg-black px-4 py-14 text-white sm:px-6 lg:px-8 lg:py-18">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 rounded-[2rem] border border-[#9ed39f]/35 bg-[#041008] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.3)] sm:p-7 lg:grid-cols-[1fr_auto] lg:items-end lg:p-9">
        <div>
          <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
            {content.eyebrow}
          </p>
          <h2 className="mt-5 max-w-4xl text-[clamp(2.15rem,4vw,4.2rem)] font-black uppercase leading-[0.92] tracking-[-0.06em] text-white">
            {content.title}
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#e6f6e7]/76 sm:text-lg">
            {content.text}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[34rem]">
          <a href="/bespoke/apply" className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-6 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white">
            Request custom proposal
          </a>
          <a href={content.secondaryHref} className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f]/45 bg-black px-6 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-white transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black">
            {content.secondaryLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
