import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund and Service Delivery Policy | Axiom Architect",
  description:
    "Refund, returns, cancellation, subscription, and digital service delivery expectations for Axiom Architect workflow services.",
};

const sections = [
  {
    title: "1. Digital service nature",
    text: [
      "Axiom Architect sells digital workflow architecture services, including audits, blueprints, operating packs, retainers, ecosystem design, and implementation planning. These are service outputs, not physical goods.",
      "Because the work often begins after payment and depends on your submitted workflow information, refund expectations are tied to service stage, delivery progress, and whether work has already started.",
    ],
  },
  {
    title: "2. Before work starts",
    text: [
      "If you purchase a service by mistake and contact us before any intake review, diagnostic work, preparation, or delivery activity has started, we will review the request and may be able to cancel and refund the order.",
      "Refund requests should be sent to hello@axiom-architect.co with the order email, service purchased, and reason for the request.",
    ],
  },
  {
    title: "3. After intake or delivery work begins",
    text: [
      "Once you submit a workflow intake or Axiom Architect begins review, diagnostic preparation, blueprint work, report generation, implementation planning, or custom service activity, the service is considered in progress.",
      "In-progress digital services are generally not refundable simply because you change your mind, no longer need the output, or decide not to use the recommendations.",
    ],
  },
  {
    title: "4. Completed digital outputs",
    text: [
      "After a report, blueprint, operating pack, written diagnostic, implementation plan, or other agreed digital output has been delivered, the order is generally treated as fulfilled.",
      "If there is a practical delivery issue, missing agreed section, file access problem, or clear service error, contact us and we will review the issue. A correction, replacement delivery, clarification, or partial remedy may be more appropriate than a refund.",
    ],
  },
  {
    title: "5. Subscriptions and retainers",
    text: [
      "Workflow Stewardship or similar ongoing services may be billed as a subscription or retainer. You can request cancellation for future billing, subject to the terms shown at checkout or agreed in writing.",
      "Cancelling a subscription normally stops future billing. It does not automatically refund service periods already started, work already completed, or support already made available.",
    ],
  },
  {
    title: "6. Client delay or missing information",
    text: [
      "Service delivery depends on receiving clear and complete information from you. If required intake details, clarification, access, or project information is missing, delivery may be delayed.",
      "A refund is not normally available where delivery is delayed because requested client information has not been provided, submitted details are incomplete, or the scope changes after purchase.",
    ],
  },
  {
    title: "7. Delivery method and timing",
    text: [
      "Axiom Architect may deliver outputs by dashboard, email, file link, report page, PDF, shared document, or another agreed digital method.",
      "Delivery estimates are practical targets, not guarantees, unless a specific delivery commitment has been agreed in writing. Larger or custom services may involve staged delivery and review points.",
    ],
  },
  {
    title: "8. Chargebacks and payment disputes",
    text: [
      "If you have a payment or service concern, contact us first at hello@axiom-architect.co so we can review the order and service status. We may need order details, account email, delivery records, and relevant correspondence to investigate.",
    ],
  },
  {
    title: "9. Contact",
    text: [
      "Refund, cancellation, and service delivery questions can be sent to hello@axiom-architect.co.",
    ],
  },
];

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_34%,#000_76%)] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto max-w-[1120px]">
          <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
            Service delivery
          </p>
          <h1 className="mt-6 max-w-5xl text-[clamp(2.55rem,5.6vw,5.4rem)] font-black uppercase leading-[0.9] tracking-[-0.075em] text-white">
            Refund / Returns / Service Delivery Policy
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#e6f6e7]/80 sm:text-xl">
            Practical expectations for digital workflow services, service stages, cancellations, subscriptions, and delivery issues.
          </p>
          <p className="mt-6 text-sm font-bold uppercase tracking-[0.16em] text-[#9ed39f]/86">
            Last updated: 17 May 2026
          </p>
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1120px] gap-5">
          {sections.map((section) => (
            <article key={section.title} className="border border-[#9ed39f]/28 bg-[#030804] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.24)] sm:p-7">
              <h2 className="text-2xl font-black uppercase tracking-[-0.04em] text-white">
                {section.title}
              </h2>
              <div className="mt-4 grid gap-4 text-base leading-8 text-[#e6f6e7]/76">
                {section.text.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
