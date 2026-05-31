import {
  getProposalPaymentTerms,
  getProposalPricing,
  jsonListToText,
  proposalStatusOptions,
  proposalTypeOptions,
  serviceRouteOptions,
  type ProposalDraftRecord,
} from "../../../lib/axiom-proposal-drafts";
import { buttonClass, primaryButtonClass } from "../../../components/admin/AdminShell";

type CustomerOption = {
  id: string;
  email: string | null;
  full_name: string | null;
  business_name: string | null;
};

type ProposalDraftFormProps = {
  proposal?: ProposalDraftRecord | null;
  customers: CustomerOption[];
  mode: "create" | "update";
};

const inputClass = "min-h-11 border border-[#9ed39f]/30 bg-black px-3 text-sm font-semibold text-white outline-none placeholder:text-white/30 focus:border-[#9ed39f]";
const textareaClass = "min-h-28 border border-[#9ed39f]/30 bg-black px-3 py-3 text-sm font-semibold leading-7 text-white outline-none placeholder:text-white/30 focus:border-[#9ed39f]";
const labelClass = "grid gap-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]";

function customerLabel(customer: CustomerOption) {
  const name = customer.business_name || customer.full_name || customer.email || "Unnamed customer";
  return `${name}${customer.email ? ` (${customer.email})` : ""}`;
}

function inputDate(value?: string | null) {
  return value ? value.slice(0, 10) : "";
}

function FieldLabel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className={labelClass}>
      {label}
      {children}
    </label>
  );
}

function TextAreaField({
  name,
  label,
  value,
  placeholder,
  rows = 4,
}: {
  name: string;
  label: string;
  value?: string | null;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <FieldLabel label={label}>
      <textarea
        name={name}
        rows={rows}
        defaultValue={value || ""}
        placeholder={placeholder}
        className={textareaClass}
      />
    </FieldLabel>
  );
}

function ListField({
  name,
  label,
  value,
  placeholder,
}: {
  name: string;
  label: string;
  value: unknown;
  placeholder?: string;
}) {
  return (
    <TextAreaField
      name={name}
      label={label}
      value={jsonListToText(value)}
      rows={5}
      placeholder={placeholder || "Add one item per line."}
    />
  );
}

export function ProposalDraftForm({ proposal, customers, mode }: ProposalDraftFormProps) {
  const pricing = getProposalPricing(proposal?.pricing_json);
  const paymentTerms = getProposalPaymentTerms(proposal?.payment_terms_json);
  const actionLabel = mode === "create" ? "Create proposal draft" : "Save proposal draft";

  return (
    <form action="/api/admin/proposals/draft" method="post" className="grid gap-8">
      <input type="hidden" name="action" value={mode} />
      <input type="hidden" name="return_to" value={proposal ? `/admin/proposals/${proposal.id}` : "/admin/proposals/new"} />
      {proposal ? <input type="hidden" name="proposal_id" value={proposal.id} /> : null}
      {proposal?.proposal_reference ? <input type="hidden" name="proposal_reference" value={proposal.proposal_reference} /> : null}

      <section className="grid gap-4 border border-[#9ed39f]/18 bg-black/34 p-5">
        <div>
          <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">Client and route</p>
          <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.05em] text-white">Proposal identity</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FieldLabel label="Linked customer">
            <select name="customer_id" defaultValue={proposal?.customer_id || ""} className={inputClass}>
              <option value="">No linked customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customerLabel(customer)}
                </option>
              ))}
            </select>
          </FieldLabel>
          <FieldLabel label="Proposal workspace name">
            <input name="workspace_name" defaultValue={proposal?.workspace_name || ""} placeholder="Business workflow proposal" className={inputClass} />
          </FieldLabel>
          <FieldLabel label="Client name">
            <input name="client_name" defaultValue={proposal?.client_name || ""} className={inputClass} />
          </FieldLabel>
          <FieldLabel label="Business name">
            <input name="business_name" defaultValue={proposal?.business_name || ""} className={inputClass} />
          </FieldLabel>
          <FieldLabel label="Client email">
            <input name="client_email" type="email" defaultValue={proposal?.client_email || ""} className={inputClass} />
          </FieldLabel>
          <FieldLabel label="Proposal type">
            <select name="proposal_type" defaultValue={proposal?.proposal_type || "standard"} className={inputClass}>
              {proposalTypeOptions.map((option) => (
                <option key={option} value={option}>{option.replace(/_/g, " ")}</option>
              ))}
            </select>
          </FieldLabel>
          <FieldLabel label="Status">
            <select name="status" defaultValue={proposal?.status || "draft"} className={inputClass}>
              {proposalStatusOptions.map((option) => (
                <option key={option} value={option}>{option.replace(/_/g, " ")}</option>
              ))}
            </select>
          </FieldLabel>
          <FieldLabel label="Recommended service route">
            <select name="recommended_service_route" defaultValue={proposal?.recommended_service_route || "workflow-blueprint"} className={inputClass}>
              {serviceRouteOptions.map((option) => (
                <option key={option} value={option}>{option.replace(/-/g, " ")}</option>
              ))}
            </select>
          </FieldLabel>
          <FieldLabel label="Alternative service route">
            <select name="alternative_service_route" defaultValue={proposal?.alternative_service_route || ""} className={inputClass}>
              <option value="">No alternative route</option>
              {serviceRouteOptions.map((option) => (
                <option key={option} value={option}>{option.replace(/-/g, " ")}</option>
              ))}
            </select>
          </FieldLabel>
          <FieldLabel label="Valid until">
            <input name="valid_until" type="date" defaultValue={inputDate(proposal?.valid_until)} className={inputClass} />
          </FieldLabel>
        </div>
      </section>

      <section className="grid gap-4 border border-[#9ed39f]/18 bg-black/34 p-5">
        <div>
          <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">Scope</p>
          <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.05em] text-white">Client-facing proposal content</h2>
        </div>
        <TextAreaField name="client_summary" label="Client summary" value={proposal?.client_summary} />
        <TextAreaField name="current_problem_summary" label="Current problem summary" value={proposal?.current_problem_summary} />
        <TextAreaField name="desired_outcome" label="Desired outcome" value={proposal?.desired_outcome} />
        <TextAreaField name="scope_summary" label="Scope summary" value={proposal?.scope_summary} />
        <div className="grid gap-4 lg:grid-cols-2">
          <ListField name="included_work" label="Included work" value={proposal?.included_work_json} />
          <ListField name="deliverables" label="Deliverables" value={proposal?.deliverables_json} />
          <ListField name="timeline" label="Timeline" value={proposal?.timeline_json} />
          <ListField name="exclusions" label="Exclusions" value={proposal?.exclusions_json} />
          <ListField name="client_responsibilities" label="Client responsibilities" value={proposal?.client_responsibilities_json} />
          <ListField name="assumptions" label="Assumptions" value={proposal?.assumptions_json} />
        </div>
      </section>

      <section className="grid gap-4 border border-[#9ed39f]/18 bg-black/34 p-5">
        <div>
          <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">Pricing</p>
          <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.05em] text-white">Manual pricing controls</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FieldLabel label="Base service price">
            <input name="base_service_price" type="number" step="1" defaultValue={pricing.base_service_price} className={inputClass} />
          </FieldLabel>
          <FieldLabel label="Complexity level">
            <input name="complexity_level" defaultValue={pricing.complexity_level} className={inputClass} />
          </FieldLabel>
          <FieldLabel label="Complexity multiplier">
            <input name="complexity_multiplier" type="number" step="0.01" defaultValue={pricing.complexity_multiplier} className={inputClass} />
          </FieldLabel>
          <FieldLabel label="Risk level">
            <input name="risk_level" defaultValue={pricing.risk_level} className={inputClass} />
          </FieldLabel>
          <FieldLabel label="Delivery depth">
            <input name="delivery_depth" defaultValue={pricing.delivery_depth} className={inputClass} />
          </FieldLabel>
          <FieldLabel label="Discount amount">
            <input name="discount_amount" type="number" step="1" defaultValue={pricing.discount_amount} className={inputClass} />
          </FieldLabel>
          <FieldLabel label="Deposit required">
            <input name="deposit_required" type="number" step="1" defaultValue={pricing.deposit_required} className={inputClass} />
          </FieldLabel>
          <FieldLabel label="Final total">
            <input name="final_total" type="number" step="1" defaultValue={pricing.final_total} className={inputClass} />
          </FieldLabel>
        </div>
        <TextAreaField name="add_ons_text" label="Add-ons as text / JSON for now" value={pricing.add_ons_text} />
        <TextAreaField name="payment_schedule" label="Payment schedule" value={paymentTerms.payment_schedule} />
        <TextAreaField name="client_price_explanation" label="Client-facing price explanation" value={proposal?.client_price_explanation} />
      </section>

      <section className="grid gap-4 border border-[#9ed39f]/18 bg-black/34 p-5">
        <div>
          <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">Internal only</p>
          <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.05em] text-white">Admin notes and risk controls</h2>
        </div>
        <TextAreaField name="internal_pricing_notes" label="Internal pricing notes" value={proposal?.internal_pricing_notes} />
        <TextAreaField name="internal_risk_notes" label="Internal risk notes" value={proposal?.internal_risk_notes} />
        <TextAreaField name="revision_notes" label="Revision notes" value={proposal?.revision_notes} />
      </section>

      <div className="flex flex-wrap gap-3">
        <button type="submit" className={primaryButtonClass}>{actionLabel}</button>
        <a href="/admin/proposals" className={buttonClass}>Back to proposals</a>
      </div>
    </form>
  );
}
