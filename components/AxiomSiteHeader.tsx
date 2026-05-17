"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const mainLinks = [
  { label: "Home", href: "/" },
  { label: "Workflow Audit", href: "/audit" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

const serviceLinks = [
  { label: "Audit", href: "/audit" },
  { label: "Method", href: "/#method" },
  { label: "Deliverables", href: "/#deliverables" },
  { label: "Services", href: "/#services" },
];

const coreSystemLinks = [
  { label: "Protocols", href: "https://axiom-studio.co/collections/protocols" },
  { label: "Agent Kits", href: "https://axiom-studio.co/collections/agent-kits" },
  { label: "Workbooks", href: "https://axiom-studio.co/collections/workbooks" },
  { label: "Operating Packs", href: "https://axiom-studio.co/collections/operating-packs" },
];

function MenuSection({
  title,
  links,
  external = false,
  onNavigate,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
  external?: boolean;
  onNavigate: () => void;
}) {
  return (
    <section className="border border-[#9ed39f]/22 bg-[#061008]/60 p-3">
      <p className="px-1 pb-3 text-[0.62rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">
        {title}
      </p>
      <div className="grid gap-2">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            onClick={onNavigate}
            className="border border-[#9ed39f]/18 bg-black px-4 py-4 text-[0.72rem] font-black uppercase tracking-[0.15em] text-white transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black"
          >
            {link.label}
          </a>
        ))}
      </div>
    </section>
  );
}

export function AxiomSiteHeader() {
  const [signedIn, setSignedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const authHref = signedIn ? "/logout" : "/login";
  const authLabel = signedIn ? "Log Out" : "Login";
  const primaryHref = signedIn ? "/dashboard" : "/signup";
  const primaryLabel = signedIn ? "Dashboard" : "Start Audit";

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#9ed39f]/30 bg-black/94 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1920px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <a href="/" aria-label="Axiom Architect home" className="flex min-w-0 items-center gap-4">
            <span className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden border border-[#9ed39f]/40 bg-black shadow-[0_0_22px_rgba(158,211,159,0.15)]">
              <Image src="/brand/axiom-logo.png" alt="" width={64} height={64} priority className="h-full w-full object-contain" />
            </span>
            <span className="min-w-0">
              <span className="block max-w-[calc(100vw-11rem)] text-[0.88rem] font-black uppercase tracking-[0.22em] text-white sm:max-w-none sm:text-[0.98rem] sm:tracking-[0.28em]">
                Axiom Architect
              </span>
              <span className="mt-2 hidden text-[0.7rem] uppercase tracking-[0.24em] text-[#9ed39f]/86 sm:block">
                The architecture behind intelligent work
              </span>
            </span>
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open site menu"
            aria-expanded={menuOpen}
            className="inline-flex min-h-12 items-center justify-center border border-[#9ed39f]/45 bg-black px-5 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black"
          >
            Menu
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm transition-opacity duration-200 ${menuOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <aside
        className={`fixed right-0 top-0 z-[90] flex h-dvh w-[min(92vw,28rem)] transform flex-col border-l border-[#9ed39f]/35 bg-black shadow-[0_0_90px_rgba(0,0,0,0.62)] transition-transform duration-300 ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
        aria-label="Site navigation"
      >
        <div className="flex items-center justify-between gap-4 border-b border-[#9ed39f]/24 p-5">
          <a href="/" onClick={closeMenu} className="flex min-w-0 items-center gap-3">
            <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden border border-[#9ed39f]/40 bg-black">
              <Image src="/brand/axiom-logo.png" alt="" width={48} height={48} className="h-full w-full object-contain" />
            </span>
            <span className="min-w-0">
              <span className="block text-[0.78rem] font-black uppercase tracking-[0.2em] text-white">
                Axiom Architect
              </span>
              <span className="mt-1 block text-[0.58rem] uppercase tracking-[0.16em] text-[#9ed39f]/78">
                Intelligent work systems
              </span>
            </span>
          </a>
          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close site menu"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-[#9ed39f]/35 text-xl leading-none text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black"
          >
            ×
          </button>
        </div>

        <nav className="grid flex-1 gap-4 overflow-y-auto p-4" aria-label="Sidebar navigation">
          <MenuSection title="Main" links={mainLinks} onNavigate={closeMenu} />
          <MenuSection title="Services" links={serviceLinks} onNavigate={closeMenu} />

          <section className="border border-[#9ed39f]/22 bg-[#061008]/60 p-3">
            <p className="px-1 pb-3 text-[0.62rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">
              Account
            </p>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={authHref}
                onClick={closeMenu}
                className="inline-flex min-h-12 items-center justify-center border border-[#9ed39f]/45 bg-black px-4 text-center text-[0.66rem] font-black uppercase tracking-[0.16em] text-white transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black"
              >
                {authLabel}
              </a>
              <a
                href={primaryHref}
                onClick={closeMenu}
                className="inline-flex min-h-12 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-4 text-center text-[0.66rem] font-black uppercase tracking-[0.16em] text-black transition hover:bg-white"
              >
                {primaryLabel}
              </a>
            </div>
          </section>

          <MenuSection title="Core Systems" links={coreSystemLinks} external onNavigate={closeMenu} />

          <section className="border border-[#9ed39f]/22 bg-[#061008]/60 p-3">
            <p className="px-1 pb-3 text-[0.62rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">
              Axiom Studio
            </p>
            <a
              href="https://axiom-studio.co/"
              target="_blank"
              rel="noreferrer"
              onClick={closeMenu}
              className="inline-flex min-h-12 w-full items-center justify-center border border-[#9ed39f]/45 bg-black px-4 text-center text-[0.68rem] font-black uppercase tracking-[0.16em] text-white transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black"
            >
              Visit Axiom Studio
            </a>
          </section>
        </nav>
      </aside>
    </>
  );
}
