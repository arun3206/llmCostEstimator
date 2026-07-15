import CostCalculator from "@/components/calculator/CostCalculator";
import type { SeoPage } from "@/data/seoPages";
import type { Route } from "next";
import Link from "next/link";

const relatedLinks: Array<[string, Route]> = [
  ["OpenAI Cost Calculator", "/openai-cost-calculator" as Route],
  ["Claude Cost Calculator", "/claude-cost-calculator" as Route],
  ["Gemini Cost Calculator", "/gemini-cost-calculator" as Route],
  ["AI Summarization Cost Calculator", "/ai-summarization-cost-calculator" as Route],
  ["Chatbot Cost Calculator", "/chatbot-cost-calculator" as Route],
];

const routes = {
  home: "/" as Route,
  summarization: "/ai-summarization-cost-calculator" as Route,
  chatbot: "/chatbot-cost-calculator" as Route,
  openai: "/openai-cost-calculator" as Route,
  claude: "/claude-cost-calculator" as Route,
  gemini: "/gemini-cost-calculator" as Route,
};

export default function LongTailPage({ page }: { page: SeoPage }) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <main className="page-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <header className="header"><div className="container header-inner">
        <Link className="brand" href={routes.home}><span className="brand-mark">AI</span>LLM Cost Estimator</Link>
        <nav className="nav" aria-label="Main navigation">
          <Link href="/#calculator">Calculator</Link><Link href="/#compare">Compare Models</Link><Link href="/#use-cases">Use Cases</Link><Link href="/#methodology">Methodology</Link>
        </nav>
        <div className="header-actions"><span className="chip">USD / INR</span><a className="button primary" href="#calculator">Start Calculating</a></div>
      </div></header>

      <section className="section seo-intro">
        <div className="container">
          <span className="eyebrow">{page.eyebrow}</span>
          <h1>{page.title}</h1>
          <p className="lead">{page.intro}</p>
        </div>
      </section>

      <CostCalculator
        headingLevel="h2"
        headingTitle={`Calculate ${page.title.replace(" Calculator", "")} Cost`}
        headingDescription={page.description}
        initialProvider={page.provider}
        initialWorkloadType={page.workloadType}
        initialOutputType={page.outputType}
      />

      <section className="section soft">
        <div className="container">
          <div className="section-heading"><h2>{page.title} FAQ</h2></div>
          <div className="faq-grid">
            {page.faqs.map(([question, answer]) => (
              <details className="faq-item" key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading"><h2>Related Cost Calculators</h2></div>
          <div className="cards-grid">
            {relatedLinks
              .filter(([, href]) => href !== `/${page.slug}`)
              .map(([label, href]) => (
                <Link className="use-card" href={href} key={href}>
                  <span className="chip">Calculator</span>
                  <h3>{label}</h3>
                  <p>Open a focused estimator page for this workload or provider.</p>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <footer className="footer"><div className="container footer-grid">
        <div><h3>LLM Cost Estimator</h3><p className="helper">Plan and compare AI API costs. Built by ElvaMind.</p><p className="fine-print">Pricing data is for estimation and may differ from provider invoices.</p></div>
        <div><h3>Tools</h3><ul><li><Link href={routes.home}>Main Calculator</Link></li><li><Link href={routes.summarization}>Summarization Cost</Link></li><li><Link href={routes.chatbot}>Chatbot Cost</Link></li></ul></div>
        <div><h3>Providers</h3><ul><li><Link href={routes.openai}>OpenAI</Link></li><li><Link href={routes.claude}>Claude</Link></li><li><Link href={routes.gemini}>Gemini</Link></li></ul></div>
        <div><h3>Company</h3><ul><li>About</li><li>Contact</li><li>ElvaMind</li></ul></div>
      </div></footer>
    </main>
  );
}
