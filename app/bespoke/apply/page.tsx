import type { Metadata } from "next";
import {
  bespokeProposalFields,
  bespokeProposalSections,
  getBespokeProposalOptions,
} from "../../../lib/axiom-bespoke-proposal";

export const metadata: Metadata = {
  title: "Request Bespoke Proposal | Axiom Architect",
  description:
    "Submit a structured bespoke proposal request for custom AI workflow architecture, implementation guardrails, Codex-ready briefs, and operating system design.",
  alternates: {
    canonical: "/bespoke/apply",
  },
  robots: {
    index: true,
    follow: true,
  },
};

function renderField(field: (typeof bespokeProposalFields)[number]) {
  const baseClass =
    "mt-2 w-full border border-[#9ed39f]/28 bg-black/55 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/32 focus:border-[#9ed39f]";

  if (field.type === "textarea") {
    return (
      <textarea
        name={field.name}
        rows={5}
        required={field.required}
        className={`${baseClass} min-h-36 resize-y`}
      />
    );
  }

  if (field.type === "select") {
    const options = getBespokeProposalOptions(field.name);

    return (
      <select name={field.name} required={field.required} className={baseClass} defaultValue="">
        <option value="" disabled>
          Select option
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "checkbox") {
    return (
      <label className="mt-4 flex gap-4 border border-[#9ed39f]/28 bg-black/55 p-4 text-sm leading-7 text-[#e6f6e7]/78">
        <input
          name={field.name}
          value="confirmed"
          type="checkbox"
          required={field.required}
          className="mt-1 h-5 w-5 shrink-0 accent-[#9ed39f]"
        />
        <span>{field.label}</span>
      </label>
    );
  }

  return <input name={field.name} type={field.type} required={field.required} className={baseClass} />;
}

export default function BespokeProposalApplyPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_34%,#000_76%)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto max-w-[1180px]">
          <a
            href="/bespoke"
            className="inline-flex border border-[#9ed39f]/35 bg-black/70 px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-[#9ed39f] transition hover:border-[#9ed39f]"
          >
            ← Bespoke service
          </a>
          <p className="mt-8 inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
            Proposal request
          </p>
          <h1 className="mt-6 max-w-5xl text-[clamp(2.6rem,6vw,5.8rem)] font-black uppercase leading-[0.9] tracking-[-0.075em] text-white">
            Submit the workflow before the proposal is written.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#e6f6e7]/80 sm:text-xl">
            This form collects the information Axiom Architect needs to decide the right proposal route, scope the guardrails, and identify whether Codex-assisted implementation should be included later.
          </p>
        </div>
      </section>

      <section className="bg-black px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-8 lg:grid-cols-[0.35fr_0.65fr]">
          <aside className="self-start border border-[#9ed39f]/28 bg-[#041008] p-5 lg:sticky lg:top-24">
            <p className="text-[0.66rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">
              Before you submit
            </p>
            <h2 className="mt-4 text-2xl font-black uppercase tracking-[-0.04em] text-white">
              No secrets. No vague build requests.
            </h2>
            <div className="mt-5 grid gap-4 text-sm leading-7 text-[#e6f6e7]/74">
              <p>
                Do not include passwords, API keys, access tokens, private credentials, payment card details, or unnecessary sensitive data.
              </p>
              <p>
                The proposal stage defines scope, risk, review gates, allowed implementation areas, and acceptance criteria before any work begins.
              </p>
              <p>
                If repository or code work is needed later, the Codex handoff brief will be prepared separately after proposal approval.
              </p>
            </div>
          </aside>

          <form action="/api/contact" method="post" className="grid gap-5 rounded-[2rem] border border-[#9ed39f]/35 bg-[#030804] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.32)] sm:p-7 lg:p-8">
            <input type="hidden" name="inquiry_type" value="Axiom Enterprise Architecture System" />
            <input type="hidden" name="subject" value="Bespoke proposal request" />
            <input type="hidden" name="business" value="Bespoke proposal request" />
            <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

            {bespokeProposalSections.map((section) => {
              const fields = bespokeProposalFields.filter((field) => field.section === section);

              return (
                <section key={section} className="border border-[#9ed39f]/20 bg-black/40 p-5 sm:p-6">
                  <p className="text-[0.66rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">
                    {section}
                  </p>
                  <div className="mt-5 grid gap-5">
                    {fields.map((field) => {
                      if (field.type === "checkbox") {
                        return <div key={field.name}>{renderField(field)}</div>;
                      }

                      return (
                        <label key={field.name} className="block">
                          <span className="text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">
                            {field.label}
                            {field.required ? " *" : ""}
                          </span>
                          {field.help ? (
                            <span className="mt-2 block text-xs leading-6 text-[#e6f6e7]/56">
                              {field.help}
                            </span>
                          ) : null}
                          {renderField(field)}
                        </label>
                      );
                    })}
                  </div>
                </section>
              );
            })}

            <label className="block">
              <span className="text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">
                Proposal summary message *
              </span>
              <span className="mt-2 block text-xs leading-6 text-[#e6f6e7]/56">
                This is the short message sent through the existing contact pipeline while the bespoke request backend is built.
              </span>
              <textarea
                name="message"
                rows={7}
                required
                className="mt-2 min-h-48 w-full resize-y border border-[#9ed39f]/28 bg-black/55 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/32 focus:border-[#9ed39f]"
                placeholder="Summarise the request in one clear paragraph. Include the workflow, main problem, desired outcome, and whether implementation may be required."
              />
            </label>

            <button type="submit" className="inline-flex min-h-14 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-black transition hover:bg-white sm:w-fit">
              Submit proposal request
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
