import { describe, expect, it } from "vitest";
import { getUseCasePreset } from "@/data/useCasePresets";
import { estimateOutputTokens, getTotalInputTokens } from "./outputEstimator";

describe("estimateOutputTokens", () => {
  it("estimates a concise summary", () => {
    expect(estimateOutputTokens(2500, "summary", "customer-call-chat")).toBe(250);
  });

  it("estimates summary plus insights", () => {
    expect(estimateOutputTokens(2500, "summary-insights", "customer-call-chat")).toBe(425);
  });

  it("estimates a detailed meeting summary", () => {
    expect(estimateOutputTokens(8000, "detailed-summary", "meeting-summary")).toBe(1500);
  });

  it("estimates chatbot replies with a lighter workload multiplier", () => {
    expect(estimateOutputTokens(3000, "summary-insights", "ai-chatbot")).toBe(459);
  });

  it("applies minimum token limits", () => {
    expect(estimateOutputTokens(10, "summary", "custom")).toBe(120);
    expect(estimateOutputTokens(10, "summary-insights", "custom")).toBe(250);
    expect(estimateOutputTokens(10, "detailed-summary", "custom")).toBe(500);
  });

  it("applies maximum token limits for very large transcripts", () => {
    expect(estimateOutputTokens(1_000_000, "summary", "custom")).toBe(400);
    expect(estimateOutputTokens(1_000_000, "summary-insights", "custom")).toBe(800);
    expect(estimateOutputTokens(1_000_000, "detailed-summary", "custom")).toBe(1500);
  });

  it("returns zero for empty or invalid input", () => {
    expect(estimateOutputTokens(0, "summary", "custom")).toBe(0);
    expect(estimateOutputTokens(Number.NaN, "summary", "custom")).toBe(0);
  });

  it("never exceeds the remaining context window", () => {
    expect(estimateOutputTokens(10_000, "detailed-summary", "meeting-summary", 250)).toBe(250);
  });
});

describe("summarization inputs and presets", () => {
  it("adds system instruction tokens to transcript tokens", () => {
    expect(getTotalInputTokens(2500, 100)).toBe(2600);
    expect(getTotalInputTokens(2500, -100)).toBe(2500);
  });

  it("returns the approved customer preset", () => {
    expect(getUseCasePreset("customer-call-chat")).toMatchObject({
      outputType: "summary-insights",
      monthlyInteractions: 1,
    });
  });

  it("returns the approved meeting preset", () => {
    expect(getUseCasePreset("meeting-summary")).toMatchObject({
      outputType: "detailed-summary",
      monthlyInteractions: 1,
    });
  });

  it("returns the chatbot preset", () => {
    expect(getUseCasePreset("ai-chatbot")).toMatchObject({
      outputType: "summary-insights",
      monthlyInteractions: 5000,
    });
  });
});
