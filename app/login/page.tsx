import type { Metadata } from "next";
import { getAuthRedirectPath } from "../../lib/axiom-auth";

export const metadata: Metadata = {
  title: "Login | Axiom Architect",
  description:
    "Log in to your Axiom Architect account to access workflow audits, submitted intakes, and report status.",
};

type SearchParams = {
  error?: string;
  logged_out?: string;
  redirect?: string;
};

function errorMessage(error?: string) {
  if (error === "config") {
    return "Login is not configured yet. Please check the Supabase environment variables.";
  }

  if (error === "missing") {
    return "Enter your email address and password to log in.";
  }

  if (error === "invalid") {
    return "Those login details were not recognised. Please check the email and password.";
  }

  return null;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const redirectTo = getAuthRedirectPath(params.redirect);
  const message = errorMessage(params.error);
  const loggedOut = params.logged_out === "1";

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
                Client login
              </p>
              <h1 className="mt-6 max-w-4xl text-[clamp(2.8rem,6.5vw,6rem)] font-black uppercase leading-[0.9] tracking-[-0.075em] text-white">
                Access your workflow audit workspace.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#e6f6e7]/75 sm:text-lg">
                Log in to review submitted workflow intakes, check report status, and manage your Axiom Architect account.
              </p>
            </div>

            <form
              action="/api/auth/login"
              method="post"
              className="rounded-[2rem] border border-[#9ed39f]/34 bg-[#030804] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-8"
            >
              <input type="hidden" name="redirect" value={redirectTo} />

              {loggedOut && (
                <div className="mb-5 border border-[#9ed39f]/45 bg-[#9ed39f]/10 p-4 text-sm leading-6 text-[#e6f6e7]/80">
                  You have been logged out.
                </div>
              )}

              {message && (
                <div className="mb-5 border border-red-400 bg-red-950/45 p-4 text-sm leading-6 text-red-100">
                  {message}
                </div>
              )}

              <label className="block">
                <span className="text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">
                  Email address
                </span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-2 w-full border border-[#9ed39f]/28 bg-black/55 px-4 py-4 text-base leading-6 text-white outline-none transition placeholder:text-white/32 focus:border-[#9ed39f]"
                  placeholder="you@example.com"
                />
              </label>

              <label className="mt-5 block">
                <span className="text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">
                  Password
                </span>
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="mt-2 w-full border border-[#9ed39f]/28 bg-black/55 px-4 py-4 text-base leading-6 text-white outline-none transition placeholder:text-white/32 focus:border-[#9ed39f]"
                  placeholder="Your password"
                />
              </label>

              <button
                type="submit"
                className="mt-7 inline-flex min-h-14 w-full items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white"
              >
                Log in
              </button>

              <div className="mt-5 grid gap-3 text-sm leading-6 text-[#e6f6e7]/68">
                <a href="/forgot-password" className="text-[#9ed39f] transition hover:text-white">
                  Forgot your password?
                </a>
                <p className="m-0">
                  New account creation is being connected next. For now, use the email connected to your paid audit.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
