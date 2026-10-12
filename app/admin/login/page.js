"use client";
import { useState } from "react";

export default function Login() {
  const [err, setErr] = useState("");

  async function go(e) {
    e.preventDefault();
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: e.target.password.value }),
    });
    if (r.ok) location.href = "/admin";
    else setErr("Wrong password. Please try again.");
  }

  return (
    <section className="page-h">
      <div className="wrap" style={{ maxWidth: 440 }}>
        <form onSubmit={go} className="card form">
          <h3>Admin login</h3>
          <label>
            Password
            <input name="password" type="password" required />
          </label>
          <button className="btn">Login</button>
          {err && <p className="bad">{err}</p>}
        </form>
      </div>
    </section>
  );
}
