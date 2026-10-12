import Link from "next/link";
import { blogArticles } from "@/lib/blogData";

export const metadata = {
  title: "Blog & Insights | Digital Custard",
  description: "Stay informed with the latest trends, strategies, and insights in digital marketing and technology.",
};

const categories = ["All", "Conversion Strategy", "Digital Marketing", "SEO", "AI & Technology"];

export default function Blog() {
  const featured = blogArticles[0];
  const remaining = blogArticles.slice(1);

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
          <div className="blog-cats">
            {categories.map((c, i) => (
              <span key={c} className={`blog-cat-pill${i === 0 ? " active-cat" : ""}`}>{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Posts ── */}
      <section>
        <div className="wrap">
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
