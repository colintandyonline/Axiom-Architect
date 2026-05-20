import type { Metadata } from "next";
import { ClientPortalPage } from "../../../components/ClientPortalPage";
import { billingContent } from "../../../lib/axiom-client-portal";

export const metadata: Metadata = {
  title: "Billing | Axiom Architect Client Portal",
  description:
    "Client billing area for active services, invoices, receipts, payment history, and account records.",
};

export const dynamic = "force-dynamic";

export default function ClientPortalBillingPage() {
  return <ClientPortalPage content={billingContent} activePath="/client/billing" />;
}
