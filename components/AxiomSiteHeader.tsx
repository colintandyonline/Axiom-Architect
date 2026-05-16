import Image from "next/image";

const navLinks = [
  { label: "Workflow Audit", href: "/audit" },
  { label: "Pricing", href: "/pricing" },
  { label: "How It Works", href: "/#method" },
  { label: "Deliverables", href: "/#deliverables" },
  { label: "Axiom Studio", href: "https://axiom-studio.co/", external: true },
];

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
          {navLinks.map((link) => (
            <a
              key={link.href}
              className="uppercase tracking-[0.18em] transition hover:text-white"
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a href="/login" className="inline-flex min-h-10 items-center justify-center border border-[#9ed39f]/35 bg-black px-4 text-center text-[0.66rem] font-black uppercase tracking-[0.16em] text-white transition hover:border-[#9ed39f] hover:text-[#9ed39f]">Sign In</a>
          <a href="/signup" className="inline-flex min-h-10 shrink-0 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-5 text-center text-[0.66rem] font-black uppercase tracking-[0.16em] text-black transition hover:bg-white">Start Audit</a>
        </div>

        <details className="group relative lg:hidden">
          <summary className="inline-flex min-h-10 cursor-pointer list-none items-center justify-center border border-[#9ed39f]/45 bg-black px-4 text-[0.66rem] font-black uppercase tracking-[0.16em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black [&::-webkit-details-marker]:hidden">
            Menu
          </summary>
          <div className="absolute right-0 top-[calc(100%+0.75rem)] w-[min(86vw,22rem)] border border-[#9ed39f]/35 bg-black p-3 shadow-[0_28px_80px_rgba(0,0,0,0.46)]">
            <nav aria-label="Mobile navigation" className="grid gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  className="border border-[#9ed39f]/20 bg-[#061008] px-4 py-4 text-[0.72rem] font-black uppercase tracking-[0.16em] text-white transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black"
                >
                  {link.label}
                </a>
              ))}
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
