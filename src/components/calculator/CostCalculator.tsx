"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CHATBOT_PRESETS, getChatbotPreset } from "@/data/chatbotPresets";
import { DEFAULT_MODEL_ID, MODEL_PRICING } from "@/data/modelPricing";
import { getUseCasePreset, USE_CASE_PRESETS } from "@/data/useCasePresets";
import { calculateCost } from "@/lib/costCalculator";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/currency";
import {
  estimateOutputTokens,
  getTotalInputTokens,
  OUTPUT_ESTIMATION_CONFIG,
} from "@/lib/outputEstimator";
import { encodeShareState } from "@/lib/shareState";
import { estimateTokens } from "@/lib/tokenEstimator";
import type { Currency, OutputType, WorkloadType } from "@/types/calculator";
import type { Provider } from "@/types/pricing";

const providers: Provider[] = ["OpenAI", "Anthropic", "Google", "DeepSeek"];
const workloadTypes: WorkloadType[] = ["custom", "customer-call-chat", "meeting-summary", "ai-chatbot"];
const outputTypes: OutputType[] = ["summary", "summary-insights", "detailed-summary"];

type CostCalculatorProps = {
  headingLevel?: "h1" | "h2";
  headingTitle?: string;
  headingDescription?: string;
  privacyNote?: string;
  initialProvider?: Provider;
  initialWorkloadType?: WorkloadType;
  initialOutputType?: OutputType;
};

const workloadCopy: Record<
  WorkloadType,
  { label: string; placeholder: string; usageHelp: string }
> = {
  custom: {
    label: "Paste your prompt, transcript or content",
    placeholder: "Paste the content that will be sent to the AI model...",
    usageHelp: "Number of AI summarization requests expected each month.",
  },
  "customer-call-chat": {
    label: "Paste a customer call or chat transcript",
    placeholder: "Paste a sample customer-agent conversation, support chat or call transcript...",
    usageHelp: "Number of customer calls or chats summarized each month.",
  },
  "meeting-summary": {
    label: "Paste a meeting transcript or meeting notes",
    placeholder: "Paste a sample meeting transcript, discussion or meeting notes...",
    usageHelp: "Number of meetings summarized each month.",
  },
  "ai-chatbot": {
    label: "Average user message or sample chat",
    placeholder: "Paste a representative user message or short chatbot conversation...",
    usageHelp: "Number of chatbot messages expected each month.",
  },
};

const chatbotOutputCopy: Record<OutputType, { label: string; description: string }> = {
  summary: {
    label: "Short Reply",
    description: "A brief answer for simple chatbot questions.",
  },
  "summary-insights": {
    label: "Helpful Reply",
    description: "A balanced chatbot response with useful detail.",
  },
  "detailed-summary": {
    label: "Detailed Reply",
    description: "A longer answer for complex support or knowledge-base questions.",
  },
};

function safeNumber(value: string | null, fallback: number, maximum = 1_000_000_000) {
  if (value === null || value.trim() === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.min(parsed, maximum) : fallback;
}

function wholeNumberInput(value: string) {
  return value.replace(/[^0-9]/g, "");
}

function decimalInput(value: string) {
  const cleaned = value.replace(/[^0-9.]/g, "");
  const [whole = "", ...fractionParts] = cleaned.split(".");
  return fractionParts.length ? `${whole}.${fractionParts.join("")}` : whole;
}

function getInitialQueryState(defaultOverrides: Partial<{
  workloadType: WorkloadType;
  provider: Provider;
  modelId: string;
  outputType: OutputType;
  monthlyInteractions: number;
  currency: Currency;
  systemInstructionTokens: number;
  cachedInputPercentage: number;
}> = {}) {
  const defaults = {
    workloadType: defaultOverrides.workloadType ?? ("customer-call-chat" as WorkloadType),
    provider: defaultOverrides.provider ?? ("OpenAI" as Provider),
    modelId:
      defaultOverrides.modelId ??
      MODEL_PRICING.find((item) => item.provider === defaultOverrides.provider)?.id ??
      DEFAULT_MODEL_ID,
    outputType: defaultOverrides.outputType ?? ("summary" as OutputType),
    monthlyInteractions: 1,
    currency: defaultOverrides.currency ?? ("USD" as Currency),
    systemInstructionTokens: 0,
    cachedInputPercentage: 0,
  };

  if (typeof window === "undefined") return defaults;

  const params = new URLSearchParams(window.location.search);
  const workload = params.get("workload") as WorkloadType | null;
  const output = params.get("output") as OutputType | null;
  const providerParam = params.get("provider");
  const requestedProvider = providers.find(
    (item) => item.toLowerCase() === providerParam?.toLowerCase(),
  );
  const requestedModel = MODEL_PRICING.find((item) => item.id === params.get("model"));
  const provider = requestedModel?.provider ?? requestedProvider ?? defaults.provider;

  return {
    workloadType: workload && workloadTypes.includes(workload) ? workload : defaults.workloadType,
    provider,
    modelId:
      requestedModel?.id ??
      MODEL_PRICING.find((item) => item.provider === provider)?.id ??
      defaults.modelId,
    outputType: output && outputTypes.includes(output) ? output : defaults.outputType,
    monthlyInteractions: safeNumber(params.get("interactions"), defaults.monthlyInteractions),
    currency: params.get("currency") === "INR" ? ("INR" as const) : ("USD" as const),
    systemInstructionTokens: safeNumber(params.get("systemTokens"), 0, 10_000_000),
    cachedInputPercentage: safeNumber(params.get("cached"), 0, 100),
  };
}

export default function CostCalculator({
  headingLevel = "h1",
  headingTitle = "Calculate Your Summarization Cost",
  headingDescription = "Paste a sample transcript, select the summary you need, and estimate your monthly API spend.",
  privacyNote = "No API key required. Your transcript stays in your browser.",
  initialProvider,
  initialWorkloadType,
  initialOutputType,
}: CostCalculatorProps = {}) {
  const initial = useMemo(
    () =>
      getInitialQueryState({
        provider: initialProvider,
        workloadType: initialWorkloadType,
        outputType: initialOutputType,
      }),
    [initialOutputType, initialProvider, initialWorkloadType],
  );
  const initialChatbotPreset = useMemo(
    () => (initial.workloadType === "ai-chatbot" ? getChatbotPreset(CHATBOT_PRESETS[0].id) : null),
    [initial.workloadType],
  );
  const [workloadType, setWorkloadType] = useState<WorkloadType>(initial.workloadType);
  const [provider, setProvider] = useState<Provider>(initial.provider);
  const [modelId, setModelId] = useState(initial.modelId);
  const [text, setText] = useState(initialChatbotPreset?.sampleMessage ?? "");
  const [outputType, setOutputType] = useState<OutputType>(initial.outputType);
  const [monthlyInteractions, setMonthlyInteractions] = useState(
    String(initialChatbotPreset?.monthlyMessages ?? initial.monthlyInteractions),
  );
  const [cachedInputPercentage, setCachedInputPercentage] = useState(
    String(initialChatbotPreset?.cachedInputPercentage ?? initial.cachedInputPercentage),
  );
  const [systemInstructionTokens, setSystemInstructionTokens] = useState(
    String(initialChatbotPreset?.systemPromptTokens ?? initial.systemInstructionTokens),
  );
  const [chatbotPresetId, setChatbotPresetId] = useState(initialChatbotPreset?.id ?? CHATBOT_PRESETS[0].id);
  const [historyMessages, setHistoryMessages] = useState(String(initialChatbotPreset?.historyMessages ?? 0));
  const [tokensPerHistoryMessage, setTokensPerHistoryMessage] = useState(
    String(initialChatbotPreset?.tokensPerHistoryMessage ?? 0),
  );
  const [ragContextTokens, setRagContextTokens] = useState(String(initialChatbotPreset?.ragContextTokens ?? 0));
  const [currency, setCurrency] = useState<Currency>(initial.currency);
  const [copyStatus, setCopyStatus] = useState("");
  const [resultEmphasis, setResultEmphasis] = useState(false);
  const [selectedComparisonIds, setSelectedComparisonIds] = useState<string[]>([
    "gpt-5.4-mini",
    "gpt-5.5",
    "claude-opus-4-8",
    "gemini-3.5-flash",
    "deepseek-v4-flash",
  ]);
  const resultRef = useRef<HTMLElement>(null);

  const model = useMemo(
    () => MODEL_PRICING.find((item) => item.id === modelId) ?? MODEL_PRICING[0],
    [modelId],
  );
  const providerModels = useMemo(
    () => MODEL_PRICING.filter((item) => item.provider === provider),
    [provider],
  );
  const tokenEstimate = useMemo(() => estimateTokens(text), [text]);
  const hasContent = text.trim().length > 0;
  const isChatbotWorkload = workloadType === "ai-chatbot";
  const safeSystemInstructionTokens = Math.floor(safeNumber(systemInstructionTokens, 0, 10_000_000));
  const safeHistoryMessages = isChatbotWorkload
    ? Math.floor(safeNumber(historyMessages, 0, 1000))
    : 0;
  const safeTokensPerHistoryMessage = isChatbotWorkload
    ? Math.floor(safeNumber(tokensPerHistoryMessage, 0, 100_000))
    : 0;
  const safeRagContextTokens = isChatbotWorkload
    ? Math.floor(safeNumber(ragContextTokens, 0, 10_000_000))
    : 0;
  const conversationHistoryTokens = safeHistoryMessages * safeTokensPerHistoryMessage;
  const chatbotContextTokens = conversationHistoryTokens + safeRagContextTokens;
  const supportsCachedInput = Boolean(model.cachedInputPricePerMillionTokens);
  const safeCachedInputPercentage = supportsCachedInput
    ? safeNumber(cachedInputPercentage, 0, 100)
    : 0;
  const totalInputTokens = hasContent
    ? getTotalInputTokens(tokenEstimate.tokens + chatbotContextTokens, safeSystemInstructionTokens)
    : 0;
  const remainingContextTokens = model.contextWindowTokens
    ? Math.max(0, model.contextWindowTokens - totalInputTokens)
    : Number.POSITIVE_INFINITY;
  const outputTokens = estimateOutputTokens(
    totalInputTokens,
    outputType,
    workloadType,
    remainingContextTokens,
  );
  const safeMonthlyInteractions = Math.floor(safeNumber(monthlyInteractions, 0));
  const totalTokensPerInteraction = totalInputTokens + outputTokens;
  const unitLabel = isChatbotWorkload ? "message" : "interaction";
  const unitLabelPlural = isChatbotWorkload ? "messages" : "interactions";
  const monthlyVolumeLabel = `${formatNumber(safeMonthlyInteractions)} ${
    safeMonthlyInteractions === 1 ? unitLabel : unitLabelPlural
  }/month`;

  const estimate = useMemo(
    () =>
      calculateCost({
        inputTokens: totalInputTokens,
        outputTokens,
        monthlyRequests: safeMonthlyInteractions,
        cachedInputPercentage: safeCachedInputPercentage,
        model,
      }),
    [model, outputTokens, safeCachedInputPercentage, safeMonthlyInteractions, totalInputTokens],
  );

  const comparisonRows = useMemo(() => {
    if (!hasContent) return [];
    const rows = MODEL_PRICING.filter((item) => selectedComparisonIds.includes(item.id)).map(
      (item) => {
        const available = item.contextWindowTokens
          ? Math.max(0, item.contextWindowTokens - totalInputTokens)
          : Number.POSITIVE_INFINITY;
        const comparableOutputTokens = estimateOutputTokens(
          totalInputTokens,
          outputType,
          workloadType,
          available,
        );
        return {
          model: item,
          estimate: calculateCost({
            inputTokens: totalInputTokens,
            outputTokens: comparableOutputTokens,
            monthlyRequests: safeMonthlyInteractions,
            cachedInputPercentage: safeCachedInputPercentage,
            model: item,
          }),
        };
      },
    );
    const lowest = rows.length ? Math.min(...rows.map((row) => row.estimate.monthlyCost)) : 0;
    return rows.map((row) => ({ ...row, isLowest: row.estimate.monthlyCost === lowest }));
  }, [
    hasContent,
    outputType,
    safeMonthlyInteractions,
    selectedComparisonIds,
    safeCachedInputPercentage,
    totalInputTokens,
    workloadType,
  ]);

  function formatCostDifference(diffUsd: number, isCurrentModel = false) {
    if (isCurrentModel) return "Current model";
    if (Math.abs(diffUsd) < 0.0000005) return "Same cost";
    const formatted = formatCurrency(Math.abs(diffUsd), currency);
    return diffUsd < 0 ? `Save ${formatted}` : `+${formatted}`;
  }

  function costDifferenceClass(diffUsd: number) {
    if (Math.abs(diffUsd) < 0.0000005) return "comparison-difference same";
    return diffUsd < 0 ? "comparison-difference saving" : "comparison-difference extra";
  }

  useEffect(() => {
    const query = encodeShareState({
      provider: provider.toLowerCase(),
      model: model.id,
      workload: workloadType,
      output: outputType,
      interactions: safeMonthlyInteractions,
      currency,
      systemInstructionTokens: safeSystemInstructionTokens,
      cachedInputPercentage: safeCachedInputPercentage,
    });
    window.history.replaceState(null, "", `${window.location.pathname}?${query}${window.location.hash}`);
  }, [
    currency,
    model.id,
    outputType,
    provider,
    safeMonthlyInteractions,
    safeCachedInputPercentage,
    safeSystemInstructionTokens,
    workloadType,
  ]);

  function applyPreset(nextWorkload: WorkloadType) {
    setWorkloadType(nextWorkload);
    const preset = getUseCasePreset(nextWorkload);
    setOutputType(preset.outputType);
    if (nextWorkload !== "custom") setMonthlyInteractions(String(preset.monthlyInteractions));
    if (nextWorkload === "ai-chatbot") applyChatbotPreset(CHATBOT_PRESETS[0].id, true);
    if (nextWorkload !== "ai-chatbot") {
      setHistoryMessages("0");
      setTokensPerHistoryMessage("0");
      setRagContextTokens("0");
    }
  }

  function applyChatbotPreset(nextPresetId: string, shouldReplaceText = false) {
    const preset = getChatbotPreset(nextPresetId);
    setChatbotPresetId(preset.id);
    setSystemInstructionTokens(String(preset.systemPromptTokens));
    setHistoryMessages(String(preset.historyMessages));
    setTokensPerHistoryMessage(String(preset.tokensPerHistoryMessage));
    setRagContextTokens(String(preset.ragContextTokens));
    setCachedInputPercentage(String(preset.cachedInputPercentage));
    setMonthlyInteractions(String(preset.monthlyMessages));
    setOutputType(preset.outputType);
    if (shouldReplaceText || text.trim() === "") setText(preset.sampleMessage);
  }

  function resetCalculator() {
    setWorkloadType("customer-call-chat");
    setProvider("OpenAI");
    setModelId(DEFAULT_MODEL_ID);
    setText("");
    setOutputType("summary");
    setMonthlyInteractions("1");
    setCachedInputPercentage("0");
    setSystemInstructionTokens("0");
    setChatbotPresetId(CHATBOT_PRESETS[0].id);
    setHistoryMessages("0");
    setTokensPerHistoryMessage("0");
    setRagContextTokens("0");
    setCurrency("USD");
    setCopyStatus("");
  }

  function showResult() {
    resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setResultEmphasis(true);
    window.setTimeout(() => setResultEmphasis(false), 900);
  }

  async function copyEstimate() {
    if (!hasContent) return;
    const workload = getUseCasePreset(workloadType);
    const output = OUTPUT_ESTIMATION_CONFIG[outputType];
    const summary = `LLM Cost Estimate

Workload: ${workload.name}
Output: ${output.label}
Provider: ${model.provider}
Model: ${model.displayName}

Total input tokens per interaction: ${formatNumber(estimate.inputTokens)}
Estimated output tokens per interaction: ${formatNumber(estimate.outputTokens)}
Monthly ${unitLabelPlural}: ${formatNumber(safeMonthlyInteractions)}

Cost per ${unitLabel}: ${formatCurrency(estimate.costPerRequest, "USD")}
Estimated monthly cost (${monthlyVolumeLabel}): ${formatCurrency(estimate.monthlyCost, "USD")}
Annual cost: ${formatCurrency(estimate.annualCost, "USD")}

Input token count is based on pasted content.
Output token count is estimated.

Estimated using llmcostestimator.com`;

    await navigator.clipboard.writeText(summary);
    setCopyStatus("Estimate copied");
    window.setTimeout(() => setCopyStatus(""), 1800);
  }

  return (
    <section className="section calculator-section" id="calculator">
      <div className="container">
        <div className="section-heading">
          {headingLevel === "h1" ? (
            <h1 className="section-title">{headingTitle}</h1>
          ) : (
            <h2>{headingTitle}</h2>
          )}
          <p className="lead">{headingDescription}</p>
          <p className="privacy-note">{privacyNote}</p>
        </div>

        <div className="calculator-grid">
          <div className="card">
            <div className="form-grid">
              <div className="field full">
                <label htmlFor="workloadType">Workload type</label>
                <select
                  id="workloadType"
                  value={workloadType}
                  onChange={(event) => applyPreset(event.target.value as WorkloadType)}
                >
                  {USE_CASE_PRESETS.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.name}
                    </option>
                  ))}
                </select>
              </div>

              {isChatbotWorkload ? (
                <div className="field full">
                  <label>Chatbot preset</label>
                  <p className="helper">
                    Choose the closest chatbot type. You can adjust details in Advanced Settings.
                  </p>
                  <div className="option-grid chatbot-preset-options">
                    {CHATBOT_PRESETS.map((preset) => (
                      <button
                        aria-pressed={chatbotPresetId === preset.id}
                        className={`option-card ${chatbotPresetId === preset.id ? "active" : ""}`}
                        key={preset.id}
                        onClick={() => applyChatbotPreset(preset.id)}
                        type="button"
                      >
                        <strong>{preset.name}</strong>
                        <span>{preset.description}</span>
                        <span>{formatNumber(preset.monthlyMessages)} messages/month</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="field">
                <label htmlFor="provider">Provider</label>
                <select
                  id="provider"
                  value={provider}
                  onChange={(event) => {
                    const nextProvider = event.target.value as Provider;
                    const nextModel = MODEL_PRICING.find((item) => item.provider === nextProvider);
                    setProvider(nextProvider);
                    setModelId(nextModel?.id ?? DEFAULT_MODEL_ID);
                    if (!nextModel?.cachedInputPricePerMillionTokens) setCachedInputPercentage("0");
                  }}
                >
                  {providers.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="model">Model</label>
                <select
                  id="model"
                  value={modelId}
                  onChange={(event) => {
                    const nextModel = MODEL_PRICING.find((item) => item.id === event.target.value);
                    setModelId(event.target.value);
                    if (!nextModel?.cachedInputPricePerMillionTokens) setCachedInputPercentage("0");
                  }}
                >
                  {providerModels.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.displayName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field full">
                <label htmlFor="workloadContent">{workloadCopy[workloadType].label}</label>
                <textarea
                  id="workloadContent"
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  placeholder={workloadCopy[workloadType].placeholder}
                />
                <div className="stats-row" aria-live="polite">
                  <span className="chip">Characters: {formatNumber(tokenEstimate.characters)}</span>
                  <span className="chip">Words: {formatNumber(tokenEstimate.words)}</span>
                  <span className="chip">Estimated input tokens: {formatNumber(tokenEstimate.tokens)}</span>
                  <span className="chip">Estimated token count</span>
                </div>
              </div>

              <div className="field full">
                <label>Output type</label>
                <div className="option-grid output-options">
                  {outputTypes.map((id) => {
                    const option = OUTPUT_ESTIMATION_CONFIG[id];
                    const displayOption = isChatbotWorkload ? chatbotOutputCopy[id] : option;
                    return (
                      <button
                        aria-pressed={outputType === id}
                        className={`option-card ${outputType === id ? "active" : ""}`}
                        key={id}
                        onClick={() => setOutputType(id)}
                        type="button"
                      >
                        <strong>{displayOption.label}</strong>
                        <span>{displayOption.description}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="helper">
                  {isChatbotWorkload
                    ? "Output tokens are estimated based on the selected reply type and input context."
                    : "Output tokens are estimated based on the selected summary type and input length."}
                </p>
              </div>

              <div className="field">
                <label htmlFor="monthlyInteractions">
                  {isChatbotWorkload ? "Monthly Messages" : "Monthly Interactions"}
                </label>
                <input
                  aria-describedby="monthlyInteractionsHelp monthlyInteractionsError"
                  aria-invalid={monthlyInteractions !== "" && safeMonthlyInteractions < 1}
                  id="monthlyInteractions"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  type="text"
                  value={monthlyInteractions}
                  onBlur={() => {
                    if (safeMonthlyInteractions < 1) setMonthlyInteractions("1");
                  }}
                  onChange={(event) => setMonthlyInteractions(wholeNumberInput(event.target.value))}
                  onFocus={(event) => event.currentTarget.select()}
                />
                <p className="helper" id="monthlyInteractionsHelp">{workloadCopy[workloadType].usageHelp}</p>
                {monthlyInteractions !== "" && safeMonthlyInteractions < 1 ? (
                  <p className="field-error" id="monthlyInteractionsError" role="alert">Enter at least 1 interaction.</p>
                ) : null}
              </div>

              <details className="advanced">
                <summary>Advanced Settings</summary>
                <div className="advanced-grid minimal">
                  <div className="field">
                    <div className="label-with-info">
                      <label htmlFor="systemInstructionTokens">System Instruction Tokens</label>
                      <span
                        aria-label="This includes recurring instructions sent with every transcript, such as the required summary format, extraction fields and response rules."
                        className="info-tooltip"
                        role="img"
                        tabIndex={0}
                        title="This includes recurring instructions sent with every transcript, such as the required summary format, extraction fields and response rules."
                      >i</span>
                    </div>
                    <input
                      aria-describedby="systemInstructionTokensHelp"
                      id="systemInstructionTokens"
                      inputMode="numeric"
                      min="0"
                      pattern="[0-9]*"
                      type="text"
                      value={systemInstructionTokens}
                      onChange={(event) => setSystemInstructionTokens(wholeNumberInput(event.target.value))}
                      onFocus={(event) => event.currentTarget.select()}
                    />
                    <p className="helper" id="systemInstructionTokensHelp">
                      Tokens used by the system prompt or recurring instructions in every {unitLabel}.
                    </p>
                  </div>

                  {isChatbotWorkload ? (
                    <>
                      <div className="field">
                        <label htmlFor="historyMessages">Conversation History Messages</label>
                        <input
                          id="historyMessages"
                          inputMode="numeric"
                          min="0"
                          pattern="[0-9]*"
                          type="text"
                          value={historyMessages}
                          onChange={(event) => setHistoryMessages(wholeNumberInput(event.target.value))}
                          onFocus={(event) => event.currentTarget.select()}
                        />
                        <p className="helper">Recent chat messages included with each new chatbot request.</p>
                      </div>

                      <div className="field">
                        <label htmlFor="tokensPerHistoryMessage">Tokens Per Past Message</label>
                        <input
                          id="tokensPerHistoryMessage"
                          inputMode="numeric"
                          min="0"
                          pattern="[0-9]*"
                          type="text"
                          value={tokensPerHistoryMessage}
                          onChange={(event) => setTokensPerHistoryMessage(wholeNumberInput(event.target.value))}
                          onFocus={(event) => event.currentTarget.select()}
                        />
                        <p className="helper">Average token size of each previous user or bot message.</p>
                      </div>

                      <div className="field">
                        <label htmlFor="ragContextTokens">RAG Context Tokens</label>
                        <input
                          id="ragContextTokens"
                          inputMode="numeric"
                          min="0"
                          pattern="[0-9]*"
                          type="text"
                          value={ragContextTokens}
                          onChange={(event) => setRagContextTokens(wholeNumberInput(event.target.value))}
                          onFocus={(event) => event.currentTarget.select()}
                        />
                        <p className="helper">Optional knowledge-base or document context sent with the chatbot request.</p>
                      </div>
                    </>
                  ) : null}

                  <div className="field">
                    <div className="label-with-info">
                      <label htmlFor="cachedInput">Cached Input Percentage</label>
                      <span
                        aria-label="Use this when repeated system instructions or prompt content are eligible for discounted cached-input pricing."
                        className="info-tooltip"
                        role="img"
                        tabIndex={0}
                        title="Use this when repeated system instructions or prompt content are eligible for discounted cached-input pricing."
                      >i</span>
                    </div>
                    <div className="input-with-suffix">
                      <input
                        aria-describedby="cachedInputHelp cachedInputError"
                        aria-invalid={safeNumber(cachedInputPercentage, 0, Number.MAX_SAFE_INTEGER) > 100}
                        disabled={!supportsCachedInput}
                        id="cachedInput"
                        inputMode="decimal"
                        max="100"
                        min="0"
                        type="text"
                        value={cachedInputPercentage}
                        onBlur={() => {
                          const value = safeNumber(cachedInputPercentage, 0, Number.MAX_SAFE_INTEGER);
                          if (cachedInputPercentage !== "" && (value > 100 || cachedInputPercentage === ".")) {
                            setCachedInputPercentage(String(Math.min(100, value)));
                          }
                        }}
                        onChange={(event) => setCachedInputPercentage(decimalInput(event.target.value))}
                        onFocus={(event) => event.currentTarget.select()}
                      />
                      <span aria-hidden="true">%</span>
                    </div>
                    <p className="helper" id="cachedInputHelp">
                      {supportsCachedInput
                        ? "Percentage of input tokens expected to use provider prompt caching."
                        : "Cached-input pricing is not available for the selected model."}
                    </p>
                    {safeNumber(cachedInputPercentage, 0, Number.MAX_SAFE_INTEGER) > 100 ? (
                      <p className="field-error" id="cachedInputError" role="alert">Enter a percentage from 0 to 100.</p>
                    ) : null}
                  </div>
                </div>
              </details>
            </div>

            <div className="button-row form-actions">
              <button className="button primary" disabled={!hasContent} onClick={showResult} type="button">
                Calculate Cost
              </button>
              <button className="button secondary" onClick={resetCalculator} type="button">
                Reset
              </button>
            </div>
          </div>

          <aside
            className={`card result-card ${resultEmphasis ? "emphasize" : ""}`}
            aria-live="polite"
            ref={resultRef}
          >
            {!hasContent ? (
              <div className="empty-result">
                <h3>Ready when you are</h3>
                <p>
                  Paste a sample transcript or content to calculate input tokens, estimated output tokens and monthly cost.
                </p>
              </div>
            ) : (
              <>
                <div className="primary-token-grid">
                  <div className="mini-card primary-metric-card">
                    <span>Cost per {unitLabel}</span>
                    <strong>{formatCurrency(estimate.costPerRequest, currency)}</strong>
                    <small>Per {unitLabel}</small>
                  </div>
                  <div className="mini-card primary-metric-card">
                    <span>Total Tokens</span>
                    <strong>{formatNumber(totalTokensPerInteraction)}</strong>
                    <small>Input: {formatNumber(estimate.inputTokens)} tokens</small>
                    <small>Output: {formatNumber(estimate.outputTokens)} estimated tokens</small>
                  </div>
                </div>

                {safeSystemInstructionTokens > 0 || safeCachedInputPercentage > 0 ? (
                  <div className="token-breakdown" aria-label="Input token breakdown">
                    {safeSystemInstructionTokens > 0 || chatbotContextTokens > 0 ? (
                      <>
                        <div className="metric-line">
                          <span>{isChatbotWorkload ? "Current Message Tokens" : "Transcript Tokens"}</span>
                          <strong>{formatNumber(tokenEstimate.tokens)}</strong>
                        </div>
                        {safeSystemInstructionTokens > 0 ? (
                          <div className="metric-line">
                            <span>System Instruction Tokens</span>
                            <strong>{formatNumber(safeSystemInstructionTokens)}</strong>
                          </div>
                        ) : null}
                        {conversationHistoryTokens > 0 ? (
                          <div className="metric-line">
                            <span>Conversation History Tokens</span>
                            <strong>{formatNumber(conversationHistoryTokens)}</strong>
                          </div>
                        ) : null}
                        {safeRagContextTokens > 0 ? (
                          <div className="metric-line">
                            <span>RAG Context Tokens</span>
                            <strong>{formatNumber(safeRagContextTokens)}</strong>
                          </div>
                        ) : null}
                        <div className="metric-line total-line">
                          <span>Total Input Tokens</span>
                          <strong>{formatNumber(estimate.inputTokens)}</strong>
                        </div>
                      </>
                    ) : null}
                    {safeCachedInputPercentage > 0 ? (
                      <>
                        <div className="metric-line">
                          <span>Normal Input Tokens</span>
                          <strong>{formatNumber(estimate.normalInputTokens)}</strong>
                        </div>
                        <div className="metric-line">
                          <span>Cached Input Tokens</span>
                          <strong>{formatNumber(estimate.cachedInputTokens)}</strong>
                        </div>
                        <div className="metric-line total-line">
                          <span>Cached Input Percentage</span>
                          <strong>{formatPercentage(safeCachedInputPercentage)}%</strong>
                        </div>
                      </>
                    ) : null}
                  </div>
                ) : null}

                <div className="result-heading-row">
                  <span className="helper">Calculation details</span>
                  <label className="currency-control">
                    <span>Currency</span>
                    <select value={currency} onChange={(event) => setCurrency(event.target.value as Currency)}>
                      <option value="USD">USD</option>
                      <option value="INR">INR</option>
                    </select>
                  </label>
                </div>

                <div className="result-details">
                  <div className="metric-line">
                    <span>Cost per 1,000 {unitLabelPlural}</span>
                    <strong>{formatCurrency(estimate.costPerThousandRequests, currency)}</strong>
                  </div>
                  <div className="metric-line">
                    <span>Monthly estimated cost ({monthlyVolumeLabel})</span>
                    <strong>{formatCurrency(estimate.monthlyCost, currency)}</strong>
                  </div>
                  <div className="metric-line">
                    <span>Annual estimated cost</span>
                    <strong>{formatCurrency(estimate.annualCost, currency)}</strong>
                  </div>
                  <div className="metric-line">
                    <span>Monthly {unitLabelPlural}</span>
                    <strong>{formatNumber(safeMonthlyInteractions)}</strong>
                  </div>
                  <div className="metric-line">
                    <span>Total monthly tokens</span>
                    <strong>{formatNumber(estimate.totalMonthlyTokens)}</strong>
                  </div>
                  <div className="metric-line">
                    <span>Input-token cost</span>
                    <strong>{formatCurrency(estimate.inputCostPerRequest, currency)}</strong>
                  </div>
                  <div className="metric-line">
                    <span>Output-token cost</span>
                    <strong>{formatCurrency(estimate.outputCostPerRequest, currency)}</strong>
                  </div>
                  {estimate.cachedInputTokens > 0 ? (
                    <div className="metric-line">
                      <span>Cached-input cost</span>
                      <strong>{formatCurrency(estimate.cachedInputCostPerRequest, currency)}</strong>
                    </div>
                  ) : null}
                  <div className="metric-line">
                    <span>Context-window status</span>
                    <strong>{estimate.fitsContextWindow ? "Fits" : "Exceeds"}</strong>
                  </div>
                  <div className="metric-line">
                    <span>Pricing last updated</span>
                    <strong>{model.pricingUpdatedAt}</strong>
                  </div>
                </div>

                {model.pricingNote ? <p className="fine-print">{model.pricingNote}</p> : null}

                <div className="estimate-explanation">
                  <p><strong>Input tokens:</strong> calculated from your pasted content and configured context.</p>
                  <p><strong>Output tokens:</strong> estimated from the selected {isChatbotWorkload ? "reply" : "summary"} type.</p>
                </div>
                <p className="fine-print">
                  The final output length and provider invoice may differ from this estimate. INR values use an indicative conversion rate.
                </p>
                <div className="button-row">
                  <a className="button primary" href="#compare">Compare Other Models</a>
                  <button className="button secondary" onClick={copyEstimate} type="button">Copy Estimate</button>
                  {copyStatus ? <span className="chip success">{copyStatus}</span> : null}
                </div>
              </>
            )}
          </aside>
        </div>

        <section className="section-heading compare-heading" id="compare">
          <h2>Compare the Same Workload Across Models</h2>
          <p className="lead">
            Compare model pricing, per-{unitLabel} cost, and monthly difference using the same current calculator values.
          </p>
          <div className="stats-row model-picks">
            {MODEL_PRICING.map((item) => (
              <label className="chip" key={item.id}>
                <input
                  checked={selectedComparisonIds.includes(item.id)}
                  onChange={(event) => {
                    setSelectedComparisonIds((current) =>
                      event.target.checked
                        ? [...current, item.id]
                        : current.filter((id) => id !== item.id),
                    );
                  }}
                  type="checkbox"
                />
                {item.displayName}
              </label>
            ))}
          </div>
        </section>

        {!hasContent ? (
          <div className="comparison-empty">Paste sample content above to compare model costs.</div>
        ) : (
          <>
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>Model</th>
                  <th>Model pricing</th>
                  <th className="numeric">Cost/{unitLabel}</th>
                  <th className="numeric">Difference/{unitLabel}</th>
                  <th className="numeric">Monthly cost ({monthlyVolumeLabel})</th>
                  <th className="numeric">Monthly difference</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, rowIndex) => {
                  const perRequestDifference = row.estimate.costPerRequest - estimate.costPerRequest;
                  const monthlyDifference = row.estimate.monthlyCost - estimate.monthlyCost;
                  const isCurrentModel = row.model.id === model.id;
                  const samePricingAs = comparisonRows
                    .slice(0, rowIndex)
                    .find(
                      (candidate) =>
                        candidate.model.provider === row.model.provider &&
                        candidate.model.inputPricePerMillionTokens === row.model.inputPricePerMillionTokens &&
                        candidate.model.outputPricePerMillionTokens === row.model.outputPricePerMillionTokens,
                    );
                  const rowClassName = [
                    row.isLowest ? "lowest" : "",
                    isCurrentModel ? "current-model" : "",
                  ].filter(Boolean).join(" ");

                  return (
                    <tr className={rowClassName} key={row.model.id}>
                      <td>{row.model.provider}</td>
                      <td>
                        {row.model.displayName}{" "}
                        {isCurrentModel ? <span className="chip">Current model</span> : null}
                        {row.isLowest ? <span className="chip success">Lowest estimated cost</span> : null}
                      </td>
                      <td>
                        <span className="comparison-price">Input ${row.model.inputPricePerMillionTokens}/1M</span>
                        <span className="comparison-price">Output ${row.model.outputPricePerMillionTokens}/1M</span>
                        {samePricingAs ? (
                          <span className="comparison-price-note">
                            Same pricing as {samePricingAs.model.displayName}
                          </span>
                        ) : null}
                      </td>
                      <td className="numeric">{formatCurrency(row.estimate.costPerRequest, currency)}</td>
                      <td className="numeric">
                        <span className={costDifferenceClass(perRequestDifference)}>
                          {formatCostDifference(perRequestDifference, isCurrentModel)}
                        </span>
                      </td>
                      <td className="numeric">{formatCurrency(row.estimate.monthlyCost, currency)}</td>
                      <td className="numeric">
                        <span className={costDifferenceClass(monthlyDifference)}>
                          {formatCostDifference(monthlyDifference, isCurrentModel)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="mobile-only">
              {comparisonRows.map((row, rowIndex) => {
                const perRequestDifference = row.estimate.costPerRequest - estimate.costPerRequest;
                const monthlyDifference = row.estimate.monthlyCost - estimate.monthlyCost;
                const isCurrentModel = row.model.id === model.id;
                const samePricingAs = comparisonRows
                  .slice(0, rowIndex)
                  .find(
                    (candidate) =>
                      candidate.model.provider === row.model.provider &&
                      candidate.model.inputPricePerMillionTokens === row.model.inputPricePerMillionTokens &&
                      candidate.model.outputPricePerMillionTokens === row.model.outputPricePerMillionTokens,
                  );

                return (
                  <article className="mini-card" key={row.model.id}>
                    <span>{row.model.provider} - {row.model.displayName}</span>
                    <strong>{formatCurrency(row.estimate.monthlyCost, currency)} / month</strong>
                    <p className="helper">
                      Pricing: input ${row.model.inputPricePerMillionTokens}/1M, output ${row.model.outputPricePerMillionTokens}/1M
                    </p>
                    {samePricingAs ? (
                      <p className="helper">Same pricing as {samePricingAs.model.displayName}</p>
                    ) : null}
                    <p className="helper">
                      {formatCurrency(row.estimate.costPerRequest, currency)} per {unitLabel} · {formatCostDifference(perRequestDifference, isCurrentModel)} per {unitLabel}
                    </p>
                    <p className="helper">
                      Monthly difference: <span className={costDifferenceClass(monthlyDifference)}>{formatCostDifference(monthlyDifference, isCurrentModel)}</span>
                    </p>
                    {isCurrentModel ? <span className="chip">Current model</span> : null}
                    {row.isLowest ? <span className="chip success">Lowest estimated cost</span> : null}
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
