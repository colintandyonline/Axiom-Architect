"use client";

import { usePathname } from "next/navigation";
import { AxiomSiteHeader } from "./AxiomSiteHeader";

const publicPagePaths = new Set(["/", "/audit", "/pricing", "/about"]);

export function AxiomGlobalHeader() {
  const pathname = usePathname();

  if (!publicPagePaths.has(pathname)) {
    return null;
  }

  return <AxiomSiteHeader />;
}
