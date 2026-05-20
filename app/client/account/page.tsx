import type { Metadata } from "next";
import { ClientPortalPage } from "../../../components/ClientPortalPage";
import { accountContent } from "../../../lib/axiom-client-portal";

export const metadata: Metadata = {
  title: "Account | Axiom Architect Client Portal",
  description:
    "Client account area for business details, contact information, access, and workspace preferences.",
};

export const dynamic = "force-dynamic";

export default function ClientPortalAccountPage() {
  return <ClientPortalPage content={accountContent} activePath="/client/account" />;
}
