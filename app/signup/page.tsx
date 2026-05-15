import type { Metadata } from "next";
import { getAxiomAuthContext } from "../../lib/axiom-auth";

export const metadata: Metadata = {
  title: "Create Account | Axiom Architect",
  description:
    "Create your Axiom Architect account before starting a Workflow Audit checkout.",
};

type TierSlug = "workflow-audit" | "workflow-blueprint" | "custom-operating-pack";

type SearchParams = {
  tier?: string;
  error?: string;
  account?: string;
};

const tiers: Record<
  TierSlug,
  {
    name: string;
    price: string;
    description: string;
  }
> = {
  "workflow-audit": {
    name: "Workflow Audit",
    price: "$49",
    description:
      "A focused diagnostic for one workflow that needs clarity, friction mapping, automation suitability, and practical next steps.",
  },
  "workflow-blueprint": {
    name: "Workflow Blueprint",
    price: "$149",
    description:
      "A deeper workflow plan with diagnostic findings, future-state design, review gates, assistant roles, and an implementation sequence.",
  },
  "custom-operating-pack": {
    name: "Custom Operating Pack",
    price: "$399",
    description:
      "A complete operating pack for one workflow, including protocol structure, instructions, workbook assets, and handoff guidance.",
  },
};

function isTierSlug(value?: string | null): value is TierSlug {
  return (
    value === "workflow-audit" ||
    value === "workflow-blueprint" ||
    value === "custom-operating-pack"
  );
}

function errorMessage(error?: string) {
  const messages: Record<string, string> = {
    config: "Account creation is not configured yet. Please check the Supabase public environment variables.",
    "service-config": "Account creation needs the Supabase service role environment variable before it can complete.",
    missing: "Enter your name, email, business or project name, password, and password confirmation.",
    password: "Use a password with at least 8 characters.",
    "password-match": "The two password fields do not match.",
    signup: "Supabase could not create the account. Please try again.",
    link: "The account was created, but it could not be linked to your Axiom customer record. Please contact support.",
  };

  return error ? messages[error] || null : null;
}

function accountNotice(account?: string) {
  const messages: Record<string, string> = {
    required: "Create your account first, then you can continue to secure checkout.",
    "customer-required": "Your account needs a linked customer record before checkout can continue.",
    "email-required": "Your account needs an email address before checkout can continue.",
  };

  return account ? messages[account] || null : null;
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const tierSlug: TierSlug = isTierSlug(params.tier) ? params.tier : "workflow-blueprint";
  const selectedTier = tiers[tierSlug];
  const error = errorMessage(params.error);
  const notice = accountNotice(params.account);
  const context = await getAxiomAuthContext();

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <section className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_34%,#000_76%)] px-4 py-10 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />

        <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-[1180px] flex-col justify-center">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <a
              href="/"
              className="inline-flex w-fit border border-[#9ed39f]/45 bg-black px-4 py-3 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black"
            >
              Axiom Architect
            </a>
            <a
              href="/pricing"
              className="inline-flex w-fit border border-[#9ed39f]/45 bg-black px-4 py-3 text-[0.68rem] font-black uppercase tracking-[0.18em] text-white transition hover:bg-[#9ed39f] hover:text-black"
            >
              View pricing
            </a>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.88fr_0.72fr] lg:items-center">
            <div>
              <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
                Account first
              </p>
              <h1 className="mt-6 max-w-4xl text-[clamp(2.8rem,6.5vw,6rem)] font-black uppercase leading-[0.9] tracking-[-0.075em] text-white">
                Create your client account before checkout.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#e6f6e7]/75 sm:text-lg">
                Your account connects the audit purchase, workflow intake, dashboard, and report delivery to one verified client record.
              </p>

              <div className="mt-8 border border-[#9ed39f]/30 bg-[#041008] p-5 sm:p-6">
                <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">
                  Selected service
                </p>
                <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-[-0.04em] text-white">
                      {selectedTier.name}
                    </h2>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-[#e6f6e7]/72">
                      {selectedTier.description}
                    </p>
                  </div>
                  <p className="text-4xl font-black tracking-[-0.06em] text-[#9ed39f]">
                    {selectedTier.price}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#9ed39f]/34 bg-[#030804] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-8">
              {context.user && context.customer ? (
                <div>
                  <div className="mb-5 border border-[#9ed39f]/45 bg-[#9ed39f]/10 p-4 text-sm leading-6 text-[#e6f6e7]/80">
                    You are already signed in. Continue to secure checkout for {selectedTier.name}.
                  </div>
                  <form action="/api/checkout" method="post">
                    <input type="hidden" name="tier" value={tierSlug} />
                    <button
                      type="submit"
                      className="inline-flex min-h-14 w-full items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white"
                    >
                      Continue to checkout
                    </button>
                  </form>
                </div>
              ) : (
                <form action="/api/auth/signup" method="post">
                  <input type="hidden" name="tier" value={tierSlug} />

                  {notice && (
                    <div className="mb-5 border border-[#9ed39f]/45 bg-[#9ed39f]/10 p-4 text-sm leading-6 text-[#e6f6e7]/80">
                      {notice}
                    </div>
                  )}

                  {error && (
                    <div className="mb-5 border border-red-400 bg-red-950/45 p-4 text-sm leading-6 text-red-100">
                      {error}
                    </div>
                  )}

                  <label className="block">
                    <span className="text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">
                      Full name
                    </span>
                    <input
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      className="mt-2 w-full border border-[#9ed39f]/28 bg-black/55 px-4 py-4 text-base leading-6 text-white outline-none transition placeholder:text-white/32 focus:border-[#9ed39f]"
                      placeholder="Your name"
                    />
                  </label>

                  <label className="mt-5 block">
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
                      Business or project
                    </span>
                    <input
                      name="business"
                      type="text"
                      autoComplete="organization"
                      required
                      className="mt-2 w-full border border-[#9ed39f]/28 bg-black/55 px-4 py-4 text-base leading-6 text-white outline-none transition placeholder:text-white/32 focus:border-[#9ed39f]"
                      placeholder="Business, brand, or project name"
                    />
                  </label>

                  <label className="mt-5 block">
                    <span className="text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">
                      Password
                    </span>
                    <input
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      className="mt-2 w-full border border-[#9ed39f]/28 bg-black/55 px-4 py-4 text-base leading-6 text-white outline-none transition placeholder:text-white/32 focus:border-[#9ed39f]"
                      placeholder="Minimum 8 characters"
                    />
                  </label>

                  <label className="mt-5 block">
                    <span className="text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">
                      Confirm password
                    </span>
                    <input
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      className="mt-2 w-full border border-[#9ed39f]/28 bg-black/55 px-4 py-4 text-base leading-6 text-white outline-none transition placeholder:text-white/32 focus:border-[#9ed39f]"
                      placeholder="Repeat password"
                    />
                  </label>

                  <button
                    type="submit"
                    className="mt-7 inline-flex min-h-14 w-full items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white"
                  >
                    Create account
                  </button>

                  <p className="mt-5 text-sm leading-6 text-[#e6f6e7]/68">
                    Already have an account?{" "}
                    <a href={`/login?redirect=/audit?tier=${tierSlug}`} className="text-[#9ed39f] transition hover:text-white">
                      Log in here.
                    </a>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
