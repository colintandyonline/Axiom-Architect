import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  async redirects() {
    return [
      {
        source: "/products/architect-residency",
        destination: "/products/enterprise-architecture-system",
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
