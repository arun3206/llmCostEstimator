import type { OutputType, WorkloadType } from "@/types/calculator";

export type UseCasePreset = {
  id: WorkloadType;
  name: string;
  description: string;
  outputType: OutputType;
  monthlyInteractions: number;
};

export const USE_CASE_PRESETS: UseCasePreset[] = [
  {
    id: "custom",
    name: "Custom Workload",
    description: "Paste any prompt, transcript, or content.",
    outputType: "summary",
    monthlyInteractions: 1000,
  },
  {
    id: "customer-call-chat",
    name: "Customer Call / Chat Summarization",
    description: "Summarize customer calls and customer-agent chats.",
    outputType: "summary-insights",
    monthlyInteractions: 10000,
  },
  {
    id: "meeting-summary",
    name: "Meeting Summarization",
    description: "Summarize meetings, decisions, and action items.",
    outputType: "detailed-summary",
    monthlyInteractions: 1000,
  },
];

export function getUseCasePreset(id: WorkloadType) {
  return USE_CASE_PRESETS.find((preset) => preset.id === id) ?? USE_CASE_PRESETS[0];
}
