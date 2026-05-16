import Image from "next/image";

type MenuLink = {
  label: string;
  href: string;
  external?: boolean;
  description?: string;
};

const productLinks: MenuLink[] = [
  { label: "Workflow Audit", href: "/pricing#workflow-audit", description: "Entry diagnostic" },
  { label: "Workflow Blueprint", href: "/pricing#workflow-blueprint", description: "Implementation plan" },
  { label: "Custom Operating Pack", href: "/pricing#custom-operating-pack", description: "Complete workflow asset" },
  { label: "Workflow Stewardship", href: "/pricing#workflow-stewardship", description: "Ongoing optimisation" },
  { label: "Departmental Ecosystem", href: "/pricing#departmental-ecosystem", description: "Multi-workflow system" },
  { label: "Architect Residency", href: "/pricing#architect-residency", description: "High-touch deployment" },
];

const studioLinks: MenuLink[] = [
  { label: "Visit Axiom Studio", href: "https://axiom-studio.co/", external: true, description: "Digital systems store" },
  { label: "Protocols", href: "https://axiom-studio.co/collections/protocols", external: true, description: "Core systems" },
  { label: "Agent Kits", href: "https://axiom-studio.co/collections/agent-kits", external: true, description: "Assistant systems" },
  { label: "Workbooks", href: "https://axiom-studio.co/collections/workbooks", external: true, description: "Implementation assets" },
  { label: "Operating Packs", href: "https://axiom-studio.co/collections/operating-packs", external: true, description: "Reusable workflow systems" },
];

function MenuDropdown({ label, links }: { label: string; links: MenuLink[] }) {
  return (
    <details className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-2 whitespace-nowrap uppercase tracking-[0.16em] text-[#9ed39f] transition hover:text-white [&::-webkit-details-marker]:hidden">
        {label}
        <span className="text-[0.9rem] leading-none transition group-open:rotate-180">⌄</span>
      </summary>
      <div className="absolute left-1/2 top-[calc(100%+1rem)] z-50 grid min-w-[22rem] -translate-x-1/2 gap-2 border border-[#9ed39f]/35 bg-black/98 p-3 shadow-[0_26px_80px_rgba(0,0,0,0.58)]">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noreferrer" : undefined}
            className="group/link border border-[#9ed39f]/18 bg-[#061008] px-4 py-3 text-white transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black"
          >
            <span className="block text-[0.72rem] font-black uppercase tracking-[0.14em]">
              {link.label}
            </span>
            {link.description ? (
              <span className="mt-1 block text-[0.66rem] uppercase tracking-[0.08em] text-[#9ed39f]/72 transition group-hover/link:text-black/62">
                {link.description}
              </span>
            ) : null}
          </a>
        ))}
      </div>
    </details>
  );
}

export function AxiomSiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#9ed39f]/30 bg-black/94 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1920px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <a href="/" aria-label="Axiom Architect home" className="flex min-w-0 items-center gap-3 sm:gap-4">
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden border border-[#9ed39f]/40 bg-black shadow-[0_0_22px_rgba(158,211,159,0.15)] sm:h-12 sm:w-12">
            <Image src="/brand/axiom-logo.png" alt="" width={48} height={48} priority className="h-full w-full object-contain" />
          </span>
          <span className="min-w-0">
            <span className="block max-w-[12rem] truncate text-[0.78rem] font-black uppercase tracking-[0.2em] text-white min-[430px]:max-w-none sm:text-[0.94rem] sm:tracking-[0.24em]">
              Axiom Architect
            </span>
            <span className="mt-1 hidden max-w-[24rem] truncate text-[0.66rem] uppercase tracking-[0.2em] text-[#9ed39f]/86 sm:block">
              The architecture behind intelligent work
            </span>
          </span>
        </a>

        <nav aria-label="Main navigation" className="hidden items-center gap-6 text-[0.72rem] font-semibold text-[#9ed39f] xl:flex">
          <a className="whitespace-nowrap uppercase tracking-[0.16em] transition hover:text-white" href="/audit">
            Workflow Audit
          </a>
          <a className="whitespace-nowrap uppercase tracking-[0.16em] transition hover:text-white" href="/pricing">
            Pricing
          </a>
          <MenuDropdown label="Products" links={productLinks} />
          <MenuDropdown label="Axiom Studio" links={studioLinks} />
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          <a href="/login" className="inline-flex min-h-10 min-w-[7rem] items-center justify-center whitespace-nowrap border border-[#9ed39f]/35 bg-black px-4 text-center text-[0.66rem] font-black uppercase tracking-[0.14em] text-white transition hover:border-[#9ed39f] hover:text-[#9ed39f]">Sign In</a>
          <a href="/signup" className="inline-flex min-h-10 min-w-[9rem] shrink-0 items-center justify-center whitespace-nowrap border border-[#9ed39f] bg-[#9ed39f] px-5 text-center text-[0.66rem] font-black uppercase tracking-[0.14em] text-black transition hover:bg-white">Start Audit</a>
        </div>

        <details className="group relative xl:hidden">
          <summary className="inline-flex min-h-10 cursor-pointer list-none items-center justify-center border border-[#9ed39f]/45 bg-black px-4 text-[0.66rem] font-black uppercase tracking-[0.16em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black [&::-webkit-details-marker]:hidden">
            Menu
          </summary>
          <div className="absolute right-0 top-[calc(100%+0.75rem)] max-h-[calc(100vh-7rem)] w-[min(90vw,25rem)] overflow-y-auto border border-[#9ed39f]/35 bg-black p-3 shadow-[0_28px_80px_rgba(0,0,0,0.46)]">
            <nav aria-label="Mobile navigation" className="grid gap-2">
              <a href="/audit" className="border border-[#9ed39f]/20 bg-[#061008] px-4 py-4 text-[0.72rem] font-black uppercase tracking-[0.16em] text-white transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black">Workflow Audit</a>
              <a href="/pricing" className="border border-[#9ed39f]/20 bg-[#061008] px-4 py-4 text-[0.72rem] font-black uppercase tracking-[0.16em] text-white transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black">Pricing</a>

              <div className="border border-[#9ed39f]/22 bg-black/60 p-2">
                <p className="px-2 pb-2 text-[0.62rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Products</p>
                <div className="grid gap-2">
                  {productLinks.map((link) => (
                    <a key={link.href} href={link.href} className="border border-[#9ed39f]/18 bg-[#061008] px-3 py-3 transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black">
                      <span className="block text-[0.68rem] font-black uppercase tracking-[0.13em] text-white group-hover:text-black">{link.label}</span>
                      {link.description ? <span className="mt-1 block text-[0.62rem] uppercase tracking-[0.08em] text-[#9ed39f]/72">{link.description}</span> : null}
                    </a>
                  ))}
                </div>
              </div>

              <div className="border border-[#9ed39f]/22 bg-black/60 p-2">
                <p className="px-2 pb-2 text-[0.62rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Axiom Studio</p>
                <div className="grid gap-2">
                  {studioLinks.map((link) => (
                    <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="border border-[#9ed39f]/18 bg-[#061008] px-3 py-3 transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black">
                      <span className="block text-[0.68rem] font-black uppercase tracking-[0.13em] text-white">{link.label}</span>
                      {link.description ? <span className="mt-1 block text-[0.62rem] uppercase tracking-[0.08em] text-[#9ed39f]/72">{link.description}</span> : null}
                    </a>
                  ))}
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
