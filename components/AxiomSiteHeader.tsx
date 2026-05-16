import Image from "next/image";

const productLinks = [
  { label: "Workflow Audit", href: "/signup?tier=workflow-audit" },
  { label: "Workflow Blueprint", href: "/signup?tier=workflow-blueprint" },
  { label: "Custom Operating Pack", href: "/signup?tier=custom-operating-pack" },
  { label: "Workflow Stewardship", href: "/signup?tier=workflow-stewardship" },
  { label: "Departmental Ecosystem", href: "/signup?tier=departmental-ecosystem" },
  { label: "Architect Residency", href: "/signup?tier=architect-residency" },
];

const pageLinks = [
  { label: "How It Works", href: "/#method" },
  { label: "Deliverables", href: "/#deliverables" },
  { label: "About", href: "/about" },
];

function DesktopDropdown({
  label,
  links,
}: {
  label: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <details className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-2 uppercase tracking-[0.18em] text-[#9ed39f] transition hover:text-white [&::-webkit-details-marker]:hidden">
        {label}
        <span className="text-[0.9rem] leading-none transition group-open:rotate-180">⌄</span>
      </summary>
      <div className="absolute left-1/2 top-[calc(100%+1rem)] z-50 grid min-w-80 -translate-x-1/2 gap-2 border border-[#9ed39f]/35 bg-black/98 p-3 shadow-[0_26px_80px_rgba(0,0,0,0.58)]">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
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
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <a href="/" aria-label="Axiom Architect home" className="flex min-w-0 items-center gap-3 sm:gap-4">
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden border border-[#9ed39f]/40 bg-black shadow-[0_0_22px_rgba(158,211,159,0.15)] sm:h-12 sm:w-12">
            <Image src="/brand/axiom-logo.png" alt="" width={48} height={48} priority className="h-full w-full object-contain" />
          </span>
          <span className="min-w-0">
            <span className="block max-w-[11rem] truncate text-[0.78rem] font-black uppercase tracking-[0.22em] text-white min-[430px]:max-w-none sm:text-[0.94rem] sm:tracking-[0.26em]">
              Axiom Architect
            </span>
            <span className="mt-1 hidden text-[0.68rem] uppercase tracking-[0.22em] text-[#9ed39f]/86 sm:block">
              The architecture behind intelligent work
            </span>
          </span>
        </a>

        <nav aria-label="Main navigation" className="hidden items-center gap-7 text-[0.74rem] font-semibold text-[#9ed39f] lg:flex">
          <a className="uppercase tracking-[0.18em] transition hover:text-white" href="/audit">
            Workflow Audit
          </a>
          <a className="uppercase tracking-[0.18em] transition hover:text-white" href="/pricing">
            Pricing
          </a>
          <DesktopDropdown label="Products" links={productLinks} />
          <DesktopDropdown label="Pages" links={pageLinks} />
          <a
            className="uppercase tracking-[0.18em] transition hover:text-white"
            href="https://axiom-studio.co/"
            target="_blank"
            rel="noreferrer"
          >
            Axiom Studio
          </a>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a href="/login" className="inline-flex min-h-10 items-center justify-center border border-[#9ed39f]/35 bg-black px-4 text-center text-[0.66rem] font-black uppercase tracking-[0.16em] text-white transition hover:border-[#9ed39f] hover:text-[#9ed39f]">Sign In</a>
          <a href="/signup" className="inline-flex min-h-10 shrink-0 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-5 text-center text-[0.66rem] font-black uppercase tracking-[0.16em] text-black transition hover:bg-white">Start Audit</a>
        </div>

        <details className="group relative lg:hidden">
          <summary className="inline-flex min-h-10 cursor-pointer list-none items-center justify-center border border-[#9ed39f]/45 bg-black px-4 text-[0.66rem] font-black uppercase tracking-[0.16em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black [&::-webkit-details-marker]:hidden">
            Menu
          </summary>
          <div className="absolute right-0 top-[calc(100%+0.75rem)] max-h-[calc(100vh-7rem)] w-[min(88vw,24rem)] overflow-y-auto border border-[#9ed39f]/35 bg-black p-3 shadow-[0_28px_80px_rgba(0,0,0,0.46)]">
            <nav aria-label="Mobile navigation" className="grid gap-2">
              <a href="/audit" className="border border-[#9ed39f]/20 bg-[#061008] px-4 py-4 text-[0.72rem] font-black uppercase tracking-[0.16em] text-white transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black">Workflow Audit</a>
              <a href="/pricing" className="border border-[#9ed39f]/20 bg-[#061008] px-4 py-4 text-[0.72rem] font-black uppercase tracking-[0.16em] text-white transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black">Pricing</a>

              <div className="border border-[#9ed39f]/22 bg-black/60 p-2">
                <p className="px-2 pb-2 text-[0.62rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Products</p>
                <div className="grid gap-2">
                  {productLinks.map((link) => (
                    <a key={link.href} href={link.href} className="border border-[#9ed39f]/18 bg-[#061008] px-3 py-3 text-[0.68rem] font-black uppercase tracking-[0.13em] text-white transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black">
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="border border-[#9ed39f]/22 bg-black/60 p-2">
                <p className="px-2 pb-2 text-[0.62rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Pages</p>
                <div className="grid gap-2">
                  {pageLinks.map((link) => (
                    <a key={link.href} href={link.href} className="border border-[#9ed39f]/18 bg-[#061008] px-3 py-3 text-[0.68rem] font-black uppercase tracking-[0.13em] text-white transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black">
                      {link.label}
                    </a>
                  ))}
                  <a href="https://axiom-studio.co/" target="_blank" rel="noreferrer" className="border border-[#9ed39f]/18 bg-[#061008] px-3 py-3 text-[0.68rem] font-black uppercase tracking-[0.13em] text-white transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black">
                    Axiom Studio
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <a href="/login" className="inline-flex min-h-12 items-center justify-center border border-[#9ed39f]/35 bg-black px-4 text-center text-[0.66rem] font-black uppercase tracking-[0.16em] text-white transition hover:border-[#9ed39f] hover:text-[#9ed39f]">Sign In</a>
                <a href="/signup" className="inline-flex min-h-12 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-4 text-center text-[0.66rem] font-black uppercase tracking-[0.16em] text-black transition hover:bg-white">Start Audit</a>
              </div>
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}
