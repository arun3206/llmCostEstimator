import type { Metadata } from "next";
import LongTailPage from "@/components/seo/LongTailPage";
import { getSeoPage } from "@/data/seoPages";

const page = getSeoPage("chatbot-cost-calculator")!;

export const metadata: Metadata = {
  title: page.metaTitle,
  description: page.description,
  alternates: { canonical: `/${page.slug}` },
};

export default function ChatbotCostCalculatorPage() {
  return <LongTailPage page={page} />;
}
