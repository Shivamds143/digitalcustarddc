"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { nav, brand } from "@/lib/content";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const navLinks = useMemo(() => [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" }
  ], []);

  /* ── scroll progress bar + glass header ── */
  useEffect(() => {
    const bar = document.getElementById("bar");
    const onScroll = () => {
      const h = document.documentElement;
      const progress = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      if (bar) bar.style.transform = `scaleX(${progress})`;
      setScrolled(h.scrollTop > 20);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ── intersection observer for gentle reveals ── */
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll("[data-r]").forEach((n) => io.observe(n));

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, [pathname]);

  /* ── close mobile menu on route change ── */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* scroll progress bar */}
      <div id="bar" />

      <header id="hd" className={`hd hd-milky-glass${scrolled ? " scrolled" : ""}`}>
        <div className="wrap hd-in">
          {/* Logo with high-contrast luxury styling */}
          <Link href="/" className="logo" aria-label="Digital Custard home">
            <img src="/images/dc-logo.png" alt="Digital Custard" />
            <span className="logo-text">Digital <em>Custard</em></span>
          </Link>

          {/* Milky White Transparent Desktop Navigation */}
          <nav className="desktop-main-nav" aria-label="Main navigation">
            {navLinks.map((item) => {
              const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`main-nav-link${isActive ? " is-active" : ""}`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="nav-glow-indicator" />}
                </Link>
              );
            })}
          </nav>

          {/* Header Action Button */}
          <div className="hd-actions">
            <Link href="/contact" className="btn sm hide-m hd-cta">
              Start Journey <b>↗</b>
            </Link>

            {/* Hamburger button for mobile */}
            <button
              className={`burger burger-milky${open ? " x" : ""}`}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              <i /><i /><i />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile navigation drawer — truly off-canvas, no clip issues */}
      {open && (
        <div
          className="nav-backdrop"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <nav
        className={`mobile-nav${open ? " open" : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!open}
        style={{ visibility: open ? "visible" : "hidden" }}
      >
        {/* Drawer header */}
        <div className="mobile-nav-header">
          <div className="mobile-nav-logo">
            <span className="mobile-nav-brand">Digital <em>Custard</em></span>
          </div>
          <button
            className="mobile-close"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Nav links */}
        <div className="mobile-nav-links">
          {navLinks.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`mobile-nav-link${isActive ? " active" : ""}`}
                onClick={() => setOpen(false)}
              >
                <span>{item.label}</span>
                {isActive && <i className="active-dot" />}
              </Link>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="mobile-nav-footer">
          <Link
            href="/contact"
            className="btn"
            style={{ width: "100%", justifyContent: "center", borderRadius: "12px" }}
            onClick={() => setOpen(false)}
          >
            Start Your Journey <b>↗</b>
          </Link>
          <p className="mobile-nav-tagline">Transforming brands through digital excellence.</p>
        </div>
      </nav>
    </>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="ft" role="contentinfo">
      <div className="ft-container">
        <div className="ft-grid">
          {/* Column 1: Brand & Social */}
          <div className="ft-col ft-col-brand">
            <Link href="/" className="ft-brand-link" aria-label="Digital Custard home">
              <img
                src="/images/dc-logo.png"
                alt="Digital Custard"
                className="ft-logo-img"
              />
              <span className="ft-brand-wordmark">
                Digital <em>Custard</em>
              </span>
            </Link>
            <p className="ft-tagline">
              Transforming brands through innovative digital marketing strategies that deliver measurable results.
            </p>
            <div className="ft-social-wrap">
              <span className="ft-social-label">Follow Us</span>
              <div className="ft-socials" role="list" aria-label="Social media channels">
                <a
                  href={brand.socials?.instagram || "https://www.instagram.com/digitalcustard"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ft-social-btn"
                  aria-label="Digital Custard on Instagram"
                  title="Instagram"
                  role="listitem"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>

                <a
                  href={brand.socials?.facebook || "https://www.facebook.com/digitalcustard"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ft-social-btn"
                  aria-label="Digital Custard on Facebook"
                  title="Facebook"
                  role="listitem"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>

                <a
                  href={brand.socials?.linkedin || "https://www.linkedin.com/company/digital-custard"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ft-social-btn"
                  aria-label="Digital Custard on LinkedIn"
                  title="LinkedIn"
                  role="listitem"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="ft-col">
            <h3 className="ft-heading">Quick Links</h3>
            <nav aria-label="Quick links">
              <ul className="ft-nav-list">
                <li>
                  <Link href="/" className="ft-link">Home</Link>
                </li>
                <li>
                  <Link href="/about" className="ft-link">About</Link>
                </li>
                <li>
                  <Link href="/services" className="ft-link">Services</Link>
                </li>
                <li>
                  <Link href="/blog" className="ft-link">Blog</Link>
                </li>
                <li>
                  <Link href="/contact" className="ft-link">Contact</Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Column 3: Services */}
          <div className="ft-col">
            <h3 className="ft-heading">Services</h3>
            <nav aria-label="Services links">
              <ul className="ft-nav-list">
                <li>
                  <Link href="/services/ai" className="ft-link">AI</Link>
                </li>
                <li>
                  <Link href="/services/it" className="ft-link">IT</Link>
                </li>
                <li>
                  <Link href="/services/marketing" className="ft-link">Digital Marketing</Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Column 4: Contact */}
          <div className="ft-col ft-col-contact">
            <h3 className="ft-heading">Contact</h3>
            <address className="ft-contact-address">
              <ul className="ft-contact-list">
                {/* Email */}
                <li className="ft-contact-item">
                  <span className="ft-contact-icon" aria-hidden="true">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                  <div className="ft-contact-details">
                    <span className="ft-contact-label">Email</span>
                    <a href="mailto:info@digitalcustard.in" className="ft-link">
                      info@digitalcustard.in
                    </a>
                  </div>
                </li>

                {/* Phone */}
                <li className="ft-contact-item">
                  <span className="ft-contact-icon" aria-hidden="true">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </span>
                  <div className="ft-contact-details">
                    <span className="ft-contact-label">Phone</span>
                    <a href="tel:+917020763979" className="ft-link">
                      +91 7020763979
                    </a>
                  </div>
                </li>

                {/* WhatsApp */}
                <li className="ft-contact-item">
                  <span className="ft-contact-icon" aria-hidden="true">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                  </span>
                  <div className="ft-contact-details">
                    <span className="ft-contact-label">WhatsApp</span>
                    <a
                      href="https://wa.me/917020763979"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ft-link"
                    >
                      Chat on WhatsApp
                    </a>
                  </div>
                </li>

                {/* Business Hours */}
                <li className="ft-contact-item ft-contact-hours">
                  <span className="ft-contact-icon" aria-hidden="true">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </span>
                  <div className="ft-contact-details">
                    <span className="ft-contact-label">Hours</span>
                    <span className="ft-contact-text">Mon - Fri: 10:00 AM - 7:00 PM</span>
                  </div>
                </li>

                {/* Address */}
                <li className="ft-contact-item ft-contact-address-block">
                  <span className="ft-contact-icon" aria-hidden="true">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </span>
                  <div className="ft-contact-details">
                    <span className="ft-contact-label">Address</span>
                    <a
                      href={brand.mapUrl || "https://maps.google.com"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ft-link ft-address-link"
                      title="Open address in Google Maps"
                    >
                      106, 1st Floor, Samrat Nucleus, Bhabha Nagar, Nashik, India
                    </a>
                  </div>
                </li>
              </ul>
            </address>
          </div>
        </div>

        {/* Bottom Bar: Divider line starts and ends at exact container edges */}
        <div className="ft-bottom">
          <p className="ft-copy">
            © {currentYear} Digital Custard · All rights reserved
          </p>
          <div className="ft-legal">
            <Link href="/privacy-policy" className="ft-legal-link">
              Privacy Policy
            </Link>
            <span className="ft-legal-sep" aria-hidden="true">·</span>
            <Link href="/terms-of-service" className="ft-legal-link">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
