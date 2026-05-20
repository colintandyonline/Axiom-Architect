import type { Metadata } from "next";
import { ClientPortalPage } from "../../../components/ClientPortalPage";
import { deliverablesContent } from "../../../lib/axiom-client-portal";
import { loadClientPortalData } from "../../../lib/axiom-client-portal-data";

export const metadata: Metadata = {
  title: "Deliverables | Axiom Architect Client Portal",
  description:
    "Client deliverables area for architecture blueprints, workflow maps, reports, protocols, and final outputs.",
};

export const dynamic = "force-dynamic";

export default async function ClientPortalDeliverablesPage() {
  const liveData = await loadClientPortalData("/client/deliverables");

  return <ClientPortalPage content={deliverablesContent} activePath="/client/deliverables" liveData={liveData} />;
}
