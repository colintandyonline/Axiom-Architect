import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Axiom Architect | Workflow Architecture Enquiries",
  description:
    "Contact Axiom Architect for AI workflow audit questions, workflow blueprint enquiries, enterprise architecture systems, client support, partnerships, and implementation planning.",
  keywords: [
    "contact Axiom Architect",
    "workflow audit enquiry",
    "workflow blueprint enquiry",
    "AI workflow architecture contact",
    "enterprise architecture system enquiry",
    "workflow support",
    "operating blueprint support",
  ],
  alternates: {
    canonical: "/contact",
  },
  robots: {
    index: true,
    follow: true,
  },
};

type ContactSearchParams = {
  sent?: string;
  error?: string;
};

const contactRoutes = [
  {
    title: "General enquiries",
    email: "hello@axiom-architect.co",
    description: "Questions about Axiom Architect, service fit, workflow audits, and next steps.",
  },
  {
    title: "Client support",
    email: "support@axiom-architect.co",
    description: "Help with account access, dashboard status, intake submissions, and report delivery.",
  },
  {
    title: "Workflow projects",
    email: "projects@axiom-architect.co",
    description: "Blueprint, operating pack, ecosystem, and enterprise architecture enquiries for active business workflows.",
  },
];

const inquiryTypes = [
  "Workflow Audit",
  "Workflow Blueprint",
  "Custom Operating Pack",
  "Workflow Stewardship",
  "Departmental Ecosystem",
  "Axiom Enterprise Architecture System",
  "Enterprise AI Control Stack",
  "Support",
  "General enquiry",
];

function ContactVisual() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[#9ed39f]/38 bg-[#020503] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.38)] sm:p-7">
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(158,211,159,0.13)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.13)_1px,transparent_1px)] [background-size:38px_38px]" />
      <svg viewBox="0 0 720 520" className="relative h-auto w-full text-[#9ed39f]" fill="none" aria-hidden="true">
        <rect x="54" y="54" width="612" height="412" rx="28" stroke="currentColor" strokeWidth="2" opacity="0.65" />
        <rect x="118" y="124" width="300" height="196" rx="18" stroke="currentColor" strokeWidth="3" />
        <path d="M118 152 268 246 418 152" stroke="currentColor" strokeWidth="3" />
        <path d="M118 320 230 226M418 320 306 226" stroke="currentColor" strokeWidth="2" opacity="0.68" />
        <circle cx="526" cy="166" r="42" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="526" cy="166" r="10" fill="currentColor" />
        <circle cx="570" cy="272" r="34" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="570" cy="272" r="8" fill="currentColor" />
        <circle cx="496" cy="370" r="38" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="496" cy="370" r="9" fill="currentColor" />
        <path d="M418 214h70M526 208v30M534 296l-24 40M458 346l-62-38" stroke="currentColor" strokeWidth="2" opacity="0.62" />
        <path d="M168 370h176M168 398h126" stroke="currentColor" strokeWidth="2.3" opacity="0.7" />
      </svg>
    </div>
  );
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<ContactSearchParams>;
}) {
  const params = await searchParams;
  const sent = params.sent === "1";
  const error = params.error === "1";

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_34%,#000_76%)] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
              Contact Axiom Architect
            </p>
            <h1 className="mt-6 max-w-5xl text-[clamp(2.7rem,6vw,5.9rem)] font-black uppercase leading-[0.9] tracking-[-0.075em] text-white">
              Send the workflow problem. We will route it properly.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#e6f6e7]/80 sm:text-xl">
              Use this page for service questions, support, workflow planning, client account issues, or partnership enquiries.
            </p>
          </div>
          <ContactVisual />
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <aside className="grid gap-4 self-start">
            {contactRoutes.map((route) => (
              <article key={route.email} className="border border-[#9ed39f]/30 bg-[#041008] p-5">
                <h2 className="text-xl font-black uppercase tracking-[-0.03em] text-white">{route.title}</h2>
                <p className="mt-2 text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">{route.email}</p>
                <p className="mt-4 text-sm leading-7 text-[#e6f6e7]/72">{route.description}</p>
              </article>
            ))}
          </aside>

          <section className="rounded-[2rem] border border-[#9ed39f]/35 bg-[#030804] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.32)] sm:p-7 lg:p-8">
            <div className="mb-8">
              <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
                Enquiry form
              </p>
              <h2 className="mt-5 text-[clamp(2rem,4vw,3.5rem)] font-black uppercase leading-[0.92] tracking-[-0.06em] text-white">
                Tell us what needs designing.
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-[#e6f6e7]/74">
                Keep it practical: what is the workflow, where is the friction, what are you trying to improve, and which package are you considering?
              </p>
            </div>

            {sent ? (
              <div className="mb-6 border border-[#9ed39f] bg-[#9ed39f] p-5 text-black">
                <p className="m-0 text-lg font-black uppercase tracking-[-0.02em]">Message sent.</p>
                <p className="mb-0 mt-2 text-sm leading-6 text-black/72">
                  Thanks — your message has been routed to Axiom Architect.
                </p>
              </div>
            ) : null}

            {error ? (
              <div className="mb-6 border border-red-400 bg-red-950/45 p-5 text-red-100">
                <p className="m-0 font-bold">The message could not be sent. Please check the fields and try again.</p>
              </div>
            ) : null}

            <form action="/api/contact" method="post" className="grid gap-5">
              <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">Name</span>
                  <input name="name" required className="mt-2 w-full border border-[#9ed39f]/28 bg-black/55 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/32 focus:border-[#9ed39f]" />
                </label>
                <label className="block">
                  <span className="text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">Email</span>
                  <input name="email" type="email" required className="mt-2 w-full border border-[#9ed39f]/28 bg-black/55 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/32 focus:border-[#9ed39f]" />
                </label>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">Business</span>
                  <input name="business" className="mt-2 w-full border border-[#9ed39f]/28 bg-black/55 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/32 focus:border-[#9ed39f]" />
                </label>
                <label className="block">
                  <span className="text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">Enquiry type</span>
                  <select name="inquiry_type" required className="mt-2 w-full border border-[#9ed39f]/28 bg-black/55 px-4 py-3 text-sm leading-6 text-white outline-none transition focus:border-[#9ed39f]">
                    {inquiryTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">Subject</span>
                <input name="subject" required className="mt-2 w-full border border-[#9ed39f]/28 bg-black/55 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/32 focus:border-[#9ed39f]" />
              </label>

              <label className="block">
                <span className="text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">Message</span>
                <textarea name="message" rows={8} required className="mt-2 min-h-52 w-full resize-y border border-[#9ed39f]/28 bg-black/55 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/32 focus:border-[#9ed39f]" />
              </label>

              <button type="submit" className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white sm:w-fit">
                Send message
              </button>
            </form>
          </section>
        </div>
      </section>
    </main>
  );
}
