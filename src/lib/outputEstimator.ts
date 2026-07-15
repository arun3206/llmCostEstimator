import type {
  OutputEstimationConfig,
  OutputType,
  WorkloadType,
} from "@/types/calculator";

export const OUTPUT_ESTIMATION_CONFIG: Record<OutputType, OutputEstimationConfig> = {
  summary: {
    outputType: "summary",
    label: "Summary",
    ratio: 0.1,
    minimumTokens: 120,
    maximumTokens: 400,
    description: "A concise summary of the purpose, discussion, and outcome.",
  },
  "summary-insights": {
    outputType: "summary-insights",
    label: "Summary + Insights",
    ratio: 0.17,
    minimumTokens: 250,
    maximumTokens: 800,
    description: "A summary with key issues, sentiment, decisions, risks, and actions.",
  },
  "detailed-summary": {
    outputType: "detailed-summary",
    label: "Detailed Summary",
    ratio: 0.26,
    minimumTokens: 500,
    maximumTokens: 1500,
    description: "A comprehensive structured summary with owners and follow-up items.",
  },
};

const WORKLOAD_RATIO_MULTIPLIER: Record<WorkloadType, number> = {
  custom: 1,
  "customer-call-chat": 1,
  "meeting-summary": 1.08,
  "ai-chatbot": 0.9,
};

export function getTotalInputTokens(transcriptTokens: number, systemInstructionTokens: number) {
  const transcript = Number.isFinite(transcriptTokens) ? Math.max(0, transcriptTokens) : 0;
  const system = Number.isFinite(systemInstructionTokens) ? Math.max(0, systemInstructionTokens) : 0;
  return Math.floor(transcript) + Math.floor(system);
}

export function estimateOutputTokens(
  inputTokens: number,
  outputType: OutputType,
  workloadType: WorkloadType,
  remainingContextTokens = Number.POSITIVE_INFINITY,
): number {
  const safeInputTokens = Number.isFinite(inputTokens) ? Math.max(0, Math.floor(inputTokens)) : 0;
  if (safeInputTokens === 0) return 0;

  const config = OUTPUT_ESTIMATION_CONFIG[outputType];
  const estimated = Math.round(
    safeInputTokens * config.ratio * WORKLOAD_RATIO_MULTIPLIER[workloadType],
  );
  const bounded = Math.min(config.maximumTokens, Math.max(config.minimumTokens, estimated));
  const safeRemaining = Number.isFinite(remainingContextTokens)
    ? Math.max(0, Math.floor(remainingContextTokens))
    : Number.POSITIVE_INFINITY;

  return Math.min(bounded, safeRemaining);
}
