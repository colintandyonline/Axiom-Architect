import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start Custom Proposal | Axiom Architect",
  description:
    "Create or access your Axiom Architect client account before submitting a custom workflow systems proposal request.",
  alternates: {
    canonical: "/bespoke/apply",
  },
  robots: {
    index: true,
    follow: true,
  },
};

type SearchParams = {
  error?: string;
};

const nextSteps = [
  "Create a secure client account with your name, email, and business name.",
  "Confirm your email address if account confirmation is required.",
  "Sign in and open the protected custom proposal intake form.",
  "Submit the workflow context so Axiom can prepare the correct proposal route.",
] as const;

function errorMessage(error?: string) {
  switch (error) {
    case "config":
      return "Account creation is not configured yet. Please check the Supabase environment variables.";
    case "missing":
      return "Enter your name, email, business name, and matching password details.";
    case "password":
      return "Use a portal password with at least 8 characters.";
    case "password-match":
      return "The portal password fields do not match.";
    case "account-create":
      return "The account could not be created. Try again or sign in if the email already has an account.";
    case "customer":
      return "Your account was created, but the customer record could not be linked yet.";
    default:
      return null;
  }
}

export default async function BespokeProposalApplyPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const message = errorMessage(params.error);

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#000_0%,#06150a_48%,#102615_100%)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(158,211,159,0.13)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.13)_1px,transparent_1px)] [background-size:44px_44px]" />

        <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <a
              href="/bespoke"
              className="inline-flex border border-[#9ed39f]/50 bg-black/70 px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-[#9ed39f] transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black"
            >
              ← Custom workflow systems
            </a>
            <p className="mt-8 inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
              Client account required
            </p>
            <h1 className="mt-6 max-w-5xl text-[clamp(2.6rem,6vw,5.8rem)] font-black uppercase leading-[0.9] tracking-[-0.075em] text-white">
              Start the custom proposal from a secure client account.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#e6f6e7] sm:text-xl">
              Custom workflow proposals are submitted from the protected Axiom Architect client route. Create an account first, or sign in with an existing account, then continue to the proposal intake.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <a
                href="/login?redirect=/client/proposal"
                className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white"
              >
                Existing client sign in
              </a>
              <a
                href="/client/proposal"
                className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f]/45 bg-black px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black"
              >
                Continue after login
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#9ed39f]/48 bg-[#07150a] p-5 shadow-[0_28px_90px_rgba(158,211,159,0.12)] sm:p-7">
            <p className="text-[0.66rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">
              Create client account
            </p>

            {message ? (
              <div className="mt-5 border border-red-400 bg-red-950/45 p-4 text-sm leading-6 text-red-100">
                {message}
              </div>
            ) : null}

            <form action="/api/client/signup" method="post" className="mt-6 grid gap-5">
              <input
                type="text"
                name="company_website"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              <label className="block">
                <span className="text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">
                  Your name *
                </span>
                <input
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="mt-2 w-full border border-[#9ed39f]/28 bg-black/55 px-4 py-4 text-base leading-6 text-white outline-none transition placeholder:text-white/32 focus:border-[#9ed39f]"
                />
              </label>

              <label className="block">
                <span className="text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">
                  Email address *
                </span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-2 w-full border border-[#9ed39f]/28 bg-black/55 px-4 py-4 text-base leading-6 text-white outline-none transition placeholder:text-white/32 focus:border-[#9ed39f]"
                />
              </label>

              <label className="block">
                <span className="text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">
                  Business name *
                </span>
                <input
                  name="business_name"
                  type="text"
                  autoComplete="organization"
                  required
                  className="mt-2 w-full border border-[#9ed39f]/28 bg-black/55 px-4 py-4 text-base leading-6 text-white outline-none transition placeholder:text-white/32 focus:border-[#9ed39f]"
                />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">
                    Portal password *
                  </span>
                  <input
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    className="mt-2 w-full border border-[#9ed39f]/28 bg-black/55 px-4 py-4 text-base leading-6 text-white outline-none transition placeholder:text-white/32 focus:border-[#9ed39f]"
                  />
                </label>

                <label className="block">
                  <span className="text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">
                    Confirm password *
                  </span>
                  <input
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    className="mt-2 w-full border border-[#9ed39f]/28 bg-black/55 px-4 py-4 text-base leading-6 text-white outline-none transition placeholder:text-white/32 focus:border-[#9ed39f]"
                  />
                </label>
              </div>

              <button
                type="submit"
                className="inline-flex min-h-14 w-full items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white"
              >
                Create account
              </button>
            </form>

            <div className="mt-6 border border-[#9ed39f]/42 bg-[#9ed39f]/12 p-5">
              <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">
                Already have an account?
              </p>
              <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/78">
                Sign in with your existing Axiom Architect account. Your normal account stays the same; the custom proposal will be attached to the same customer record.
              </p>
              <a
                href="/login?redirect=/client/proposal"
                className="mt-5 inline-flex min-h-12 items-center justify-center border border-[#9ed39f]/45 bg-black px-5 text-center text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black"
              >
                Sign in instead
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1280px] gap-5 lg:grid-cols-4">
          {nextSteps.map((step, index) => (
            <article key={step} className="border border-[#9ed39f]/24 bg-[#030804] p-5">
              <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-4 text-sm leading-7 text-[#e6f6e7]/72">{step}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
