export type Provider = "OpenAI" | "Anthropic" | "Google" | "DeepSeek";

export type TokenizationMethod = "exact" | "compatible" | "estimated";

export type ModelPricing = {
  id: string;
  provider: Provider;
  modelName: string;
  displayName: string;
  inputPricePerMillionTokens: number;
  outputPricePerMillionTokens: number;
  cachedInputPricePerMillionTokens?: number;
  contextWindowTokens?: number;
  tokenizationMethod: TokenizationMethod;
  pricingUpdatedAt: string;
  pricingSourceUrl?: string;
  pricingNote?: string;
};
