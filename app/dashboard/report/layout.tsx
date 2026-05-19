import type { ReactNode } from "react";
import { ReportUpdateWindowCopy } from "./ReportUpdateWindowCopy";

export default function DashboardReportLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ReportUpdateWindowCopy />
    </>
  );
}
