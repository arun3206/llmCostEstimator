import { describe, expect, it } from "vitest";
import { calculateCost } from "./costCalculator";
import { USD_TO_INR, toCurrencyValue } from "./currency";
import { MODEL_PRICING } from "@/data/modelPricing";

const model = MODEL_PRICING.find((item) => item.id === "gpt-5.4-nano")!;

describe("calculateCost", () => {
  it("calculates input cost", () => {
    const result = calculateCost({ inputTokens: 1_000_000, outputTokens: 0, monthlyRequests: 1, model });
    expect(result.inputCostPerRequest).toBeCloseTo(0.2);
  });

  it("calculates output cost", () => {
    const result = calculateCost({ inputTokens: 0, outputTokens: 1_000_000, monthlyRequests: 1, model });
    expect(result.outputCostPerRequest).toBeCloseTo(1.25);
  });

  it("calculates monthly interaction and annual cost", () => {
    const result = calculateCost({ inputTokens: 2500, outputTokens: 300, monthlyRequests: 10000, model });
    expect(result.monthlyCost).toBeCloseTo(8.75);
    expect(result.annualCost).toBeCloseTo(105);
  });

  it("calculates cost per 1,000 interactions", () => {
    const result = calculateCost({ inputTokens: 2500, outputTokens: 300, monthlyRequests: 10000, model });
    expect(result.costPerThousandRequests).toBeCloseTo(0.875);
  });

  it("calculates cached input", () => {
    const result = calculateCost({
      inputTokens: 1000,
      outputTokens: 0,
      monthlyRequests: 1,
      cachedInputPercentage: 50,
      model,
    });
    expect(result.normalInputTokens).toBe(500);
    expect(result.cachedInputTokens).toBe(500);
    expect(result.costPerRequest).toBeCloseTo(0.00011);
  });

  it("supports decimal cached-input percentages", () => {
    const result = calculateCost({
      inputTokens: 1000,
      outputTokens: 0,
      monthlyRequests: 1,
      cachedInputPercentage: 25.5,
      model,
    });
    expect(result.cachedInputTokens).toBe(255);
    expect(result.normalInputTokens).toBe(745);
  });

  it("handles zero-token scenario", () => {
    const result = calculateCost({ inputTokens: 0, outputTokens: 0, monthlyRequests: 100, model });
    expect(result.costPerRequest).toBe(0);
  });

  it("handles zero-request scenario", () => {
    const result = calculateCost({ inputTokens: 2500, outputTokens: 300, monthlyRequests: 0, model });
    expect(result.monthlyCost).toBe(0);
  });

  it("handles invalid monthly interaction values", () => {
    const result = calculateCost({ inputTokens: 2500, outputTokens: 300, monthlyRequests: Number.NaN, model });
    expect(result.monthlyCost).toBe(0);
  });

  it("keeps very small costs precise", () => {
    const result = calculateCost({ inputTokens: 1, outputTokens: 1, monthlyRequests: 1, model });
    expect(result.costPerRequest).toBeGreaterThan(0);
    expect(result.costPerRequest).toBeLessThan(0.00001);
  });

  it("handles large request volumes", () => {
    const result = calculateCost({ inputTokens: 2500, outputTokens: 300, monthlyRequests: 10_000_000, model });
    expect(result.monthlyCost).toBeCloseTo(8750);
  });

  it("converts currency", () => {
    expect(toCurrencyValue(10, "INR")).toBeCloseTo(10 * USD_TO_INR);
  });

  it("validates context window fit", () => {
    const result = calculateCost({ inputTokens: 400000, outputTokens: 1, monthlyRequests: 1, model });
    expect(result.fitsContextWindow).toBe(false);
  });
});

describe("current model catalog", () => {
  it("includes GPT-5.5 and Claude Opus 4.6", () => {
    expect(MODEL_PRICING.some((item) => item.id === "gpt-5.5")).toBe(true);
    expect(MODEL_PRICING.some((item) => item.id === "claude-opus-4-6")).toBe(true);
  });

  it("contains current models for every supported provider", () => {
    for (const provider of ["OpenAI", "Anthropic", "Google", "DeepSeek"]) {
      expect(MODEL_PRICING.some((item) => item.provider === provider)).toBe(true);
    }
  });
});
