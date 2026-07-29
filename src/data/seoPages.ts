import type { OutputType, WorkloadType } from "@/types/calculator";
import type { Provider } from "@/types/pricing";

export type SeoPage = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  eyebrow: string;
  intro: string;
  provider?: Provider;
  workloadType?: WorkloadType;
  outputType?: OutputType;
  guideSections?: Array<{
    heading: string;
    body: string[];
    table?: {
      columns: string[];
      rows: string[][];
    };
  }>;
  faqs: Array<[string, string]>;
};

export const seoPages: SeoPage[] = [
  {
    slug: "openai-cost-calculator",
    title: "OpenAI Cost Calculator",
    metaTitle: "OpenAI Cost Calculator - Estimate GPT API Costs",
    description:
      "Estimate GPT API costs for prompts, summaries, chatbots and AI workflows. Compare OpenAI pricing against Claude, Gemini and DeepSeek models.",
    eyebrow: "GPT API pricing",
    intro:
      "Use this OpenAI cost calculator to estimate cost per interaction, monthly spend and token usage for GPT-powered apps before you build.",
    provider: "OpenAI",
    workloadType: "customer-call-chat",
    outputType: "summary-insights",
    faqs: [
      ["How do I estimate OpenAI API cost?", "Paste a representative prompt, transcript or content sample, then enter expected monthly interactions. The calculator estimates input tokens, output tokens and monthly cost."],
      ["Does this call the OpenAI API?", "No. The MVP runs locally in your browser and does not require an API key."],
      ["Can I compare OpenAI with other models?", "Yes. The comparison table uses the same workload across supported OpenAI, Anthropic, Google and DeepSeek models."],
    ],
  },
  {
    slug: "claude-cost-calculator",
    title: "Claude Cost Calculator",
    metaTitle: "Claude Cost Calculator - Estimate Anthropic API Costs",
    description:
      "Estimate Claude API costs for summarization, support transcripts, documents and AI workflows. Compare Anthropic pricing with OpenAI, Gemini and DeepSeek.",
    eyebrow: "Anthropic API pricing",
    intro:
      "Use this Claude cost calculator to plan Anthropic API spend for summaries, insights and detailed analysis workloads.",
    provider: "Anthropic",
    workloadType: "meeting-summary",
    outputType: "detailed-summary",
    faqs: [
      ["What can I estimate on this Claude calculator?", "You can estimate cost per interaction, monthly cost, annual cost and token usage for Claude-style summarization workloads."],
      ["Are Claude token counts exact?", "The MVP labels token counts as estimated because providers can tokenize content differently."],
      ["Can I compare Claude with GPT or Gemini?", "Yes. Use the model comparison section to compare the same workload across providers."],
    ],
  },
  {
    slug: "gemini-cost-calculator",
    title: "Gemini Cost Calculator",
    metaTitle: "Gemini Cost Calculator - Estimate Google AI API Costs",
    description:
      "Estimate Gemini API costs for prompts, summaries, support content and AI products. Compare Google model pricing across common workloads.",
    eyebrow: "Google AI pricing",
    intro:
      "Use this Gemini cost calculator to estimate Google AI API spend from a real content sample and monthly usage volume.",
    provider: "Google",
    workloadType: "customer-call-chat",
    outputType: "summary",
    faqs: [
      ["How do I calculate Gemini API cost?", "Paste sample content, choose a summary type and enter monthly interactions. The calculator applies model input and output pricing."],
      ["Does this include Google Cloud infrastructure cost?", "No. This MVP estimates only model token costs, not storage, databases, transcription or cloud infrastructure."],
      ["Can I use this for Gemini chatbot estimates?", "Yes. Use a representative chat or prompt sample and set monthly interactions to your expected message volume."],
    ],
  },
  {
    slug: "ai-summarization-cost-calculator",
    title: "AI Summarization Cost Calculator",
    metaTitle: "AI Summarization Cost Calculator - Estimate Monthly LLM Spend",
    description:
      "Estimate the cost of AI summarization for calls, chats, meetings, transcripts and documents across leading LLM providers.",
    eyebrow: "Summarization workload pricing",
    intro:
      "Use this AI summarization cost calculator to plan monthly spend for customer conversations, meeting notes, documents and transcript summaries.",
    workloadType: "customer-call-chat",
    outputType: "summary-insights",
    faqs: [
      ["What inputs affect summarization cost?", "Input length, summary detail, selected model, system instruction tokens, caching and monthly interaction volume all affect cost."],
      ["Does this include speech-to-text cost?", "No. Speech-to-text transcription is not included yet; this calculator focuses on LLM summarization cost."],
      ["Can I use one transcript as a sample?", "Yes. Paste a representative transcript and scale it by monthly interactions to estimate total spend."],
    ],
  },
  {
    slug: "chatbot-cost-calculator",
    title: "Chatbot Cost Calculator",
    metaTitle: "Chatbot Cost Calculator - Estimate AI Chat API Costs",
    description:
      "Estimate AI chatbot API costs from prompt size, expected response length and monthly message volume across popular LLM models.",
    eyebrow: "AI chatbot pricing",
    intro:
      "Use this chatbot cost calculator to estimate per-message cost and monthly API spend for AI chatbots and support assistants.",
    workloadType: "ai-chatbot",
    outputType: "summary-insights",
    faqs: [
      ["How do I estimate chatbot API cost?", "Paste a representative chat prompt or conversation context, choose expected output length and enter monthly message volume."],
      ["Why do chatbot costs vary?", "Costs change with context size, response length, model choice, cached prompts and conversation volume."],
      ["Can I compare chatbot costs across models?", "Yes. The comparison table estimates the same workload across the supported providers."],
    ],
  },
  {
    slug: "rag-cost-calculator",
    title: "RAG Cost Calculator",
    metaTitle: "RAG Cost Calculator - Estimate Retrieval AI Costs",
    description:
      "Estimate RAG application costs from user questions, retrieved context, system prompts, output tokens and monthly query volume.",
    eyebrow: "Retrieval augmented generation pricing",
    intro:
      "Use this RAG cost calculator to estimate how retrieved knowledge-base context changes per-query and monthly LLM API spend.",
    workloadType: "custom",
    outputType: "summary-insights",
    guideSections: [
      {
        heading: "What to include in a RAG cost estimate",
        body: [
          "A RAG request usually includes the user question, system instructions, retrieved document chunks and the generated answer. The retrieved chunks are often the biggest hidden cost because they are sent on every query.",
          "For a practical first estimate, paste a typical user question plus representative retrieved context into the calculator, then scale it by expected monthly queries.",
        ],
        table: {
          columns: ["RAG component", "Typical token range", "Why it matters"],
          rows: [
            ["User question", "20-150", "Usually small, but present on every request"],
            ["System instructions", "200-800", "Can often be cached or shortened"],
            ["Retrieved context", "1,000-8,000", "Main driver of input-token cost"],
            ["Generated answer", "200-800", "Drives output-token cost"],
          ],
        },
      },
    ],
    faqs: [
      ["How do I estimate RAG API cost?", "Add the user question, system prompt and retrieved context as input tokens, estimate answer length, then multiply by monthly query volume."],
      ["Does this include vector database cost?", "No. This page estimates LLM token cost only. Vector storage and search infrastructure should be estimated separately."],
      ["What reduces RAG cost the fastest?", "Send fewer retrieved chunks, trim repeated instructions, cache stable prompt text and route simple questions to lower-cost models."],
    ],
  },
  {
    slug: "customer-support-ai-cost-calculator",
    title: "Customer Support AI Cost Calculator",
    metaTitle: "Customer Support AI Cost Calculator - Estimate Support Bot Spend",
    description:
      "Estimate AI cost for customer support chats, call summaries, ticket triage and support automation across LLM providers.",
    eyebrow: "Customer support AI pricing",
    intro:
      "Use this customer support AI cost calculator to model monthly spend for support summaries, chatbot replies and ticket workflows.",
    workloadType: "customer-call-chat",
    outputType: "summary-insights",
    guideSections: [
      {
        heading: "Support cost depends on transcript length and volume",
        body: [
          "Support AI workloads are usually repeated at high volume. A short ticket summary may be cheap per interaction, but thousands of monthly tickets can create meaningful spend.",
          "Use a real support conversation as the sample input. Include any recurring instructions or required output format in system instruction tokens.",
        ],
        table: {
          columns: ["Support workload", "Input to estimate", "Output to estimate"],
          rows: [
            ["Chat summary", "Full chat transcript", "Issue, resolution, sentiment and next action"],
            ["Ticket triage", "Ticket text plus metadata", "Category, priority and routing"],
            ["Agent assist", "Conversation history plus knowledge context", "Suggested answer"],
          ],
        },
      },
    ],
    faqs: [
      ["Can I estimate cost per support ticket?", "Yes. Paste a representative ticket or conversation and set monthly interactions to your expected ticket volume."],
      ["Should I include agent instructions?", "Yes. Recurring instructions affect input tokens and should be added as system instruction tokens."],
      ["Does this include helpdesk software cost?", "No. It estimates only LLM token cost, not Zendesk, Intercom, storage or workflow tools."],
    ],
  },
  {
    slug: "meeting-summary-cost-calculator",
    title: "Meeting Summary Cost Calculator",
    metaTitle: "Meeting Summary Cost Calculator - Estimate AI Notes Cost",
    description:
      "Estimate the monthly LLM cost of summarizing meeting transcripts into notes, decisions, action items and follow-ups.",
    eyebrow: "Meeting notes AI pricing",
    intro:
      "Use this meeting summary cost calculator to estimate AI notes spend from transcript size, output detail and monthly meeting volume.",
    workloadType: "meeting-summary",
    outputType: "detailed-summary",
    guideSections: [
      {
        heading: "Estimate from representative meeting transcripts",
        body: [
          "Meeting transcripts vary widely. A 15-minute standup and a 90-minute workshop can have very different token counts, so estimating from a real sample is better than using a flat per-meeting price.",
          "Detailed meeting outputs usually cost more because action items, owners, risks and decisions require longer generated responses.",
        ],
        table: {
          columns: ["Meeting type", "Common input size", "Recommended output type"],
          rows: [
            ["Short standup", "2,000-5,000 tokens", "Summary"],
            ["Customer call", "5,000-12,000 tokens", "Summary + Insights"],
            ["Workshop", "12,000+ tokens", "Detailed Summary"],
          ],
        },
      },
    ],
    faqs: [
      ["Does this include transcription cost?", "No. It estimates only the LLM summarization cost after transcript text exists."],
      ["How do I estimate long meetings?", "Paste a representative transcript or enter the expected token count manually, then choose detailed output if you need decisions and actions."],
      ["Can I compare meeting cost across models?", "Yes. The comparison table applies the same meeting workload to each selected model."],
    ],
  },
  {
    slug: "document-summarization-cost-calculator",
    title: "Document Summarization Cost Calculator",
    metaTitle: "Document Summarization Cost Calculator - Estimate AI PDF Costs",
    description:
      "Estimate LLM API costs for summarizing PDFs, reports, contracts, policies and business documents.",
    eyebrow: "Document AI pricing",
    intro:
      "Use this document summarization cost calculator to estimate cost from document length, summary detail and monthly document volume.",
    workloadType: "custom",
    outputType: "detailed-summary",
    guideSections: [
      {
        heading: "Document size is the main cost driver",
        body: [
          "Document summarization cost usually rises with input length. Reports, policies and contracts can be much larger than chat messages, especially when OCR or extracted text includes tables and repeated headers.",
          "For a useful estimate, paste extracted text from a representative document and set monthly interactions to the number of documents processed.",
        ],
        table: {
          columns: ["Document type", "Cost driver", "Planning tip"],
          rows: [
            ["PDF report", "Long extracted text", "Estimate from an average report, not a short sample"],
            ["Contract", "Detailed output requirements", "Include clauses and extraction instructions"],
            ["Policy document", "Large input context", "Chunk long documents if they exceed context limits"],
          ],
        },
      },
    ],
    faqs: [
      ["Can I paste PDF text into the calculator?", "Yes. Paste extracted text from the PDF or enter manual token counts if your pipeline already measures them."],
      ["Does this include OCR cost?", "No. OCR, storage and document parsing costs are not included in this MVP."],
      ["How do I estimate bulk document processing?", "Estimate one average document, then set monthly interactions to the number of documents processed per month."],
    ],
  },
  {
    slug: "ai-agent-cost-calculator",
    title: "AI Agent Cost Calculator",
    metaTitle: "AI Agent Cost Calculator - Estimate Multi-Step LLM Spend",
    description:
      "Estimate AI agent costs for multi-step workflows with repeated model calls, tool results, context and final outputs.",
    eyebrow: "AI agent pricing",
    intro:
      "Use this AI agent cost calculator to plan spend for workflows where one user task may trigger multiple LLM interactions.",
    workloadType: "custom",
    outputType: "summary-insights",
    guideSections: [
      {
        heading: "AI agents often cost more than one prompt",
        body: [
          "An AI agent may call a model several times to plan, use tools, read results and produce a final answer. A good MVP estimate should model the average tokens per step and the number of steps per task.",
          "Use the calculator by pasting the average context for one agent step, then multiply monthly interactions by expected agent steps or runs.",
        ],
        table: {
          columns: ["Agent step", "Tokens to include", "Cost risk"],
          rows: [
            ["Planning", "Goal, constraints and available tools", "Usually small but repeated"],
            ["Tool result analysis", "Tool output and previous context", "Can grow quickly"],
            ["Final response", "Summarized context and answer", "Output tokens matter most"],
          ],
        },
      },
    ],
    faqs: [
      ["How should I estimate multi-step agent cost?", "Estimate the average cost of one model call, then multiply by the average number of model calls per agent task."],
      ["Does this include tool API costs?", "No. It estimates model token cost only, not third-party API calls or workflow infrastructure."],
      ["What reduces AI agent cost?", "Limit unnecessary steps, summarize tool outputs, cache stable instructions and use cheaper models for simple planning steps."],
    ],
  },
  {
    slug: "llm-token-calculator",
    title: "LLM Token Calculator",
    metaTitle: "LLM Token Calculator - Estimate Tokens and API Cost",
    description:
      "Estimate LLM token counts, input tokens, output tokens, cost per request and monthly API spend from pasted text.",
    eyebrow: "Token counting and pricing",
    intro:
      "Use this LLM token calculator to estimate how prompt size affects model cost across OpenAI, Claude, Gemini and DeepSeek.",
    workloadType: "custom",
    outputType: "summary",
    guideSections: [
      {
        heading: "Tokens connect prompt size to API cost",
        body: [
          "LLM providers price usage by tokens, not by words or pages. Input tokens are what you send to the model. Output tokens are what the model generates.",
          "This calculator labels token counts as estimates where provider-specific tokenization may vary, then applies model pricing to show practical cost impact.",
        ],
        table: {
          columns: ["Metric", "Meaning", "Why it matters"],
          rows: [
            ["Input tokens", "Prompt, context and instructions", "Usually controls context cost"],
            ["Output tokens", "Generated response", "Often priced higher than input"],
            ["Monthly tokens", "Tokens per request times volume", "Useful for budget planning"],
          ],
        },
      },
    ],
    faqs: [
      ["Is this an exact tokenizer?", "The MVP uses local estimation and clearly labels token counts as estimated when they are not provider-exact."],
      ["Why do output tokens matter?", "Many providers charge more for generated output than input, so long answers can materially increase cost."],
      ["Can I use manual token counts?", "Yes. If you already know production token usage, enter tokens manually instead of relying on pasted-text estimation."],
    ],
  },
  {
    slug: "gpt-api-cost-calculator",
    title: "GPT API Cost Calculator",
    metaTitle: "GPT API Cost Calculator - Estimate OpenAI Token Spend",
    description:
      "Estimate GPT API cost for prompts, chatbots, summaries and AI apps using token counts and monthly request volume.",
    eyebrow: "GPT token pricing",
    intro:
      "Use this GPT API cost calculator to estimate OpenAI model spend before launching a chatbot, summarizer or AI workflow.",
    provider: "OpenAI",
    workloadType: "custom",
    outputType: "summary-insights",
    guideSections: [
      {
        heading: "Plan GPT spend before production",
        body: [
          "GPT API cost depends on model choice, prompt length, output length and request volume. The same feature can have very different monthly cost depending on whether it sends a short prompt or a full conversation history.",
          "Paste a realistic prompt or transcript, then compare GPT models against other providers in the comparison section.",
        ],
        table: {
          columns: ["Use case", "Estimate with", "Watch out for"],
          rows: [
            ["Support bot", "Message + history + answer", "Growing conversation context"],
            ["Summarizer", "Transcript + summary output", "Long transcripts"],
            ["Workflow automation", "Instructions + data + response", "Repeated model calls"],
          ],
        },
      },
    ],
    faqs: [
      ["Is this different from the OpenAI cost calculator?", "This page targets GPT API planning broadly, while the OpenAI page focuses on provider-level comparison."],
      ["Can I estimate GPT chatbot cost?", "Yes. Use AI Chatbot mode or paste a representative chat context and set monthly message volume."],
      ["Does this call OpenAI?", "No. It calculates locally from estimated tokens and configured pricing data."],
    ],
  },
  {
    slug: "cost-per-1000-ai-chatbot-messages",
    title: "Cost Per 1,000 AI Chatbot Messages",
    metaTitle: "Cost Per 1,000 AI Chatbot Messages - LLM Pricing Guide",
    description:
      "Estimate cost per 1,000 AI chatbot messages and monthly spend based on message size, context and model pricing.",
    eyebrow: "Chatbot unit economics",
    intro:
      "Use this page to estimate chatbot cost per 1,000 messages, then scale the same workload to monthly traffic.",
    workloadType: "ai-chatbot",
    outputType: "summary-insights",
    guideSections: [
      {
        heading: "Why cost per 1,000 messages is useful",
        body: [
          "Cost per message can be too small to understand. Cost per 1,000 messages makes it easier to compare models, price plans and estimate chatbot gross margin.",
          "For best results, choose the closest chatbot preset, then adjust conversation history and RAG context in Advanced Settings.",
        ],
        table: {
          columns: ["Chatbot type", "Main cost driver", "Optimization idea"],
          rows: [
            ["Lead capture", "Short replies", "Use small models for first responses"],
            ["Support bot", "History and knowledge context", "Limit retrieved context"],
            ["Internal assistant", "Policy or document context", "Cache stable instructions"],
          ],
        },
      },
    ],
    faqs: [
      ["How do I calculate cost per 1,000 chatbot messages?", "Estimate cost per message, then multiply by 1,000. The calculator displays this metric automatically."],
      ["Should I count user and bot messages separately?", "For API cost, count each model request. Include user text, history, retrieved context and expected model reply."],
      ["Why can two chatbots with the same users cost differently?", "Different message lengths, context windows, RAG usage and output lengths can produce very different token usage."],
    ],
  },
  {
    slug: "cached-input-pricing-calculator",
    title: "Cached Input Pricing Calculator",
    metaTitle: "Cached Input Pricing Calculator - Estimate LLM Cache Savings",
    description:
      "Estimate how cached input pricing can reduce LLM API costs for repeated system prompts, instructions and shared context.",
    eyebrow: "Prompt caching savings",
    intro:
      "Use this cached input pricing calculator to estimate savings when part of your prompt is reused across many LLM requests.",
    workloadType: "custom",
    outputType: "summary-insights",
    guideSections: [
      {
        heading: "Cached input helps repeated prompts",
        body: [
          "Some models offer lower pricing for cached or reused input tokens. This matters for apps that send the same system instructions, policy text or tool schema on many requests.",
          "Enter stable prompt content as system instruction tokens and adjust cached input percentage in Advanced Settings to estimate the impact.",
        ],
        table: {
          columns: ["Reusable input", "Good caching candidate?", "Reason"],
          rows: [
            ["System prompt", "Yes", "Often repeated on every request"],
            ["Tool schema", "Yes", "Usually stable across calls"],
            ["User message", "No", "Usually different each request"],
          ],
        },
      },
    ],
    faqs: [
      ["What is cached input pricing?", "It is discounted pricing for prompt tokens that a provider can reuse from previous requests."],
      ["Which tokens should I mark as cached?", "Only stable repeated tokens, such as recurring instructions or shared context. Do not mark unique user content as cached."],
      ["Do all models support cached input pricing?", "No. The calculator only applies cached-input cost where the selected model has cached pricing configured."],
    ],
  },
  {
    slug: "openai-vs-claude-vs-gemini-cost-comparison",
    title: "OpenAI vs Claude vs Gemini Cost Comparison",
    metaTitle: "OpenAI vs Claude vs Gemini Cost Comparison Calculator",
    description:
      "Compare estimated OpenAI, Claude and Gemini API costs for the same prompt, transcript, chatbot or summarization workload.",
    eyebrow: "LLM provider cost comparison",
    intro:
      "Use this comparison calculator to see how the same workload prices across OpenAI, Anthropic Claude, Google Gemini and other models.",
    workloadType: "custom",
    outputType: "summary-insights",
    guideSections: [
      {
        heading: "Compare providers using the same workload",
        body: [
          "A fair model cost comparison must use the same input tokens, output tokens and monthly volume across providers. Otherwise, small prompt differences can distort the result.",
          "Paste one representative workload, then use the comparison table to view per-interaction cost, monthly cost and savings versus your selected model.",
        ],
        table: {
          columns: ["Comparison metric", "Why it helps", "Where to look"],
          rows: [
            ["Cost per interaction", "Shows unit economics", "Right-side result card and table"],
            ["Monthly cost", "Shows budget impact", "Comparison table"],
            ["Context status", "Shows whether the workload fits", "Result details"],
          ],
        },
      },
    ],
    faqs: [
      ["Which provider is cheapest?", "It depends on input length, output length, model choice and caching. Use the same workload to compare fairly."],
      ["Does the calculator rank model quality?", "No. It compares estimated cost only. Quality depends on your use case and should be tested separately."],
      ["Can I compare DeepSeek too?", "Yes. The comparison table includes supported DeepSeek models alongside OpenAI, Claude and Gemini."],
    ],
  },
];

export function getSeoPage(slug: string) {
  return seoPages.find((page) => page.slug === slug);
}
