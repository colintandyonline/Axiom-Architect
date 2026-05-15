import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | Axiom Architect",
  description:
    "Request a secure password reset link for your Axiom Architect account.",
};

type SearchParams = {
  sent?: string;
  missing?: string;
  error?: string;
  config_error?: string;
};

function statusMessage(params: SearchParams) {
  if (params.sent === "1") {
    return {
      tone: "success",
      text: "If an account exists for that email, a password reset link has been sent.",
    };
  }

  if (params.missing === "1") {
    return {
      tone: "error",
      text: "Enter the email address connected to your Axiom Architect account.",
    };
  }

  if (params.config_error === "1") {
    return {
      tone: "error",
      text: "Password reset is not configured yet. Please check the Supabase environment variables.",
    };
  }

  if (params.error === "1") {
    return {
      tone: "error",
      text: "The reset request could not be sent. Please try again.",
    };
  }

  return null;
}

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const message = statusMessage(params);

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <section className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_34%,#000_76%)] px-4 py-10 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />

        <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-[1180px] flex-col justify-center">
          <a
            href="/login"
            className="mb-10 inline-flex w-fit border border-[#9ed39f]/45 bg-black px-4 py-3 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black"
          >
            Back to login
          </a>

          <div className="grid gap-8 lg:grid-cols-[0.88fr_0.72fr] lg:items-center">
            <div>
              <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
                Password reset
              </p>
              <h1 className="mt-6 max-w-4xl text-[clamp(2.8rem,6.5vw,6rem)] font-black uppercase leading-[0.9] tracking-[-0.075em] text-white">
                Recover your account access.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#e6f6e7]/75 sm:text-lg">
                Enter the email connected to your Axiom Architect account. We will send a secure reset link through Supabase Auth.
              </p>
            </div>

            <form
              action="/api/auth/forgot-password"
              method="post"
              className="rounded-[2rem] border border-[#9ed39f]/34 bg-[#030804] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-8"
            >
              {message && (
                <div
                  className={`mb-5 border p-4 text-sm leading-6 ${
                    message.tone === "success"
                      ? "border-[#9ed39f]/45 bg-[#9ed39f]/10 text-[#e6f6e7]/80"
                      : "border-red-400 bg-red-950/45 text-red-100"
                  }`}
                >
                  {message.text}
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

              <button
                type="submit"
                className="mt-7 inline-flex min-h-14 w-full items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white"
              >
                Send reset link
              </button>

              <p className="mb-0 mt-5 text-sm leading-6 text-[#e6f6e7]/68">
                The reset link opens a secure password update page. If the email does not arrive, check spam or return to login.
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
