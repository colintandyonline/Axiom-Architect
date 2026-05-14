import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
