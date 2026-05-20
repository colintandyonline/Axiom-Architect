import type { Metadata } from "next";
import { ClientPortalPage } from "../../../components/ClientPortalPage";
import { operationsContent } from "../../../lib/axiom-client-portal";
import { loadClientPortalData } from "../../../lib/axiom-client-portal-data";

export const metadata: Metadata = {
  title: "Operations | Axiom Architect Client Portal",
  description:
    "Client operations workspace for project phases, review gates, workflow priorities, and decisions.",
};

export const dynamic = "force-dynamic";

export default async function ClientPortalOperationsPage() {
  const liveData = await loadClientPortalData("/client/operations");

  return <ClientPortalPage content={operationsContent} activePath="/client/operations" liveData={liveData} />;
}
