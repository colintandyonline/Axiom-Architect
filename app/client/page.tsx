import type { Metadata } from "next";
import { ClientPortalPage } from "../../components/ClientPortalPage";
import { overviewContent } from "../../lib/axiom-client-portal";
import { loadClientPortalData } from "../../lib/axiom-client-portal-data";

export const metadata: Metadata = {
  title: "Client Portal | Axiom Architect",
  description:
    "A private Axiom Architect client portal for engagement overview, operations, documents, deliverables, billing, and account control.",
};

export const dynamic = "force-dynamic";

export default async function ClientPortalOverviewPage() {
  const liveData = await loadClientPortalData("/client");

  return <ClientPortalPage content={overviewContent} activePath="/client" liveData={liveData} />;
}
