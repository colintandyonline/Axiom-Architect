import type { MetadataRoute } from "next";

const siteUrl = "https://www.axiom-architect.co";

const routes = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/audit", priority: 0.95, changeFrequency: "weekly" },
  { path: "/pricing", priority: 0.9, changeFrequency: "weekly" },
  { path: "/products/workflow-audit", priority: 0.88, changeFrequency: "monthly" },
  { path: "/products/workflow-blueprint", priority: 0.86, changeFrequency: "monthly" },
  { path: "/products/custom-operating-pack", priority: 0.84, changeFrequency: "monthly" },
  { path: "/products/workflow-stewardship", priority: 0.82, changeFrequency: "monthly" },
  { path: "/products/departmental-ecosystem", priority: 0.8, changeFrequency: "monthly" },
  { path: "/products/enterprise-architecture-system", priority: 0.78, changeFrequency: "monthly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.65, changeFrequency: "monthly" },
  { path: "/sitemap", priority: 0.5, changeFrequency: "monthly" },
  { path: "/terms", priority: 0.35, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.35, changeFrequency: "yearly" },
  { path: "/cookies", priority: 0.3, changeFrequency: "yearly" },
  { path: "/refund-policy", priority: 0.3, changeFrequency: "yearly" },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
