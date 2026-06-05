import Stripe from "stripe";
import type { ProposalDraftRecord } from "./axiom-proposal-drafts";
import { getProposalPaymentTerms, getProposalPricing } from "./axiom-proposal-drafts";
import { getStripeServerClient } from "./axiom-stripe-proposal-sync.server";

type ProposalInvoiceStage = "deposit" | "final";

type ProposalInvoiceResult = {
  stripe_customer_id: string;
  stripe_invoice_id: string;
  hosted_invoice_url: string;
  invoice_pdf: string | null;
};

function proposalTitle(proposal: ProposalDraftRecord) {
  return proposal.business_name || proposal.workspace_name || proposal.proposal_reference || "Axiom Architect proposal";
}

function stageLabel(stage: ProposalInvoiceStage) {
  return stage === "deposit" ? "Deposit" : "Final balance";
}

function centsFromDollars(value: unknown) {
  const amount = typeof value === "number" ? value : Number(value || 0);
  return Math.round(amount * 100);
}

function formatInvoiceMoney(value: unknown) {
  const amount = typeof value === "number" ? value : Number(value || 0);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function percentageOfTotal(amount: number, total: number) {
  if (!total || total <= 0) {
    return null;
  }

  return Math.round((amount / total) * 100);
}

function getProposalAmount(proposal: ProposalDraftRecord, stage: ProposalInvoiceStage) {
  const pricing = getProposalPricing(proposal.pricing_json);
  return stage === "deposit" ? pricing.deposit_required : pricing.balance_amount;
}

function invoiceDescription(proposal: ProposalDraftRecord, stage: ProposalInvoiceStage) {
  const pricing = getProposalPricing(proposal.pricing_json);
  const total = formatInvoiceMoney(pricing.final_total);
  const deposit = formatInvoiceMoney(pricing.deposit_required);
  const balance = formatInvoiceMoney(pricing.balance_amount);
  const depositPercentage = percentageOfTotal(pricing.deposit_required, pricing.final_total);
  const balancePercentage = percentageOfTotal(pricing.balance_amount, pricing.final_total);

  if (stage === "deposit") {
    return `Deposit payment - ${depositPercentage ? `${depositPercentage}% of ` : ""}${total} proposal total. Remaining balance: ${balance}.`;
  }

  return `Final balance - remaining ${balancePercentage ? `${balancePercentage}% of ` : ""}${total} proposal total. Deposit already paid: ${deposit}.`;
}

function invoiceFooter(proposal: ProposalDraftRecord, stage: ProposalInvoiceStage) {
  const pricing = getProposalPricing(proposal.pricing_json);
  const paymentTerms = getProposalPaymentTerms(proposal.payment_terms_json);
  const total = formatInvoiceMoney(pricing.final_total);
  const deposit = formatInvoiceMoney(pricing.deposit_required);
  const balance = formatInvoiceMoney(pricing.balance_amount);
  const stageNote = stage === "deposit"
    ? `This invoice charges the deposit only. Full proposal total: ${total}. Deposit: ${deposit}. Remaining balance: ${balance}.`
    : `This invoice charges the final balance only. Full proposal total: ${total}. Deposit already paid: ${deposit}. Final balance: ${balance}.`;
  const paymentInstructions = paymentTerms.payment_instructions?.trim();

  return paymentInstructions ? `${stageNote}\n\n${paymentInstructions}` : stageNote;
}

function invoiceCustomFields(proposal: ProposalDraftRecord, stage: ProposalInvoiceStage): Stripe.InvoiceCreateParams.CustomField[] {
  const pricing = getProposalPricing(proposal.pricing_json);

  return [
    {
      name: "Proposal",
      value: proposal.proposal_reference || proposal.id,
    },
    {
      name: "Full total",
      value: formatInvoiceMoney(pricing.final_total),
    },
    {
      name: stage === "deposit" ? "Deposit due" : "Deposit paid",
      value: formatInvoiceMoney(pricing.deposit_required),
    },
    {
      name: "Final balance",
      value: formatInvoiceMoney(pricing.balance_amount),
    },
  ];
}

function proposalMetadata(proposal: ProposalDraftRecord, stage: ProposalInvoiceStage) {
  return {
    axiom_proposal_id: proposal.id,
    axiom_payment_stage: stage,
    axiom_customer_id: proposal.customer_id || "",
    axiom_proposal_reference: proposal.proposal_reference || "",
  };
}

async function findOrCreateStripeCustomer(stripe: Stripe, proposal: ProposalDraftRecord) {
  if (proposal.stripe_customer_id) {
    return proposal.stripe_customer_id;
  }

  const email = proposal.client_email?.trim();

  if (!email) {
    throw new Error("Add a client email before creating a Stripe invoice.");
  }

  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  });

  if (existingCustomers.data[0]?.id) {
    return existingCustomers.data[0].id;
  }

  const customer = await stripe.customers.create({
    email,
    name: proposal.client_name || proposal.business_name || undefined,
    metadata: {
      axiom_customer_id: proposal.customer_id || "",
      axiom_proposal_id: proposal.id,
    },
  });

  return customer.id;
}

function getHostedInvoiceUrl(invoice: Stripe.Invoice) {
  const hostedInvoiceUrl = invoice.hosted_invoice_url;

  if (!hostedInvoiceUrl) {
    throw new Error("Stripe did not return a hosted invoice URL.");
  }

  return hostedInvoiceUrl;
}

function assertInvoiceHasExpectedTotal(invoice: Stripe.Invoice, expectedAmountInCents: number) {
  const total = invoice.total || 0;
  const amountDue = invoice.amount_due || 0;

  if (total < expectedAmountInCents || amountDue < expectedAmountInCents) {
    throw new Error("Stripe invoice amount was lower than the proposal payment amount. Invoice was not sent.");
  }
}

export async function createStripeProposalInvoice(
  proposal: ProposalDraftRecord,
  stage: ProposalInvoiceStage,
): Promise<ProposalInvoiceResult> {
  const amount = getProposalAmount(proposal, stage);
  const amountInCents = centsFromDollars(amount);

  if (amountInCents <= 0) {
    throw new Error(`Cannot create a ${stageLabel(stage).toLowerCase()} invoice because the amount is zero.`);
  }

  const stripe = getStripeServerClient();
  const stripeCustomerId = await findOrCreateStripeCustomer(stripe, proposal);
  const metadata = proposalMetadata(proposal, stage);
  const description = invoiceDescription(proposal, stage);
  const fullDescription = `${proposalTitle(proposal)} - ${description}`;

  const invoice = await stripe.invoices.create({
    customer: stripeCustomerId,
    currency: "usd",
    collection_method: "send_invoice",
    days_until_due: 7,
    auto_advance: false,
    description: fullDescription,
    metadata,
    custom_fields: invoiceCustomFields(proposal, stage),
    footer: invoiceFooter(proposal, stage),
  });

  await stripe.invoiceItems.create({
    customer: stripeCustomerId,
    invoice: invoice.id,
    amount: amountInCents,
    currency: "usd",
    description: fullDescription,
    metadata,
  });

  const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);

  assertInvoiceHasExpectedTotal(finalizedInvoice, amountInCents);

  const sentInvoice = finalizedInvoice.status === "open"
    ? await stripe.invoices.sendInvoice(finalizedInvoice.id)
    : finalizedInvoice;

  return {
    stripe_customer_id: stripeCustomerId,
    stripe_invoice_id: sentInvoice.id,
    hosted_invoice_url: getHostedInvoiceUrl(sentInvoice),
    invoice_pdf: sentInvoice.invoice_pdf || null,
  };
}
