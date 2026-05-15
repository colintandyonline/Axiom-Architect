import type { Metadata } from "next";
import { requireAxiomAuth } from "../../lib/axiom-auth";

export const metadata: Metadata = {
  title: "Account | Axiom Architect",
  description:
    "Manage your Axiom Architect account, customer profile, audit workspace access, and password options.",
};

export const dynamic = "force-dynamic";

function valueOrPending(value?: string | null) {
  return value || "Not linked yet";
}

export default async function AccountPage() {
  const { user, customer } = await requireAxiomAuth("/login?redirect=/account");
  const displayName = customer?.full_name || user.email || "Axiom client";
  const accountStatus = customer?.account_status || "pending link";

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <section className="relative overflow-hidden border-b border-[#9ed39f]/20 bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_36%,#000_78%)] px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto max-w-[1220px]">
          <nav className="flex flex-wrap items-center justify-between gap-4" aria-label="Account navigation">
            <a
              href="/dashboard"
              className="inline-flex border border-[#9ed39f]/45 bg-black px-4 py-3 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black"
            >
              Axiom Architect
            </a>
            <div className="flex flex-wrap gap-3">
              <a
                href="/dashboard"
                className="inline-flex min-h-11 items-center justify-center border border-[#9ed39f]/45 bg-black px-4 text-center text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black"
              >
                Dashboard
              </a>
              <a
                href="/logout"
                className="inline-flex min-h-11 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-4 text-center text-[0.68rem] font-black uppercase tracking-[0.16em] text-black transition hover:bg-white"
              >
                Log out
              </a>
            </div>
          </nav>

          <p className="mt-10 inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
            Account workspace
          </p>

          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_0.72fr] lg:items-end">
            <div>
              <h1 className="max-w-5xl text-[clamp(2.65rem,6vw,5.9rem)] font-black uppercase leading-[0.9] tracking-[-0.075em] text-white">
                Manage your Axiom Architect account.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[#e6f6e7]/75 sm:text-lg">
                Review the customer profile connected to your audit workspace. Password and profile editing actions will be wired in the next account stage.
              </p>
            </div>

            <aside className="rounded-[1.5rem] border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5">
              <p className="m-0 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">
                Signed in as
              </p>
              <p className="mt-4 text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-white">
                {displayName}
              </p>
              <p className="mb-0 mt-3 text-sm leading-6 text-[#e6f6e7]/72">
                {user.email || "No email available"}
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-[#9ed39f] px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1220px] grid-cols-1 gap-5 lg:grid-cols-4">
          {[
            ["Account status", accountStatus],
            ["Customer link", customer ? "Linked" : "Not linked"],
            ["Business", valueOrPending(customer?.business_name)],
            ["Email", valueOrPending(customer?.email || user.email)],
          ].map(([label, text]) => (
            <article
              key={label}
              className="rounded-[1.25rem] border border-black bg-[#061009] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.26)]"
            >
              <span className="mb-5 block h-2 w-2 bg-[#9ed39f]" />
              <h2 className="text-lg font-black uppercase tracking-[0.02em] text-[#9ed39f]">
                {label}
              </h2>
              <p className="mt-4 text-sm leading-6 text-white/78">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1220px] gap-8 lg:grid-cols-[0.78fr_1fr]">
          <article className="rounded-[2rem] border border-[#9ed39f]/34 bg-[#030804] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-8">
            <p className="m-0 text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">
              Account actions
            </p>
            <h2 className="mt-5 text-[clamp(2rem,4vw,3.7rem)] font-black uppercase leading-[0.92] tracking-[-0.06em] text-white">
              Profile and password controls.
            </h2>
            <p className="mt-5 text-base leading-8 text-[#e6f6e7]/75">
              This page is now protected by login. The next stage will add working profile updates, password reset/change flows, and customer account claiming for paid audit users.
            </p>
          </article>

          <div className="grid gap-4">
            <article className="rounded-[1.25rem] border border-[#9ed39f]/28 bg-[#030804] p-5">
              <h3 className="m-0 text-xl font-black uppercase tracking-[-0.04em] text-white">
                Password management
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/70">
                Password reset and change-password actions will connect to Supabase Auth in the next stage.
              </p>
              <a
                href="/forgot-password"
                className="mt-5 inline-flex min-h-12 items-center justify-center border border-[#9ed39f]/45 bg-black px-5 text-center text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black"
              >
                Reset password
              </a>
            </article>

            <article className="rounded-[1.25rem] border border-[#9ed39f]/28 bg-[#030804] p-5">
              <h3 className="m-0 text-xl font-black uppercase tracking-[-0.04em] text-white">
                Audit workspace
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/70">
                Return to your dashboard to review submitted workflow intakes and report status.
              </p>
              <a
                href="/dashboard"
                className="mt-5 inline-flex min-h-12 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-5 text-center text-[0.68rem] font-black uppercase tracking-[0.16em] text-black transition hover:bg-white"
              >
                Open dashboard
              </a>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
