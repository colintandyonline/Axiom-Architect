import Image from "next/image";
import type { ReactNode } from "react";
import { clientPortalNav } from "../../lib/axiom-client-portal";

export default function ClientPortalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="client-portal-shell min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <style>{`
        .client-portal-shell {
          background:
            linear-gradient(rgba(0, 0, 0, 0.72), rgba(0, 0, 0, 0.82)),
            url("/brand/axiom-background-desktop.png") center top / cover fixed,
            #000;
        }

        .client-portal-shell::before {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          content: "";
          opacity: 0.18;
          background-image:
            linear-gradient(rgba(158, 211, 159, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(158, 211, 159, 0.1) 1px, transparent 1px);
          background-size: 44px 44px;
        }

        .client-portal-frame,
        .client-portal-content {
          position: relative;
          z-index: 1;
        }

        .client-portal-header {
          background: rgba(0, 0, 0, 0.78);
          border-bottom: 1px solid rgba(158, 211, 159, 0.34);
          backdrop-filter: blur(18px);
        }

        .client-portal-nav-link,
        .client-portal-brand {
          border-radius: 8px !important;
        }

        .client-portal-content main {
          background: transparent !important;
        }

        .client-portal-content article,
        .client-portal-content aside,
        .client-portal-content [class*="border-\\[\\#9ed39f\\]"],
        .client-portal-content [class*="border-\\[rgba"] {
          border-radius: 8px !important;
        }

        .client-portal-content article {
          border-color: rgba(158, 211, 159, 0.34) !important;
          background: rgba(6, 16, 10, 0.82) !important;
          box-shadow: 0 26px 70px rgba(0, 0, 0, 0.34) !important;
        }

        .client-portal-content aside {
          border-color: rgba(158, 211, 159, 0.42) !important;
          background: rgba(6, 16, 10, 0.86) !important;
          box-shadow: 0 26px 70px rgba(0, 0, 0, 0.34) !important;
        }

        .client-portal-content a:hover {
          color: #041006 !important;
        }

        .client-portal-content h1,
        .client-portal-content h2,
        .client-portal-content h3 {
          text-wrap: balance;
        }

        .client-portal-content span[aria-hidden="true"] {
          color: inherit;
        }

        .client-portal-content article > span:first-child {
          color: #9ed39f !important;
        }

        @media (max-width: 760px) {
          .client-portal-shell {
            background:
              linear-gradient(rgba(0, 0, 0, 0.72), rgba(0, 0, 0, 0.88)),
              url("/brand/axiom-background-mobile.png") center top / cover,
              #000;
          }

          .client-portal-content h1 {
            font-size: clamp(2.45rem, 14vw, 3.4rem) !important;
          }

          .client-portal-content h2 {
            font-size: clamp(2rem, 11vw, 3rem) !important;
          }
        }
      `}</style>

      <header className="client-portal-frame client-portal-header px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <a
            href="/client"
            className="client-portal-brand inline-flex w-fit items-center gap-3 border border-[#9ed39f]/35 bg-[#050705] px-4 py-3 transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black"
          >
            <Image
              src="/brand/axiom-logo.png"
              alt="Axiom Architect"
              width={42}
              height={42}
              priority
              className="border border-[#9ed39f]/35 bg-black"
            />
            <span className="grid gap-1 leading-none">
              <strong className="text-[0.86rem] font-black uppercase tracking-[0.16em]">Axiom Architect</strong>
              <small className="text-[0.68rem] font-semibold text-white/58">Client workspace</small>
            </span>
          </a>

          <nav aria-label="Client portal navigation" className="flex flex-wrap gap-2">
            {clientPortalNav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="client-portal-nav-link border border-[#9ed39f]/24 bg-black/45 px-4 py-3 text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#e6f6e7]/82 transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <div className="client-portal-content">{children}</div>
    </div>
  );
}
