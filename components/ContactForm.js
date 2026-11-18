"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const INIT = { name: "", email: "", phone: "", subject: "", message: "", hp: "" };

export default function ContactForm() {
  const router = useRouter();
  const [fields, setFields] = useState(INIT);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | busy | ok | err
  const [errMsg, setErrMsg] = useState("");

  function onChange(e) {
    const { name, value } = e.target;
    setFields((f) => ({ ...f, [name]: value }));
    // Clear field error on change
    if (errors[name]) setErrors((er) => ({ ...er, [name]: "" }));
  }

  function validate() {
    const e = {};
    if (!fields.name.trim() || fields.name.trim().length < 2) {
      e.name = "Please enter your full name (at least 2 characters).";
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(fields.email.trim())) {
      e.email = "Enter a valid email address.";
    }
    if (fields.phone.trim() && !/^[+0-9\s\-()]{6,30}$/.test(fields.phone.trim())) {
      e.phone = "Enter a valid phone number (or leave blank).";
    }
    if (!fields.message.trim() || fields.message.trim().length < 10) {
      e.message = "Please enter your message (at least 10 characters).";
    }
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setStatus("busy");
    setErrMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("ok");
        setFields(INIT);
        setErrors({});
        router.push("/thank-you");
      } else {
        setStatus("err");
        setErrMsg(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("err");
      setErrMsg("Network error. Please check your connection and try again.");
    }
  }

  if (status === "ok") {
    return (
      <div className="card form-success">
        <div className="form-success-icon">✓</div>
        <h3>Message Sent!</h3>
        <p>Thank you, {fields.name || "there"}! We've received your message and will get back to you within 24 hours.</p>
        <button className="btn sm" onClick={() => setStatus("idle")} style={{ marginTop: 20 }}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card form" noValidate>
      <h3>Send Us a Message</h3>

      {/* Hidden honeypot field for bot/spam protection */}
      <div style={{ display: "none" }} aria-hidden="true">
        <label htmlFor="form-hp-field">Leave this empty</label>
        <input
          id="form-hp-field"
          type="text"
          name="hp"
          value={fields.hp}
          onChange={onChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <label>
        Name <span className="req">*</span>
        <input
          name="name"
          value={fields.name}
          onChange={onChange}
          placeholder="Your full name"
          autoComplete="name"
          aria-invalid={!!errors.name}
        />
        {errors.name && <span className="field-err">{errors.name}</span>}
      </label>

      <label>
        Email <span className="req">*</span>
        <input
          name="email"
          type="email"
          value={fields.email}
          onChange={onChange}
          placeholder="you@example.com"
          autoComplete="email"
          aria-invalid={!!errors.email}
        />
        {errors.email && <span className="field-err">{errors.email}</span>}
      </label>

      <label>
        Phone <span className="opt">(optional)</span>
        <input
          name="phone"
          type="tel"
          value={fields.phone}
          onChange={onChange}
          placeholder="+91 70207 63979"
          autoComplete="tel"
          aria-invalid={!!errors.phone}
        />
        {errors.phone && <span className="field-err">{errors.phone}</span>}
      </label>

      <label>
        Subject <span className="opt">(optional)</span>
        <input
          name="subject"
          type="text"
          value={fields.subject}
          onChange={onChange}
          placeholder="e.g. Website Redesign / AI Automation Inquiry"
          autoComplete="off"
        />
      </label>

      <label>
        Comment or Message <span className="req">*</span>
        <textarea
          name="message"
          rows={5}
          value={fields.message}
          onChange={onChange}
          placeholder="Tell us about your project or ask us anything..."
          aria-invalid={!!errors.message}
        />
        {errors.message && <span className="field-err">{errors.message}</span>}
      </label>

      <button className="btn" type="submit" disabled={status === "busy"}>
        {status === "busy" ? (
          <><span className="spinner" /> Sending…</>
        ) : (
          <>Submit ↗</>
        )}
      </button>

      {status === "err" && (
        <p className="bad" role="alert" style={{ marginTop: 8 }}>
          ⚠ {errMsg || "Message not sent. Please try again."}
        </p>
      )}
    </form>
  );
}
