import type { CalculatorInput, CostEstimate } from "@/types/calculator";

const clampNumber = (value: number, min = 0) =>
  Number.isFinite(value) ? Math.max(min, value) : min;

export function calculateCost(input: CalculatorInput): CostEstimate {
  const inputTokens = Math.floor(clampNumber(input.inputTokens));
  const outputTokens = Math.floor(clampNumber(input.outputTokens));
  const monthlyRequests = Math.floor(clampNumber(input.monthlyRequests));
  const requestedCachedPercentage = clampNumber(input.cachedInputPercentage ?? 0);
  const cachedInputPercentage = input.model.cachedInputPricePerMillionTokens
    ? Math.min(requestedCachedPercentage, 100) / 100
    : 0;

  const cachedInputTokens = Math.round(inputTokens * cachedInputPercentage);
  const normalInputTokens = Math.max(0, inputTokens - cachedInputTokens);

  const inputCostPerRequest =
    (normalInputTokens / 1_000_000) * input.model.inputPricePerMillionTokens;
  const cachedInputCostPerRequest =
    (cachedInputTokens / 1_000_000) *
    (input.model.cachedInputPricePerMillionTokens ?? 0);
  const outputCostPerRequest =
    (outputTokens / 1_000_000) * input.model.outputPricePerMillionTokens;
  const costPerRequest =
    inputCostPerRequest + cachedInputCostPerRequest + outputCostPerRequest;
  const monthlyCost = costPerRequest * monthlyRequests;
  const totalMonthlyTokens = (inputTokens + outputTokens) * monthlyRequests;
  const contextWindowUsagePercentage = input.model.contextWindowTokens
    ? ((inputTokens + outputTokens) / input.model.contextWindowTokens) * 100
    : undefined;

  return {
    inputTokens,
    outputTokens,
    normalInputTokens,
    cachedInputTokens,
    inputCostPerRequest,
    cachedInputCostPerRequest,
    outputCostPerRequest,
    costPerRequest,
    costPerThousandRequests: costPerRequest * 1000,
    monthlyCost,
    annualCost: monthlyCost * 12,
    totalMonthlyTokens,
    contextWindowUsagePercentage,
    fitsContextWindow: input.model.contextWindowTokens
      ? inputTokens + outputTokens <= input.model.contextWindowTokens
      : undefined,
  };
}
