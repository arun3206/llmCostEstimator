"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_MODEL_ID, MODEL_PRICING } from "@/data/modelPricing";
import { getUseCasePreset, USE_CASE_PRESETS } from "@/data/useCasePresets";
import { calculateCost } from "@/lib/costCalculator";
import { formatCurrency, formatNumber } from "@/lib/currency";
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
const workloadTypes: WorkloadType[] = ["custom", "customer-call-chat", "meeting-summary"];
const outputTypes: OutputType[] = ["summary", "summary-insights", "detailed-summary"];

const workloadCopy: Record<
  WorkloadType,
  { label: string; placeholder: string; usageHelp: string }
> = {
  custom: {
    label: "Paste your prompt, transcript or content",
    placeholder: "Paste the content that will be sent to the AI model...",
    usageHelp: "Number of AI requests expected each month",
  },
  "customer-call-chat": {
    label: "Paste a customer call or chat transcript",
    placeholder: "Paste a sample customer-agent conversation, support chat or call transcript...",
    usageHelp: "Number of customer calls or chats summarized each month",
  },
  "meeting-summary": {
    label: "Paste a meeting transcript or meeting notes",
    placeholder: "Paste a sample meeting transcript, discussion or meeting notes...",
    usageHelp: "Number of meetings summarized each month",
  },
};

function safeNumber(value: string | null, fallback: number, maximum = 1_000_000_000) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.min(parsed, maximum) : fallback;
}

function getInitialQueryState() {
  const defaults = {
    workloadType: "customer-call-chat" as WorkloadType,
    provider: "OpenAI" as Provider,
    modelId: DEFAULT_MODEL_ID,
    outputType: "summary" as OutputType,
    monthlyInteractions: 10000,
    currency: "USD" as Currency,
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

export default function CostCalculator() {
  const initial = useMemo(() => getInitialQueryState(), []);
  const [workloadType, setWorkloadType] = useState<WorkloadType>(initial.workloadType);
  const [provider, setProvider] = useState<Provider>(initial.provider);
  const [modelId, setModelId] = useState(initial.modelId);
  const [text, setText] = useState("");
  const [outputType, setOutputType] = useState<OutputType>(initial.outputType);
  const [monthlyInteractions, setMonthlyInteractions] = useState(initial.monthlyInteractions);
  const [cachedInputPercentage, setCachedInputPercentage] = useState(initial.cachedInputPercentage);
  const [systemInstructionTokens, setSystemInstructionTokens] = useState(initial.systemInstructionTokens);
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
  const totalInputTokens = hasContent
    ? getTotalInputTokens(tokenEstimate.tokens, systemInstructionTokens)
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
  const safeMonthlyInteractions = Number.isFinite(monthlyInteractions)
    ? Math.max(0, Math.floor(monthlyInteractions))
    : 0;

  const estimate = useMemo(
    () =>
      calculateCost({
        inputTokens: totalInputTokens,
        outputTokens,
        monthlyRequests: safeMonthlyInteractions,
        cachedInputPercentage,
        model,
      }),
    [cachedInputPercentage, model, outputTokens, safeMonthlyInteractions, totalInputTokens],
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
            cachedInputPercentage,
            model: item,
          }),
        };
      },
    );
    const lowest = rows.length ? Math.min(...rows.map((row) => row.estimate.monthlyCost)) : 0;
    return rows.map((row) => ({ ...row, isLowest: row.estimate.monthlyCost === lowest }));
  }, [
    cachedInputPercentage,
    hasContent,
    outputType,
    safeMonthlyInteractions,
    selectedComparisonIds,
    totalInputTokens,
    workloadType,
  ]);

  useEffect(() => {
    const query = encodeShareState({
      provider: provider.toLowerCase(),
      model: model.id,
      workload: workloadType,
      output: outputType,
      interactions: safeMonthlyInteractions,
      currency,
      systemInstructionTokens: Math.max(0, systemInstructionTokens),
      cachedInputPercentage: Math.max(0, Math.min(100, cachedInputPercentage)),
    });
    window.history.replaceState(null, "", `${window.location.pathname}?${query}${window.location.hash}`);
  }, [
    cachedInputPercentage,
    currency,
    model.id,
    outputType,
    provider,
    safeMonthlyInteractions,
    systemInstructionTokens,
    workloadType,
  ]);

  function applyPreset(nextWorkload: WorkloadType) {
    setWorkloadType(nextWorkload);
    const preset = getUseCasePreset(nextWorkload);
    setOutputType(preset.outputType);
    if (nextWorkload !== "custom") setMonthlyInteractions(preset.monthlyInteractions);
  }

  function resetCalculator() {
    setWorkloadType("customer-call-chat");
    setProvider("OpenAI");
    setModelId(DEFAULT_MODEL_ID);
    setText("");
    setOutputType("summary");
    setMonthlyInteractions(10000);
    setCachedInputPercentage(0);
    setSystemInstructionTokens(0);
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

Input tokens per interaction: ${formatNumber(estimate.inputTokens)}
Estimated output tokens per interaction: ${formatNumber(estimate.outputTokens)}
Monthly interactions: ${formatNumber(safeMonthlyInteractions)}

Cost per interaction: ${formatCurrency(estimate.costPerRequest, "USD")}
Monthly cost: ${formatCurrency(estimate.monthlyCost, "USD")}
Annual cost: ${formatCurrency(estimate.annualCost, "USD")}

Input token count is based on pasted content.
Output token count is estimated.

Estimated using llmcostestimator.com`;

    await navigator.clipboard.writeText(summary);
    setCopyStatus("Estimate copied");
    window.setTimeout(() => setCopyStatus(""), 1800);
  }

  const inputShare = estimate.costPerRequest
    ? ((estimate.inputCostPerRequest + estimate.cachedInputCostPerRequest) /
        estimate.costPerRequest) *
      100
    : 0;
  const outputShare = estimate.costPerRequest
    ? (estimate.outputCostPerRequest / estimate.costPerRequest) * 100
    : 0;

  return (
    <section className="section" id="calculator">
      <div className="container">
        <div className="section-heading">
          <h2>Calculate Your Summarization Cost</h2>
          <p className="lead">
            Paste a sample transcript, select the summary you need, and estimate your monthly API spend.
          </p>
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

              <div className="field">
                <label htmlFor="provider">Provider</label>
                <select
                  id="provider"
                  value={provider}
                  onChange={(event) => {
                    const nextProvider = event.target.value as Provider;
                    setProvider(nextProvider);
                    setModelId(
                      MODEL_PRICING.find((item) => item.provider === nextProvider)?.id ??
                        DEFAULT_MODEL_ID,
                    );
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
                <select id="model" value={modelId} onChange={(event) => setModelId(event.target.value)}>
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
                    return (
                      <button
                        aria-pressed={outputType === id}
                        className={`option-card ${outputType === id ? "active" : ""}`}
                        key={id}
                        onClick={() => setOutputType(id)}
                        type="button"
                      >
                        <strong>{option.label}</strong>
                        <span>{option.description}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="helper">
                  Output tokens are estimated based on the selected summary type and input length.
                </p>
              </div>

              <div className="field full">
                <label htmlFor="monthlyInteractions">Monthly interactions</label>
                <input
                  id="monthlyInteractions"
                  min={0}
                  type="number"
                  value={monthlyInteractions}
                  onChange={(event) => setMonthlyInteractions(Number(event.target.value))}
                />
                <p className="helper">{workloadCopy[workloadType].usageHelp}</p>
              </div>

              <details className="advanced">
                <summary>Advanced settings</summary>
                <div className="advanced-grid minimal">
                  <div className="field">
                    <label htmlFor="systemInstructionTokens">System instruction tokens</label>
                    <input
                      id="systemInstructionTokens"
                      min={0}
                      type="number"
                      value={systemInstructionTokens}
                      onChange={(event) => setSystemInstructionTokens(Number(event.target.value))}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="cachedInput">Cached input percentage</label>
                    <input
                      disabled={!model.cachedInputPricePerMillionTokens}
                      id="cachedInput"
                      max={100}
                      min={0}
                      type="number"
                      value={cachedInputPercentage}
                      onChange={(event) => setCachedInputPercentage(Number(event.target.value))}
                    />
                    {!model.cachedInputPricePerMillionTokens ? (
                      <span className="helper">Cached input pricing is not configured for this model.</span>
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
            <div className="result-heading-row">
              <span className="chip success">Estimated Monthly Cost</span>
              <label className="currency-control">
                <span>Currency</span>
                <select value={currency} onChange={(event) => setCurrency(event.target.value as Currency)}>
                  <option value="USD">USD</option>
                  <option value="INR">INR</option>
                </select>
              </label>
            </div>

            {!hasContent ? (
              <div className="empty-result">
                <h3>Ready when you are</h3>
                <p>Paste a sample transcript or content to calculate an estimate.</p>
              </div>
            ) : (
              <>
                <p className="big-money">{formatCurrency(estimate.monthlyCost, currency)}</p>
                {currency === "USD" ? (
                  <p className="helper">Approximately {formatCurrency(estimate.monthlyCost, "INR")} per month</p>
                ) : null}

                <div className="result-grid">
                  <div className="mini-card">
                    <span>Cost per interaction</span>
                    <strong>{formatCurrency(estimate.costPerRequest, currency)}</strong>
                  </div>
                  <div className="mini-card">
                    <span>Cost per 1,000 interactions</span>
                    <strong>{formatCurrency(estimate.costPerThousandRequests, currency)}</strong>
                  </div>
                  <div className="mini-card">
                    <span>Annual cost</span>
                    <strong>{formatCurrency(estimate.annualCost, currency)}</strong>
                  </div>
                  <div className="mini-card">
                    <span>Total monthly tokens</span>
                    <strong>{formatNumber(estimate.totalMonthlyTokens)}</strong>
                  </div>
                </div>

                <div className="bar-group">
                  <div>
                    <div className="bar-top">
                      <span>Input-token cost per interaction</span>
                      <strong>
                        {formatCurrency(
                          estimate.inputCostPerRequest + estimate.cachedInputCostPerRequest,
                          currency,
                        )}
                      </strong>
                    </div>
                    <div className="bar"><span style={{ width: `${Math.max(3, inputShare)}%` }} /></div>
                  </div>
                  <div>
                    <div className="bar-top">
                      <span>Output-token cost per interaction</span>
                      <strong>{formatCurrency(estimate.outputCostPerRequest, currency)}</strong>
                    </div>
                    <div className="bar secondary"><span style={{ width: `${Math.max(3, outputShare)}%` }} /></div>
                  </div>
                </div>

                <div className="info-panel">
                  <div className="metric-line">
                    <span>Input tokens per interaction</span>
                    <strong>{formatNumber(estimate.inputTokens)}</strong>
                  </div>
                  <div className="metric-line">
                    <span>Estimated output tokens</span>
                    <strong>{formatNumber(estimate.outputTokens)}</strong>
                  </div>
                  <div className="metric-line">
                    <span>Context window</span>
                    <strong>{estimate.fitsContextWindow ? "Fits" : "Exceeds"}</strong>
                  </div>
                  <div className="metric-line">
                    <span>Pricing last updated</span>
                    <strong>{model.pricingUpdatedAt}</strong>
                  </div>
                </div>

                {model.pricingNote ? <p className="fine-print">{model.pricingNote}</p> : null}

                <div className="estimate-explanation">
                  <p><strong>Input tokens:</strong> calculated from your pasted content.</p>
                  <p><strong>Output tokens:</strong> estimated from the selected summary type.</p>
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
          <p className="lead">Compare cost using the same transcript, output type, and monthly interactions.</p>
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
                  <th>Provider</th><th>Model</th><th className="numeric">Input price</th>
                  <th className="numeric">Output price</th><th className="numeric">Cost/interaction</th>
                  <th className="numeric">Monthly</th><th className="numeric">Annual</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr className={row.isLowest ? "lowest" : ""} key={row.model.id}>
                    <td>{row.model.provider}</td>
                    <td>{row.model.displayName} {row.isLowest ? <span className="chip success">Lowest estimated cost</span> : null}</td>
                    <td className="numeric">${row.model.inputPricePerMillionTokens}/1M</td>
                    <td className="numeric">${row.model.outputPricePerMillionTokens}/1M</td>
                    <td className="numeric">{formatCurrency(row.estimate.costPerRequest, currency)}</td>
                    <td className="numeric">{formatCurrency(row.estimate.monthlyCost, currency)}</td>
                    <td className="numeric">{formatCurrency(row.estimate.annualCost, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mobile-only">
              {comparisonRows.map((row) => (
                <article className="mini-card" key={row.model.id}>
                  <span>{row.model.provider} · {row.model.displayName}</span>
                  <strong>{formatCurrency(row.estimate.monthlyCost, currency)} / month</strong>
                  <p className="helper">
                    {formatCurrency(row.estimate.costPerRequest, currency)} per interaction · {formatCurrency(row.estimate.annualCost, currency)} annually
                  </p>
                  {row.isLowest ? <span className="chip success">Lowest estimated cost</span> : null}
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
