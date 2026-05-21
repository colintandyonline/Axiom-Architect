import Image from "next/image";
import type { ReactNode } from "react";
import { clientPortalNav } from "../../lib/axiom-client-portal";

export default function ClientPortalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="client-portal-shell min-h-screen overflow-x-hidden bg-[#06150a] text-white selection:bg-[#9ed39f] selection:text-black">
      <style>{`
        .client-portal-shell {
          background:
            radial-gradient(circle at 82% 4%, rgba(158, 211, 159, 0.28), transparent 26%),
            linear-gradient(135deg, #0d2413 0%, #06150a 42%, #020603 100%) !important;
        }

        .client-portal-shell::before {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          content: "";
          opacity: 0.18;
          background-image:
            linear-gradient(rgba(158, 211, 159, 0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(158, 211, 159, 0.12) 1px, transparent 1px);
          background-size: 42px 42px;
        }

        .client-portal-frame,
        .client-portal-content {
          position: relative;
          z-index: 1;
        }

        .client-portal-content > main {
          background: transparent !important;
        }

        .client-portal-content section {
          background: transparent !important;
        }

        .client-portal-content section:first-child {
          border-bottom: 1px solid rgba(158, 211, 159, 0.24) !important;
          background:
            linear-gradient(135deg, rgba(158, 211, 159, 0.15), rgba(0, 0, 0, 0.1)),
            rgba(3, 12, 6, 0.56) !important;
        }

        .client-portal-content article {
          border-color: rgba(158, 211, 159, 0.42) !important;
          border-radius: 22px !important;
          background:
            linear-gradient(135deg, rgba(158, 211, 159, 0.18), rgba(255, 255, 255, 0.045)),
            rgba(6, 20, 11, 0.88) !important;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
        }

        .client-portal-content article:nth-child(4n + 1) {
          background:
            linear-gradient(135deg, rgba(158, 211, 159, 0.34), rgba(158, 211, 159, 0.08)),
            rgba(8, 34, 15, 0.92) !important;
        }

        .client-portal-content article:nth-child(4n + 2) {
          background:
            linear-gradient(135deg, rgba(255, 255, 255, 0.11), rgba(158, 211, 159, 0.12)),
            rgba(8, 24, 14, 0.9) !important;
        }

        .client-portal-content aside {
          border-radius: 22px !important;
          background:
            linear-gradient(135deg, rgba(158, 211, 159, 0.28), rgba(255, 255, 255, 0.05)),
            rgba(4, 20, 9, 0.9) !important;
          box-shadow: 0 26px 90px rgba(0, 0, 0, 0.34) !important;
        }

        .client-portal-content a {
          border-radius: 999px !important;
        }

        .client-portal-content article > span:first-child,
        .client-portal-content aside > div:first-child {
          border-radius: 16px !important;
          background: rgba(158, 211, 159, 0.14) !important;
          color: transparent !important;
          position: relative;
          overflow: hidden;
        }

        .client-portal-content article > span:first-child::before,
        .client-portal-content aside > div:first-child::before {
          position: absolute;
          inset: 50%;
          width: 17px;
          height: 17px;
          border: 2px solid #9ed39f;
          border-radius: 999px;
          content: "";
          transform: translate(-50%, -50%);
        }

        .client-portal-content article > span:first-child::after,
        .client-portal-content aside > div:first-child::after {
          position: absolute;
          inset: 50%;
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: #9ed39f;
          content: "";
          transform: translate(-50%, -50%);
        }

        .client-portal-content h1,
        .client-portal-content h2,
        .client-portal-content h3 {
          text-wrap: balance;
        }

        .client-portal-content [class*="bg-\\[\\#9ed39f\\]"] {
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.26) inset !important;
        }

        @media (max-width: 760px) {
          .client-portal-content h1 {
            font-size: clamp(2.45rem, 14vw, 3.4rem) !important;
          }

          .client-portal-content h2 {
            font-size: clamp(2rem, 11vw, 3rem) !important;
          }
        }
      `}</style>

      <header className="client-portal-frame border-b border-[#9ed39f]/24 bg-[#06150a]/86 px-4 py-5 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-5 xl:grid-cols-[0.62fr_0.38fr] xl:items-stretch">
          <div className="rounded-[1.65rem] border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-4 shadow-[0_24px_90px_rgba(0,0,0,0.34)] sm:p-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <a
                href="/client"
                className="inline-flex w-fit items-center gap-3 rounded-full border border-[#9ed39f]/45 bg-black/44 px-4 py-3 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#9ed39f]/50 bg-[#9ed39f]/12">AA</span>
                Axiom Architect
              </a>

              <nav aria-label="Client portal navigation" className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
                {clientPortalNav.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="shrink-0 rounded-full border border-[#9ed39f]/24 bg-black/35 px-4 py-3 text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#e6f6e7]/82 transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          <div className="hidden overflow-hidden rounded-[1.65rem] border border-[#9ed39f]/35 bg-black/40 shadow-[0_24px_90px_rgba(0,0,0,0.34)] xl:block">
            <Image
              src="/brand/axiom-architect-header-1920x1080-final.png"
              alt="Axiom Architect workflow architecture visual"
              width={1920}
              height={1080}
              priority
              className="h-full min-h-[112px] w-full object-cover opacity-82 mix-blend-screen"
            />
          </div>
        </div>
      </header>

      <div className="client-portal-content">{children}</div>
    </div>
  );
}
