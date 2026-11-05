"use client";

import { useState } from "react";
import Link from "next/link";
import "./FlipCard.css";

export default function FlipCard({ item, index, parentTitle }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`flip-card-wrapper ${flipped ? "flipped" : ""}`}
      onClick={() => setFlipped(!flipped)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setFlipped(!flipped);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`${item.title} card - click or hover to flip`}
    >
      <div className="flip-card-inner">
        {/* ── FRONT FACE ── */}
        <div className="flip-face flip-face-front">
          <div className="card-top-row">
            <div className="flip-badge-num">
              {String(index + 1).padStart(2, "0")}
            </div>
            <span className="flip-hint-pill">
              Hover to Flip ⟳
            </span>
          </div>

          <h3 className="flip-front-title">{item.title}</h3>
          <p className="flip-front-desc">{item.desc}</p>

          <div className="flip-chips-row">
            {item.chips.map((chip) => (
              <span key={chip} className="flip-chip">
                {chip}
              </span>
            ))}
          </div>
        </div>

        {/* ── BACK FACE ── */}
        <div className="flip-face flip-face-back">
          <div className="flip-back-top">
            <span className="flip-back-kicker">
              {parentTitle || "Digital Custard"}
            </span>
            <h3 className="flip-back-title">{item.title}</h3>
            <p className="flip-back-desc">{item.desc}</p>

            <div className="flip-back-features-list">
              {item.chips.map((chip) => (
                <div key={chip} className="flip-back-feature-item">
                  <span className="flip-back-feature-bullet">✦</span>
                  <span>{chip} Included</span>
                </div>
              ))}
              <div className="flip-back-feature-item">
                <span className="flip-back-feature-bullet">✦</span>
                <span>Dedicated Strategic Execution</span>
              </div>
            </div>
          </div>

          <div className="flip-back-actions" onClick={(e) => e.stopPropagation()}>
            <Link
              href={`/contact?service=${encodeURIComponent(item.title)}`}
              className="flip-cta-btn"
            >
              Get Started <b>↗</b>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

