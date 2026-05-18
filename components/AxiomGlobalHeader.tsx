"use client";

import { AxiomSiteHeader } from "./AxiomSiteHeader";

export function AxiomGlobalHeader() {
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
