import Link from "next/link";
import { notFound } from "next/navigation";
import { blogArticles, getArticleBySlug } from "@/lib/blogData";
import Cta from "@/components/Cta";

export function generateStaticParams() {
  return blogArticles.map((article) => ({
    slug: article.slug,
  }));
}

export function generateMetadata({ params }) {
  const article = getArticleBySlug(params.slug);
  if (!article) return { title: "Article Not Found | Digital Custard" };

  return {
    title: `${article.title} | Digital Custard`,
    description: article.excerpt,
  };
}

export default function ArticlePage({ params }) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  const related = blogArticles.filter((a) => a.slug !== article.slug);

  return (
    <>
      {/* ── Article Header ── */}
      <article className="article-container">
        <header className="article-header wrap">
          <div className="article-breadcrumbs">
            <Link href="/blog" className="text-link" style={{ margin: 0 }}>
              ← Back to Insights
            </Link>
            <span style={{ color: "var(--line-strong)" }}>/</span>
            <span className="chip">{article.category}</span>
          </div>

          <h1 className="article-title mt" style={{ marginTop: 20 }}>
            {article.title}
          </h1>

          <p className="lead mt" style={{ marginTop: 20, fontSize: "19px", lineHeight: 1.6 }}>
            {article.intro}
          </p>

          <div className="article-author-card mt">
            <div className="author-avatar">{article.author[0]}</div>
            <div>
              <strong style={{ display: "block", color: "var(--ink)", fontSize: 15 }}>
                {article.author}
              </strong>
              <small style={{ color: "var(--mut)" }}>
                {article.authorRole} · {article.date} · {article.readTime}
              </small>
            </div>
          </div>

          <div
            className="article-hero-visual mt"
            style={{ backgroundImage: `url(${article.image})` }}
          />
        </header>

        {/* ── Article Content Sections ── */}
        <div className="wrap article-content-layout">
          <div className="article-body">
            {article.sections.map((sec, idx) => (
              <section key={sec.heading} className="article-section-block">
                <div className="article-section-num">{sec.num || `0${idx + 1}`}</div>
                <h2>{sec.heading}</h2>
                <p className="article-p">{sec.body}</p>

                {sec.fixes && sec.fixes.length > 0 && (
                  <div className="article-action-box">
                    <h4>{sec.fixTitle || "Key Action Steps:"}</h4>
                    <ul className="article-checklist">
                      {sec.fixes.map((fix) => (
                        <li key={fix}>
                          <span className="check-icon">✓</span>
                          <span>{fix}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {sec.takeaway && (
                  <div className="article-takeaway">
                    <span className="takeaway-badge">Key Takeaway</span>
                    <p>{sec.takeaway}</p>
                  </div>
                )}
              </section>
            ))}

            {/* Checklist Section */}
            {article.checklist && article.checklist.length > 0 && (
              <div className="card article-audit-checklist" data-r>
                <p className="eyebrow">Quick Diagnostic</p>
                <h3>Website &amp; Growth Checklist</h3>
                <p style={{ marginTop: 8 }}>
                  Ask yourself these crucial questions before investing more budget into traffic:
                </p>
                <div className="checklist-grid mt">
                  {article.checklist.map((item, i) => (
                    <div key={item} className="checklist-item">
                      <span className="checklist-bullet">{i + 1}</span>
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Real World Impact */}
            {article.realWorld && (
              <div className="article-case-callout mt" data-r>
                <div className="callout-icon">💡</div>
                <div>
                  <h4 style={{ color: "var(--ink)", marginBottom: 8, fontSize: 18 }}>
                    Real-World Client Result
                  </h4>
                  <p style={{ color: "var(--mut)", lineHeight: 1.6 }}>{article.realWorld}</p>
                </div>
              </div>
            )}

            {/* FAQ Accordion Section */}
            {article.faqs && article.faqs.length > 0 && (
              <div className="article-faq-section mt" data-r>
                <p className="eyebrow">Frequently Asked Questions</p>
                <h2>Questions About This Topic</h2>
                <div className="faq-list mt">
                  {article.faqs.map((faq, i) => (
                    <div key={faq.q} className="card faq-card">
                      <h4>
                        <span className="faq-q-badge">Q{i + 1}</span> {faq.q}
                      </h4>
                      <p style={{ marginTop: 10, lineHeight: 1.6 }}>{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Sidebar */}
          <aside className="article-sidebar">
            <div className="card sidebar-cta-box">
              <span className="chip" style={{ marginBottom: 12 }}>Free Consultation</span>
              <h3>Need Help Implementing This?</h3>
              <p style={{ marginTop: 10, fontSize: 13.5, lineHeight: 1.5 }}>
                Get a comprehensive website audit and personalized growth roadmap from our experts.
              </p>
              <Link href="/contact" className="btn sm mt" style={{ width: "100%", justifyContent: "center" }}>
                Book Free Audit <b>↗</b>
              </Link>
            </div>

            {related.length > 0 && (
              <div className="card mt" style={{ padding: 24 }}>
                <h4 style={{ marginBottom: 16 }}>Related Insights</h4>
                {related.map((rel) => (
                  <div key={rel.slug} style={{ marginBottom: 16 }}>
                    <small className="chip chip-time" style={{ marginBottom: 6 }}>
                      {rel.category}
                    </small>
                    <Link
                      href={`/blog/${rel.slug}`}
                      style={{
                        display: "block",
                        fontWeight: 600,
                        fontSize: 14,
                        color: "var(--ink)",
                        lineHeight: 1.4,
                      }}
                    >
                      {rel.title}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>
      </article>

      <Cta
        title="Ready to Elevate Your Digital Growth?"
        text="Let's analyze your current setup and implement strategies that drive measurable revenue."
        label="Get Your Free Consultation"
      />
    </>
  );
}
