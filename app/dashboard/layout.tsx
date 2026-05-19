import type { ReactNode } from "react";
import { CustomerFacingCopyGuard } from "../../components/CustomerFacingCopyGuard";
import { StewardshipCycleNotice } from "../../components/StewardshipCycleNotice";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <StewardshipCycleNotice placement="dashboard" />
      <CustomerFacingCopyGuard />
    </>
  );
}
