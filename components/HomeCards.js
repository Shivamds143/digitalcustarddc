"use client";

import { useState } from "react";
import Link from "next/link";

/* ══════════════════════════════════════════════════
   HELPER: MOUSE-TRACKING SPOTLIGHT EFFECT
══════════════════════════════════════════════════ */
function handleMouseMove(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
  e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
}

/* ══════════════════════════════════════════════════
   1. EXCELLENCE SECTION (SPOTLIGHT LUXURY CARDS)
══════════════════════════════════════════════════ */
const excellenceDetails = [
  {
    title: "Data-Driven Approach",
    desc: "Every strategic decision and campaign iteration backed by deep performance analytics and real-time insights.",
    badge: "Analytics First",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
    metric: "100% Data-Backed"
  },
  {
    title: "Dedicated Team",
    desc: "Experienced full-stack engineers, creatives, and growth strategists fully committed to your business success.",
    badge: "Specialist Squad",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    metric: "Senior Dedicated Leads"
  },
  {
    title: "Proven Results",
    desc: "A consistent track record of driving qualified customer pipelines, reducing CAC, and delivering exponential ROI.",
    badge: "High Growth",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="m16 12-4-4-4 4M12 16V8" />
      </svg>
    ),
    metric: "300%+ Avg ROI"
  },
  {
    title: "24/7 Support",
    desc: "Proactive communication, rapid issue resolution, and around-the-clock technical monitoring when you need it.",
    badge: "Always On",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    metric: "Live Proactive Response"
  }
];

export function ExcellenceSection() {
  return (
    <section className="excellence-section">
      <div className="wrap">
        <div className="section-head" data-r>
          <span className="eyebrow">Our Standard</span>
          <h2>We Deliver Excellence in Every Project</h2>
          <p className="lead mt" style={{ marginTop: 14 }}>
            Our commitment to quality, innovation, and client success sets us apart from the competition.
          </p>
        </div>

        <div className="excellence-cards-grid mt">
          {excellenceDetails.map((item, i) => (
            <div
              key={item.title}
              className="excellence-card spotlight-card"
              onMouseMove={handleMouseMove}
              data-r
            >
              <div className="excellence-card-glow" />
              <div className="excellence-top">
                <div className="excellence-icon-wrapper">
                  {item.icon}
                </div>
                <span className="excellence-pill">{item.badge}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <div className="excellence-bottom">
                <span className="excellence-metric">
                  <i className="pulse-dot" /> {item.metric}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   2. WHY DIGITAL CUSTARD – BENTO SPOTLIGHT GRID
   (Replaces the horizontal scroll with a modern luxury bento grid)
══════════════════════════════════════════════════ */
const whySteps = [
  {
    num: "01",
    tag: "Strategy",
    title: "Strategy First",
    desc: "We align digital solutions directly with your business goals, target audience, and high-intent market opportunities.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    feature: "Commercial Alignment"
  },
  {
    num: "02",
    tag: "Synergy",
    title: "Creative + Technology",
    desc: "Where bold, memorable storytelling meets full-stack engineering to build flawless customer journeys.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    feature: "Full-Stack Synergy"
  },
  {
    num: "03",
    tag: "Precision",
    title: "Data-Driven Decisions",
    desc: "Zero guesswork — every campaign, ad spend allocation, and UX touchpoint is guided by real user behavior analytics.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    feature: "100% Attribution"
  },
  {
    num: "04",
    tag: "Custom",
    title: "Built Around You",
    desc: "Tailored strategies and digital architecture engineered specifically for your brand voice, industry compliance, and market edge.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    feature: "Custom Architecture"
  },
  {
    num: "05",
    tag: "Scale",
    title: "Focused on Growth",
    desc: "We don't just launch and leave. We continuously test, optimize, and scale campaigns to drive compounding revenue.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    feature: "Continuous Scaling"
  }
];

export function WhySection() {
  return (
    <section className="why-section">
      <div className="wrap">
        <div className="why-header-row" data-r>
          <div>
            <p className="eyebrow">Why Digital Custard?</p>
            <h2>More Than Digital. We Build What Moves Your Business Forward.</h2>
            <p className="lead mt" style={{ marginTop: 14 }}>
              Clear strategy, creative innovation, and measurable performance — engineered for your growth.
            </p>
          </div>
        </div>

        {/* Bento-style Spotlight Card Grid (No horizontal clipping, fully responsive) */}
        <div className="why-bento-grid mt">
          {whySteps.map((step, idx) => (
            <div
              key={step.title}
              className={`why-bento-card spotlight-card why-card-${idx + 1}`}
              onMouseMove={handleMouseMove}
              data-r
            >
              <div className="why-card-top">
                <div className="why-icon-badge">
                  {step.icon}
                </div>
                <div className="why-badge-group">
                  <span className="why-step-pill">{step.tag}</span>
                  <span className="why-step-num">{step.num}</span>
                </div>
              </div>

              <div className="why-card-content">
                <h3 className="why-step-title">{step.title}</h3>
                <p className="why-step-body">{step.desc}</p>
              </div>

              <div className="why-card-footer">
                <span className="why-feature-tag">
                  <i className="feature-glow-dot" /> {step.feature}
                </span>
                <span className="why-card-arrow">↗</span>
              </div>
            </div>
          ))}
        </div>

        <div className="why-bottom-cta mt" style={{ marginTop: 44, textAlign: "center" }}>
          <Link href="/contact" className="btn">
            Talk to our team <b>↗</b>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   3. INDUSTRIES WE WORK WITH – INTERACTIVE SHOWCASE
══════════════════════════════════════════════════ */
const sectorDetails = [
  {
    title: "Healthcare",
    tag: "Patient Trust & Portals",
    desc: "We help healthcare businesses strengthen their digital presence, connect with patients, and build trusted brands through strategic digital solutions and engaging experiences.",
    icon: "🩺",
    color: "#D49520"
  },
  {
    title: "Banking & Finance",
    tag: "Fintech & Compliance",
    desc: "We empower financial businesses with data-driven digital strategies that build trust, improve customer engagement, and create seamless digital experiences.",
    icon: "🏦",
    color: "#E5A824"
  },
  {
    title: "Industry & Manufacturing",
    tag: "B2B Automation & Scale",
    desc: "We help manufacturing businesses modernize their digital presence, showcase their capabilities, and connect with customers through effective digital strategies.",
    icon: "⚙️",
    color: "#C88A1A"
  },
  {
    title: "Media & Entertainment",
    tag: "Viral Audience Reach",
    desc: "We help media and entertainment brands capture attention, engage audiences, and grow their digital presence through creative content and performance-driven strategies.",
    icon: "🎬",
    color: "#B57512"
  },
  {
    title: "Logistic & Supply Chain",
    tag: "Logistics Intelligence",
    desc: "We support supply chain businesses in communicating their value, strengthening their digital presence, and reaching the right audiences through focused digital solutions.",
    icon: "📦",
    color: "#DE9F26"
  }
];

export function IndustriesSection() {
  const [activeSector, setActiveSector] = useState(0);

  return (
    <section className="industries-section">
      <div className="wrap">
        <div className="section-head" data-r>
          <span className="eyebrow">Sector Expertise</span>
          <h2>Industries We Work With</h2>
          <p className="lead mt" style={{ marginTop: 14 }}>
            Tailored digital solutions engineered for the unique challenges of your industry.
          </p>
        </div>

        {/* Animated Industry Cards Grid */}
        <div className="industries-cards-grid mt">
          {sectorDetails.map((sec, idx) => {
            const isActive = activeSector === idx;
            return (
              <div
                key={sec.title}
                className={`card industry-card${isActive ? " is-active" : ""}`}
                onMouseEnter={() => setActiveSector(idx)}
                data-r
              >
                <div className="industry-card-top">
                  <div className="industry-icon-pill">{sec.icon}</div>
                  <span className="industry-tag">{sec.tag}</span>
                </div>
                <h3>{sec.title}</h3>
                <p>{sec.desc}</p>
                <div className="industry-card-footer">
                  <Link href="/contact" className="industry-cta">
                    Custom Solutions <b>↗</b>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
