import type { Metadata } from "next";
import Script from "next/script";
import { AxiomGlobalFooter } from "../components/AxiomGlobalFooter";
import { AxiomGlobalHeader } from "../components/AxiomGlobalHeader";
import { BespokeProposalCta } from "../components/BespokeProposalCta";
import "./globals.css";

const googleAnalyticsId = "G-WPVQ3WB3FK";
const siteUrl = "https://www.axiom-architect.co";
const siteTitle = "Axiom Architect";
const siteDescription =
  "Axiom Architect designs AI-ready workflow architecture for business operations: workflow diagnostics, operating blueprints, automation suitability, review gates, and enterprise AI control systems.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteTitle,
  title: {
    default: "Axiom Architect | AI Workflow Architecture & Operating Blueprints",
    template: "%s | Axiom Architect",
  },
  description: siteDescription,
  keywords: [
    "AI workflow architecture",
    "workflow audit",
    "workflow blueprint",
    "automation suitability",
    "AI operating system",
    "human in the loop controls",
    "review gates",
    "enterprise AI control stack",
    "workflow diagnostics",
    "operating blueprints",
    "Axiom Architect",
    "Axiom Studio",
  ],
  authors: [{ name: "Axiom Architect" }],
  creator: "Axiom Architect",
  publisher: "Axiom Architect",
  category: "Business workflow architecture",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl,
    siteName: siteTitle,
    title: "Axiom Architect | AI Workflow Architecture & Operating Blueprints",
    description: siteDescription,
    images: [
      {
        url: "/brand/axiom-architect-hero-banner.png",
        width: 1920,
        height: 1080,
        alt: "Axiom Architect — The architecture behind intelligent work",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Axiom Architect | AI Workflow Architecture & Operating Blueprints",
    description: siteDescription,
    images: ["/brand/axiom-architect-hero-banner.png"],
  },
  icons: {
    icon: "/brand/axiom-logo.png",
    apple: "/brand/axiom-logo.png",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Axiom Architect",
      url: siteUrl,
      logo: `${siteUrl}/brand/axiom-logo.png`,
      description: siteDescription,
      sameAs: ["https://axiom-studio.co/"],
      brand: {
        "@type": "Brand",
        name: "Axiom Architect",
        slogan: "The architecture behind intelligent work",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "Axiom Architect",
      url: siteUrl,
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      inLanguage: "en-GB",
      description: siteDescription,
    },
    {
      "@type": "ProfessionalService",
      "@id": `${siteUrl}/#service`,
      name: "Axiom Architect",
      url: siteUrl,
      areaServed: "Worldwide",
      serviceType: "AI workflow architecture, workflow diagnostics, operating blueprints, automation suitability analysis, enterprise AI control design",
      provider: {
        "@id": `${siteUrl}/#organization`,
      },
      description: siteDescription,
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Axiom Architect workflow architecture products",
        itemListElement: [
          "Workflow Audit",
          "Workflow Blueprint",
          "Custom Operating Pack",
          "Workflow Stewardship",
          "Departmental Ecosystem",
          "Axiom Enterprise Architecture System",
          "Bespoke AI Workflow Architecture"
        ].map((name) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name,
          },
        })),
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body>
        <AxiomGlobalHeader />
        {children}
        <BespokeProposalCta />
        <AxiomGlobalFooter />
        <Script
          id="axiom-structured-data"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
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
