import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://llmcostestimator.com",
      lastModified: new Date("2026-07-16"),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
