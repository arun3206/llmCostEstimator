import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blogPosts";
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
    {
      url: `${baseUrl}/blog`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.75,
    },
    ...blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
