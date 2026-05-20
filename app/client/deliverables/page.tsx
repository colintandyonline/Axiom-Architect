import type { Metadata } from "next";
import { ClientPortalPage } from "../../../components/ClientPortalPage";
import { deliverablesContent } from "../../../lib/axiom-client-portal";

export const metadata: Metadata = {
  title: "Deliverables | Axiom Architect Client Portal",
  description:
    "Client deliverables area for architecture blueprints, workflow maps, reports, protocols, and final outputs.",
};

export const dynamic = "force-dynamic";

export default function ClientPortalDeliverablesPage() {
  return <ClientPortalPage content={deliverablesContent} activePath="/client/deliverables" />;
}
