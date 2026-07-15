import type { ModelPricing } from "./pricing";

export type Currency = "USD" | "INR";

export type WorkloadType = "custom" | "customer-call-chat" | "meeting-summary";

export type OutputType = "summary" | "summary-insights" | "detailed-summary";

export type OutputEstimationConfig = {
  outputType: OutputType;
  label: string;
  ratio: number;
  minimumTokens: number;
  maximumTokens: number;
  description: string;
};

export type CalculatorInput = {
  inputTokens: number;
  outputTokens: number;
  monthlyRequests: number;
  cachedInputPercentage?: number;
  model: ModelPricing;
};

export type CostEstimate = {
  inputTokens: number;
  outputTokens: number;
  normalInputTokens: number;
  cachedInputTokens: number;
  inputCostPerRequest: number;
  cachedInputCostPerRequest: number;
  outputCostPerRequest: number;
  costPerRequest: number;
  costPerThousandRequests: number;
  monthlyCost: number;
  annualCost: number;
  totalMonthlyTokens: number;
  contextWindowUsagePercentage?: number;
  fitsContextWindow?: boolean;
};
