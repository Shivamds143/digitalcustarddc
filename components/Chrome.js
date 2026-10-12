"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import GooeyNav from "./GooeyNav";
import { nav, brand } from "@/lib/content";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const gooeyItems = useMemo(() => [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Work", href: "/work" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" }
  ], []);

  const activeIndex = useMemo(() => {
    const idx = gooeyItems.findIndex((it) =>
      it.href === "/" ? pathname === "/" : pathname.startsWith(it.href)
    );
    return idx >= 0 ? idx : 0;
  }, [pathname, gooeyItems]);

  /* ── scroll progress bar + glass header ── */
  useEffect(() => {
    const bar = document.getElementById("bar");
    const hd = document.getElementById("hd");
    const onScroll = () => {
      const h = document.documentElement;
      const progress = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      if (bar) bar.style.transform = `scaleX(${progress})`;
      const isScrolled = h.scrollTop > 20;
      if (hd) hd.classList.toggle("glass", isScrolled);
      setScrolled(isScrolled);
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

      <header id="hd" className={`hd${scrolled ? " glass" : ""}`}>
        <div className="wrap hd-in">
          {/* logo */}
          <Link href="/" className="logo" aria-label="Digital Custard home">
            <img src="/images/digital-custard-mark.png" alt="Digital Custard" />
            <span>Digital<br /><em>Custard</em></span>
          </Link>

          {/* Desktop GooeyNav */}
          <div className="desktop-gooey-nav">
            <GooeyNav
              items={gooeyItems}
              initialActiveIndex={0}
              activeIndex={activeIndex}
              onChange={(_, item) => {
                if (item.href && item.href !== pathname) router.push(item.href);
              }}
              theme="dark"
              color="#F5F0E9"
              activeTextColor="#3A281D"
              colors={["#C18A4A", "#D4A369", "#E5B978", "#8C6239", "#A97845", "#F5F0E9"]}
              size="md"
              frame={true}
              particleCount={15}
              spread={56}
              animationTime={600}
              timeVariance={300}
              gooeyness={0.5}
              wobble={0.5}
              hoverEffect={true}
            />
          </div>

          {/* Mobile navigation drawer */}
          <nav className={`mobile-nav${open ? " open" : ""}`} aria-label="Mobile navigation">
            <div className="mobile-nav-header">
              <span className="eyebrow" style={{ margin: 0 }}>Menu</span>
              <button
                className="mobile-close"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
            <div className="mobile-nav-links">
              {gooeyItems.map((item) => {
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
            <div className="mobile-nav-footer">
              <Link
                href="/contact"
                className="btn sm"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => setOpen(false)}
              >
                Start Journey <b>↗</b>
              </Link>
            </div>
          </nav>

          {/* header action button */}
          <Link href="/contact" className="btn sm hide-m hd-cta">
            Start Journey <b>↗</b>
          </Link>

          {/* hamburger */}
          <button
            className={`burger${open ? " x" : ""}`}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <i /><i />
          </button>
        </div>

        {/* mobile overlay backdrop */}
        {open && (
          <div
            className="nav-backdrop"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        )}
      </header>
    </>
  );
}

export function Footer() {
  return (
    <footer className="ft">
      <div className="wrap ft-g">
        {/* brand */}
        <div>
          <div className="logo inv">
            <img src="/images/digital-custard-mark.png" alt="Digital Custard" />
            <span>Digital<br /><em>Custard</em></span>
          </div>
          <p style={{ marginTop: 16, maxWidth: "34ch", color: "#d9cec5" }}>
            Transforming brands through innovative digital marketing strategies that deliver measurable results.
          </p>
          <div className="footer-social-wrap">
            <span className="social-stickers-label">Follow Us</span>
            <div className="social-stickers" role="list" aria-label="Social media channels">
              <a
                href={brand.socials?.instagram || "https://instagram.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="social-sticker sticker-instagram"
                aria-label="Follow Digital Custard on Instagram"
                title="Instagram"
              >
                <span className="sticker-shine" aria-hidden="true" />
                <span className="sticker-peel" aria-hidden="true" />
                <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" ry="5.5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                <span className="sticker-tooltip">Instagram</span>
              </a>

              <a
                href={brand.socials?.facebook || "https://facebook.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="social-sticker sticker-facebook"
                aria-label="Connect with Digital Custard on Facebook"
                title="Facebook"
              >
                <span className="sticker-shine" aria-hidden="true" />
                <span className="sticker-peel" aria-hidden="true" />
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                  <path d="M9.5 21.5h4v-7.8h2.8l.4-3.3h-3.2V8.3c0-.9.3-1.5 1.6-1.5h1.7V3.8c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5v2.2H7.2v3.3h2.6v7.8z" />
                </svg>
                <span className="sticker-tooltip">Facebook</span>
              </a>

              <a
                href={brand.socials?.linkedin || "https://linkedin.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="social-sticker sticker-linkedin"
                aria-label="Follow Digital Custard on LinkedIn"
                title="LinkedIn"
              >
                <span className="sticker-shine" aria-hidden="true" />
                <span className="sticker-peel" aria-hidden="true" />
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                  <path d="M8 19H5v-9h3zm-1.5-10.75A1.75 1.75 0 1 1 8.3 6.5a1.78 1.78 0 0 1-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0 0 13 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 0 1 2.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                </svg>
                <span className="sticker-tooltip">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        {/* quick links */}
        <div>
          <h4>Quick Links</h4>
          {nav.filter(n => n !== "Home").map((n) => (
            <Link key={n} href={`/${n.toLowerCase()}`}>{n}</Link>
          ))}
        </div>

        {/* services */}
        <div>
          <h4>Services</h4>
          {["AI Services", "Product Development", "Web Development", "Mobile App Development", "UI/UX Design", "Digital Marketing Services"].map((s) => (
            <Link key={s} href="/services">{s}</Link>
          ))}
        </div>

        {/* contact */}
        <div>
          <h4>Contact</h4>
          <a href={`mailto:${brand.email}`}>{brand.email}</a>
          <a href={`tel:${brand.phone.replace(/ /g, "")}`}>{brand.phone}</a>
          <a href="https://wa.me/917020763979" target="_blank" rel="noopener noreferrer">WhatsApp us</a>
          <span>{brand.hours}</span>
          <span>{brand.loc}</span>
        </div>
      </div>

      <div className="wrap copy">
        © {new Date().getFullYear()} Digital Custard · All rights reserved
      </div>
    </footer>
  );
}
