import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { CustomerFacingCopyGuard } from "../../components/CustomerFacingCopyGuard";
import { StewardshipCycleNotice } from "../../components/StewardshipCycleNotice";
import { isAxiomAdminEmail } from "../../lib/axiom-admin";
import { getAxiomAuthContext, getAxiomClientWorkspaceByCustomerId } from "../../lib/axiom-auth";

export const dynamic = "force-dynamic";

function shouldRouteWorkspaceToClientPortal(workspace: Awaited<ReturnType<typeof getAxiomClientWorkspaceByCustomerId>>) {
  if (!workspace) {
    return false;
  }

  if (workspace.order_id) {
    return false;
  }

  if (workspace.workspace_type === "package_client_portal" || workspace.workspace_type === "report_delivery_workspace") {
    return false;
  }

  return Boolean(workspace.service_request_id);
}

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const authContext = await getAxiomAuthContext();
  const isAdmin =
    isAxiomAdminEmail(authContext.user?.email) ||
    isAxiomAdminEmail(authContext.customer?.email);

  if (authContext.user && authContext.customer && !isAdmin) {
    const serviceWorkspace = await getAxiomClientWorkspaceByCustomerId(authContext.customer.id);

    if (shouldRouteWorkspaceToClientPortal(serviceWorkspace)) {
      redirect("/client");
    }
  }

  return (
    <>
      {children}
      <StewardshipCycleNotice placement="dashboard" />
      <CustomerFacingCopyGuard />
    </>
  );
}
