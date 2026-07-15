import type { MetadataRoute } from "next";
import { seoPages } from "@/data/seoPages";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://llmcostestimator.com";
  const lastModified = new Date("2026-07-16");

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...seoPages.map((page) => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
  ];
}
