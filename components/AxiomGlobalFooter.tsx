"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const publicPagePaths = new Set([
  "/",
  "/audit",
  "/pricing",
  "/about",
  "/contact",
  "/sitemap",
  "/terms",
  "/privacy",
  "/cookies",
  "/refund-policy",
]);

const siteLinks = [
  { label: "Home", href: "/" },
  { label: "Workflow Audit", href: "/audit" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Sitemap", href: "/sitemap" },
];

const systemLinks = [
  { label: "Protocols", href: "https://axiom-studio.co/collections/protocols" },
  { label: "Agent Kits", href: "https://axiom-studio.co/collections/agent-kits" },
  { label: "Workbooks", href: "https://axiom-studio.co/collections/workbooks" },
  { label: "Operating Packs", href: "https://axiom-studio.co/collections/operating-packs" },
  { label: "Enterprise AI Control Stack", href: "https://axiom-studio.co/collections/enterprise-ai-control-stack" },
  { label: "Visit Axiom Studio", href: "https://axiom-studio.co/" },
];

const legalLinks = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "Refund / Service Delivery", href: "/refund-policy" },
];

function isPublicPagePath(pathname: string) {
  return publicPagePaths.has(pathname) || pathname.startsWith("/products/");
}

function FooterColumn({
  title,
  links,
  external = false,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
  external?: boolean;
}) {
  return (
    <section>
      <h2 className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-[#9ed39f]">
        {title}
      </h2>
      <div className="mt-5 grid gap-3">
        {links.map((link) => {
          const isExternal = external || link.href.startsWith("https://");

          return (
            <a
              key={link.href}
              href={link.href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noreferrer" : undefined}
              className="group inline-flex items-center justify-between gap-4 border border-[#9ed39f]/14 bg-black/54 px-4 py-3 text-[0.76rem] font-bold uppercase tracking-[0.12em] text-white/78 transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black"
            >
              <span>{link.label}</span>
              <span className="text-[#9ed39f] transition group-hover:text-black">→</span>
            </a>
          );
        })}
      </div>
    </section>
  );
}

export function AxiomGlobalFooter() {
  const pathname = usePathname();
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadAuthStatus() {
      try {
        const response = await fetch("/api/auth/status", { cache: "no-store" });

        if (!response.ok) {
          return;
        }

        const status = (await response.json()) as { signedIn?: boolean };

        if (active) {
          setSignedIn(Boolean(status.signedIn));
        }
      } catch {
        if (active) {
          setSignedIn(false);
        }
      }
    }

    loadAuthStatus();

    return () => {
      active = false;
    };
  }, []);

  if (!isPublicPagePath(pathname)) {
    return null;
  }

  const accountLinks = signedIn
    ? [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Log Out", href: "/logout" },
      ]
    : [
        { label: "Start Audit", href: "/signup" },
        { label: "Login", href: "/login" },
      ];

  return (
    <footer className="border-t border-[#9ed39f]/28 bg-black text-white">
      <div className="relative overflow-hidden border-b border-[#9ed39f]/18 bg-[#020503] px-4 py-14 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.12)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr_0.85fr_0.85fr]">
          <section>
            <a href="/" aria-label="Axiom Architect home" className="inline-flex min-w-0 items-center gap-4">
              <span className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden border border-[#9ed39f]/42 bg-black shadow-[0_0_24px_rgba(158,211,159,0.16)]">
                <Image src="/brand/axiom-logo.png" alt="" width={64} height={64} className="h-full w-full object-contain" />
              </span>
              <span>
                <strong className="block text-[0.92rem] font-black uppercase tracking-[0.22em] text-white">
                  Axiom Architect
                </strong>
                <span className="mt-2 block text-[0.64rem] uppercase tracking-[0.18em] text-[#9ed39f]/82">
                  The architecture behind intelligent work
                </span>
              </span>
            </a>

            <p className="mt-7 max-w-xl text-base leading-8 text-[#e6f6e7]/72">
              Axiom Architect turns real business workflows into structured diagnostics, automation suitability maps, review gates, and implementation blueprints.
            </p>

            <div className="mt-7 grid gap-3 sm:max-w-md sm:grid-cols-2">
              <a href="/signup" className="inline-flex min-h-12 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-5 text-center text-[0.68rem] font-black uppercase tracking-[0.17em] text-black transition hover:bg-white">
                Start Audit
              </a>
              <a href="mailto:hello@axiom-architect.co" className="inline-flex min-h-12 items-center justify-center border border-[#9ed39f]/40 bg-black px-5 text-center text-[0.68rem] font-black uppercase tracking-[0.17em] text-white transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black">
                Email Axiom
              </a>
            </div>
          </section>

          <FooterColumn title="Site" links={siteLinks} />
          <FooterColumn title="Account" links={accountLinks} />
          <FooterColumn title="Legal" links={legalLinks} />
        </div>

        <div className="relative mx-auto mt-10 grid max-w-[1440px] grid-cols-1 gap-5 border-t border-[#9ed39f]/18 pt-8 lg:grid-cols-[1fr_2.4fr] lg:items-start">
          <div>
            <h2 className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-[#9ed39f]">
              Core Systems
            </h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-white/58">
              Linked Axiom Studio resources for protocols, workbooks, operating packs, and agent instruction kits.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
            {systemLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="border border-[#9ed39f]/14 bg-black/54 px-4 py-3 text-center text-[0.68rem] font-black uppercase tracking-[0.14em] text-white/78 transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-white/48 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Axiom Architect. All rights reserved.</p>
          <p>Contact: hello@axiom-architect.co</p>
        </div>
      </div>
    </footer>
  );
}
