import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/blog/SiteHeader";
import { blogPosts } from "@/data/blogPosts";

export const metadata: Metadata = {
  title: "LLM Cost Blog - API Pricing Guides and Examples",
  description:
    "Practical guides for estimating OpenAI, Claude, Gemini, DeepSeek and chatbot API costs with real pricing examples.",
  alternates: { canonical: "/blog" },
};

const blogJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "LLM Cost Blog",
  url: "https://llmcostestimator.com/blog",
  description:
    "Guides and examples for estimating LLM API costs, token usage, chatbot spend and summarization pricing.",
  blogPost: blogPosts.map((post) => ({
    "@type": "BlogPosting",
    headline: post.title,
    url: `https://llmcostestimator.com/blog/${post.slug}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
  })),
};

export default function BlogIndexPage() {
  const featuredPost = blogPosts[0];
  const remainingPosts = blogPosts.slice(1);

  return (
    <main className="page-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />
      <SiteHeader />

      <section className="section seo-intro">
        <div className="container blog-hero">
          <span className="eyebrow">LLM pricing guides</span>
          <h1>Practical LLM API Cost Guides</h1>
          <p className="lead">
            Learn how to estimate token usage, chatbot costs, summarization spend and provider pricing before your AI app reaches production scale.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Link className="featured-post" href={`/blog/${featuredPost.slug}`}>
            <span className="chip">{featuredPost.category}</span>
            <h2>{featuredPost.title}</h2>
            <p>{featuredPost.excerpt}</p>
            <span className="text-link">Read guide</span>
          </Link>

          <div className="blog-grid">
            {remainingPosts.map((post) => (
              <Link className="blog-card" href={`/blog/${post.slug}`} key={post.slug}>
                <span className="chip">{post.category}</span>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
                <div className="post-meta">
                  <span>Updated {post.updatedAt}</span>
                  <span>{post.readMinutes} min read</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="container blog-cta">
          <span className="eyebrow">Calculator-first SEO</span>
          <h2>Estimate Cost From Your Own Prompt or Transcript</h2>
          <p className="lead">
            Use the calculator after reading a guide to compare real workloads across OpenAI, Claude, Gemini and DeepSeek models.
          </p>
          <div className="button-row">
            <Link className="button primary" href="/#calculator">
              Open Main Calculator
            </Link>
            <Link className="button secondary" href="/chatbot-cost-calculator">
              Estimate Chatbot Cost
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
