import Link from "next/link";
import type { ReactNode } from "react";
import { label } from "../../lib/axiom-admin-dashboard";

export const panelClass = "rounded-[1.5rem] border border-[#9ed39f]/30 bg-[#030804] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.24)] sm:p-7";
export const eyebrowClass = "text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]";
export const buttonClass = "inline-flex min-h-10 items-center justify-center border border-[#9ed39f]/35 bg-black px-3 text-center text-[0.62rem] font-black uppercase tracking-[0.14em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black";
export const primaryButtonClass = "inline-flex min-h-10 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-3 text-center text-[0.62rem] font-black uppercase tracking-[0.14em] text-black transition hover:bg-white";

const adminCoreNavItems = [
  ["Overview", "/admin"],
  ["Clients", "/admin/clients"],
  ["Orders", "/admin/orders"],
  ["Workflows", "/admin/workflows"],
  ["Reports", "/admin/reports"],
  ["Analytics", "/admin/analytics"],
] as const;

const proposalNavItems = [
  ["Proposal clients", "/admin/proposals"],
  ["Files received", "/admin/proposals/documents"],
  ["Sent deliverables", "/admin/proposals/deliverables"],
  ["Client updates", "/admin/proposals/updates"],
] as const;

function AdminNavGroup({
  labelText,
  items,
  activePath,
}: {
  labelText: string;
  items: readonly (readonly [string, string])[];
  activePath: string;
}) {
  return (
    <section className="min-w-0 border border-[#9ed39f]/18 bg-[#020704] p-3">
      <p className="mb-3 text-[0.58rem] font-black uppercase tracking-[0.22em] text-[#9ed39f]/72">
        {labelText}
      </p>
      <div className="flex flex-wrap gap-2 text-[0.62rem] font-black uppercase tracking-[0.14em]">
        {items.map(([text, href]) => {
          const isActive = activePath === href || (href !== "/admin" && activePath.startsWith(`${href}/`));

          return (
            <Link
              key={href}
              href={href}
              className={`inline-flex min-h-10 items-center justify-center border px-3 py-2 text-center transition ${
                isActive
                  ? "border-[#9ed39f] bg-[#9ed39f] text-black"
                  : "border-[#9ed39f]/30 text-[#9ed39f] hover:bg-[#9ed39f] hover:text-black"
              }`}
            >
              {text}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function statusPill(status?: string | null) {
  return (
    <span className="inline-flex w-fit border border-[#9ed39f]/35 px-2 py-1 text-[0.62rem] font-black uppercase tracking-[0.14em] text-[#9ed39f]">
      {label(status)}
    </span>
  );
}

export function AdminShell({
  adminEmail,
  eyebrow,
  title,
  intro,
  activePath,
  children,
}: {
  adminEmail: string;
  eyebrow: string;
  title: string;
  intro: string;
  activePath: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <section className="relative overflow-hidden border-b border-[#9ed39f]/20 bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_36%,#000_78%)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto max-w-[1440px]">
          <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
            {eyebrow}
          </p>
          <div className="mt-6 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <h1 className="max-w-5xl text-[clamp(2.65rem,6vw,5.8rem)] font-black uppercase leading-[0.9] tracking-[-0.075em] text-white">
              {title}
            </h1>
            <div className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5 text-base leading-8 text-[#e6f6e7]/78 sm:text-lg">
              <p className="m-0 text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-white">
                Signed in as {adminEmail}
              </p>
              <p className="mb-0 mt-3">{intro}</p>
            </div>
          </div>
        </div>
      </section>

      <nav className="sticky top-0 z-20 border-b border-[#9ed39f]/20 bg-black/94 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-3 xl:grid-cols-[0.95fr_1.05fr]">
          <AdminNavGroup labelText="Admin core" items={adminCoreNavItems} activePath={activePath} />
          <AdminNavGroup labelText="Proposal operations" items={proposalNavItems} activePath={activePath} />
        </div>
      </nav>

      {children}
    </main>
  );
}

export function StatCard({ title, value, helper }: { title: string; value: string; helper: string }) {
  return (
    <article className="rounded-[1.25rem] border border-black bg-[#061009] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.26)]">
      <span className="mb-5 block h-2 w-2 bg-[#9ed39f]" />
      <h2 className="text-lg font-black uppercase tracking-[0.02em] text-[#9ed39f]">{title}</h2>
      <p className="mt-4 text-3xl font-black uppercase tracking-[-0.055em] text-white">{value}</p>
      <p className="mt-3 text-sm leading-6 text-white/68">{helper}</p>
    </article>
  );
}

export function AdminSection({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section className={panelClass}>
      <p className={eyebrowClass}>{eyebrow}</p>
      <h2 className="mt-3 text-[clamp(1.8rem,3vw,3.1rem)] font-black uppercase leading-[0.94] tracking-[-0.06em] text-white">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}
