"use client";

import { useMemo, useRef, useState } from "react";
import {
  getProposalPaymentTerms,
  getProposalPricing,
  jsonListToText,
  proposalStatusOptions,
  proposalTypeOptions,
  serviceRouteOptions,
  type ProposalDraftRecord,
} from "../../../lib/axiom-proposal-drafts";
import { getProposalPreset, proposalPresets, type ProposalPreset } from "../../../lib/axiom-proposal-presets";
import type { ProposalSourceOption } from "../../../lib/axiom-proposal-source-options";

type CustomerOption = {
  id: string;
  email: string | null;
  full_name: string | null;
  business_name: string | null;
};

type ProposalDraftFormProps = {
  proposal?: ProposalDraftRecord | null;
  customers: CustomerOption[];
  sourceOptions: ProposalSourceOption[];
  mode: "create" | "update";
};

const inputClass = "min-h-11 border border-[#9ed39f]/30 bg-black px-3 text-sm font-semibold text-white outline-none placeholder:text-white/30 focus:border-[#9ed39f]";
const textareaClass = "min-h-28 border border-[#9ed39f]/30 bg-black px-3 py-3 text-sm font-semibold leading-7 text-white outline-none placeholder:text-white/30 focus:border-[#9ed39f]";
const labelClass = "grid gap-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]";
const buttonClass = "inline-flex min-h-10 items-center justify-center border border-[#9ed39f]/35 bg-black px-3 text-center text-[0.62rem] font-black uppercase tracking-[0.14em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black";
const primaryButtonClass = "inline-flex min-h-10 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-3 text-center text-[0.62rem] font-black uppercase tracking-[0.14em] text-black transition hover:bg-white";

function customerLabel(customer: CustomerOption) {
  const name = customer.business_name || customer.full_name || customer.email || "Unnamed customer";
  return `${name}${customer.email ? ` (${customer.email})` : ""}`;
}

function sourceKey(source: ProposalSourceOption) {
  return `${source.source_record_type}:${source.source_record_id}`;
}

function sourceLabel(source: ProposalSourceOption) {
  const date = inputDate(source.updated_at || source.created_at);
  return `${source.type_label} - ${source.title}${source.status ? ` - ${source.status.replace(/_/g, " ")}` : ""}${date ? ` - ${date}` : ""}`;
}

function inputDate(value?: string | null) {
  return value ? value.slice(0, 10) : "";
}

function serviceRouteLabel(value: string) {
  return proposalPresets.find((preset) => preset.service_route === value)?.label || value.replace(/-/g, " ");
}

function listText(items: string[]) {
  return items.join("\n");
}

function suggestedDeposit(preset: ProposalPreset) {
  return Math.round(preset.suggested_base_price * 0.5);
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

export function ProposalDraftForm({ proposal, customers, sourceOptions, mode }: ProposalDraftFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const pricing = getProposalPricing(proposal?.pricing_json);
  const paymentTerms = getProposalPaymentTerms(proposal?.payment_terms_json);
  const actionLabel = mode === "create" ? "Create proposal draft" : "Save proposal draft";
  const initialRoute = proposal?.recommended_service_route || "workflow-blueprint";
  const initialCustomerId = proposal?.customer_id || "";
  const initialSourceKey = proposal?.source_record_id && proposal.source_record_type
    ? `${proposal.source_record_type}:${proposal.source_record_id}`
    : "";
  const initialSource = sourceOptions.find((source) => sourceKey(source) === initialSourceKey) || null;
  const [selectedRoute, setSelectedRoute] = useState(initialRoute);
  const [selectedCustomerId, setSelectedCustomerId] = useState(initialCustomerId);
  const [selectedSourceKey, setSelectedSourceKey] = useState(initialSourceKey);
  const selectedPreset = useMemo(() => getProposalPreset(selectedRoute), [selectedRoute]);
  const filteredSourceOptions = useMemo(
    () => sourceOptions.filter((source) => !selectedCustomerId || source.customer_id === selectedCustomerId),
    [selectedCustomerId, sourceOptions],
  );
  const selectedSource = useMemo(
    () => sourceOptions.find((source) => sourceKey(source) === selectedSourceKey) || null,
    [selectedSourceKey, sourceOptions],
  );

  function setFieldValue(name: string, value: string | number) {
    const field = formRef.current?.elements.namedItem(name);

    if (
      field instanceof HTMLInputElement ||
      field instanceof HTMLTextAreaElement ||
      field instanceof HTMLSelectElement
    ) {
      field.value = String(value);
    }
  }

  function fieldHasValue(name: string) {
    const field = formRef.current?.elements.namedItem(name);

    if (
      field instanceof HTMLInputElement ||
      field instanceof HTMLTextAreaElement ||
      field instanceof HTMLSelectElement
    ) {
      return field.value.trim().length > 0 && field.value.trim() !== "0";
    }

    return false;
  }

  function fieldValue(name: string) {
    const field = formRef.current?.elements.namedItem(name);

    if (
      field instanceof HTMLInputElement ||
      field instanceof HTMLTextAreaElement ||
      field instanceof HTMLSelectElement
    ) {
      return field.value.trim();
    }

    return "";
  }

  function setSourceFields(source: ProposalSourceOption | null) {
    setFieldValue("source_record_id", source?.source_record_id || "");
    setFieldValue("source_record_type", source?.source_record_type || "");
    setFieldValue("source_record_title", source?.title || "");
    setFieldValue("source_record_summary", source?.source_context || "");
  }

  function handleCustomerChange(customerId: string) {
    setSelectedCustomerId(customerId);
    const customer = customers.find((item) => item.id === customerId);

    if (!customer) {
      setSelectedSourceKey("");
      setSourceFields(null);
      return;
    }

    const targetFields = [
      ["client_name", customer.full_name || ""],
      ["business_name", customer.business_name || ""],
      ["client_email", customer.email || ""],
    ].filter(([, value]) => value);
    const wouldOverwrite = targetFields.some(([name, value]) => fieldHasValue(name) && fieldValue(name) !== value);

    if (
      wouldOverwrite &&
      !window.confirm("Prefill this customer's identity details? This will overwrite the current name, business, or email fields.")
    ) {
      return;
    }

    targetFields.forEach(([name, value]) => setFieldValue(name, value));

    if (selectedSource && selectedSource.customer_id !== customerId) {
      setSelectedSourceKey("");
      setSourceFields(null);
    }
  }

  function importSourceDetails() {
    if (!selectedSource) {
      return;
    }

    const targetFields = [
      ["workspace_name", selectedSource.workspace_name],
      ["client_summary", selectedSource.client_summary],
      ["current_problem_summary", selectedSource.current_problem_summary],
      ["desired_outcome", selectedSource.desired_outcome],
      ["scope_summary", selectedSource.scope_summary],
      ["assumptions", listText(selectedSource.assumptions)],
      ["client_responsibilities", listText(selectedSource.client_responsibilities)],
    ].filter(([, value]) => String(value).trim());
    const hasExistingContent = targetFields.some(([name]) => fieldHasValue(name));

    if (
      hasExistingContent &&
      !window.confirm("Import this client request? This will overwrite matching client-facing proposal fields, but not pricing presets or internal notes.")
    ) {
      return;
    }

    targetFields.forEach(([name, value]) => setFieldValue(name, value));
    setSourceFields(selectedSource);
  }

  function applyPreset() {
    if (!selectedPreset) {
      return;
    }

    const fieldsToOverwrite = [
      "scope_summary",
      "included_work",
      "deliverables",
      "timeline",
      "exclusions",
      "client_responsibilities",
      "assumptions",
      "base_service_price",
      "complexity_level",
      "complexity_multiplier",
      "risk_level",
      "delivery_depth",
      "discount_amount",
      "deposit_required",
      "final_total",
      "add_ons_text",
      "payment_schedule",
      "client_price_explanation",
    ];
    const hasExistingContent = fieldsToOverwrite.some(fieldHasValue);

    if (
      hasExistingContent &&
      !window.confirm("Apply the selected preset? This will overwrite existing scope and pricing fields, but not internal notes.")
    ) {
      return;
    }

    setFieldValue("base_service_price", selectedPreset.suggested_base_price);
    setFieldValue("complexity_level", selectedPreset.default_complexity_level);
    setFieldValue("complexity_multiplier", selectedPreset.default_complexity_multiplier);
    setFieldValue("risk_level", selectedPreset.default_risk_level);
    setFieldValue("delivery_depth", selectedPreset.default_delivery_depth);
    setFieldValue("discount_amount", 0);
    setFieldValue("deposit_required", suggestedDeposit(selectedPreset));
    setFieldValue("final_total", selectedPreset.suggested_base_price);
    setFieldValue("scope_summary", selectedPreset.scope_summary);
    setFieldValue("included_work", listText(selectedPreset.included_work));
    setFieldValue("deliverables", listText(selectedPreset.deliverables));
    setFieldValue("timeline", listText(selectedPreset.timeline));
    setFieldValue("exclusions", listText(selectedPreset.exclusions));
    setFieldValue("client_responsibilities", listText(selectedPreset.client_responsibilities));
    setFieldValue("assumptions", listText(selectedPreset.assumptions));
    setFieldValue("payment_schedule", selectedPreset.payment_terms);
    setFieldValue("client_price_explanation", selectedPreset.client_price_explanation);
    setFieldValue("add_ons_text", listText(selectedPreset.optional_add_ons));
  }

  return (
    <form ref={formRef} action="/api/admin/proposals/draft" method="post" className="grid gap-8">
      <input type="hidden" name="action" value={mode} />
      <input type="hidden" name="return_to" value={proposal ? `/admin/proposals/${proposal.id}` : "/admin/proposals/new"} />
      {proposal ? <input type="hidden" name="proposal_id" value={proposal.id} /> : null}
      {proposal?.proposal_reference ? <input type="hidden" name="proposal_reference" value={proposal.proposal_reference} /> : null}
      <input type="hidden" name="source_record_id" defaultValue={proposal?.source_record_id || ""} />
      <input type="hidden" name="source_record_type" defaultValue={proposal?.source_record_type || ""} />
      <input type="hidden" name="source_record_title" defaultValue={initialSource?.title || ""} />
      <input type="hidden" name="source_record_summary" defaultValue={initialSource?.source_context || ""} />

      <section className="grid gap-4 border border-[#9ed39f]/18 bg-black/34 p-5">
        <div>
          <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9ed39f]">Client and route</p>
          <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.05em] text-white">Proposal identity</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FieldLabel label="Linked customer">
            <select
              name="customer_id"
              defaultValue={initialCustomerId}
              className={inputClass}
              onChange={(event) => handleCustomerChange(event.currentTarget.value)}
            >
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
            <select
              name="recommended_service_route"
              defaultValue={initialRoute}
              className={inputClass}
              onChange={(event) => setSelectedRoute(event.currentTarget.value)}
            >
              {serviceRouteOptions.map((option) => (
                <option key={option} value={option}>{serviceRouteLabel(option)}</option>
              ))}
            </select>
          </FieldLabel>
          <FieldLabel label="Alternative service route">
            <select name="alternative_service_route" defaultValue={proposal?.alternative_service_route || ""} className={inputClass}>
              <option value="">No alternative route</option>
              {serviceRouteOptions.map((option) => (
                <option key={option} value={option}>{serviceRouteLabel(option)}</option>
              ))}
            </select>
          </FieldLabel>
          <FieldLabel label="Valid until">
            <input name="valid_until" type="date" defaultValue={inputDate(proposal?.valid_until)} className={inputClass} />
          </FieldLabel>
        </div>
        {selectedCustomerId ? (
          <div className="grid gap-4 border border-[#9ed39f]/20 bg-black/30 p-4">
            <div className="grid gap-2">
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Client source data</p>
              <p className="text-sm leading-7 text-white/62">
                Choose a proposal request or workflow intake from this customer, then import the client-submitted details before applying an Axiom pricing preset.
              </p>
            </div>
            {filteredSourceOptions.length > 0 ? (
              <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                <FieldLabel label="Available request / intake">
                  <select
                    value={selectedSourceKey}
                    className={inputClass}
                    onChange={(event) => setSelectedSourceKey(event.currentTarget.value)}
                  >
                    <option value="">Select source record</option>
                    {filteredSourceOptions.map((source) => (
                      <option key={sourceKey(source)} value={sourceKey(source)}>
                        {sourceLabel(source)}
                      </option>
                    ))}
                  </select>
                </FieldLabel>
                <button type="button" onClick={importSourceDetails} disabled={!selectedSource} className={`${primaryButtonClass} disabled:cursor-not-allowed disabled:border-white/15 disabled:bg-black disabled:text-white/30`}>
                  Import client request details
                </button>
              </div>
            ) : (
              <p className="border border-[#9ed39f]/16 bg-black/36 p-4 text-sm leading-7 text-white/58">
                No proposal requests or workflow intakes were found for this customer.
              </p>
            )}
            {selectedSource ? (
              <div className="border border-[#9ed39f]/16 bg-[#030804] p-4 text-sm leading-7 text-white/66">
                <p><strong className="text-[#9ed39f]">Selected:</strong> {selectedSource.title}</p>
                <p><strong className="text-[#9ed39f]">Type:</strong> {selectedSource.type_label}</p>
                <p><strong className="text-[#9ed39f]">Status:</strong> {selectedSource.status || "Not set"}</p>
                {selectedSource.source_context ? <p className="mt-2 whitespace-pre-wrap">{selectedSource.source_context}</p> : null}
              </div>
            ) : null}
          </div>
        ) : null}
        {selectedPreset ? (
          <div className="border border-[#9ed39f]/22 bg-[#9ed39f]/10 p-4">
            <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Suggested preset</p>
            <h3 className="mt-2 text-xl font-black uppercase tracking-[-0.04em] text-white">{selectedPreset.label}</h3>
            <p className="mt-2 text-sm leading-7 text-white/68">
              Suggested range: {new Intl.NumberFormat("en-GB", { style: "currency", currency: selectedPreset.currency, maximumFractionDigits: 0 }).format(selectedPreset.suggested_min_price)} - {new Intl.NumberFormat("en-GB", { style: "currency", currency: selectedPreset.currency, maximumFractionDigits: 0 }).format(selectedPreset.suggested_max_price)}.
              Suggested base: {new Intl.NumberFormat("en-GB", { style: "currency", currency: selectedPreset.currency, maximumFractionDigits: 0 }).format(selectedPreset.suggested_base_price)}.
            </p>
            <button type="button" onClick={applyPreset} className={`${primaryButtonClass} mt-4`}>
              Apply suggested scope and pricing
            </button>
          </div>
        ) : (
          <div className="border border-[#9ed39f]/18 bg-black/30 p-4 text-sm leading-7 text-white/62">
            No preset is available for this route yet. Admin can still complete the proposal manually.
          </div>
        )}
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
        <div className="border border-[#9ed39f]/20 bg-black/30 p-4 text-sm leading-7 text-white/68">
          <strong className="text-[#9ed39f]">Guidance only.</strong>{" "}
          {selectedPreset
            ? `Suggested range ${new Intl.NumberFormat("en-GB", { style: "currency", currency: selectedPreset.currency, maximumFractionDigits: 0 }).format(selectedPreset.suggested_min_price)} - ${new Intl.NumberFormat("en-GB", { style: "currency", currency: selectedPreset.currency, maximumFractionDigits: 0 }).format(selectedPreset.suggested_max_price)}; suggested base ${new Intl.NumberFormat("en-GB", { style: "currency", currency: selectedPreset.currency, maximumFractionDigits: 0 }).format(selectedPreset.suggested_base_price)}.`
            : "No preset guidance available for this route."}{" "}
          Final proposal price is admin controlled.
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
