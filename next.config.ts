import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  serverExternalPackages: ["pdfkit"],
  outputFileTracingIncludes: {
    "/api/admin/reports/action": ["./node_modules/pdfkit/js/data/**/*"],
    "/api/client/reports/[reportId]/pdf": ["./node_modules/pdfkit/js/data/**/*"],
  },
  async redirects() {
    return [
      {
        source: "/products/architect-residency",
        destination: "/products/enterprise-architecture-system",
        permanent: true,
      },
      {
        source: "/signup",
        has: [
          {
            type: "query",
            key: "tier",
            value: "architect-residency",
          },
        ],
        destination: "/signup?tier=enterprise-architecture-system",
        permanent: true,
      },
      {
        source: "/pricing",
        has: [
          {
            type: "query",
            key: "tier",
            value: "architect-residency",
          },
        ],
        destination: "/pricing?tier=enterprise-architecture-system",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/products/enterprise-architecture-system",
        destination: "/products/architect-residency",
      },
    ];
  },
};

export default nextConfig;
