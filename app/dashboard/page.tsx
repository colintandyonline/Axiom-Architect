import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Axiom Architect",
  description:
    "Access your Axiom Architect workflow intake, report status, payment details, and account settings.",
};

const tabs = [
  {
    label: "Workflow intake",
    text: "Submit the workflow details needed to generate your audit report.",
  },
  {
    label: "Report status",
    text: "Track progress from intake submitted to report ready.",
  },
  {
    label: "Payment details",
    text: "View your selected audit tier and checkout confirmation.",
  },
  {
    label: "Account settings",
    text: "Manage the email and business details connected to your audit.",
  },
];

export default function DashboardPage({
  searchParams,
}: {
  searchParams?: { checkout?: string; session_id?: string };
}) {
  const isCheckoutSuccess = searchParams?.checkout === "success";

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <section className="relative overflow-hidden border-b border-[#9ed39f]/20 bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_36%,#000_78%)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto max-w-[1440px]">
          <a
            href="/"
            className="inline-flex border border-[#9ed39f]/45 bg-black px-4 py-3 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black"
          >
            Axiom Architect
          </a>

          {isCheckoutSuccess ? (
            <p className="mt-10 inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
              Payment confirmed
            </p>
          ) : (
            <p className="mt-10 inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
              Client dashboard
            </p>
          )}

          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <h1 className="max-w-5xl text-[clamp(2.65rem,6vw,5.8rem)] font-black uppercase leading-[0.9] tracking-[-0.075em] text-white">
                Your audit workspace is ready.
              </h1>
            </div>
            <p className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5 text-base leading-8 text-[#e6f6e7]/78 sm:text-lg">
              Start by completing the workflow intake. Your report is generated from the details you provide there.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#9ed39f] px-4 py-14 text-black sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-5 lg:grid-cols-4">
          {tabs.map((tab) => (
            <article key={tab.label} className="rounded-[1.5rem] border border-black/22 bg-[#b8efb9]/45 p-5">
              <span className="mb-5 block h-2 w-2 bg-black" />
              <h2 className="text-lg font-black uppercase tracking-[0.02em]">
                {tab.label}
              </h2>
              <p className="mt-4 text-sm leading-6 text-black/72">{tab.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 rounded-[2rem] border border-[#9ed39f]/34 bg-[#030804] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
              Next step
            </p>
            <h2 className="mt-5 max-w-4xl text-[clamp(2.1rem,4vw,3.7rem)] font-black uppercase leading-[0.92] tracking-[-0.06em] text-white">
              Submit your first workflow.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[#e6f6e7]/78 sm:text-lg">
              The intake form is the source material for your diagnostic report. The stronger the workflow details, the stronger the report.
            </p>
          </div>
          <a
            href="/dashboard/intake"
            className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white sm:min-w-72"
          >
            Start workflow intake
          </a>
        </div>
      </section>
    </main>
  );
}
