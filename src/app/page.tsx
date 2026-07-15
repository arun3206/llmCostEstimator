import CostCalculator from "@/components/calculator/CostCalculator";
import { MODEL_PRICING } from "@/data/modelPricing";

const faqs = [
  ["How are input tokens calculated?", "Your pasted content is analyzed locally in your browser using a text-aware estimator. The MVP labels this value as estimated rather than exact."],
  ["How are output tokens estimated?", "The estimate uses your input length and selected summary type, then applies minimum and maximum limits for realistic results."],
  ["What is the difference between Summary, Summary + Insights and Detailed Summary?", "Summary is concise. Summary + Insights adds structured findings such as sentiment and actions. Detailed Summary provides a fuller overview with decisions, owners, risks, and follow-up items."],
  ["Does the calculator send my transcript to a server?", "No. Your transcript stays in your browser and is never included in the shareable URL."],
  ["Does this calculator call an AI API?", "No. The estimator works locally and does not require an API key."],
  ["Can I estimate customer-call and chat summarization costs?", "Yes. Select Customer Call / Chat Summarization and paste a representative transcript."],
  ["Can I estimate meeting-summary costs?", "Yes. Select Meeting Summarization to estimate summaries, decisions, and action items from meeting content."],
  ["Why may the actual API bill be different?", "Generated output length, provider tokenization, caching, pricing changes, taxes, and implementation details can affect the final invoice."],
  ["Does this include speech-to-text transcription cost?", "No. This MVP estimates only LLM summarization costs. Speech-to-text pricing is not included yet."],
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(([question, answer]) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

const webApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "LLM Cost Estimator",
  url: "https://llmcostestimator.com",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  description:
    "Estimate token usage and LLM API costs for summarization workloads across OpenAI, Claude, Gemini, and DeepSeek models.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function Home() {
  const updatedAt = MODEL_PRICING[0]?.pricingUpdatedAt ?? "2026-07-15";
  return (
    <main className="page-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }} />
      <Header />
      <CostCalculator />
      <UseCases />
      <HowItWorks />
      <Methodology updatedAt={updatedAt} />
      <FAQ />
      <Footer />
    </main>
  );
}

function Header() {
  return (
    <header className="header"><div className="container header-inner">
      <a className="brand" href="#"><span className="brand-mark">AI</span>LLM Cost Estimator</a>
      <nav className="nav" aria-label="Main navigation">
        <a href="#calculator">Calculator</a><a href="#compare">Compare Models</a><a href="#use-cases">Use Cases</a><a href="#methodology">Methodology</a>
      </nav>
      <div className="header-actions"><span className="chip">USD / INR</span><a className="button primary" href="#calculator">Start Calculating</a></div>
    </div></header>
  );
}

function UseCases() {
  const cases = [
    { title: "Customer Call / Chat Summarization", description: "Estimate the cost of summarizing support calls, sales calls and customer-agent conversations.", button: "Estimate Customer Summary Cost", href: "/?workload=customer-call-chat&output=summary-insights&interactions=1#calculator" },
    { title: "Meeting Summarization", description: "Estimate the cost of producing summaries, decisions and action items from meeting transcripts.", button: "Estimate Meeting Cost", href: "/?workload=meeting-summary&output=detailed-summary&interactions=1#calculator" },
    { title: "Custom Workload", description: "Paste any prompt, transcript or content and estimate its LLM processing cost.", button: "Estimate Custom Workload", href: "/?workload=custom&output=summary&interactions=1#calculator" },
  ];
  return (
    <section className="section soft" id="use-cases"><div className="container">
      <div className="section-heading"><h2>Estimate Common Summarization Workloads</h2><p className="lead">Choose the closest workload, then paste a representative sample.</p></div>
      <div className="cards-grid">{cases.map((item) => (
        <article className="use-card" key={item.title}><span className="chip">Summarization use case</span><h3>{item.title}</h3><p>{item.description}</p><a className="button secondary" href={item.href}>{item.button}</a></article>
      ))}</div>
    </div></section>
  );
}

function HowItWorks() {
  const steps = [
    ["Add sample content", "Paste a customer conversation, meeting transcript, or other representative content."],
    ["Choose the summary", "Select Summary, Summary + Insights, or Detailed Summary and set monthly interactions."],
    ["Compare costs", "See per-interaction, monthly, and annual estimates across supported models."],
  ];
  return (
    <section className="section"><div className="container"><div className="section-heading"><h2>How it works</h2></div><div className="steps-grid">
      {steps.map(([title, description], index) => <article className="step" key={title}><div className="step-number">{index + 1}</div><h3>{title}</h3><p>{description}</p></article>)}
    </div></div></section>
  );
}

function Methodology({ updatedAt }: { updatedAt: string }) {
  return (
    <section className="section soft" id="methodology"><div className="container methodology">
      <span className="chip">Pricing last updated: {updatedAt}</span><h2>How the Estimate Is Calculated</h2>
      <div className="formula"><span>Input cost = estimated input tokens / 1,000,000 x model input price</span><span>Output cost = estimated output tokens / 1,000,000 x model output price</span><span>Total monthly cost = cost per interaction x monthly interactions</span></div>
      <p className="lead">Input tokens come from your pasted content. Output tokens are projected from the summary type and input length. Taxes, transcription, storage, and other infrastructure are not included.</p>
    </div></section>
  );
}

function FAQ() {
  return (
    <section className="section"><div className="container"><div className="section-heading"><h2>FAQ</h2></div><div className="faq-grid">
      {faqs.map(([question, answer]) => <details className="faq-item" key={question}><summary>{question}</summary><p>{answer}</p></details>)}
    </div></div></section>
  );
}

function Footer() {
  return (
    <footer className="footer"><div className="container footer-grid">
      <div><h3>LLM Cost Estimator</h3><p className="helper">Plan and compare AI summarization costs. Built by ElvaMind.</p><p className="fine-print">Pricing data is for estimation and may differ from provider invoices.</p></div>
      <div><h3>Tools</h3><ul><li>Summarization Calculator</li><li>Token Estimate</li><li>Model Comparison</li></ul></div>
      <div><h3>Resources</h3><ul><li><a href="/openai-cost-calculator">OpenAI Cost Calculator</a></li><li><a href="/claude-cost-calculator">Claude Cost Calculator</a></li><li><a href="/gemini-cost-calculator">Gemini Cost Calculator</a></li></ul></div>
      <div><h3>Company</h3><ul><li>About</li><li>Contact</li><li>ElvaMind</li></ul></div>
    </div></footer>
  );
}
