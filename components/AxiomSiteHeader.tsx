import Image from "next/image";

export function AxiomSiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#9ed39f]/30 bg-black/92 backdrop-blur-xl">
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
          <a className="uppercase tracking-[0.18em] transition hover:text-white" href="/audit">Workflow Audit</a>
          <a className="uppercase tracking-[0.18em] transition hover:text-white" href="/pricing">Pricing</a>
          <a className="uppercase tracking-[0.18em] transition hover:text-white" href="/login">Login</a>
          <a className="uppercase tracking-[0.18em] transition hover:text-white" href="https://axiom-studio.co/" target="_blank" rel="noreferrer">Axiom Studio</a>
        </nav>
        <div className="flex items-center gap-2">
          <a href="/login" className="hidden min-h-10 items-center justify-center border border-[#9ed39f]/35 bg-black px-4 text-center text-[0.66rem] font-black uppercase tracking-[0.16em] text-white transition hover:border-[#9ed39f] hover:text-[#9ed39f] sm:inline-flex">Login</a>
          <a href="/signup" className="inline-flex min-h-10 shrink-0 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-4 text-center text-[0.66rem] font-black uppercase tracking-[0.16em] text-black transition hover:bg-white sm:px-5">Start Audit</a>
        </div>
      </div>
    </header>
  );
}
