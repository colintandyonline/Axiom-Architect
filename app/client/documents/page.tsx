import type { Metadata } from "next";
import { ClientPortalPage } from "../../../components/ClientPortalPage";
import { documentsContent } from "../../../lib/axiom-client-portal";

export const metadata: Metadata = {
  title: "Documents | Axiom Architect Client Portal",
  description:
    "Client document area for workflow evidence, uploaded files, and supporting project material.",
};

export const dynamic = "force-dynamic";

export default function ClientPortalDocumentsPage() {
  return <ClientPortalPage content={documentsContent} activePath="/client/documents" />;
}
