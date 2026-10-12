"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { excellence, why, sectors } from "@/lib/content";

/* ══════════════════════════════════════════════════
   1. EXCELLENCE SECTION WITH ANIMATED INTERACTIVE CARDS
══════════════════════════════════════════════════ */
const excellenceDetails = [
  {
    title: "Data-Driven Approach",
    desc: "Every decision backed by analytics and insights.",
    badge: "Analytics First",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
    metric: "100% Data-Backed"
  },
  {
    title: "Dedicated Team",
    desc: "Expert professionals committed to your success.",
    badge: "Specialist Squad",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    metric: "Dedicated Leads"
  },
  {
    title: "Proven Results",
    desc: "Track record of delivering measurable ROI.",
    badge: "300%+ Avg Growth",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="m16 12-4-4-4 4M12 16V8" />
      </svg>
    ),
    metric: "ROI Focused"
  },
  {
    title: "24/7 Support",
    desc: "Round-the-clock assistance when you need it.",
    badge: "Always Available",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    metric: "Live Response"
  }
];

export function ExcellenceSection() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

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
          {excellenceDetails.map((item, i) => {
            const isHovered = hoveredIdx === i;
            return (
              <div
                key={item.title}
                className={`excellence-card card${isHovered ? " is-hovered" : ""}`}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
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
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   2. WHY DIGITAL CUSTARD – SCROLLING STEP DECK
══════════════════════════════════════════════════ */
const whySteps = [
  {
    num: "01",
    tag: "Strategy",
    title: "Strategy First",
    lead: "We start with your business goals, not just technology.",
    text: "We understand your challenges, audience, and objectives before creating a strategy that fits your business."
  },
  {
    num: "02",
    tag: "Synergy",
    title: "Creative + Technology",
    lead: "Ideas become more powerful when creativity meets technology.",
    text: "We bring together creative thinking, modern technology, and digital expertise to build meaningful experiences."
  },
  {
    num: "03",
    tag: "Precision",
    title: "Data-Driven Decisions",
    lead: "Less guesswork. More measurable growth.",
    text: "We use data and performance insights to optimize strategies, improve engagement, and drive better results."
  },
  {
    num: "04",
    tag: "Custom",
    title: "Built Around You",
    lead: "Your business is unique. Your solution should be too.",
    text: "From strategy to execution, we create customized solutions aligned with your brand, industry, and goals."
  },
  {
    num: "05",
    tag: "Scale",
    title: "Focused on Growth",
    lead: "We don't just launch. We help you move forward.",
    text: "Our work is designed to create lasting digital impact, improve performance, and support sustainable business growth."
  }
];

export function WhySection() {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -340, behavior: "smooth" });
  };
  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 340, behavior: "smooth" });
  };

  return (
    <section className="why-section">
      <div className="wrap">
        <div className="why-header-row" data-r>
          <div>
            <p className="eyebrow">Why Digital Custard?</p>
            <h2>More Than Digital. We Build What Moves Your Business Forward.</h2>
            <p className="lead mt" style={{ marginTop: 14 }}>
              At Digital Custard, we combine strategy, creativity, technology, and data to create digital solutions that deliver real business impact.
            </p>
          </div>

          <div className="why-scroll-controls hide-m">
            <button onClick={scrollLeft} aria-label="Scroll left" className="scroll-btn">
              ←
            </button>
            <button onClick={scrollRight} aria-label="Scroll right" className="scroll-btn">
              →
            </button>
          </div>
        </div>

        {/* Horizontal scroll track with smooth snap effect */}
        <div className="why-scroll-container mt" ref={scrollRef}>
          {whySteps.map((step) => (
            <div key={step.title} className="card why-step-card" data-r>
              <div className="why-step-watermark">{step.num}</div>
              <div className="why-step-header">
                <span className="why-step-pill">{step.tag}</span>
                <span className="why-step-num">Step {step.num}</span>
              </div>
              <h3 className="why-step-title">{step.title}</h3>
              <p className="why-step-lead">
                <strong>{step.lead}</strong>
              </p>
              <p className="why-step-body">{step.text}</p>
              <div className="why-step-line" />
            </div>
          ))}
        </div>

        <div className="mt" style={{ marginTop: 32 }}>
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
    color: "#ba8346"
  },
  {
    title: "Banking & Finance",
    tag: "Fintech & Compliance",
    desc: "We empower financial businesses with data-driven digital strategies that build trust, improve customer engagement, and create seamless digital experiences.",
    icon: "🏦",
    color: "#d99b38"
  },
  {
    title: "Manufacturing",
    tag: "B2B Automation & Scale",
    desc: "We help manufacturing businesses modernize their digital presence, showcase their capabilities, and connect with customers through effective digital strategies.",
    icon: "⚙️",
    color: "#c29462"
  },
  {
    title: "Media & Entertainment",
    tag: "Viral Audience Reach",
    desc: "We help media and entertainment brands capture attention, engage audiences, and grow their digital presence through creative content and performance-driven strategies.",
    icon: "🎬",
    color: "#a87334"
  },
  {
    title: "Supply Chain",
    tag: "Logistics Intelligence",
    desc: "We support supply chain businesses in communicating their value, strengthening their digital presence, and reaching the right audiences through focused digital solutions.",
    icon: "📦",
    color: "#c48d4c"
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
                  <span className="industry-cta">
                    Custom Solutions <b>↗</b>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
