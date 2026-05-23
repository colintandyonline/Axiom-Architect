import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { CustomerFacingCopyGuard } from "../../components/CustomerFacingCopyGuard";
import { StewardshipCycleNotice } from "../../components/StewardshipCycleNotice";
import { isAxiomAdminEmail } from "../../lib/axiom-admin";
import { getAxiomAuthContext, getAxiomClientWorkspaceByCustomerId } from "../../lib/axiom-auth";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const authContext = await getAxiomAuthContext();
  const isAdmin =
    isAxiomAdminEmail(authContext.user?.email) ||
    isAxiomAdminEmail(authContext.customer?.email);

  if (authContext.user && authContext.customer && !isAdmin) {
    const serviceWorkspace = await getAxiomClientWorkspaceByCustomerId(authContext.customer.id);

    if (serviceWorkspace) {
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
