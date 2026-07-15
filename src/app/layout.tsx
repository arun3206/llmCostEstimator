import type { Metadata } from "next";
import "./globals.css";

const title = "LLM Cost Estimator - Compare AI API and Token Costs";
const description =
  "Estimate LLM API costs for OpenAI, Claude, Gemini, DeepSeek and other AI models. Calculate token usage, cost per interaction and monthly AI spend.";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL("https://llmcostestimator.com"),
  alternates: { canonical: "/" },
  keywords: [
    "LLM cost estimator",
    "AI API cost calculator",
    "token cost calculator",
    "OpenAI cost calculator",
    "Claude cost calculator",
    "Gemini cost calculator",
    "AI summarization cost",
  ],
  openGraph: {
    title,
    description,
    url: "https://llmcostestimator.com",
    siteName: "LLM Cost Estimator",
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
