import type { Metadata } from "next";
import { ClientPortalPage } from "../../../components/ClientPortalPage";
import { accountContent } from "../../../lib/axiom-client-portal";
import { loadClientPortalData } from "../../../lib/axiom-client-portal-data";

export const metadata: Metadata = {
  title: "Account | Axiom Architect Client Portal",
  description:
    "Client account area for business details, contact information, access, and workspace preferences.",
};

export const dynamic = "force-dynamic";

export default async function ClientPortalAccountPage() {
  const liveData = await loadClientPortalData("/client/account");

  return <ClientPortalPage content={accountContent} activePath="/client/account" liveData={liveData} />;
}
