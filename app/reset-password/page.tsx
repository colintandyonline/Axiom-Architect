import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | Axiom Architect",
  description:
    "Reset your Axiom Architect account access after requesting a secure recovery link.",
};

type SearchParams = {
  missing_token?: string;
  weak_password?: string;
  mismatch?: string;
  error?: string;
  config_error?: string;
};

function statusMessage(params: SearchParams) {
  if (params.missing_token === "1") {
    return "The recovery session is missing or expired. Request a fresh reset link.";
  }

  if (params.weak_password === "1") {
    return "Use at least 8 characters for the new login key.";
  }

  if (params.mismatch === "1") {
    return "The two login key fields did not match.";
  }

  if (params.config_error === "1") {
    return "Reset access is not configured yet. Please check the Supabase environment variables.";
  }

  if (params.error === "1") {
    return "The reset could not be completed. Request a fresh reset link and try again.";
  }

  return "Open this page from the recovery email link, then enter your new account login key.";
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const message = statusMessage(params);
  const hasError = Object.values(params).includes("1");

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
                Reset access
              </p>
              <h1 className="mt-6 max-w-4xl text-[clamp(2.8rem,6.5vw,6rem)] font-black uppercase leading-[0.9] tracking-[-0.075em] text-white">
                Set new account access.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#e6f6e7]/75 sm:text-lg">
                This page is the recovery destination for Axiom Architect accounts. It keeps the account flow branded while the secure reset session is handled by the auth layer.
              </p>
            </div>

            <div className="rounded-[2rem] border border-[#9ed39f]/34 bg-[#030804] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-8">
              <div
                className={`mb-5 border p-4 text-sm leading-6 ${
                  hasError
                    ? "border-red-400 bg-red-950/45 text-red-100"
                    : "border-[#9ed39f]/45 bg-[#9ed39f]/10 text-[#e6f6e7]/80"
                }`}
              >
                {message}
              </div>

              <div className="grid gap-4 text-sm leading-7 text-[#e6f6e7]/72">
                <p className="m-0">
                  The reset backend route is connected. The final browser handoff for the recovery session will be wired in the next focused pass.
                </p>
                <p className="m-0">
                  For now, request a fresh recovery email from the forgot password page if the link has expired.
                </p>
              </div>

              <a
                href="/forgot-password"
                className="mt-7 inline-flex min-h-14 w-full items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white"
              >
                Request fresh link
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
