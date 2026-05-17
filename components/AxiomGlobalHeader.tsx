"use client";

import { usePathname } from "next/navigation";
import { AxiomSiteHeader } from "./AxiomSiteHeader";

const publicPagePaths = new Set([
  "/",
  "/audit",
  "/pricing",
  "/about",
  "/contact",
  "/sitemap",
  "/terms",
  "/privacy",
  "/cookies",
  "/refund-policy",
]);

function isPublicPagePath(pathname: string) {
  return publicPagePaths.has(pathname) || pathname.startsWith("/products/");
}

export function AxiomGlobalHeader() {
  const pathname = usePathname();

  if (!isPublicPagePath(pathname)) {
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
