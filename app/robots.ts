import type { MetadataRoute } from "next";

const siteUrl = "https://www.axiom-architect.co";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/dashboard/", "/api", "/api/", "/login", "/logout", "/signup"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
