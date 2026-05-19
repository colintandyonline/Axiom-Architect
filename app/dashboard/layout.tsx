import type { ReactNode } from "react";
import { StewardshipCycleNotice } from "../../components/StewardshipCycleNotice";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <StewardshipCycleNotice placement="dashboard" />
    </>
  );
}
