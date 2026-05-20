import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check Your Email | Axiom Architect Client Portal",
  description:
    "Confirm your email address to access the Axiom Architect client portal after submitting a custom workflow proposal request.",
};

export const dynamic = "force-dynamic";

type SearchParams = {
  email?: string;
  proposal?: string;
};

export default async function ClientCheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const email = params.email || "your email address";

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <section className="relative overflow-hidden border-b border-[#9ed39f]/20 bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_34%,#000_78%)] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[0.95fr_0.7fr] lg:items-end">
          <div>
            <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
              Proposal received
            </p>
            <h1 className="mt-6 max-w-5xl text-[clamp(2.75rem,6vw,5.8rem)] font-black uppercase leading-[0.9] tracking-[-0.075em] text-white">
              Check your email to access the client portal.
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#e6f6e7]/76 sm:text-lg">
              Your custom workflow proposal request has been received. Confirm your email address, then sign in to continue through the dedicated Axiom Architect client portal.
            </p>
          </div>

          <aside className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5">
            <p className="m-0 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">
              Email sent to
            </p>
            <p className="mt-4 break-words text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-white">
              {email}
            </p>
            <p className="mb-0 mt-4 text-sm leading-7 text-[#e6f6e7]/72">
              If the email does not arrive shortly, check spam or return to the proposal form and confirm the address was entered correctly.
            </p>
          </aside>
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1180px] gap-5 lg:grid-cols-3">
          {[
            ["01", "Confirm email", "Use the email confirmation link to activate portal access."],
            ["02", "Sign in", "After confirmation, sign in with the password you created."],
            ["03", "Open portal", "Your client portal keeps operations, documents, billing, and deliverables separate from standard audit dashboards."],
          ].map(([number, title, text]) => (
            <article key={number} className="border border-[#9ed39f]/24 bg-[#030804] p-5">
              <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">{number}</p>
              <h2 className="mt-4 text-2xl font-black uppercase tracking-[-0.05em] text-white">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72">{text}</p>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-10 flex max-w-[1180px] flex-col gap-4 sm:flex-row">
          <a
            href="/login?redirect=/client"
            className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white"
          >
            Go to sign in
          </a>
          <a
            href="/bespoke/apply"
            className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f]/45 bg-black px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black"
          >
            Return to proposal form
          </a>
        </div>
      </section>
    </main>
  );
}
