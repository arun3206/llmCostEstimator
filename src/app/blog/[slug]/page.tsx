import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/blog/SiteHeader";
import { blogPosts, getBlogPost } from "@/data/blogPosts";

type BlogArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.metaTitle,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    keywords: [post.primaryKeyword, post.category, "LLM API cost", "AI token pricing"],
    openGraph: {
      title: post.metaTitle,
      description: post.description,
      url: `https://llmcostestimator.com/blog/${post.slug}`,
      siteName: "LLM Cost Estimator",
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
    },
  };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 3);
  const articleUrl = `https://llmcostestimator.com/blog/${post.slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: articleUrl,
    author: {
      "@type": "Organization",
      name: "ElvaMind",
    },
    publisher: {
      "@type": "Organization",
      name: "LLM Cost Estimator",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <main className="page-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <SiteHeader />

      <article>
        <section className="section seo-intro article-intro">
          <div className="container article-container">
            <Link className="text-link" href="/blog">
              Blog
            </Link>
            <span className="eyebrow">{post.category}</span>
            <h1>{post.title}</h1>
            <p className="lead">{post.description}</p>
            <div className="post-meta">
              <span>Updated {post.updatedAt}</span>
              <span>{post.readMinutes} min read</span>
              <span>Keyword: {post.primaryKeyword}</span>
            </div>
          </div>
        </section>

        <section className="section article-section">
          <div className="container article-layout">
            <div className="article-content">
              {post.sections.map((section) => (
                <section className="article-block" key={section.heading}>
                  <h2>{section.heading}</h2>
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.table ? (
                    <div className="article-table-wrap">
                      <table className="article-table">
                        <thead>
                          <tr>
                            {section.table.columns.map((column) => (
                              <th key={column}>{column}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {section.table.rows.map((row) => (
                            <tr key={row.join("|")}>
                              {row.map((cell) => (
                                <td key={cell}>{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : null}
                </section>
              ))}

              <section className="article-block">
                <h2>Sources</h2>
                <p>
                  Pricing changes over time. These examples use official provider pricing pages checked on July 22, 2026.
                </p>
                <ul className="source-list">
                  {post.sources.map((source) => (
                    <li key={source.href}>
                      <a href={source.href} rel="noreferrer" target="_blank">
                        {source.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="article-block">
                <h2>{post.category} FAQ</h2>
                <div className="faq-grid article-faq">
                  {post.faqs.map(([question, answer]) => (
                    <details className="faq-item" key={question}>
                      <summary>{question}</summary>
                      <p>{answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            </div>

            <aside className="article-sidebar" aria-label="Related calculator">
              <div className="sidebar-panel">
                <span className="chip">Try it with your data</span>
                <h2>{post.relatedCalculator.label}</h2>
                <p>
                  Paste your own prompt, transcript or chatbot sample and compare estimated spend across providers.
                </p>
                <Link className="button primary" href={post.relatedCalculator.href}>
                  Open Calculator
                </Link>
              </div>
              <div className="sidebar-panel">
                <h2>Related Guides</h2>
                <div className="related-list">
                  {relatedPosts.map((relatedPost) => (
                    <Link href={`/blog/${relatedPost.slug}`} key={relatedPost.slug}>
                      {relatedPost.title}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </article>
    </main>
  );
}
