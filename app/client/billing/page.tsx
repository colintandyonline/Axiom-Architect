import type { Metadata } from "next";
import Link from "next/link";
import { loadClientPortalData } from "../../../lib/axiom-client-portal-data";

export const metadata: Metadata = {
  title: "Billing | Axiom Architect Client Portal",
  description:
    "Your Axiom Architect billing page for proposal value, invoices, payment status, and service history.",
};

export const dynamic = "force-dynamic";

function formatLabel(value: string | null | undefined, fallback = "Not set") {
  if (!value) {
    return fallback;
  }

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "Not recorded";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatMoney(amount: number | null | undefined, currency: string | null | undefined) {
  if (amount === null || amount === undefined) {
    return "Not set";
  }

  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency || "GBP",
  }).format(amount / 100);
}

export default async function ClientPortalBillingPage() {
  const liveData = await loadClientPortalData("/client/billing");
  const invoices = liveData.invoices;
  const serviceRequest = liveData.serviceRequest;
  const latestInvoice = invoices[0];
  const openInvoices = invoices.filter((invoice) => ["sent", "open"].includes(invoice.status));
  const paidInvoices = invoices.filter((invoice) => invoice.status === "paid");
  const overdueInvoices = invoices.filter((invoice) => {
    if (!invoice.due_at || invoice.status === "paid") {
      return false;
    }

    return new Date(invoice.due_at).getTime() < Date.now();
  });

  const summaryCards = [
    {
      label: "Invoices",
      value: String(invoices.length),
      text: invoices.length === 1 ? "One invoice is attached to this workspace." : "Invoices attached to this workspace.",
    },
    {
      label: "Open",
      value: String(openInvoices.length),
      text: "Invoices currently awaiting payment or review.",
    },
    {
      label: "Paid",
      value: String(paidInvoices.length),
      text: "Invoices marked as paid.",
    },
    {
      label: "Overdue",
      value: String(overdueInvoices.length),
      text: "Invoices past their due date.",
    },
  ];

  const billingSteps = [
    {
      label: "1",
      title: "Review",
      text: "Axiom reviews the request and confirms the right route for the work.",
    },
    {
      label: "2",
      title: "Proposal",
      text: "You receive the scope, timing, outputs, and price before work starts.",
    },
    {
      label: "3",
      title: "Approval",
      text: "You approve the proposed next step before billing begins.",
    },
    {
      label: "4",
      title: "Invoice",
      text: "Any invoice appears here with its amount, due date, and payment status.",
    },
  ];

  return (
    <main className="bg-black text-white">
      <section className="relative overflow-hidden border-b border-[#9ed39f]/20 bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.18),#041008_34%,#000_78%)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto max-w-[1440px]">
          <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
            Billing
          </p>

          <div className="mt-6 grid gap-8 lg:grid-cols-[0.95fr_0.55fr] lg:items-end">
            <div>
              <h1 className="max-w-5xl text-[clamp(3rem,6vw,6.5rem)] font-black uppercase leading-[0.86] tracking-[-0.08em] text-white">
                Pricing and invoices.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[#e6f6e7]/78 sm:text-lg">
                Review proposal value, invoice status, payment history, and service billing details for this workspace.
              </p>
            </div>

            <aside className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5">
              <p className="m-0 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">
                Latest invoice
              </p>
              <p className="mt-4 text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-white">
                {latestInvoice?.invoice_number || latestInvoice?.title || "None yet"}
              </p>
              <p className="mb-0 mt-3 text-sm leading-7 text-[#e6f6e7]/72">
                {latestInvoice
                  ? `${formatLabel(latestInvoice.status)} · ${formatMoney(latestInvoice.amount_due, latestInvoice.currency)}`
                  : "Invoices appear here once pricing is agreed."}
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-[#9ed39f] px-4 py-12 text-black sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-6 lg:grid-cols-[0.42fr_1fr] lg:items-end">
          <div>
            <p className="inline-flex border border-black bg-black px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-[#9ed39f]">
              Payment
            </p>
            <h2 className="mt-5 text-[clamp(2.1rem,4vw,4.4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-black">
              {latestInvoice ? formatLabel(latestInvoice.status) : "No payment due."}
            </h2>
          </div>
          <p className="max-w-4xl text-base leading-8 text-black/76 sm:text-lg">
            {latestInvoice
              ? `Latest amount: ${formatMoney(latestInvoice.amount_due, latestInvoice.currency)}. Due date: ${formatDate(latestInvoice.due_at)}.`
              : "Pricing is confirmed after the request has been reviewed and the next step is agreed."}
          </p>
        </div>
      </section>

      <section className="bg-[#020904] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <article key={card.label} className="rounded-[1.25rem] border border-[#9ed39f]/30 bg-black p-5 shadow-[0_18px_40px_rgba(0,0,0,0.3)]">
              <span className="mb-5 block h-2 w-2 bg-[#9ed39f]" />
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">{card.label}</p>
              <h2 className="mt-3 text-2xl font-black uppercase leading-tight tracking-[-0.05em] text-white">{card.value}</h2>
              <p className="mt-4 text-sm leading-6 text-[#e6f6e7]/72">{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-8 lg:grid-cols-[0.42fr_1fr] lg:items-end">
            <div>
              <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
                Invoice list
              </p>
              <h2 className="mt-5 text-[clamp(2.1rem,4vw,4.4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">
                Billing history.
              </h2>
            </div>
            <p className="max-w-3xl text-base leading-8 text-[#e6f6e7]/75 sm:text-lg">
              Invoices and receipts connected to this workspace appear here when available.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {invoices.length > 0 ? (
              invoices.map((invoice) => (
                <article key={invoice.id} className="border border-[#9ed39f]/24 bg-[#030804] p-5">
                  <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">
                    {formatLabel(invoice.status)} · {formatMoney(invoice.amount_due, invoice.currency)}
                  </p>
                  <h3 className="mt-4 text-2xl font-black uppercase tracking-[-0.05em] text-white">
                    {invoice.invoice_number || invoice.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72">
                    {invoice.description || "Billing item connected to this workspace."}
                  </p>
                  <div className="mt-5 grid gap-2 border-t border-[#9ed39f]/16 pt-4 text-xs font-bold uppercase tracking-[0.14em] text-[#e6f6e7]/58">
                    <span>Issued {formatDate(invoice.created_at)}</span>
                    <span>Due {formatDate(invoice.due_at)}</span>
                    {invoice.paid_at && <span>Paid {formatDate(invoice.paid_at)}</span>}
                  </div>
                  {(invoice.invoice_url || invoice.receipt_url) && (
                    <div className="mt-5 flex flex-wrap gap-3">
                      {invoice.invoice_url && (
                        <a href={invoice.invoice_url} className="border border-[#9ed39f] px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black">
                          View invoice
                        </a>
                      )}
                      {invoice.receipt_url && (
                        <a href={invoice.receipt_url} className="border border-[#9ed39f] px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black">
                          View receipt
                        </a>
                      )}
                    </div>
                  )}
                </article>
              ))
            ) : (
              <article className="border border-[#9ed39f]/24 bg-[#030804] p-5 lg:col-span-3">
                <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white">No invoices yet.</h3>
                <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72">
                  There is no payment due at the moment. Billing will appear here after a proposal is agreed.
                </p>
              </article>
            )}
          </div>
        </div>
      </section>

      <section className="bg-[#020904] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-8 lg:grid-cols-[0.42fr_1fr] lg:items-end">
            <div>
              <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
                Billing flow
              </p>
              <h2 className="mt-5 text-[clamp(2.1rem,4vw,4.4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">
                How payment works.
              </h2>
            </div>
            <p className="max-w-3xl text-base leading-8 text-[#e6f6e7]/75 sm:text-lg">
              Custom work is priced after the scope has been reviewed properly.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {billingSteps.map((step) => (
              <article key={step.title} className="border border-[#9ed39f]/24 bg-black p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">{step.label}</span>
                  <span className="h-2 w-2 bg-[#9ed39f]" />
                </div>
                <h3 className="mt-4 text-2xl font-black uppercase leading-tight tracking-[-0.05em] text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[0.42fr_1fr]">
          <div>
            <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
              Proposal
            </p>
            <h2 className="mt-5 text-[clamp(2.1rem,4vw,4.4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">
              Current request.
            </h2>
          </div>

          <div className="grid gap-3">
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-[#030804] p-4 md:grid-cols-[0.28fr_1fr] md:items-center">
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Status</p>
              <p className="text-sm font-semibold leading-7 text-white md:text-base">{serviceRequest ? formatLabel(serviceRequest.status) : "No active proposal"}</p>
            </div>
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-[#030804] p-4 md:grid-cols-[0.28fr_1fr] md:items-center">
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Proposal</p>
              <p className="text-sm font-semibold leading-7 text-white md:text-base">{serviceRequest ? formatLabel(serviceRequest.proposal_status) : "Not prepared"}</p>
            </div>
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-[#030804] p-4 md:grid-cols-[0.28fr_1fr] md:items-start">
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Summary</p>
              <p className="text-sm font-semibold leading-7 text-white md:text-base">{serviceRequest?.summary_message || "No proposal summary available yet."}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#020904] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-8 lg:grid-cols-[0.42fr_1fr] lg:items-end">
            <div>
              <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
                Next
              </p>
              <h2 className="mt-5 text-[clamp(2.1rem,4vw,4.4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">
                Useful links.
              </h2>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <Link href="/client" className="group border border-[#9ed39f]/24 bg-black p-5 transition hover:border-[#9ed39f] hover:bg-[#9ed39f]">
              <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white group-hover:text-black">Overview</h3>
              <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72 group-hover:text-black/72">Return to the workspace summary.</p>
            </Link>
            <Link href="/client/deliverables" className="group border border-[#9ed39f]/24 bg-black p-5 transition hover:border-[#9ed39f] hover:bg-[#9ed39f]">
              <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white group-hover:text-black">Deliverables</h3>
              <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72 group-hover:text-black/72">Check output status.</p>
            </Link>
            <Link href="/client/account" className="group border border-[#9ed39f]/24 bg-black p-5 transition hover:border-[#9ed39f] hover:bg-[#9ed39f]">
              <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white group-hover:text-black">Account</h3>
              <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72 group-hover:text-black/72">Confirm your details.</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
