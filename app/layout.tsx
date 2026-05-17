import type { Metadata } from "next";
import Script from "next/script";
import { AxiomGlobalFooter } from "../components/AxiomGlobalFooter";
import { AxiomGlobalHeader } from "../components/AxiomGlobalHeader";
import "./globals.css";

const googleAnalyticsId = "G-WPVQ3WB3FK";

export const metadata: Metadata = {
  title: "Axiom Architect",
  description:
    "AI-powered workflow architecture for structured business systems, diagnostics, automation opportunities, and practical implementation blueprints.",
  icons: {
    icon: "/brand/axiom-logo.png",
    apple: "/brand/axiom-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AxiomGlobalHeader />
        {children}
        <AxiomGlobalFooter />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleAnalyticsId}');
          `}
        </Script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('click', function (event) {
                var target = event.target;
                if (!target || !target.closest) return;
                var link = target.closest('a');
                if (!link) return;
                var href = link.getAttribute('href');
                if (href === '#start' || href === 'mailto:hello@axiom-architect.co?subject=Start%20Workflow%20Audit') {
                  event.preventDefault();
                  window.location.href = '/signup';
                }
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
