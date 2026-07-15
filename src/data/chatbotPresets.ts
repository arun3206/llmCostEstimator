import type { OutputType } from "@/types/calculator";

export type ChatbotPresetId =
  | "website-support"
  | "lead-capture"
  | "internal-knowledge"
  | "sales-assistant"
  | "rag-chatbot";

export type ChatbotPreset = {
  id: ChatbotPresetId;
  name: string;
  description: string;
  monthlyMessages: number;
  systemPromptTokens: number;
  historyMessages: number;
  tokensPerHistoryMessage: number;
  ragContextTokens: number;
  cachedInputPercentage: number;
  outputType: OutputType;
  sampleMessage: string;
};

export const CHATBOT_PRESETS: ChatbotPreset[] = [
  {
    id: "website-support",
    name: "Website support chatbot",
    description: "Common support bot with a short history window.",
    monthlyMessages: 5000,
    systemPromptTokens: 500,
    historyMessages: 6,
    tokensPerHistoryMessage: 120,
    ragContextTokens: 0,
    cachedInputPercentage: 20,
    outputType: "summary-insights",
    sampleMessage: "I need help choosing the right plan. Can you compare the features and explain which option is best for a small team?",
  },
  {
    id: "lead-capture",
    name: "Lead capture chatbot",
    description: "Short sales qualifier for website visitors.",
    monthlyMessages: 2000,
    systemPromptTokens: 300,
    historyMessages: 4,
    tokensPerHistoryMessage: 90,
    ragContextTokens: 0,
    cachedInputPercentage: 25,
    outputType: "summary",
    sampleMessage: "I run a small business and want to automate customer follow-ups. Can someone from your team help?",
  },
  {
    id: "internal-knowledge",
    name: "Internal knowledge assistant",
    description: "Employee assistant with company knowledge context.",
    monthlyMessages: 10000,
    systemPromptTokens: 700,
    historyMessages: 6,
    tokensPerHistoryMessage: 130,
    ragContextTokens: 1500,
    cachedInputPercentage: 30,
    outputType: "summary-insights",
    sampleMessage: "What is our refund approval process for enterprise customers, and which team should handle exceptions?",
  },
  {
    id: "sales-assistant",
    name: "Sales assistant",
    description: "Conversation-aware assistant for product and pricing questions.",
    monthlyMessages: 4000,
    systemPromptTokens: 600,
    historyMessages: 8,
    tokensPerHistoryMessage: 110,
    ragContextTokens: 500,
    cachedInputPercentage: 25,
    outputType: "summary-insights",
    sampleMessage: "A prospect asked whether we integrate with HubSpot and what the onboarding timeline looks like. Help me draft a clear answer.",
  },
  {
    id: "rag-chatbot",
    name: "RAG knowledge-base chatbot",
    description: "Chatbot that sends retrieved document chunks with each answer.",
    monthlyMessages: 10000,
    systemPromptTokens: 700,
    historyMessages: 6,
    tokensPerHistoryMessage: 120,
    ragContextTokens: 2000,
    cachedInputPercentage: 30,
    outputType: "detailed-summary",
    sampleMessage: "According to our policy documents, what information do I need before approving a vendor contract?",
  },
];

export function getChatbotPreset(id: string | null | undefined) {
  return CHATBOT_PRESETS.find((preset) => preset.id === id) ?? CHATBOT_PRESETS[0];
}
