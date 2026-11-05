"use client";
import { useState } from "react";
import Link from "next/link";

export default function AdminLogin() {
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setErr("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: e.target.password.value }),
      });

      if (res.ok) {
        window.location.href = "/admin";
      } else {
        setErr("Incorrect password. Please verify and try again.");
      }
    } catch {
      setErr("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className="page-h"
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="wrap"
        style={{
          maxWidth: 440,
          width: "100%",
          margin: "0 auto",
        }}
      >
        <div
          className="card"
          style={{
            padding: "36px 32px",
            background: "rgba(22, 16, 11, 0.95)",
            border: "1px solid rgba(193, 138, 74, 0.28)",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.45)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Link href="/" style={{ textDecoration: "none", display: "inline-block", marginBottom: 12 }}>
              <img src="/images/dc-logo.png" alt="Logo" style={{ width: 44, height: 44 }} />
            </Link>
            <h2 style={{ fontSize: 24, margin: "0 0 6px", color: "#FAF6F0" }}>
              Admin <em>Portal</em>
            </h2>
            <p style={{ fontSize: 13, color: "#A89F97", margin: 0 }}>
              Enter administrator password to access dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="form" style={{ display: "grid", gap: 16 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#FAF6F0", textTransform: "uppercase" }}>
                Admin Password
              </span>
              <input
                name="password"
                type="password"
                placeholder="••••••••••••"
                required
                autoFocus
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(193, 138, 74, 0.3)",
                  color: "#FFF",
                  fontSize: 14,
                  outline: "none",
                }}
              />
            </label>

            <button
              className="btn"
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                justifyContent: "center",
                marginTop: 6,
                padding: "12px",
                background: "var(--camel, #C18A4A)",
              }}
            >
              {loading ? "Authenticating..." : "Unlock Dashboard ↗"}
            </button>

            {err && (
              <p
                role="alert"
                style={{
                  background: "rgba(220, 38, 38, 0.12)",
                  border: "1px solid rgba(220, 38, 38, 0.3)",
                  color: "#FCA5A5",
                  padding: "10px 14px",
                  borderRadius: 8,
                  fontSize: 13,
                  margin: 0,
                  textAlign: "center",
                }}
              >
                ⚠ {err}
              </p>
            )}
          </form>

          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Link href="/" style={{ fontSize: 12, color: "#A89F97", textDecoration: "none" }}>
              ← Return to Digital Custard Website
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
