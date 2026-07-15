import type { OutputType, WorkloadType } from "@/types/calculator";
import type { Provider } from "@/types/pricing";

export type SeoPage = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  eyebrow: string;
  intro: string;
  provider?: Provider;
  workloadType?: WorkloadType;
  outputType?: OutputType;
  faqs: Array<[string, string]>;
};

export const seoPages: SeoPage[] = [
  {
    slug: "openai-cost-calculator",
    title: "OpenAI Cost Calculator",
    metaTitle: "OpenAI Cost Calculator - Estimate GPT API Costs",
    description:
      "Estimate GPT API costs for prompts, summaries, chatbots and AI workflows. Compare OpenAI pricing against Claude, Gemini and DeepSeek models.",
    eyebrow: "GPT API pricing",
    intro:
      "Use this OpenAI cost calculator to estimate cost per interaction, monthly spend and token usage for GPT-powered apps before you build.",
    provider: "OpenAI",
    workloadType: "customer-call-chat",
    outputType: "summary-insights",
    faqs: [
      ["How do I estimate OpenAI API cost?", "Paste a representative prompt, transcript or content sample, then enter expected monthly interactions. The calculator estimates input tokens, output tokens and monthly cost."],
      ["Does this call the OpenAI API?", "No. The MVP runs locally in your browser and does not require an API key."],
      ["Can I compare OpenAI with other models?", "Yes. The comparison table uses the same workload across supported OpenAI, Anthropic, Google and DeepSeek models."],
    ],
  },
  {
    slug: "claude-cost-calculator",
    title: "Claude Cost Calculator",
    metaTitle: "Claude Cost Calculator - Estimate Anthropic API Costs",
    description:
      "Estimate Claude API costs for summarization, support transcripts, documents and AI workflows. Compare Anthropic pricing with OpenAI, Gemini and DeepSeek.",
    eyebrow: "Anthropic API pricing",
    intro:
      "Use this Claude cost calculator to plan Anthropic API spend for summaries, insights and detailed analysis workloads.",
    provider: "Anthropic",
    workloadType: "meeting-summary",
    outputType: "detailed-summary",
    faqs: [
      ["What can I estimate on this Claude calculator?", "You can estimate cost per interaction, monthly cost, annual cost and token usage for Claude-style summarization workloads."],
      ["Are Claude token counts exact?", "The MVP labels token counts as estimated because providers can tokenize content differently."],
      ["Can I compare Claude with GPT or Gemini?", "Yes. Use the model comparison section to compare the same workload across providers."],
    ],
  },
  {
    slug: "gemini-cost-calculator",
    title: "Gemini Cost Calculator",
    metaTitle: "Gemini Cost Calculator - Estimate Google AI API Costs",
    description:
      "Estimate Gemini API costs for prompts, summaries, support content and AI products. Compare Google model pricing across common workloads.",
    eyebrow: "Google AI pricing",
    intro:
      "Use this Gemini cost calculator to estimate Google AI API spend from a real content sample and monthly usage volume.",
    provider: "Google",
    workloadType: "customer-call-chat",
    outputType: "summary",
    faqs: [
      ["How do I calculate Gemini API cost?", "Paste sample content, choose a summary type and enter monthly interactions. The calculator applies model input and output pricing."],
      ["Does this include Google Cloud infrastructure cost?", "No. This MVP estimates only model token costs, not storage, databases, transcription or cloud infrastructure."],
      ["Can I use this for Gemini chatbot estimates?", "Yes. Use a representative chat or prompt sample and set monthly interactions to your expected message volume."],
    ],
  },
  {
    slug: "ai-summarization-cost-calculator",
    title: "AI Summarization Cost Calculator",
    metaTitle: "AI Summarization Cost Calculator - Estimate Monthly LLM Spend",
    description:
      "Estimate the cost of AI summarization for calls, chats, meetings, transcripts and documents across leading LLM providers.",
    eyebrow: "Summarization workload pricing",
    intro:
      "Use this AI summarization cost calculator to plan monthly spend for customer conversations, meeting notes, documents and transcript summaries.",
    workloadType: "customer-call-chat",
    outputType: "summary-insights",
    faqs: [
      ["What inputs affect summarization cost?", "Input length, summary detail, selected model, system instruction tokens, caching and monthly interaction volume all affect cost."],
      ["Does this include speech-to-text cost?", "No. Speech-to-text transcription is not included yet; this calculator focuses on LLM summarization cost."],
      ["Can I use one transcript as a sample?", "Yes. Paste a representative transcript and scale it by monthly interactions to estimate total spend."],
    ],
  },
  {
    slug: "chatbot-cost-calculator",
    title: "Chatbot Cost Calculator",
    metaTitle: "Chatbot Cost Calculator - Estimate AI Chat API Costs",
    description:
      "Estimate AI chatbot API costs from prompt size, expected response length and monthly message volume across popular LLM models.",
    eyebrow: "AI chatbot pricing",
    intro:
      "Use this chatbot cost calculator to estimate per-message cost and monthly API spend for AI chatbots and support assistants.",
    workloadType: "custom",
    outputType: "summary",
    faqs: [
      ["How do I estimate chatbot API cost?", "Paste a representative chat prompt or conversation context, choose expected output length and enter monthly message volume."],
      ["Why do chatbot costs vary?", "Costs change with context size, response length, model choice, cached prompts and conversation volume."],
      ["Can I compare chatbot costs across models?", "Yes. The comparison table estimates the same workload across the supported providers."],
    ],
  },
];

export function getSeoPage(slug: string) {
  return seoPages.find((page) => page.slug === slug);
}
