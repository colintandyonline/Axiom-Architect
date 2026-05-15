import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workflow Intake | Axiom Architect",
  description:
    "Submit the staged workflow details needed for your Axiom Architect audit report.",
};

export const dynamic = "force-dynamic";

type SearchParams = {
  submission_id?: string;
  submitted?: string;
  error?: string;
  not_found?: string;
};

type IntakeRecord = {
  id: string;
  tier_slug: string;
  workflow_title: string | null;
  status: string;
  business_type: string | null;
  user_role: string | null;
  team_size: string | null;
  industry: string | null;
  business_description: string | null;
  workflow_goal: string | null;
  people_involved: string | null;
  workflow_frequency: string | null;
  workflow_trigger: string | null;
  current_process_steps: string | null;
  tools_used: string | null;
  inputs_needed: string | null;
  outputs_produced: string | null;
  handoffs: string | null;
  information_storage: string | null;
  workflow_slowdowns: string | null;
  manual_repetition: string | null;
  mistake_points: string | null;
  delay_causes: string | null;
  team_or_client_frustrations: string | null;
  failure_impact: string | null;
  human_approval_needed: string | null;
  risk_areas: string | null;
  protected_decisions: string | null;
  ideal_workflow: string | null;
  assistant_support_requested: string | null;
  tools_open_to_using: string | null;
  success_definition: string | null;
};

type OrderRecord = {
  service_name: string;
  amount_total: number | null;
  currency: string | null;
};

type CustomerRecord = {
  full_name: string | null;
  business_name: string | null;
  email: string | null;
};

type IntakeContext = {
  intake: IntakeRecord;
  order: OrderRecord | null;
  customer: CustomerRecord | null;
};

type Field = {
  name: keyof IntakeRecord;
  label: string;
  type?: "input" | "textarea";
  placeholder?: string;
};

type Stage = {
  number: string;
  title: string;
  description: string;
  fields: Field[];
};

const stages: Stage[] = [
  {
    number: "01",
    title: "Business context",
    description: "Give the report engine enough context to understand the operating environment.",
    fields: [
      { name: "business_type", label: "Business type", type: "input", placeholder: "Example: consultancy, ecommerce, agency, creator business" },
      { name: "user_role", label: "Your role", type: "input", placeholder: "Example: founder, operations lead, consultant" },
      { name: "team_size", label: "Team size", type: "input", placeholder: "Example: solo, 2-5, 6-20, 20+" },
      { name: "industry", label: "Industry", type: "input", placeholder: "Example: professional services, retail, education" },
      { name: "business_description", label: "What does the business do?", placeholder: "Describe the business, customers, offers, and main operating model." },
    ],
  },
  {
    number: "02",
    title: "Workflow overview",
    description: "Define the workflow we are diagnosing and what it is supposed to achieve.",
    fields: [
      { name: "workflow_title", label: "Workflow name", type: "input", placeholder: "Example: client onboarding, content production, order fulfilment" },
      { name: "workflow_goal", label: "What is the workflow trying to achieve?", placeholder: "Explain the end result this workflow should produce." },
      { name: "people_involved", label: "Who is involved?", placeholder: "List roles, teams, clients, suppliers, approvers, or tools involved." },
      { name: "workflow_frequency", label: "How often does it happen?", type: "input", placeholder: "Example: daily, weekly, per client, per order" },
      { name: "workflow_trigger", label: "What triggers it?", placeholder: "Describe the event, request, sale, deadline, or input that starts the workflow." },
    ],
  },
  {
    number: "03",
    title: "Current process",
    description: "Map how the workflow actually happens today, including tools, handoffs, and stored information.",
    fields: [
      { name: "current_process_steps", label: "Step-by-step current process", placeholder: "Write the current process as numbered steps from start to finish." },
      { name: "tools_used", label: "Tools used", placeholder: "List the apps, documents, inboxes, spreadsheets, databases, or platforms involved." },
      { name: "inputs_needed", label: "Inputs needed", placeholder: "What information, files, messages, or approvals are needed before work can begin?" },
      { name: "outputs_produced", label: "Outputs produced", placeholder: "What does the workflow create, update, send, or deliver?" },
      { name: "handoffs", label: "Handoffs", placeholder: "Where does the work move from one person, system, or stage to another?" },
      { name: "information_storage", label: "Where information is stored", placeholder: "Where do notes, decisions, assets, records, and final outputs live?" },
    ],
  },
  {
    number: "04",
    title: "Pain points",
    description: "Identify friction, repeated manual effort, delays, and weak points.",
    fields: [
      { name: "workflow_slowdowns", label: "What slows this down?", placeholder: "Describe bottlenecks, waiting time, unclear ownership, or approval delays." },
      { name: "manual_repetition", label: "What gets repeated manually?", placeholder: "List repeated copying, rewriting, checking, chasing, or formatting tasks." },
      { name: "mistake_points", label: "Where do mistakes happen?", placeholder: "Describe missed steps, wrong data, duplicated work, or quality issues." },
      { name: "delay_causes", label: "What causes delays?", placeholder: "Explain what usually blocks progress or creates rework." },
      { name: "team_or_client_frustrations", label: "What frustrates the team or client?", placeholder: "Capture practical frustrations from the people using or receiving this workflow." },
    ],
  },
  {
    number: "05",
    title: "Risk and review",
    description: "Set the boundaries for safe implementation and human-in-the-loop review.",
    fields: [
      { name: "failure_impact", label: "What happens if this goes wrong?", placeholder: "Describe operational, client, financial, legal, or brand impact." },
      { name: "human_approval_needed", label: "Does a human need to approve anything?", placeholder: "List decisions, messages, outputs, or changes that need review before action." },
      { name: "risk_areas", label: "Legal, financial, client, or brand risks", placeholder: "Describe sensitive areas, compliance concerns, client commitments, or reputation risks." },
      { name: "protected_decisions", label: "What must never be decided automatically?", placeholder: "Define decisions that should always remain with a person." },
    ],
  },
  {
    number: "06",
    title: "Desired outcome",
    description: "Describe the better operating model this audit should help design.",
    fields: [
      { name: "ideal_workflow", label: "What would a better version look like?", placeholder: "Describe the improved workflow in practical terms." },
      { name: "assistant_support_requested", label: "What would you like assistants or automation to help with?", placeholder: "List drafting, checking, routing, summarising, data entry, alerts, or preparation tasks." },
      { name: "tools_open_to_using", label: "What tools are you open to using?", placeholder: "List current tools you want to keep and any tools you are willing to add." },
      { name: "success_definition", label: "What does success look like?", placeholder: "Describe the result that would make this workflow noticeably better." },
    ],
  },
];

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return {
    url: url.replace(/\/$/, ""),
    serviceRoleKey,
  };
}

async function supabaseFetch<T>(path: string): Promise<T | null> {
  const config = getSupabaseConfig();

  if (!config) {
    return null;
  }

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    cache: "no-store",
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("Intake Supabase request failed", await response.text());
    return null;
  }

  return (await response.json()) as T;
}

async function getIntakeContext(submissionId?: string): Promise<IntakeContext | null> {
  if (!submissionId) {
    return null;
  }

  const records = await supabaseFetch<
    Array<
      IntakeRecord & {
        axiom_orders: OrderRecord | null;
        axiom_customers: CustomerRecord | null;
      }
    >
  >(
    `axiom_workflow_submissions?select=*,axiom_orders(service_name,amount_total,currency),axiom_customers(full_name,business_name,email)&id=eq.${encodeURIComponent(submissionId)}&limit=1`,
  );

  const record = records?.[0];

  if (!record) {
    return null;
  }

  return {
    intake: record,
    order: record.axiom_orders,
    customer: record.axiom_customers,
  };
}

function fieldValue(record: IntakeRecord, fieldName: keyof IntakeRecord) {
  const value = record[fieldName];
  return typeof value === "string" ? value : "";
}

function renderField(field: Field, record: IntakeRecord) {
  const commonClasses = "mt-2 w-full border border-[#9ed39f]/28 bg-black/55 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/32 focus:border-[#9ed39f]";
  const value = fieldValue(record, field.name);

  return (
    <label key={field.name} className="block">
      <span className="text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">
        {field.label}
      </span>
      {field.type === "input" ? (
        <input
          name={field.name}
          defaultValue={value}
          placeholder={field.placeholder}
          className={commonClasses}
        />
      ) : (
        <textarea
          name={field.name}
          defaultValue={value}
          placeholder={field.placeholder}
          rows={5}
          className={`${commonClasses} min-h-36 resize-y`}
        />
      )}
    </label>
  );
}

function formatStatus(status: string) {
  return status.replace(/_/g, " ");
}

export default async function WorkflowIntakePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const context = await getIntakeContext(params.submission_id);
  const isSubmitted = params.submitted === "1";
  const hasError = params.error === "1";
  const notFound = params.not_found === "1" || (!!params.submission_id && !context);

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#9ed39f] selection:text-black">
      <section className="relative overflow-hidden border-b border-[#9ed39f]/20 bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_36%,#000_78%)] px-4 py-12 sm:px-6 lg:px-8 lg:py-18">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto max-w-[1320px]">
          <a
            href="/dashboard"
            className="inline-flex border border-[#9ed39f]/45 bg-black px-4 py-3 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black"
          >
            Back to dashboard
          </a>

          <p className="mt-10 inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
            Workflow intake
          </p>

          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_0.75fr] lg:items-end">
            <div>
              <h1 className="max-w-5xl text-[clamp(2.65rem,6vw,5.7rem)] font-black uppercase leading-[0.9] tracking-[-0.075em] text-white">
                Submit your workflow for diagnosis.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[#e6f6e7]/75 sm:text-lg">
                Work through each stage carefully. This intake becomes the source material for your report, recommendations, and future workflow blueprint.
              </p>
            </div>

            <aside className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5">
              <p className="m-0 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">
                Audit context
              </p>
              <div className="mt-5 grid gap-3 text-sm leading-6 text-[#e6f6e7]/78">
                <p className="m-0">
                  <strong className="text-white">Tier:</strong> {context?.order?.service_name || context?.intake.tier_slug || "Workflow audit"}
                </p>
                <p className="m-0">
                  <strong className="text-white">Business:</strong> {context?.customer?.business_name || "Not loaded"}
                </p>
                <p className="m-0">
                  <strong className="text-white">Status:</strong> {context ? formatStatus(context.intake.status) : "Missing submission"}
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-black px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-[1320px]">
          {isSubmitted && (
            <div className="mb-8 border border-[#9ed39f] bg-[#9ed39f] p-5 text-black">
              <p className="m-0 text-lg font-black uppercase tracking-[-0.02em]">
                Your workflow audit has been received.
              </p>
              <p className="mb-0 mt-2 text-sm leading-6 text-black/72">
                The submission status is now set to submitted. The next stage is report processing.
              </p>
            </div>
          )}

          {hasError && (
            <div className="mb-8 border border-red-400 bg-red-950/45 p-5 text-red-100">
              <p className="m-0 font-bold">The intake could not be saved. Please check the form and try again.</p>
            </div>
          )}

          {notFound && (
            <div className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-6">
              <h2 className="m-0 text-2xl font-black uppercase tracking-[-0.04em] text-white">
                Submission not found
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#e6f6e7]/75">
                This page needs a valid paid workflow submission ID. Return to the dashboard and open the intake from your audit card.
              </p>
              <a
                href="/dashboard"
                className="mt-6 inline-flex min-h-12 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-6 text-center text-[0.72rem] font-black uppercase tracking-[0.16em] text-black transition hover:bg-white"
              >
                Return to dashboard
              </a>
            </div>
          )}

          {context && (
            <form action="/api/intake" method="post" className="grid gap-8">
              <input type="hidden" name="submission_id" value={context.intake.id} />

              {stages.map((stage) => (
                <section
                  key={stage.number}
                  className="grid gap-6 border border-[#9ed39f]/28 bg-[#030804] p-5 sm:p-7 lg:grid-cols-[0.36fr_1fr] lg:p-8"
                >
                  <div>
                    <p className="m-0 text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">
                      Stage {stage.number}
                    </p>
                    <h2 className="mt-4 text-[clamp(1.65rem,3vw,2.8rem)] font-black uppercase leading-[0.95] tracking-[-0.06em] text-white">
                      {stage.title}
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-[#e6f6e7]/66">
                      {stage.description}
                    </p>
                  </div>
                  <div className="grid gap-5">
                    {stage.fields.map((field) => renderField(field, context.intake))}
                  </div>
                </section>
              ))}

              <section className="grid gap-6 border border-[#9ed39f] bg-[#9ed39f] p-5 text-black sm:p-7 lg:grid-cols-[0.55fr_1fr] lg:p-8">
                <div>
                  <p className="m-0 text-[0.72rem] font-black uppercase tracking-[0.18em] text-black/70">
                    Stage 07
                  </p>
                  <h2 className="mt-4 text-[clamp(1.65rem,3vw,2.8rem)] font-black uppercase leading-[0.95] tracking-[-0.06em] text-black">
                    Review and submit
                  </h2>
                </div>
                <div className="grid gap-4 text-sm leading-7 text-black/72">
                  <p className="m-0">
                    <strong className="text-black">Tier purchased:</strong> {context.order?.service_name || context.intake.tier_slug}
                  </p>
                  <p className="m-0">
                    <strong className="text-black">Workflow title:</strong> Entered above and saved into the audit record.
                  </p>
                  <p className="m-0">
                    <strong className="text-black">Delivery expectation:</strong> Report generation begins after the intake is submitted.
                  </p>
                  <button
                    type="submit"
                    className="mt-4 inline-flex min-h-14 items-center justify-center border border-black bg-black px-7 text-center text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition hover:bg-white hover:text-black sm:w-fit"
                  >
                    Submit workflow intake
                  </button>
                </div>
              </section>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
