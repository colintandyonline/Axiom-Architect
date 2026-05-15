import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Claim Account | Axiom Architect",
  description: "Claim your Axiom Architect account after purchasing a Workflow Audit.",
};

type SearchParams = {
  error?: string;
};

function errorMessage(error?: string) {
  const messages: Record<string, string> = {
    config: "Account claiming is not configured yet. Please check the Supabase environment variables.",
    missing: "Enter your checkout email, name, business or project name, and password.",
    password: "Use a password with at least 8 characters.",
    not_found: "No paid Axiom Architect customer was found for that email address. Use the same email you used at checkout.",
    already_claimed: "This paid customer record has already been linked to an account. Log in instead.",
    already_exists: "An account already exists for that email address. Try logging in or resetting your password.",
    signup: "Supabase could not create the account. Please try again.",
    link: "The account was created, but it could not be linked to the paid customer record. Please contact support.",
  };

  return error ? messages[error] || null : null;
}

export default async function ClaimAccountPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const message = errorMessage(params.error);

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <section className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_34%,#000_76%)] px-4 py-10 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />

        <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-[1180px] flex-col justify-center">
          <a
            href="/"
            className="mb-10 inline-flex w-fit border border-[#9ed39f]/45 bg-black px-4 py-3 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black"
          >
            Axiom Architect
          </a>

          <div className="grid gap-8 lg:grid-cols-[0.88fr_0.72fr] lg:items-center">
            <div>
              <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
                Paid customer access
              </p>
              <h1 className="mt-6 max-w-4xl text-[clamp(2.8rem,6.5vw,6rem)] font-black uppercase leading-[0.9] tracking-[-0.075em] text-white">
                Claim your workflow audit account.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#e6f6e7]/75 sm:text-lg">
                Use the same email address from your successful Workflow Audit checkout. Axiom Architect will connect your paid order, workflow intake, and report workspace to your account.
              </p>
            </div>

            <form
              action="/api/auth/claim-account"
              method="post"
              className="rounded-[2rem] border border-[#9ed39f]/34 bg-[#030804] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-8"
            >
              {message && (
                <div className="mb-5 border border-red-400 bg-red-950/45 p-4 text-sm leading-6 text-red-100">
                  {message}
                </div>
              )}

              <label className="block">
                <span className="text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">Checkout email</span>
                <input name="email" type="email" autoComplete="email" required className="mt-2 w-full border border-[#9ed39f]/28 bg-black/55 px-4 py-4 text-base leading-6 text-white outline-none transition placeholder:text-white/32 focus:border-[#9ed39f]" placeholder="you@example.com" />
              </label>

              <label className="mt-5 block">
                <span className="text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">Full name</span>
                <input name="fullName" type="text" autoComplete="name" required className="mt-2 w-full border border-[#9ed39f]/28 bg-black/55 px-4 py-4 text-base leading-6 text-white outline-none transition placeholder:text-white/32 focus:border-[#9ed39f]" placeholder="Your name" />
              </label>

              <label className="mt-5 block">
                <span className="text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">Business or project</span>
                <input name="businessName" type="text" autoComplete="organization" required className="mt-2 w-full border border-[#9ed39f]/28 bg-black/55 px-4 py-4 text-base leading-6 text-white outline-none transition placeholder:text-white/32 focus:border-[#9ed39f]" placeholder="Business, brand, or project name" />
              </label>

              <label className="mt-5 block">
                <span className="text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">Create password</span>
                <input name="password" type="password" autoComplete="new-password" required minLength={8} className="mt-2 w-full border border-[#9ed39f]/28 bg-black/55 px-4 py-4 text-base leading-6 text-white outline-none transition placeholder:text-white/32 focus:border-[#9ed39f]" placeholder="Minimum 8 characters" />
              </label>

              <button type="submit" className="mt-7 inline-flex min-h-14 w-full items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white">
                Claim account
              </button>

              <p className="mt-5 text-sm leading-6 text-[#e6f6e7]/68">
                Already claimed your account? <a href="/login" className="text-[#9ed39f] transition hover:text-white">Log in here.</a>
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
