import Link from "next/link";
import Cta from "@/components/Cta";
import { stats, pillars, quotes } from "@/lib/content";
import { ExcellenceSection, WhySection, IndustriesSection } from "@/components/HomeCards";

export const metadata = {
  title: "Digital Custard | AI, IT and Digital Marketing",
  description: "Transforming brands through innovative digital marketing strategies that deliver measurable results.",
};

export default function Home() {
  return (
    <>
      {/* ── HERO SECTION ── */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="hero-kicker">
              <i /> Digital strategy · technology · growth
            </p>
            <h1>
              Digital Custard's Recipe for <em>Your Marketing Triumph.</em>
            </h1>
            <p className="lead">
              We craft data-driven marketing strategies that elevate brands, captivate audiences, and deliver measurable growth.
            </p>
            <div className="row">
              <Link href="/contact" className="btn">
                Start your journey <b>↗</b>
              </Link>
              <Link href="/services" className="btn out">
                Explore services
              </Link>
            </div>
          </div>

          {/* Hero Visual: Premium D & C Monogram with team clipped inside */}
          <div className="hero-monogram-wrapper" data-r>
            <div className="hero-monogram-inner">
              <img
                src="/images/dc-hero-monogram.jpg"
                alt="Digital Custard D and C monogram with collaborative business team"
                className="hero-monogram-img"
                loading="eager"
              />
            </div>
          </div>

          <div className="stats">
            {stats.map(([a, b]) => (
              <div key={b}>
                <b>{a}</b>
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THREE PILLARS ── */}
      <section>
        <div className="wrap sp">
          <div className="sticky">
            <span className="eyebrow">Our Foundation</span>
            <h2>Three focused pillars for business growth</h2>
            <p className="lead mt">
              AI innovation, full-stack IT engineering, and results-driven digital marketing — three focused pillars built for measurable business growth.
            </p>
          </div>
          <div className="stack">
            {pillars.map(([t, x], i) => (
              <div className="card" style={{ "--i": i }} key={t}>
                <div className="icon">{t[0]}</div>
                <h3>{t}</h3>
                <p>{x}</p>
                <Link href="/services" className="btn out sm mt">
                  Learn more <b>↗</b>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 1. ANIMATED EXCELLENCE SECTION ── */}
      <ExcellenceSection />

      {/* ── 2. ANIMATED WHY DIGITAL CUSTARD SCROLLING DECK ── */}
      <WhySection />

      {/* ── 3. ANIMATED INDUSTRIES WE WORK WITH ── */}
      <IndustriesSection />

      {/* ── TESTIMONIALS ── */}
      <section>
        <div className="wrap">
          <p className="eyebrow">Testimonials</p>
          <h2>What Our Clients Say</h2>
          <p className="lead mt">
            Don't just take our word for it - hear from businesses we've helped succeed.
          </p>
          <div className="grid g3 mt">
            {quotes.map(([q, n, r]) => (
              <div className="card" data-r key={n}>
                <div className="q">“</div>
                <p style={{ lineHeight: 1.6 }}>{q}</p>
                <div className="who">
                  <i>{n[0]}</i>
                  <div>
                    <b>{n}</b>
                    <small>{r}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Cta
        title="Ready to Elevate Your Brand?"
        text="Let's discuss how we can help you achieve your digital marketing goals and take your business to new heights."
        label="Get Your Free Consultation"
      />
    </>
  );
}
