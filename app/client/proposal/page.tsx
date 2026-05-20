import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAxiomAuthContext } from "../../../lib/axiom-auth";
import {
  bespokeProposalFields,
  bespokeProposalSections,
  getBespokeProposalOptions,
} from "../../../lib/axiom-bespoke-proposal";

export const metadata: Metadata = {
  title: "Client Proposal Intake | Axiom Architect",
  description:
    "Submit a protected Axiom Architect custom workflow proposal request from inside the client route.",
};

export const dynamic = "force-dynamic";

type SearchParams = {
  error?: string;
};

const lockedAccountFieldNames = new Set(["name", "email", "business_name"]);

const sectionNotes: Record<string, string> = {
  "Client details": "Your account details are locked from the customer record. Add your role and any public project context.",
  "Workflow context": "The operating reality: current process, friction, tools, people, handoffs, and intended outcome.",
  "Proposal route": "The likely shape of the service so Axiom can recommend the right scope.",
  "Implementation and guardrails": "Boundaries, risk areas, approval rules, and technical considerations before any work is planned.",
  "Commercial fit": "Timeline, budget range, and anything else needed to shape a realistic proposal.",
  Agreement: "Confirmation that the request contains enough context without exposing secrets or unnecessary sensitive data.",
};

function errorMessage(error?: string) {
  switch (error) {
    case "config":
      return "Proposal submission is not configured yet. Please check the Supabase environment variables.";
    case "missing":
      return "Complete all required proposal fields before submitting.";
    case "account":
      return "Your account could not be linked to a customer record yet.";
    case "portal-sync":
      return "The proposal could not be saved into the client portal records.";
    default:
      return null;
  }
}

function renderField(field: (typeof bespokeProposalFields)[number]) {
  const baseClass =
    "mt-3 w-full border border-[#9ed39f]/40 bg-black/72 px-4 py-4 text-sm leading-6 text-white outline-none transition placeholder:text-white/35 focus:border-[#9ed39f] focus:bg-black";

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
      <label className="mt-5 flex gap-4 border border-[#9ed39f]/42 bg-[#9ed39f]/12 p-5 text-sm leading-7 text-[#e6f6e7]">
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

export default async function ClientProposalPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const authContext = await getAxiomAuthContext();

  if (!authContext.user) {
    redirect("/login?redirect=/client/proposal");
  }

  if (!authContext.customer) {
    redirect("/bespoke/apply?error=customer");
  }

  const params = await searchParams;
  const message = errorMessage(params.error);
  const customer = authContext.customer;
  const fullName = customer.full_name || authContext.user.email || "Axiom client";
  const email = customer.email || authContext.user.email || "Connected account";
  const businessName = customer.business_name || "Axiom client workspace";

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#000_0%,#06150a_48%,#102615_100%)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(158,211,159,0.13)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.13)_1px,transparent_1px)] [background-size:44px_44px]" />

        <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <a
              href="/client"
              className="inline-flex border border-[#9ed39f]/50 bg-black/70 px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-[#9ed39f] transition hover:border-[#9ed39f] hover:bg-[#9ed39f] hover:text-black"
            >
              Back to client portal
            </a>
            <p className="mt-8 inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
              Protected proposal intake
            </p>
            <h1 className="mt-6 max-w-5xl text-[clamp(2.6rem,6vw,5.8rem)] font-black uppercase leading-[0.9] tracking-[-0.075em] text-white">
              Give the workflow enough shape to scope the system.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#e6f6e7] sm:text-xl">
              This request helps Axiom Architect understand the operating problem, the people involved, the tools in play, the risk boundaries, and the right proposal route before any implementation work is planned.
            </p>
          </div>

          <aside className="rounded-[2rem] border border-[#9ed39f]/48 bg-[#07150a] p-5 shadow-[0_28px_90px_rgba(158,211,159,0.12)] sm:p-7">
            <p className="text-[0.66rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">
              Locked account details
            </p>
            <div className="mt-6 grid gap-3">
              {[
                ["Name", fullName],
                ["Email", email],
                ["Business", businessName],
              ].map(([label, value]) => (
                <div key={label} className="border border-[#9ed39f]/34 bg-black/64 p-4">
                  <p className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">
                    {label}
                  </p>
                  <p className="mt-2 break-words text-base font-black uppercase tracking-[-0.03em] text-white">
                    {value}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-7 text-[#e6f6e7]/72">
              These details come from the client account and cannot be changed on this proposal form.
            </p>
          </aside>
        </div>
      </section>

      <section className="bg-[#020904] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <form action="/api/client/proposal" method="post" className="mx-auto grid max-w-[1280px] gap-6">
          <input type="hidden" name="inquiry_type" value="Custom Workflow Systems" />
          <input type="hidden" name="subject" value="Custom workflow proposal request" />
          <input type="hidden" name="business" value="Custom workflow proposal request" />
          <input
            type="text"
            name="company_website"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

          {message ? (
            <div className="border border-red-400 bg-red-950/45 p-5 text-sm leading-7 text-red-100">
              {message}
            </div>
          ) : null}

          {bespokeProposalSections.map((section, index) => {
            const fields = bespokeProposalFields.filter(
              (field) => field.section === section && !lockedAccountFieldNames.has(field.name),
            );

            if (fields.length === 0) {
              return null;
            }

            return (
              <section
                key={section}
                className="grid grid-cols-1 gap-5 border border-[#9ed39f]/36 bg-black p-5 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-7 lg:grid-cols-[0.34fr_0.66fr] lg:p-8"
              >
                <div className="border border-[#9ed39f]/34 bg-[#9ed39f]/12 p-5">
                  <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">
                    Section {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-4 text-3xl font-black uppercase leading-[0.95] tracking-[-0.05em] text-white">
                    {section}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-[#e6f6e7]/76">
                    {sectionNotes[section]}
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  {fields.map((field) => {
                    const wideField = field.type === "textarea" || field.type === "checkbox";

                    if (field.type === "checkbox") {
                      return (
                        <div key={field.name} className="md:col-span-2">
                          {renderField(field)}
                        </div>
                      );
                    }

                    return (
                      <label key={field.name} className={wideField ? "block md:col-span-2" : "block"}>
                        <span className="text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">
                          {field.label}
                          {field.required ? " *" : ""}
                        </span>
                        {field.help ? (
                          <span className="mt-2 block text-xs leading-6 text-[#e6f6e7]/62">
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

          <section className="grid grid-cols-1 gap-5 border border-[#9ed39f]/48 bg-[linear-gradient(135deg,#07150a,#000)] p-5 sm:p-7 lg:grid-cols-[0.34fr_0.66fr] lg:p-8">
            <div>
              <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.2em] text-black">
                Final summary
              </p>
              <h2 className="mt-5 text-3xl font-black uppercase leading-[0.95] tracking-[-0.05em] text-white">
                One clear paragraph for the first review.
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#e6f6e7]/76">
                Summarise the request plainly so the first review has the workflow, problem, desired outcome, and likely implementation need in one place.
              </p>
            </div>
            <label className="block">
              <span className="text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">
                Proposal summary message *
              </span>
              <textarea
                name="message"
                rows={7}
                required
                className="mt-3 min-h-48 w-full resize-y border border-[#9ed39f]/40 bg-black/72 px-4 py-4 text-sm leading-6 text-white outline-none transition placeholder:text-white/35 focus:border-[#9ed39f] focus:bg-black"
                placeholder="Summarise the workflow, main problem, desired outcome, and whether implementation support may be required."
              />
            </label>
          </section>

          <section className="grid grid-cols-1 gap-6 bg-[#9ed39f] p-5 text-black sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center lg:p-8">
            <div>
              <p className="text-[0.68rem] font-black uppercase tracking-[0.2em]">Submit request</p>
              <h2 className="mt-3 text-3xl font-black uppercase leading-none tracking-[-0.05em]">
                Send the workflow for proposal review.
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-black/76">
                Axiom Architect will review the operating context and prepare the correct route for a scoped proposal. No checkout is triggered from this form.
              </p>
            </div>
            <button
              type="submit"
              className="inline-flex min-h-14 items-center justify-center border border-black bg-black px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black sm:min-w-72"
            >
              Submit proposal request
            </button>
          </section>
        </form>
      </section>
    </main>
  );
}
