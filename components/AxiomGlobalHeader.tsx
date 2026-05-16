"use client";

import { usePathname } from "next/navigation";
import { AxiomSiteHeader } from "./AxiomSiteHeader";

const excludedPaths = new Set(["/", "/pricing"]);

export function AxiomGlobalHeader() {
  const pathname = usePathname();

  if (excludedPaths.has(pathname)) {
    return null;
  }

  return (
    <>
      {pathname === "/audit" ? (
        <style>{`main > section:first-of-type { display: none !important; }`}</style>
      ) : null}
      <AxiomSiteHeader />
    </>
  );
}
