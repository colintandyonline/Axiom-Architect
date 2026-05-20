import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sitemap | Axiom Architect Pages & Products",
  description:
    "Browse Axiom Architect public pages, workflow architecture product pages, pricing, support routes, legal policies, and XML sitemap links.",
  alternates: {
    canonical: "/sitemap",
  },
};

const pageGroups = [
  {
    title: "Main Pages",
    description: "Core public pages for understanding Axiom Architect and starting the workflow architecture path.",
    links: [
      { label: "Home", href: "/", note: "Main Axiom Architect landing page." },
      { label: "Workflow Packages", href: "/audit", note: "Product ladder and workflow architecture overview." },
      { label: "Pricing", href: "/pricing", note: "Compare the six Axiom Architect products." },
      { label: "About", href: "/about", note: "Brand, positioning, and service context." },
      { label: "Contact", href: "/contact", note: "Contact and support entry point." },
    ],
  },
  {
    title: "Product Detail Pages",
    description: "Dedicated pages explaining what each product does, who it is for, and what the client receives.",
    links: [
      { label: "Workflow Audit", href: "/products/workflow-audit", note: "Focused diagnostic for one workflow." },
      { label: "Workflow Blueprint", href: "/products/workflow-blueprint", note: "Implementation plan for one workflow." },
      { label: "Custom Operating Pack", href: "/products/custom-operating-pack", note: "Reusable operating assets and assistant guidance." },
      { label: "Workflow Stewardship", href: "/products/workflow-stewardship", note: "Ongoing review and optimisation." },
      { label: "Departmental Ecosystem", href: "/products/departmental-ecosystem", note: "Connected operating model for multiple workflows." },
      { label: "Axiom Enterprise Architecture System", href: "/products/enterprise-architecture-system", note: "Flagship enterprise architecture package for complex workflow systems." },
    ],
  },
  {
    title: "Account Path",
    description: "Public account entry points used before payment and dashboard access.",
    links: [
      { label: "Create Account", href: "/signup", note: "Create a secure client account before checkout." },
      { label: "Login", href: "/login", note: "Access an existing client account." },
    ],
  },
  {
    title: "Legal And Policy Pages",
    description: "Service terms, privacy, cookie, and delivery policies for Axiom Architect.",
    links: [
      { label: "Terms of Service", href: "/terms", note: "Service terms and usage rules." },
      { label: "Privacy Policy", href: "/privacy", note: "How client and workflow information is handled." },
      { label: "Cookie Policy", href: "/cookies", note: "Cookie and tracking information." },
      { label: "Refund / Service Delivery Policy", href: "/refund-policy", note: "Refund, returns, cancellation, and digital delivery expectations." },
    ],
  },
  {
    title: "Search Engine Sitemap",
    description: "XML sitemap for Google Search Console and search crawlers.",
    links: [
      { label: "XML Sitemap", href: "/sitemap.xml", note: "Machine-readable sitemap for search engines." },
    ],
  },
];

export default function SitemapPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_34%,#000_76%)] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto max-w-[1120px]">
          <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
            Site index
          </p>
          <h1 className="mt-6 max-w-5xl text-[clamp(2.7rem,6vw,5.7rem)] font-black uppercase leading-[0.9] tracking-[-0.075em] text-white">
            Sitemap
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#e6f6e7]/80 sm:text-xl">
            Browse the main public pages, product detail pages, account entry points, legal pages, and the XML sitemap for search engines.
          </p>
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1120px] gap-6">
          {pageGroups.map((group) => (
            <section key={group.title} className="border border-[#9ed39f]/28 bg-[#030804] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.24)] sm:p-7">
              <div className="grid gap-4 lg:grid-cols-[0.55fr_1fr] lg:items-start">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-[-0.04em] text-white">
                    {group.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/64">
                    {group.description}
                  </p>
                </div>
                <div className="grid gap-3">
                  {group.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="group grid gap-2 border border-[#9ed39f]/16 bg-black/56 px-4 py-4 transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black sm:grid-cols-[0.45fr_1fr_auto] sm:items-center"
                    >
                      <span className="text-[0.74rem] font-black uppercase tracking-[0.14em] text-white transition group-hover:text-black">
                        {link.label}
                      </span>
                      <span className="text-sm leading-6 text-[#e6f6e7]/64 transition group-hover:text-black/70">
                        {link.note}
                      </span>
                      <span className="text-[#9ed39f] transition group-hover:text-black">→</span>
                    </a>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
