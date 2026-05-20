import type { ReactNode } from "react";
import { clientPortalNav } from "../../lib/axiom-client-portal";

export default function ClientPortalLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <section className="border-b border-[#9ed39f]/20 bg-[#030804] px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <a
            href="/dashboard"
            className="inline-flex w-fit border border-[#9ed39f]/45 bg-black px-4 py-3 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black"
          >
            Axiom Architect
          </a>
          <nav aria-label="Client portal navigation" className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
            {clientPortalNav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="shrink-0 border border-[#9ed39f]/24 bg-black/35 px-4 py-3 text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#e6f6e7]/78 transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </section>
      {children}
    </main>
  );
}
