import Link from "next/link";
export const metadata = {
  title: "Work | Digital Custard",
  description: "Case studies and project stories from Digital Custard — coming soon.",
};

const comingSoonItems = [
  { label: "Growth & Performance", icon: "📈" },
  { label: "Product & Technology", icon: "⚙️" },
  { label: "Brand & Creative", icon: "🎨" },
  { label: "AI & Automation", icon: "🤖" },
];

export default function Work() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="page-h inner-hero">
        <div className="wrap sp">
          <div>
            <p className="eyebrow">Selected Work</p>
            <h1>
              Built to move <em>business forward.</em>
            </h1>
            <p className="lead mt">
              We are putting together detailed stories from recent projects across growth, product and technology.
            </p>
          </div>
          <div className="inner-visual work-visual">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=85"
              alt="Team workshop"
            />
            <span>Impact in<br />the making</span>
          </div>
        </div>
      </section>

      {/* ── Coming Soon ── */}
      <section>
        <div className="wrap">
          <div className="case-placeholder" data-r>
            <p className="eyebrow">Case Studies</p>
            <h2>New Case Studies Coming Soon.</h2>
            <p>
              We're carefully documenting the work, the thinking and the outcomes behind our recent projects. Check back soon — or start a conversation to see how we can help.
            </p>

            {/* category preview pills */}
            <div className="work-cats">
              {comingSoonItems.map(({ label, icon }) => (
                <div className="work-cat-pill" key={label}>
                  <span>{icon}</span> {label}
                </div>
              ))}
            </div>

            <div className="row mt">
              <Link href="/contact" className="btn">Start a conversation ↗</Link>
              <Link href="/services" className="btn out">Our Services</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Placeholder grid to show scale ── */}
      <section>
        <div className="wrap">
          <p className="eyebrow">What's coming</p>
          <h2>Projects in the works</h2>
          <p className="lead mt" style={{ marginBottom: 40 }}>
            We partner across industries — from B2B SaaS to consumer brands, healthcare to fintech.
          </p>
          <div className="grid g3">
            {[
              ["Healthcare Client", "Digital transformation & patient experience — coming soon", "Healthcare"],
              ["FinTech Startup", "Performance marketing & lead generation — coming soon", "Banking & Finance"],
              ["B2B SaaS Platform", "Product development & growth strategy — coming soon", "Technology"],
            ].map(([title, desc, sector]) => (
              <div className="card work-preview-card" data-r key={title}>
                <div className="work-preview-thumb" />
                <span className="chip" style={{ marginBottom: 12 }}>{sector}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
