import Cta from "@/components/Cta";
import Link from "next/link";
import { groups, process } from "@/lib/content";

export const metadata = {
  title: "Services | Digital Custard",
  description: "From AI adoption and product development to web, mobile, UX, and digital marketing — focused services that move your business forward.",
};

const heroStats = [
  { label: "AI Services",         sub: "Generative, agentic, data & governance",  badge: "Priority" },
  { label: "Product Development", sub: "Strategy, UX and scalable engineering",    badge: "End-to-end" },
  { label: "24/7",                sub: "Support Available Around the Clock",      badge: "Reliable" },
  { label: "Expert Team",         sub: "Seasoned Specialists & Strategists",       badge: "Certified" },
];

export default function Services() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="page-h inner-hero">
        <div className="wrap">
          <div className="sp" style={{ alignItems: "center" }}>
            <div>
              <p className="eyebrow">Capabilities</p>
              <h1>
                AI, Product, Technology <em>and Growth.</em>
              </h1>
              <p className="lead mt">
                From AI adoption and product development to web, mobile, UX, and digital marketing, we build focused services that move your business forward.
              </p>
              <div className="row mt">
                <Link href="/contact" className="btn">Get Started <b>↗</b></Link>
                <a href="#ai" className="btn out">Explore Services</a>
              </div>
            </div>

            <div className="inner-visual service-visual">
              <img
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1000&q=85"
                alt="Creative professionals planning a project"
              />
              <span>One partner<br />many possibilities</span>
            </div>
          </div>

          {/* stat cards — full width balanced grid across all 4 columns */}
          <div className="svc-hero-stats" style={{ marginTop: 44 }}>
            {heroStats.map(({ label, sub, badge }) => (
              <div className="svc-stat-card" key={label}>
                <span className="svc-badge">{badge}</span>
                <strong className="svc-stat-label">{label}</strong>
                <small className="svc-stat-sub">{sub}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Service Groups ── */}
      {groups.map(([g, items], gi) => (
        <section key={g} id={gi === 0 ? "ai" : gi === 1 ? "it" : "marketing"}>
          <div className="wrap sp">
            <div className="sticky">
              <p className="eyebrow">0{gi + 1} / services</p>
              <h2>{g}</h2>
              <p className="mt">
                Focused expertise, designed to connect directly to measurable business outcomes.
              </p>
              <Link href="/contact" className="btn out sm mt">Talk to an expert</Link>
            </div>
            <div className="grid">
              {items.map(([t, x, bl], i) => (
                <div className="card service-card" data-r key={t}>
                  <span>0{i + 1}</span>
                  <h3>{t}</h3>
                  <p>{x}</p>
                  {bl && (
                    <ul className="list mt">
                      {bl.map((b) => <li key={b}>{b}</li>)}
                    </ul>
                  )}
                  <Link href="/contact" className="text-link">
                    Talk to an expert <b>↗</b>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ── Process ── */}
      <section className="process-section">
        <div className="wrap">
          <p className="eyebrow">How we work</p>
          <h2>Our Process</h2>
          <p className="lead mt">A proven methodology that delivers consistent results.</p>
          <div className="grid g4 mt">
            {process.map(([t, x], i) => (
              <div className="card process-card" data-r key={t}>
                <div className="process-num">{String(i + 1).padStart(2, "0")}</div>
                <div className="icon" style={{ marginTop: 16 }}>{i + 1}</div>
                <h3>{t}</h3>
                <p>{x}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Cta
        title="Want To Be Digitally Active?"
        text="Let's discuss which services are right for your business."
        label="Let's Connect"
      />
    </>
  );
}
