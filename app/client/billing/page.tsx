import type { Metadata } from "next";
import { ClientPortalPage } from "../../../components/ClientPortalPage";
import { billingContent } from "../../../lib/axiom-client-portal";
import { loadClientPortalData } from "../../../lib/axiom-client-portal-data";

export const metadata: Metadata = {
  title: "Billing | Axiom Architect Client Portal",
  description:
    "Client billing area for active services, invoices, receipts, payment history, and account records.",
};

export const dynamic = "force-dynamic";

export default async function ClientPortalBillingPage() {
  const liveData = await loadClientPortalData("/client/billing");

  return <ClientPortalPage content={billingContent} activePath="/client/billing" liveData={liveData} />;
}
