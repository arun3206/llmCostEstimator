import type { Currency, OutputType, WorkloadType } from "@/types/calculator";

export type ShareState = {
  provider: string;
  model: string;
  workload: WorkloadType;
  output: OutputType;
  interactions: number;
  currency: Currency;
  systemInstructionTokens: number;
  cachedInputPercentage: number;
};

export function encodeShareState(state: ShareState) {
  const params = new URLSearchParams({
    provider: state.provider,
    model: state.model,
    workload: state.workload,
    output: state.output,
    interactions: String(state.interactions),
    currency: state.currency,
    systemTokens: String(state.systemInstructionTokens),
    cached: String(state.cachedInputPercentage),
  });

  return params.toString();
}
