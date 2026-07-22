import type { Route } from "next";
import Link from "next/link";

const routes = {
  home: "/" as Route,
  blog: "/blog" as Route,
  openai: "/openai-cost-calculator" as Route,
  chatbot: "/chatbot-cost-calculator" as Route,
};

export default function SiteHeader() {
  return (
    <header className="header">
      <div className="container header-inner">
        <Link className="brand" href={routes.home}>
          <span className="brand-mark">AI</span>LLM Cost Estimator
        </Link>
        <nav className="nav" aria-label="Main navigation">
          <Link href="/#calculator">Calculator</Link>
          <Link href="/#compare">Compare Models</Link>
          <Link href={routes.blog}>Blog</Link>
          <Link href="/#methodology">Methodology</Link>
        </nav>
        <div className="header-actions">
          <span className="chip">USD / INR</span>
          <Link className="button primary" href={routes.openai}>
            Start Calculating
          </Link>
        </div>
      </div>
    </header>
  );
}
