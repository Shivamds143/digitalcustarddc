import Cta from "@/components/Cta";
import Link from "next/link";
import { values } from "@/lib/content";
export const metadata = {
  title: "About | Digital Custard",
  description: "We're pioneers in navigating the digital landscape, empowering businesses to thrive in the ever-evolving online sphere.",
};

export default function About() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="page-h inner-hero">
        <div className="wrap sp">
          <div>
            <p className="eyebrow">About Digital Custard</p>
            <h1>
              Ideas with intent.<br />
              <em>Growth with meaning.</em>
            </h1>
            <p className="lead mt">
              We bring strategy, creativity and technology together to help ambitious brands grow with purpose.
            </p>
            <div className="row mt">
              <Link href="/contact" className="btn">Let's Connect <b>↗</b></Link>
              <Link href="/services" className="btn out">Our Services</Link>
            </div>
          </div>
          <div className="inner-visual about-visual">
            <img
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=85"
              alt="Team collaborating around a table"
            />
            <span>Est. in India<br />Built for everywhere</span>
          </div>
        </div>
      </section>

      {/* ── Story ── */}
      <section>
        <div className="wrap sp">
          <div className="sticky">
            <p className="eyebrow">Our Story</p>
            <h2>Strategy, creativity and technology—working as one.</h2>
          </div>
          <div>
            {[
              "At Digital Custard, we're more than a marketing agency. We're pioneers in navigating the digital landscape, empowering businesses to thrive in the ever-evolving online sphere.",
              "Over the years, we've helped startups find their voice, established brands reinvent themselves, and everything in between. Our approach combines creative intuition with rigorous data analysis to deliver campaigns that don't just look good — they perform.",
              "Today, we're proud to be partners with clients who trust us with their digital presence. But we're just getting started.",
            ].map((p) => (
              <p className="lead" style={{ marginBottom: 20 }} data-r key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ── Vision + Mission cards ── */}
      <section>
        <div className="wrap grid g2">
          {[
            [
              "Our Vision",
              "To be the most trusted digital partner for businesses worldwide, driving innovation and excellence in every campaign we create.",
              "🎯",
            ],
            [
              "Our Mission",
              "To empower businesses with cutting-edge digital solutions that deliver real results, foster growth, and create lasting impact in the digital landscape.",
              "🚀",
            ],
          ].map(([t, x, emoji]) => (
            <div className="card vm-card" data-r key={t}>
              <div className="vm-emoji">{emoji}</div>
              <h3>{t}</h3>
              <p style={{ marginTop: 12 }}>{x}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Core Values ── */}
      <section>
        <div className="wrap">
          <p className="eyebrow">What guides us</p>
          <h2>Our Core Values</h2>
          <p className="lead mt">The principles that guide everything we do.</p>
          <div className="grid g4 mt">
            {values.map(([t, x]) => (
              <div className="card value-card" data-r key={t}>
                <div className="icon">{t[0]}</div>
                <h3>{t}</h3>
                <p>{x}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why work with us ── */}
      <section>
        <div className="wrap">
          <div className="dark sp" data-r>
            <div>
              <p className="eyebrow" style={{ color: "var(--gold-glow)" }}>Why us?</p>
              <h2>More than an agency.<br />We're your growth partner.</h2>
              <p className="mt">
                At Digital Custard, we're not just marketers; we're storytellers, artists of digital landscapes, and architects of your brand's digital triumph. With a team of seasoned professionals dedicated to amplifying your brand's online presence, we turn visions into digital reality.
              </p>
              <Link href="/contact" className="btn mt">Start a conversation ↗</Link>
            </div>
            <div className="partner-list">
              {[
                ["Expertise Meets Innovation", "We combine industry knowledge with cutting-edge strategies to deliver unparalleled results."],
                ["Tailored Solutions", "Each strategy is meticulously crafted to suit your brand's unique needs, ensuring optimal outcomes."],
                ["Proven Track Record", "Our success stories speak volumes about our commitment to driving your brand's growth."],
              ].map(([t, x], i) => (
                <div key={t} style={{ marginBottom: 22 }}>
                  <span>0{i + 1}</span>
                  <h3>{t}</h3>
                  <p>{x}</p>
                </div>
              ))}
              <p>
                <b style={{ color: "#fff" }}>Strategic Thinking · Creative Solutions · Real Results · 24/7 Support</b>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <Cta
        title="Want to Work With Us?"
        text="We're always looking for exciting projects and partnerships. Let's build something great together."
        label="Let's Connect"
      />
    </>
  );
}
