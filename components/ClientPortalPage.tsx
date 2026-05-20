import type { ClientPortalPageContent } from "../lib/axiom-client-portal";
import { clientPortalNav, portalStatusCards } from "../lib/axiom-client-portal";

type ClientPortalPageProps = {
  content: ClientPortalPageContent;
  activePath: string;
};

function getActiveDescription(activePath: string) {
  return clientPortalNav.find((item) => item.href === activePath)?.description || clientPortalNav[0].description;
}

export function ClientPortalPage({ content, activePath }: ClientPortalPageProps) {
  const activeDescription = getActiveDescription(activePath);

  return (
    <>
      <section className="relative overflow-hidden border-b border-[#9ed39f]/20 bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_34%,#000_78%)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto max-w-[1440px]">
          <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
            {content.eyebrow}
          </p>
          <div className="mt-6 grid gap-8 lg:grid-cols-[0.92fr_0.72fr] lg:items-end">
            <div>
              <h1 className="max-w-6xl text-[clamp(2.75rem,6vw,6.2rem)] font-black uppercase leading-[0.88] tracking-[-0.08em] text-white">
                {content.title}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[#e6f6e7]/76 sm:text-lg">
                {content.intro}
              </p>
            </div>
            <aside className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5">
              <p className="m-0 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">
                Workspace area
              </p>
              <p className="mt-4 text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-white">
                {clientPortalNav.find((item) => item.href === activePath)?.label || "Overview"}
              </p>
              <p className="mb-0 mt-3 text-sm leading-7 text-[#e6f6e7]/72">
                {activeDescription}
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-[#9ed39f] px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-5 lg:grid-cols-4">
          {portalStatusCards.map((card) => (
            <article key={card.label} className="rounded-[1.25rem] border border-black bg-[#061009] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.26)]">
              <span className="mb-5 block h-2 w-2 bg-[#9ed39f]" />
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">{card.label}</p>
              <h2 className="mt-3 text-2xl font-black uppercase leading-tight tracking-[-0.05em] text-white">{card.value}</h2>
              <p className="mt-4 text-sm leading-6 text-white/75">{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-5 md:grid-cols-2 xl:grid-cols-4">
          {content.panels.map((panel) => (
            <article key={`${panel.label}-${panel.title}`} className="border border-[#9ed39f]/24 bg-[#030804] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">
                  {panel.label}
                </span>
                <span className="h-2 w-2 bg-[#9ed39f]" />
              </div>
              <h3 className="mt-4 text-2xl font-black uppercase leading-tight tracking-[-0.05em] text-white">
                {panel.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72">{panel.text}</p>
            </article>
          ))}
        </div>
      </section>

      {content.actions && content.actions.length > 0 && (
        <section className="bg-[#030804] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid gap-8 lg:grid-cols-[0.55fr_1fr] lg:items-end">
              <div>
                <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
                  Workspace shortcuts
                </p>
                <h2 className="mt-5 text-[clamp(2.1rem,4vw,4.4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">
                  Move through the client portal with purpose.
                </h2>
              </div>
              <p className="max-w-3xl text-base leading-8 text-[#e6f6e7]/75 sm:text-lg">
                Each area has a separate URL and purpose, keeping account control, billing, documents, operations, and deliverables clear for the client.
              </p>
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {content.actions.map((action) => (
                <a key={action.href} href={action.href} className="group border border-[#9ed39f]/24 bg-black/40 p-5 transition hover:border-[#9ed39f] hover:bg-[#9ed39f]">
                  <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white group-hover:text-black">
                    {action.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72 group-hover:text-black/72">
                    {action.text}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
