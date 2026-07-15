import type { Metadata } from "next";
import "./globals.css";

const title = "AI Summarization Cost Estimator – Compare LLM API Costs";
const description =
  "Estimate customer-call, chat, and meeting summarization costs across OpenAI, Claude, Gemini, and DeepSeek models.";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL("https://llmcostestimator.com"),
  alternates: { canonical: "/" },
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
