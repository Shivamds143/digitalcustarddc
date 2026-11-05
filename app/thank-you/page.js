"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ThankYouPage() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <section className="page-h inner-hero" style={{ minHeight: "75vh", display: "flex", alignItems: "center" }}>
      <div className="wrap" style={{ textAlign: "center", maxWidth: 650, margin: "0 auto" }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #F0BF58 0%, #D49520 100%)",
            color: "#18110B",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 34,
            fontWeight: 800,
            marginBottom: 24,
            boxShadow: "0 12px 30px rgba(212, 149, 32, 0.35)",
          }}
        >
          ✓
        </div>

        <p className="eyebrow" style={{ justifyContent: "center" }}>Success</p>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", marginBottom: 16 }}>
          Thank <em>You!</em>
        </h1>
        <p className="lead" style={{ margin: "0 auto 24px", color: "var(--ink-light)" }}>
          We have received your message and will get back to you within 24 hours.
        </p>

        <p
          style={{
            fontSize: 14,
            color: "var(--camel-dark)",
            fontWeight: 600,
            marginBottom: 32,
            letterSpacing: "0.02em",
          }}
        >
          Redirecting to home page in <strong>{seconds}</strong> second{seconds !== 1 ? "s" : ""}...
        </p>

        <div className="row" style={{ justifyContent: "center" }}>
          <Link href="/" className="btn">
            Back to Home Now <b>↗</b>
          </Link>
          <Link href="/services" className="btn out">
            Explore Services
          </Link>
        </div>
      </div>
    </section>
  );
}

