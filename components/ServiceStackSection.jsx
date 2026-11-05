"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { servicePanels } from "@/lib/servicesContent";
import "./ServiceStackSection.css";

export default function ServiceStackSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const panelsRef = useRef([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = panelsRef.current.indexOf(entry.target);
            if (idx !== -1) setActiveIdx(idx);
          }
        });
      },
      { threshold: 0.35 }
    );

    panelsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToPanel = (index) => {
    const el = panelsRef.current[index];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="fullscreen-service-container">
      {/* Right side floating vertical pagination dock */}
      <nav className="stack-indicator" aria-label="Services stack navigation">
        {servicePanels.map((sp, idx) => (
          <button
            key={sp.id}
            type="button"
            className={`stack-dot${activeIdx === idx ? " active" : ""}`}
            onClick={() => scrollToPanel(idx)}
            aria-label={`Go to ${sp.title} section`}
          >
            <span className="stack-dot-line" />
            <span className="stack-dot-label">0{idx + 1} {sp.id.toUpperCase()}</span>
          </button>
        ))}
      </nav>

      {/* Fullscreen Stacking Stage */}
      <div className="fullscreen-service-stage">
        {servicePanels.map((service, index) => (
          <section
            key={service.id}
            id={service.id}
            ref={(el) => (panelsRef.current[index] = el)}
            className={`fullscreen-service-panel ${service.className}`}
          >
            {/* Subtle atmospheric watermark number */}
            <div className="panel-watermark" aria-hidden="true">
              {service.num}
            </div>

            <div className="panel-inner panel-inner--no-cards">
              {/* Heading, description & visible CTAs */}
              <div className="panel-intro">
                <span className="panel-pill">{service.pill}</span>
                <h2 className="panel-title">
                  {service.title} <em>{service.titleEm}</em>
                </h2>
                <p className="panel-desc">{service.desc}</p>
                <div className="panel-actions">
                  <Link href={service.ctaHref} className="btn btn-primary-cta">
                    {service.cta} <b>↗</b>
                  </Link>
                  <Link href="/contact" className="btn btn-expert">
                    Talk to an expert
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom scroll hint for user feedback */}
            {index < servicePanels.length - 1 && (
              <div
                className="stack-scroll-cue"
                onClick={() => scrollToPanel(index + 1)}
                role="button"
                tabIndex={0}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
                <span>Scroll down for 0{index + 2} {servicePanels[index + 1].id.toUpperCase()}</span>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
