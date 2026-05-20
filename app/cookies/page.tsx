import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | Axiom Architect Site Operation & Analytics",
  description:
    "Cookie policy for Axiom Architect covering essential cookies, account sessions, checkout flow, analytics, service improvement, and third-party operational tools.",
  keywords: [
    "Axiom Architect cookie policy",
    "site operation cookies",
    "account session cookies",
    "checkout cookies",
    "analytics cookies",
    "service improvement cookies",
    "workflow service cookies",
  ],
  alternates: {
    canonical: "/cookies",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const sections = [
  {
    title: "1. What cookies are",
    text: [
      "Cookies are small files or similar technologies that help a website remember information about a visit, session, device, or preference.",
      "Axiom Architect may use cookies and similar technologies to operate the site, support account sessions, protect the service, process checkout flows, understand site usage, and improve service delivery.",
    ],
  },
  {
    title: "2. Essential cookies",
    text: [
      "Essential cookies support core site functions such as page routing, security, account sessions, checkout flow, form handling, and service access. Some parts of the site may not work correctly without them.",
    ],
  },
  {
    title: "3. Account and service cookies",
    text: [
      "If you create an account or access a dashboard, cookies or similar session technologies may be used to keep you signed in, verify access, remember service state, and protect account areas.",
    ],
  },
  {
    title: "4. Payment and checkout cookies",
    text: [
      "Checkout and payment flows may involve cookies or similar technologies from payment providers such as Stripe. These support secure payment processing, fraud prevention, and checkout completion.",
    ],
  },
  {
    title: "5. Analytics and improvement",
    text: [
      "Axiom Architect may use analytics or measurement tools to understand page performance, service interest, navigation patterns, and site reliability. Analytics should help improve the service without replacing direct client communication or project review.",
    ],
  },
  {
    title: "6. Third-party services",
    text: [
      "Some cookies or similar technologies may be set by trusted service providers that support hosting, authentication, payment, email, analytics, security, or operational tooling.",
      "Those providers may have their own privacy and cookie information. You should review their policies where you interact directly with those services, especially during checkout or account authentication.",
    ],
  },
  {
    title: "7. Managing cookies",
    text: [
      "Most browsers let you block, delete, or limit cookies through browser settings. Blocking some cookies may affect sign-in, checkout, form submission, dashboard access, or other service functions.",
      "If a cookie preference banner or settings tool is available on the site, you can use it to manage non-essential cookie choices where applicable.",
    ],
  },
  {
    title: "8. Contact",
    text: [
      "Questions about cookies or site tracking can be sent to hello@axiom-architect.co.",
    ],
  },
];

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_34%,#000_76%)] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto max-w-[1120px]">
          <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
            Site operation
          </p>
          <h1 className="mt-6 max-w-5xl text-[clamp(2.7rem,6vw,5.7rem)] font-black uppercase leading-[0.9] tracking-[-0.075em] text-white">
            Cookie Policy
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#e6f6e7]/80 sm:text-xl">
            How cookies and similar technologies may support site operation, account sessions, checkout, analytics, and service improvement.
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
