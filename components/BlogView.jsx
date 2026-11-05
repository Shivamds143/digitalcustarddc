"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const categories = ["All", "Conversion Strategy", "Digital Marketing", "SEO", "AI & Technology"];

export default function BlogView({ articles = [] }) {
  const [selectedCat, setSelectedCat] = useState("All");

  const filtered = useMemo(() => {
    if (selectedCat === "All") return articles;
    return articles.filter((article) => {
      if (article.category === selectedCat) return true;
      if (selectedCat === "SEO" && (article.title.includes("SEO") || article.category.includes("SEO") || article.excerpt.includes("SEO"))) {
        return true;
      }
      if (selectedCat === "AI & Technology" && (article.title.includes("AI") || article.excerpt.includes("AI") || article.category.includes("AI"))) {
        return true;
      }
      return false;
    });
  }, [articles, selectedCat]);

  const featured = filtered[0];
  const remaining = filtered.slice(1);

  return (
    <>
      {/* ── Hero ── */}
      <section className="page-h blog-hero">
        <div className="wrap blog-hero-inner">
          <div>
            <p className="eyebrow">Digital Thinking</p>
            <h1>Insights &amp; <em>Updates.</em></h1>
            <p className="lead mt">
              Stay informed with the latest trends, strategies, and insights in digital marketing and technology.
            </p>
          </div>
          {/* category filter display */}
          <div className="blog-cats" role="tablist" aria-label="Article categories">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCat(c)}
                className={`blog-cat-pill${selectedCat === c ? " active-cat" : ""}`}
                role="tab"
                aria-selected={selectedCat === c}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Posts ── */}
      <section>
        <div className="wrap">
          {filtered.length === 0 ? (
            <div className="card" style={{ padding: "48px 32px", textAlign: "center" }}>
              <p className="eyebrow" style={{ color: "var(--camel)" }}>Coming Soon</p>
              <h3 style={{ marginTop: 8 }}>Articles in &ldquo;{selectedCat}&rdquo; are being prepared</h3>
              <p style={{ marginTop: 12, maxWidth: "50ch", marginInline: "auto" }}>
                Our strategy and engineering teams are drafting in-depth insights for this category. Check back shortly or explore our featured articles below.
              </p>
              <button
                type="button"
                className="btn sm mt"
                onClick={() => setSelectedCat("All")}
                style={{ marginTop: 24 }}
              >
                View All Articles <b>↗</b>
              </button>
            </div>
          ) : (
            <>
              {/* featured first post */}
              {featured && (
                <article className="card blog-featured" data-r>
                  <div
                    className="blog-featured-img"
                    style={{ backgroundImage: `url(${featured.image})` }}
                  />
                  <div className="blog-featured-body">
                    <div className="row" style={{ gap: 10, marginBottom: 16 }}>
                      <span className="chip">{featured.category}</span>
                      <span className="chip chip-time">{featured.readTime}</span>
                    </div>
                    <h2 style={{ fontSize: "clamp(22px, 2.8vw, 32px)", lineHeight: 1.25 }}>
                      <Link href={`/blog/${featured.slug}`} style={{ color: "var(--ink)" }}>
                        {featured.title}
                      </Link>
                    </h2>
                    <p style={{ marginTop: 14, maxWidth: "65ch", lineHeight: 1.6 }}>{featured.excerpt}</p>
                    <div className="blog-meta mt">
                      <span>{featured.date}</span>
                      <span>·</span>
                      <span>{featured.author}</span>
                      <span>·</span>
                      <span>{featured.readTime}</span>
                    </div>
                    <div style={{ marginTop: 24 }}>
                      <Link href={`/blog/${featured.slug}`} className="btn sm">
                        Read Full Article <b>↗</b>
                      </Link>
                    </div>
                  </div>
                </article>
              )}

              {/* remaining posts grid */}
              {remaining.length > 0 && (
                <div className="grid g2" style={{ marginTop: 32 }}>
                  {remaining.map((p) => (
                    <article className="card blog-card" data-r key={p.slug}>
                      <div
                        className="post-image"
                        style={{ backgroundImage: `url(${p.image})` }}
                      />
                      <div className="blog-card-body">
                        <div className="row" style={{ gap: 8 }}>
                          <span className="chip">{p.category}</span>
                          <span className="chip chip-time">{p.readTime}</span>
                        </div>
                        <h3 style={{ margin: "14px 0 10px", fontSize: 21, lineHeight: 1.3 }}>
                          <Link href={`/blog/${p.slug}`} style={{ color: "var(--ink)" }}>
                            {p.title}
                          </Link>
                        </h3>
                        <p style={{ lineHeight: 1.55 }}>{p.excerpt}</p>
                        <div className="blog-meta mt">
                          <span>{p.date}</span>
                          <span>·</span>
                          <span>{p.author}</span>
                        </div>
                        <Link href={`/blog/${p.slug}`} className="text-link mt">
                          Read Full Article <b>↗</b>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── Newsletter CTA ── */}
      <section className="wrap">
        <div className="blog-newsletter" data-r>
          <div>
            <p className="eyebrow" style={{ color: "var(--gold-glow)" }}>Stay Updated</p>
            <h2 style={{ color: "#fff" }}>Get insights delivered to your inbox.</h2>
            <p style={{ color: "#e6ded6", marginTop: 12 }}>
              The latest strategies, case studies, and digital marketing insights — straight from the Digital Custard team.
            </p>
          </div>
          <Link href="/contact" className="btn">
            Get In Touch <b>↗</b>
          </Link>
        </div>
      </section>
    </>
  );
}

