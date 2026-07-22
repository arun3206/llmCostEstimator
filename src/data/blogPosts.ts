import type { Route } from "next";

export type BlogPost = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  excerpt: string;
  publishedAt: string;
  updatedAt: string;
  readMinutes: number;
  category: string;
  primaryKeyword: string;
  relatedCalculator: {
    label: string;
    href: Route;
  };
  sources: Array<{
    label: string;
    href: string;
  }>;
  sections: Array<{
    heading: string;
    body: string[];
    table?: {
      columns: string[];
      rows: string[][];
    };
  }>;
  faqs: Array<[string, string]>;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-estimate-openai-api-cost",
    title: "How to Estimate OpenAI API Cost Before Building an App",
    metaTitle: "How to Estimate OpenAI API Cost Before Building an App",
    description:
      "Learn how to estimate OpenAI API cost from input tokens, output tokens, monthly volume and model choice before committing engineering budget.",
    excerpt:
      "A practical guide to turning prompts, responses and monthly usage into a reliable OpenAI API budget estimate.",
    publishedAt: "2026-07-22",
    updatedAt: "2026-07-22",
    readMinutes: 7,
    category: "OpenAI Pricing",
    primaryKeyword: "estimate OpenAI API cost",
    relatedCalculator: {
      label: "OpenAI Cost Calculator",
      href: "/openai-cost-calculator" as Route,
    },
    sources: [
      { label: "OpenAI API pricing", href: "https://developers.openai.com/api/docs/pricing" },
    ],
    sections: [
      {
        heading: "Start with the cost formula",
        body: [
          "OpenAI API pricing is usually calculated from input tokens and output tokens. Input tokens are the prompt, system instructions, retrieved context and conversation history sent to the model. Output tokens are the generated answer.",
          "The practical formula is: input tokens divided by 1,000,000 multiplied by the model input price, plus output tokens divided by 1,000,000 multiplied by the model output price. Monthly cost is that request cost multiplied by expected monthly requests.",
        ],
      },
      {
        heading: "Use realistic model rates",
        body: [
          "For text workloads, OpenAI lists prices per 1M tokens. As of July 22, 2026, examples on the official pricing page include ChatGPT chat-latest at $5 input and $30 output per 1M tokens, and gpt-5.3-codex at $1.75 input and $14 output per 1M tokens. Tool usage, realtime, image, audio and batch pricing may follow separate rules.",
          "That means a product estimate should not use a single flat per-message number. A support bot with short answers can be cheap, while a workflow that sends long documents and asks for detailed analysis can spend much more on output tokens.",
        ],
        table: {
          columns: ["Scenario", "Input tokens", "Output tokens", "Rate example", "Estimated request cost"],
          rows: [
            ["Short assistant reply", "1,000", "300", "$5 in / $30 out", "$0.014"],
            ["Detailed analysis", "8,000", "1,500", "$5 in / $30 out", "$0.085"],
            ["Long document summary", "40,000", "2,500", "$5 in / $30 out", "$0.275"],
          ],
        },
      },
      {
        heading: "Estimate before implementation",
        body: [
          "Before building, collect three samples: a short request, a typical request and a worst-case long request. Estimate cost for all three, then multiply by expected monthly traffic. This exposes whether the product needs prompt trimming, caching, smaller models or batching.",
          "For app planning, connect the estimate to product behavior. A chat app should model conversation history growth. A summarization product should model transcript length. A retrieval app should include retrieved chunks, not only the user question.",
        ],
      },
      {
        heading: "Use the calculator for validation",
        body: [
          "The OpenAI calculator on this site lets you paste representative content, estimate tokens locally and compare monthly cost against other LLM providers. Use it as a first-pass planning tool, then confirm final production pricing against your provider invoice and selected API features.",
        ],
      },
    ],
    faqs: [
      ["What affects OpenAI API cost the most?", "The biggest drivers are input context length, generated output length, model choice, monthly request volume and use of tools such as search or file retrieval."],
      ["Is cost per message a reliable estimate?", "Only if message size is stable. For real products, estimate tokens from representative examples because conversation history and retrieved context can increase cost quickly."],
      ["Should I use the cheapest model?", "Use the cheapest model that meets quality requirements. Many production apps route simple tasks to lower-cost models and reserve stronger models for complex cases."],
    ],
  },
  {
    slug: "ai-chatbot-cost-per-month",
    title: "How Much Does an AI Chatbot Cost Per Month?",
    metaTitle: "AI Chatbot Cost Per Month - LLM Pricing Examples",
    description:
      "Estimate monthly AI chatbot cost with realistic token examples for support bots, lead capture bots and internal assistants.",
    excerpt:
      "A clear framework for estimating chatbot API spend from message volume, context length and model pricing.",
    publishedAt: "2026-07-22",
    updatedAt: "2026-07-22",
    readMinutes: 8,
    category: "Chatbot Pricing",
    primaryKeyword: "AI chatbot cost per month",
    relatedCalculator: {
      label: "Chatbot Cost Calculator",
      href: "/chatbot-cost-calculator" as Route,
    },
    sources: [
      { label: "OpenAI API pricing", href: "https://developers.openai.com/api/docs/pricing" },
      { label: "Claude pricing", href: "https://platform.claude.com/docs/en/about-claude/pricing" },
      { label: "Gemini API pricing", href: "https://ai.google.dev/gemini-api/docs/pricing" },
    ],
    sections: [
      {
        heading: "Monthly chatbot cost depends on message shape",
        body: [
          "A chatbot bill is not based only on the number of users. It depends on how many messages they send, how much conversation history is included, how much retrieved knowledge is added and how long the model answers.",
          "A lean support bot might send 800 input tokens and receive 250 output tokens per message. A heavier assistant with full chat history and retrieved documentation might send 4,000 to 8,000 input tokens before generating an answer.",
        ],
      },
      {
        heading: "Example monthly estimates",
        body: [
          "The table below shows how quickly costs change when monthly messages and model rates change. These examples use published per-1M-token pricing patterns from major providers, with separate input and output costs.",
        ],
        table: {
          columns: ["Monthly messages", "Tokens per message", "Low-cost model example", "Premium model example"],
          rows: [
            ["10,000", "800 in / 250 out", "$2 to $8", "$12 to $45"],
            ["100,000", "1,200 in / 400 out", "$30 to $100", "$180 to $720"],
            ["1,000,000", "2,000 in / 600 out", "$500 to $1,800", "$3,000 to $12,000"],
          ],
        },
      },
      {
        heading: "Use model routing to control spend",
        body: [
          "Most chatbot teams reduce cost by using smaller models for routine answers, escalating difficult conversations to stronger models and trimming stale conversation history. Retrieval should also be selective: sending ten document chunks when three are enough directly increases input-token cost.",
          "Caching can help when system prompts and knowledge instructions repeat. Some providers publish lower cached-input prices, but the exact savings depend on how the API call is structured.",
        ],
      },
      {
        heading: "Estimate your actual bot",
        body: [
          "Use the chatbot calculator with a real conversation sample, expected monthly message count and answer length. Then compare model options before choosing the production default.",
        ],
      },
    ],
    faqs: [
      ["How do I estimate chatbot cost?", "Estimate input tokens, output tokens and monthly message volume, then multiply those tokens by the selected model's input and output prices."],
      ["Why is my chatbot more expensive than expected?", "Common causes are long conversation history, large retrieved context, verbose answers, high message volume and using premium models for every request."],
      ["Can a chatbot cost be under $100 per month?", "Yes, small or efficient bots can stay under $100 monthly, but high-volume support bots with long context can cost much more."],
    ],
  },
  {
    slug: "llm-token-pricing-explained",
    title: "LLM Token Pricing Explained: Input Tokens vs Output Tokens",
    metaTitle: "LLM Token Pricing Explained - Input vs Output Tokens",
    description:
      "Understand how LLM token pricing works, why output tokens often cost more and how to estimate API bills accurately.",
    excerpt:
      "A plain-English explanation of token pricing for teams comparing OpenAI, Claude, Gemini and DeepSeek API costs.",
    publishedAt: "2026-07-22",
    updatedAt: "2026-07-22",
    readMinutes: 6,
    category: "Token Pricing",
    primaryKeyword: "LLM token pricing explained",
    relatedCalculator: {
      label: "LLM Cost Estimator",
      href: "/" as Route,
    },
    sources: [
      { label: "Claude pricing", href: "https://platform.claude.com/docs/en/about-claude/pricing" },
      { label: "Gemini API pricing", href: "https://ai.google.dev/gemini-api/docs/pricing" },
      { label: "DeepSeek API pricing", href: "https://api-docs.deepseek.com/quick_start/pricing/" },
    ],
    sections: [
      {
        heading: "Tokens are the billing unit",
        body: [
          "LLM providers bill text usage in tokens, usually priced per 1M tokens. A token can be a word fragment, word, number or punctuation mark depending on the tokenizer. Exact token counts differ by provider, so planning tools should label token counts as estimates unless they use the exact provider tokenizer.",
          "A request normally has two billable sides: input tokens sent to the model and output tokens generated by the model.",
        ],
      },
      {
        heading: "Output tokens usually cost more",
        body: [
          "Output tokens often cost several times more than input tokens because generation is computationally expensive. Anthropic lists Claude Sonnet 4.6 at $3 input and $15 output per 1M tokens, while Claude Haiku 4.5 is listed at $1 input and $5 output. Google Gemini 3.5 Flash-Lite is listed at $0.30 input and $2.50 output per 1M tokens.",
          "This pricing pattern means short prompts with long answers can be more expensive than expected. It also means summary detail settings matter: a detailed summary can cost noticeably more than a concise one.",
        ],
        table: {
          columns: ["Provider example", "Input price / 1M", "Output price / 1M", "Output multiple"],
          rows: [
            ["Claude Sonnet 4.6", "$3.00", "$15.00", "5x"],
            ["Claude Haiku 4.5", "$1.00", "$5.00", "5x"],
            ["Gemini 3.5 Flash-Lite", "$0.30", "$2.50", "8.3x"],
            ["DeepSeek V4 Flash", "$0.14 cache miss", "$0.28", "2x"],
          ],
        },
      },
      {
        heading: "Cached input changes the equation",
        body: [
          "Some providers publish separate cached-input rates. DeepSeek, for example, lists V4 Flash cache-hit input at $0.0028 per 1M tokens and cache-miss input at $0.14 per 1M tokens. That gap can be significant for repeated prompts, system instructions or reused context.",
          "Caching is not automatic savings for every app. The application has to send repeatable context in a way the provider can cache, and cache storage or minimums may apply depending on the provider.",
        ],
      },
      {
        heading: "Estimate using real samples",
        body: [
          "The safest budget estimate uses real examples from your product. Paste representative content into the calculator, pick an expected response type and compare per-interaction and monthly spend across providers.",
        ],
      },
    ],
    faqs: [
      ["Are tokens the same as words?", "No. Tokens are text units used by the model tokenizer. A token can be part of a word, a whole word, punctuation or a number."],
      ["Why are output tokens more expensive?", "Generating output requires model inference step by step, so providers usually price output tokens higher than input tokens."],
      ["Do cached tokens always save money?", "Cached input can reduce cost when the same context is reused, but savings depend on the provider's cache rules and how your app sends prompts."],
    ],
  },
  {
    slug: "reduce-llm-api-costs",
    title: "How to Reduce LLM API Costs Without Hurting Quality",
    metaTitle: "How to Reduce LLM API Costs Without Hurting Quality",
    description:
      "Practical ways to reduce LLM API costs using prompt trimming, model routing, caching, concise outputs and workload-specific estimates.",
    excerpt:
      "A cost-control checklist for teams moving from prototype prompts to production LLM usage.",
    publishedAt: "2026-07-22",
    updatedAt: "2026-07-22",
    readMinutes: 7,
    category: "Cost Optimization",
    primaryKeyword: "reduce LLM API costs",
    relatedCalculator: {
      label: "AI Summarization Cost Calculator",
      href: "/ai-summarization-cost-calculator" as Route,
    },
    sources: [
      { label: "OpenAI API pricing", href: "https://developers.openai.com/api/docs/pricing" },
      { label: "Claude pricing", href: "https://platform.claude.com/docs/en/about-claude/pricing" },
      { label: "Gemini API pricing", href: "https://ai.google.dev/gemini-api/docs/pricing" },
    ],
    sections: [
      {
        heading: "Cost optimization starts with measurement",
        body: [
          "The highest-impact LLM cost reductions usually come from measuring actual token use, not guessing. Track input tokens, output tokens, model, endpoint, cache usage and request category. Without that breakdown, teams often optimize the wrong part of the workflow.",
          "Start by separating tasks into simple, normal and complex requests. Each class can use a different prompt, model and output limit.",
        ],
      },
      {
        heading: "Five reliable ways to cut spend",
        body: [
          "Trim context before sending it to the model. Long chat history, duplicated instructions and excessive retrieval chunks all increase input cost.",
          "Cap output length for routine tasks. Because output tokens are often priced higher, concise answer formats can materially reduce monthly spend.",
          "Route by difficulty. Use lower-cost models for classification, extraction and short answers, then escalate only when needed.",
          "Cache stable instructions and repeated context where provider APIs support cached input.",
          "Batch offline workloads when latency does not matter and the provider offers batch discounts.",
        ],
      },
      {
        heading: "Example savings from shorter outputs",
        body: [
          "If a support summary uses 2,000 input tokens and 900 output tokens, reducing the answer to 450 output tokens cuts generated-token usage in half. On a model with $15 output pricing per 1M tokens, that saves about $0.00675 per request. At 500,000 monthly summaries, the output reduction alone saves about $3,375 per month.",
        ],
        table: {
          columns: ["Monthly requests", "Output reduction", "Output price", "Approx. monthly savings"],
          rows: [
            ["50,000", "450 tokens", "$15 / 1M", "$337.50"],
            ["500,000", "450 tokens", "$15 / 1M", "$3,375"],
            ["1,000,000", "450 tokens", "$15 / 1M", "$6,750"],
          ],
        },
      },
      {
        heading: "Protect quality while reducing cost",
        body: [
          "Do not remove context blindly. Keep the facts required for correctness, but remove duplicated boilerplate and stale conversation history. For summarization, test concise and detailed formats against real transcripts before changing production defaults.",
          "Use the calculator to compare models and output lengths before making changes. The right cost reduction should preserve task success, not only lower the invoice.",
        ],
      },
    ],
    faqs: [
      ["What is the fastest way to reduce LLM cost?", "Shorten unnecessary input context and cap verbose output. These usually reduce cost without changing product architecture."],
      ["Is model routing worth it?", "Yes for production systems with mixed request complexity. Simple requests can often run on cheaper models while complex cases use stronger models."],
      ["Can cost optimization hurt quality?", "Yes, if it removes required context or forces answers to be too short. Validate changes on real examples before rollout."],
    ],
  },
  {
    slug: "ai-summarization-cost-examples",
    title: "AI Summarization Cost Examples for Meetings, Calls and Documents",
    metaTitle: "AI Summarization Cost Examples - Meetings, Calls and Documents",
    description:
      "Compare realistic AI summarization cost examples for meeting transcripts, customer calls and document summaries.",
    excerpt:
      "Concrete LLM summarization pricing examples for common business workloads.",
    publishedAt: "2026-07-22",
    updatedAt: "2026-07-22",
    readMinutes: 8,
    category: "Summarization Pricing",
    primaryKeyword: "AI summarization cost",
    relatedCalculator: {
      label: "AI Summarization Cost Calculator",
      href: "/ai-summarization-cost-calculator" as Route,
    },
    sources: [
      { label: "Claude pricing", href: "https://platform.claude.com/docs/en/about-claude/pricing" },
      { label: "Gemini API pricing", href: "https://ai.google.dev/gemini-api/docs/pricing" },
      { label: "DeepSeek API pricing", href: "https://api-docs.deepseek.com/quick_start/pricing/" },
    ],
    sections: [
      {
        heading: "Summarization cost is mostly input length plus summary detail",
        body: [
          "Summarization workloads often have large input and moderate output. A customer call transcript, meeting transcript or document may contain thousands of tokens before the model writes a summary.",
          "The second driver is output detail. A short bullet summary costs less than a detailed summary with decisions, owners, risks, sentiment and action items.",
        ],
      },
      {
        heading: "Common summarization examples",
        body: [
          "These examples use three workload sizes and show why teams should estimate from real content. Actual bills may differ because tokenization, hidden reasoning tokens, caching and provider-specific tiers vary.",
        ],
        table: {
          columns: ["Workload", "Input tokens", "Output tokens", "At $1 in / $5 out", "At $3 in / $15 out"],
          rows: [
            ["Short support chat", "1,500", "300", "$0.0030", "$0.0090"],
            ["30-minute call", "8,000", "900", "$0.0125", "$0.0375"],
            ["Long meeting transcript", "20,000", "1,500", "$0.0275", "$0.0825"],
            ["Large document", "75,000", "2,500", "$0.0875", "$0.2625"],
          ],
        },
      },
      {
        heading: "Monthly cost changes quickly with volume",
        body: [
          "A single meeting summary can cost less than a cent on efficient models, but high volume changes the economics. A 30-minute call summary costing $0.0375 becomes $3,750 per month at 100,000 calls.",
          "This is why summarization products should model both average and high-percentile transcript lengths. Long calls and long documents can dominate the bill even if they are a minority of requests.",
        ],
      },
      {
        heading: "Compare providers before committing",
        body: [
          "Providers differ materially. Anthropic lists Claude Haiku 4.5 at $1 input and $5 output per 1M tokens, Google lists Gemini 3.5 Flash-Lite at $0.30 input and $2.50 output, and DeepSeek lists V4 Flash cache-miss input at $0.14 and output at $0.28 per 1M tokens.",
          "Use those published rates as a starting point, then compare quality on your own summaries before choosing a default model.",
        ],
      },
    ],
    faqs: [
      ["How much does AI summarization cost?", "Small summaries can cost fractions of a cent, while long transcripts and high-volume workloads can become thousands of dollars per month."],
      ["What matters more for summarization, input or output?", "Both matter, but long transcripts usually drive input tokens while detailed summaries increase output-token cost."],
      ["Does this include transcription cost?", "No. These examples estimate LLM summarization only. Speech-to-text, storage and application infrastructure are separate costs."],
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
