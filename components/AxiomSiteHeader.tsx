import Image from "next/image";

const serviceLinks = [
  { label: "Audit", href: "/audit" },
  { label: "Method", href: "/#method" },
  { label: "Deliverables", href: "/#deliverables" },
];

const coreSystemLinks = [
  { label: "Protocols", href: "https://axiom-studio.co/collections/protocols" },
  { label: "Agent Kits", href: "https://axiom-studio.co/collections/agent-kits" },
  { label: "Workbooks", href: "https://axiom-studio.co/collections/workbooks" },
  { label: "Operating Packs", href: "https://axiom-studio.co/collections/operating-packs" },
];

function HeaderDropdown({
  label,
  links,
  external = false,
}: {
  label: string;
  links: Array<{ label: string; href: string }>;
  external?: boolean;
}) {
  return (
    <details className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-2 whitespace-nowrap uppercase tracking-[0.18em] text-[#9ed39f] transition hover:text-white [&::-webkit-details-marker]:hidden">
        {label}
        <span className="text-[0.88rem] transition group-open:rotate-180">⌄</span>
      </summary>
      <div className="absolute left-1/2 top-[calc(100%+1rem)] z-50 grid min-w-72 -translate-x-1/2 gap-2 border border-[#9ed39f]/35 bg-black/98 p-3 shadow-[0_26px_80px_rgba(0,0,0,0.58)]">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            className="border border-[#9ed39f]/18 bg-[#061008] px-4 py-3 text-[0.72rem] font-black uppercase tracking-[0.14em] text-white transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black"
          >
            {link.label}
          </a>
        ))}
      </div>
    </details>
  );
}

export function AxiomSiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#9ed39f]/30 bg-black/94 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1920px] items-center justify-between gap-5 px-4 py-4 sm:px-6 lg:px-8">
        <a href="/" aria-label="Axiom Architect home" className="flex min-w-0 items-center gap-4">
          <span className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden border border-[#9ed39f]/40 bg-black shadow-[0_0_22px_rgba(158,211,159,0.15)]">
            <Image src="/brand/axiom-logo.png" alt="" width={64} height={64} priority className="h-full w-full object-contain" />
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="block max-w-[21rem] truncate text-[0.92rem] font-black uppercase tracking-[0.28em] text-white">
              Axiom Architect
            </span>
            <span className="mt-2 block max-w-[24rem] truncate text-[0.72rem] uppercase tracking-[0.28em] text-[#9ed39f]/86">
              The architecture behind intelligent work
            </span>
          </span>
        </a>

        <nav aria-label="Main navigation" className="hidden items-center gap-8 text-[0.74rem] font-black text-[#9ed39f] xl:flex">
          <HeaderDropdown label="Services" links={serviceLinks} />
          <a className="whitespace-nowrap uppercase tracking-[0.18em] transition hover:text-white" href="/pricing">
            Pricing
          </a>
          <a className="whitespace-nowrap uppercase tracking-[0.18em] transition hover:text-white" href="/about">
            About
          </a>
          <a className="whitespace-nowrap uppercase tracking-[0.18em] transition hover:text-white" href="/login">
            Login
          </a>
          <HeaderDropdown label="Core Systems" links={coreSystemLinks} external />
          <a
            className="whitespace-nowrap uppercase tracking-[0.18em] transition hover:text-white"
            href="https://axiom-studio.co/"
            target="_blank"
            rel="noreferrer"
          >
            Axiom Studio
          </a>
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          <a href="/signup" className="inline-flex min-h-14 min-w-[15rem] shrink-0 items-center justify-center whitespace-nowrap border border-[#9ed39f] bg-[#9ed39f] px-7 text-center text-[0.7rem] font-black uppercase tracking-[0.2em] text-black transition hover:bg-white">Start Audit</a>
        </div>

        <details className="group relative xl:hidden">
          <summary className="inline-flex min-h-11 cursor-pointer list-none items-center justify-center border border-[#9ed39f]/45 bg-black px-4 text-[0.66rem] font-black uppercase tracking-[0.16em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black [&::-webkit-details-marker]:hidden">
            Menu
          </summary>
          <div className="absolute right-0 top-[calc(100%+0.75rem)] max-h-[calc(100vh-7rem)] w-[min(90vw,24rem)] overflow-y-auto border border-[#9ed39f]/35 bg-black p-3 shadow-[0_28px_80px_rgba(0,0,0,0.46)]">
            <nav aria-label="Mobile navigation" className="grid gap-2">
              <div className="border border-[#9ed39f]/22 bg-black/60 p-2">
                <p className="px-2 pb-2 text-[0.62rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Services</p>
                <div className="grid gap-2">
                  {serviceLinks.map((link) => (
                    <a key={link.href} href={link.href} className="border border-[#9ed39f]/18 bg-[#061008] px-3 py-3 text-[0.68rem] font-black uppercase tracking-[0.13em] text-white transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black">
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              <a href="/pricing" className="border border-[#9ed39f]/20 bg-[#061008] px-4 py-4 text-[0.72rem] font-black uppercase tracking-[0.16em] text-white transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black">Pricing</a>
              <a href="/about" className="border border-[#9ed39f]/20 bg-[#061008] px-4 py-4 text-[0.72rem] font-black uppercase tracking-[0.16em] text-white transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black">About</a>
              <a href="/login" className="border border-[#9ed39f]/20 bg-[#061008] px-4 py-4 text-[0.72rem] font-black uppercase tracking-[0.16em] text-white transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black">Login</a>

              <div className="border border-[#9ed39f]/22 bg-black/60 p-2">
                <p className="px-2 pb-2 text-[0.62rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Core Systems</p>
                <div className="grid gap-2">
                  {coreSystemLinks.map((link) => (
                    <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="border border-[#9ed39f]/18 bg-[#061008] px-3 py-3 text-[0.68rem] font-black uppercase tracking-[0.13em] text-white transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black">
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              <a href="https://axiom-studio.co/" target="_blank" rel="noreferrer" className="border border-[#9ed39f]/20 bg-[#061008] px-4 py-4 text-[0.72rem] font-black uppercase tracking-[0.16em] text-white transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black">Axiom Studio</a>
              <a href="/signup" className="inline-flex min-h-12 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-4 text-center text-[0.66rem] font-black uppercase tracking-[0.16em] text-black transition hover:bg-white">Start Audit</a>
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}
