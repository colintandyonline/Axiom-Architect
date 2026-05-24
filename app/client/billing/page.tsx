import type { Metadata } from "next";
import Link from "next/link";
import { loadClientPortalData } from "../../../lib/axiom-client-portal-data";

export const metadata: Metadata = {
  title: "Billing | Axiom Architect Client Portal",
  description: "Client billing dashboard for package orders, invoices, payments, receipts, and proposal status.",
};

export const dynamic = "force-dynamic";

function label(value: string | null | undefined) {
  return value ? value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) : "Not set";
}

function date(value: string | null | undefined) {
  if (!value) return "Not recorded";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function money(amount: number | null | undefined, currency: string | null | undefined) {
  if (amount === null || amount === undefined) return "Not set";
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: currency || "GBP" }).format(amount / 100);
}

export default async function ClientPortalBillingPage() {
  const data = await loadClientPortalData("/client/billing");
  const invoices = data.invoices;
  const request = data.serviceRequest;
  const workspace = data.workspace;
  const isPackageWorkspace = Boolean(workspace?.order_id);
  const latest = invoices[0];
  const open = invoices.filter((invoice) => ["sent", "open"].includes(invoice.status));
  const paid = invoices.filter((invoice) => invoice.status === "paid");
  const overdue = invoices.filter((invoice) => invoice.due_at && invoice.status !== "paid" && new Date(invoice.due_at).getTime() < Date.now());
  const pageCopy = isPackageWorkspace
    ? {
        title: "Orders.",
        intro: "Package payment status, receipts, invoice history, and order context.",
        latestLabel: "Latest billing item",
        emptyLatest: "No extra payment is due right now.",
        listEyebrow: "Billing history",
        listTitle: invoices.length ? "Order history." : "No extra invoices yet.",
        emptyTitle: "No extra invoices.",
        emptyText: "Your package order is recorded. Any extra invoices or receipts will appear here when available.",
        contextEyebrow: "Package",
        contextTitle: "Current package.",
        statusLabel: "Workspace",
        statusValue: workspace ? label(workspace.status) : "No package workspace yet",
        secondaryLabel: "Order",
        secondaryValue: workspace?.order_id ? "Linked to your package order" : "No linked order recorded",
      }
    : {
        title: "Invoices.",
        intro: "Payment status, invoice history, and current proposal state.",
        latestLabel: "Latest invoice",
        emptyLatest: "No invoice is due right now.",
        listEyebrow: "Invoice list",
        listTitle: invoices.length ? "Billing history." : "No invoices yet.",
        emptyTitle: "No invoices.",
        emptyText: "There is no payment due at the moment.",
        contextEyebrow: "Proposal",
        contextTitle: "Current request.",
        statusLabel: "Status",
        statusValue: request ? label(request.status) : "No active proposal",
        secondaryLabel: "Proposal",
        secondaryValue: request ? label(request.proposal_status) : "Not prepared",
      };

  const stats = [
    [isPackageWorkspace ? "Billing items" : "Invoices", String(invoices.length), "Attached"],
    ["Open", String(open.length), "Awaiting action"],
    ["Paid", String(paid.length), "Complete"],
    ["Overdue", String(overdue.length), "Past due"],
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden border-b border-[#9ed39f]/20 bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.16),#031007_34%,#000_78%)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.1)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="relative mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[0.9fr_0.48fr] lg:items-end">
          <div>
            <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">Billing</p>
            <h1 className="mt-6 text-[clamp(2.8rem,5.6vw,5.8rem)] font-black uppercase leading-[0.88] tracking-[-0.08em] text-white">{pageCopy.title}</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[#e6f6e7]/74 sm:text-lg">{pageCopy.intro}</p>
          </div>
          <aside className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5">
            <div className="mb-5 flex h-10 w-10 items-center justify-center border border-[#9ed39f] text-[#9ed39f]">£</div>
            <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">{pageCopy.latestLabel}</p>
            <p className="mt-3 text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-white">{latest?.invoice_number || latest?.title || "None yet"}</p>
            <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72">{latest ? `${label(latest.status)} · ${money(latest.amount_due, latest.currency)}` : pageCopy.emptyLatest}</p>
          </aside>
        </div>
      </section>

      <section className="bg-[#020904] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(([name, value, text]) => (
            <article key={name} className="border border-[#9ed39f]/30 bg-black p-5">
              <span className="mb-5 flex h-9 w-9 items-center justify-center border border-[#9ed39f]/60 text-[#9ed39f]">▣</span>
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">{name}</p>
              <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.05em] text-white">{value}</h2>
              <p className="mt-4 text-sm leading-6 text-[#e6f6e7]/72">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-black px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-5 border-b border-[#9ed39f]/20 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">{pageCopy.listEyebrow}</p>
              <h2 className="mt-5 text-[clamp(2rem,4vw,4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">{pageCopy.listTitle}</h2>
            </div>
            <Link href="/client/deliverables" className="inline-flex min-h-12 items-center justify-center border border-[#9ed39f] px-5 text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] transition hover:bg-[#9ed39f] hover:text-black">View deliverables</Link>
          </div>

          <div className="mt-8 grid gap-4">
            {invoices.length ? invoices.map((invoice) => (
              <article key={invoice.id} className="grid gap-4 border border-[#9ed39f]/24 bg-[#030804] p-5 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">{label(invoice.status)} · {money(invoice.amount_due, invoice.currency)}</p>
                  <h3 className="mt-3 text-2xl font-black uppercase tracking-[-0.05em] text-white">{invoice.invoice_number || invoice.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#e6f6e7]/72">{invoice.description || "Billing item for this workspace."}</p>
                </div>
                <div className="text-left text-xs font-bold uppercase tracking-[0.14em] text-[#e6f6e7]/58 lg:text-right">
                  <p>Issued {date(invoice.created_at)}</p>
                  <p className="mt-2">Due {date(invoice.due_at)}</p>
                  {invoice.paid_at && <p className="mt-2">Paid {date(invoice.paid_at)}</p>}
                </div>
              </article>
            )) : <article className="border border-[#9ed39f]/24 bg-[#030804] p-6"><h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white">{pageCopy.emptyTitle}</h3><p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72">{pageCopy.emptyText}</p></article>}
          </div>
        </div>
      </section>

      <section className="bg-[#020904] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[0.42fr_1fr]">
          <div><p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">{pageCopy.contextEyebrow}</p><h2 className="mt-5 text-[clamp(2rem,4vw,4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">{pageCopy.contextTitle}</h2></div>
          <div className="grid gap-3">
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-black p-4 md:grid-cols-[0.28fr_1fr] md:items-center"><p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">{pageCopy.statusLabel}</p><p className="text-sm font-semibold leading-7 text-white md:text-base">{pageCopy.statusValue}</p></div>
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-black p-4 md:grid-cols-[0.28fr_1fr] md:items-center"><p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">{pageCopy.secondaryLabel}</p><p className="text-sm font-semibold leading-7 text-white md:text-base">{pageCopy.secondaryValue}</p></div>
          </div>
        </div>
      </section>
    </main>
  );
}
