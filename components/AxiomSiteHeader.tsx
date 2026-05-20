"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const mainLinks = [
  { label: "Home", href: "/" },
  { label: "Workflow Audit", href: "/audit" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
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
  { label: "Enterprise AI Control Stack", href: "https://axiom-studio.co/collections/enterprise-ai-control-stack" },
];

const legalLinks = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Cookies", href: "/cookies" },
  { label: "Refund Policy", href: "/refund-policy" },
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
  onNavigate?: () => void;
}) {
  return (
    <section className="border border-[#9ed39f]/20 bg-[#061008]/58 p-3">
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
            className="border border-[#9ed39f]/16 bg-black px-4 py-4 text-[0.72rem] font-black uppercase tracking-[0.14em] text-white transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black"
          >
            {link.label}
          </a>
        ))}
      </div>
    </section>
  );
}

function BrandLockup({ compact = false, onNavigate }: { compact?: boolean; onNavigate?: () => void }) {
  return (
    <a href="/" onClick={onNavigate} aria-label="Axiom Architect home" className="flex min-w-0 items-center gap-3">
      <span className={compact ? "relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden border border-[#9ed39f]/40 bg-black" : "relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden border border-[#9ed39f]/40 bg-black shadow-[0_0_22px_rgba(158,211,159,0.15)]"}>
        <Image src="/brand/axiom-logo.png" alt="" width={compact ? 48 : 64} height={compact ? 48 : 64} priority={!compact} className="h-full w-full object-contain" />
      </span>
      <span className="min-w-0">
        <span className={compact ? "block text-[0.78rem] font-black uppercase tracking-[0.2em] text-white" : "block text-[0.92rem] font-black uppercase tracking-[0.22em] text-white"}>
          Axiom Architect
        </span>
        <span className={compact ? "mt-1 block text-[0.58rem] uppercase tracking-[0.16em] text-[#9ed39f]/78" : "mt-2 block text-[0.62rem] uppercase tracking-[0.17em] text-[#9ed39f]/82"}>
          {compact ? "Intelligent work systems" : "The architecture behind intelligent work"}
        </span>
      </span>
    </a>
  );
}

export function AxiomSiteHeader() {
  const pathname = usePathname();
  const [signedIn, setSignedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(false);

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
    setMenuOpen(false);
    setDesktopSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const closeDesktopSidebar = () => setDesktopSidebarOpen(false);
  const openDesktopSidebar = () => setDesktopSidebarOpen(true);
  const authHref = signedIn ? "/logout" : "/login";
  const authLabel = signedIn ? "Log Out" : "Login";
  const primaryHref = signedIn ? "/dashboard" : "/signup";
  const primaryLabel = signedIn ? "Dashboard" : "Start Audit";

  const accountActions = (
    <section className="border border-[#9ed39f]/20 bg-[#061008]/58 p-3">
      <p className="px-1 pb-3 text-[0.62rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">
        Account
      </p>
      <div className="grid gap-2">
        <a
          href={primaryHref}
          onClick={closeMenu}
          className="inline-flex min-h-12 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-4 text-center text-[0.66rem] font-black uppercase tracking-[0.16em] text-black transition hover:bg-white"
        >
          {primaryLabel}
        </a>
        <a
          href={authHref}
          onClick={closeMenu}
          className="inline-flex min-h-12 items-center justify-center border border-[#9ed39f]/45 bg-black px-4 text-center text-[0.66rem] font-black uppercase tracking-[0.16em] text-white transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black"
        >
          {authLabel}
        </a>
      </div>
    </section>
  );

  return (
    <>
      <style>{`
        @media (min-width: 1024px) {
          body {
            padding-left: ${desktopSidebarOpen ? "23rem" : "0"};
            transition: padding-left 300ms ease;
          }
        }
      `}</style>

      <header className="sticky top-0 z-50 border-b border-[#9ed39f]/30 bg-black/94 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex w-full items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <BrandLockup />
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

      <button
        type="button"
        onClick={openDesktopSidebar}
        className={`fixed left-5 top-5 z-[55] hidden min-h-12 border border-[#9ed39f]/45 bg-black/92 px-5 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] shadow-[0_18px_50px_rgba(0,0,0,0.36)] transition hover:bg-[#9ed39f] hover:text-black lg:inline-flex lg:items-center lg:justify-center ${desktopSidebarOpen ? "pointer-events-none -translate-x-8 opacity-0" : "translate-x-0 opacity-100"}`}
        aria-label="Open sidebar navigation"
        aria-expanded={desktopSidebarOpen}
      >
        Menu
      </button>

      <aside className={`fixed left-0 top-0 z-50 hidden h-dvh w-[23rem] transform flex-col border-r border-[#9ed39f]/30 bg-black/96 shadow-[0_0_80px_rgba(0,0,0,0.5)] transition-transform duration-300 lg:flex ${desktopSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-start justify-between gap-4 border-b border-[#9ed39f]/24 p-5">
          <BrandLockup />
          <button
            type="button"
            onClick={closeDesktopSidebar}
            aria-label="Close sidebar navigation"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-[#9ed39f]/35 text-xl leading-none text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black"
          >
            ×
          </button>
        </div>

        <nav className="grid flex-1 gap-4 overflow-y-auto p-4" aria-label="Desktop sidebar navigation">
          <MenuSection title="Main" links={mainLinks} />
          <MenuSection title="Services" links={serviceLinks} />
          {accountActions}
          <MenuSection title="Core Systems" links={coreSystemLinks} external />
          <MenuSection title="Legal" links={legalLinks} />
          <section className="border border-[#9ed39f]/20 bg-[#061008]/58 p-3">
            <p className="px-1 pb-3 text-[0.62rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">
              Axiom Studio
            </p>
            <a
              href="https://axiom-studio.co/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 w-full items-center justify-center border border-[#9ed39f]/45 bg-black px-4 text-center text-[0.68rem] font-black uppercase tracking-[0.16em] text-white transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black"
            >
              Visit Axiom Studio
            </a>
          </section>
        </nav>
      </aside>

      <div
        className={`fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm transition-opacity duration-200 lg:hidden ${menuOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <aside
        className={`fixed right-0 top-0 z-[90] flex h-dvh w-[min(92vw,28rem)] transform flex-col border-l border-[#9ed39f]/35 bg-black shadow-[0_0_90px_rgba(0,0,0,0.62)] transition-transform duration-300 lg:hidden ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
        aria-label="Mobile site navigation"
      >
        <div className="flex items-center justify-between gap-4 border-b border-[#9ed39f]/24 p-5">
          <BrandLockup compact onNavigate={closeMenu} />
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
          {accountActions}
          <MenuSection title="Core Systems" links={coreSystemLinks} external onNavigate={closeMenu} />
          <MenuSection title="Legal" links={legalLinks} onNavigate={closeMenu} />

          <section className="border border-[#9ed39f]/20 bg-[#061008]/58 p-3">
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
