import type { Metadata } from "next";
import LongTailPage from "@/components/seo/LongTailPage";
import { getSeoPage } from "@/data/seoPages";

const page = getSeoPage("ai-summarization-cost-calculator")!;

export const metadata: Metadata = {
  title: page.metaTitle,
  description: page.description,
  alternates: { canonical: `/${page.slug}` },
};

export default function AISummarizationCostCalculatorPage() {
  return <LongTailPage page={page} />;
}
