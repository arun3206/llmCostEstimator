import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LongTailPage from "@/components/seo/LongTailPage";
import { getSeoPage, seoPages } from "@/data/seoPages";

const staticSeoPageSlugs = new Set([
  "openai-cost-calculator",
  "claude-cost-calculator",
  "gemini-cost-calculator",
  "ai-summarization-cost-calculator",
  "chatbot-cost-calculator",
]);

type DynamicSeoPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return seoPages
    .filter((page) => !staticSeoPageSlugs.has(page.slug))
    .map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: DynamicSeoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getSeoPage(slug);

  if (!page || staticSeoPageSlugs.has(slug)) {
    return {};
  }

  return {
    title: page.metaTitle,
    description: page.description,
    alternates: { canonical: `/${page.slug}` },
    openGraph: {
      title: page.metaTitle,
      description: page.description,
      url: `https://llmcostestimator.com/${page.slug}`,
      siteName: "LLM Cost Estimator",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: page.metaTitle,
      description: page.description,
    },
  };
}

export default async function DynamicSeoPage({ params }: DynamicSeoPageProps) {
  const { slug } = await params;
  const page = getSeoPage(slug);

  if (!page || staticSeoPageSlugs.has(slug)) {
    notFound();
  }

  return <LongTailPage page={page} />;
}
