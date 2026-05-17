"use client";

import { usePathname } from "next/navigation";
import { AxiomSiteHeader } from "./AxiomSiteHeader";

const publicPagePaths = new Set([
  "/",
  "/audit",
  "/pricing",
  "/about",
  "/contact",
  "/terms",
  "/privacy",
  "/cookies",
  "/refund-policy",
]);

export function AxiomGlobalHeader() {
  const pathname = usePathname();

  if (!publicPagePaths.has(pathname)) {
    return null;
  }

  return (
    <>
      <style>{`
        main > header:first-child {
          display: none !important;
        }

        main > section#top {
          padding-top: 0 !important;
        }
      `}</style>
      <AxiomSiteHeader />
    </>
  );
}
