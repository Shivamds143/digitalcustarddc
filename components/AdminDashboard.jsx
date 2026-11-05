"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./AdminDashboard.css";

export default function AdminDashboard({ initialMessages, mongoStatus, initialSeoData }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("inquiries"); // 'inquiries' | 'seo'

  // ── INQUIRIES STATE ──
  const [messages, setMessages] = useState(initialMessages);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filterPeriod, setFilterPeriod] = useState("all"); // 'all' | 'today' | 'week'
  const [copiedId, setCopiedId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const [liveStatus, setLiveStatus] = useState(mongoStatus);

  // ── SEO MANAGER STATE ──
  const [seoData, setSeoData] = useState(initialSeoData || {});
  const [selectedSeoKey, setSelectedSeoKey] = useState("home");
  const [seoForm, setSeoForm] = useState(initialSeoData?.home || {});
  const [savingSeo, setSavingSeo] = useState(false);
  const [seoSaveMsg, setSeoSaveMsg] = useState("");

  // Switch selected SEO page
  function selectSeoPage(key) {
    setSelectedSeoKey(key);
    setSeoForm(seoData[key] || {});
    setSeoSaveMsg("");
  }

  function handleSeoInputChange(field, val) {
    setSeoForm((prev) => ({ ...prev, [field]: val }));
  }

  async function handleSaveSeo(e) {
    e.preventDefault();
    setSavingSeo(true);
    setSeoSaveMsg("");

    try {
      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: selectedSeoKey,
          ...seoForm,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSeoData((prev) => ({
          ...prev,
          [selectedSeoKey]: { ...prev[selectedSeoKey], ...seoForm },
        }));
        setSeoSaveMsg("✓ SEO settings published & saved successfully!");
      } else {
        setSeoSaveMsg(`⚠ ${data.error || "Failed to save SEO"}`);
      }
    } catch {
      setSeoSaveMsg("⚠ Network error while saving SEO.");
    } finally {
      setSavingSeo(false);
      setTimeout(() => setSeoSaveMsg(""), 4000);
    }
  }

  // Filter messages based on search & date
  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      const matchSearch =
        !searchTerm ||
        (m.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.phone || "").includes(searchTerm) ||
        (m.message || "").toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchSearch) return false;

      if (filterPeriod === "today") {
        const msgDate = new Date(m.createdAt).toDateString();
        const today = new Date().toDateString();
        return msgDate === today;
      }

      if (filterPeriod === "week") {
        const msgTime = new Date(m.createdAt).getTime();
        const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        return msgTime >= weekAgo;
      }

      return true;
    });
  }, [messages, searchTerm, filterPeriod]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = messages.length;
    const today = messages.filter(
      (m) => new Date(m.createdAt).toDateString() === new Date().toDateString()
    ).length;
    const withPhone = messages.filter((m) => !!m.phone).length;
    return { total, today, withPhone };
  }, [messages]);

  async function handleDelete(id, e) {
    e?.stopPropagation();
    if (!confirm("Are you sure you want to permanently delete this inquiry?")) return;
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => (m._id || m.id || m.createdAt) !== id));
        if (selectedMessage && (selectedMessage._id || selectedMessage.id || selectedMessage.createdAt) === id) {
          setSelectedMessage(null);
        }
      } else {
        alert("Could not delete message. Please try again.");
      }
    } catch {
      alert("Error connecting to server.");
    } finally {
      setIsDeleting(null);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    window.location.href = "/admin/login";
  }

  async function refreshConnection() {
    setTestingConnection(true);
    try {
      const res = await fetch("/api/admin/status");
      const data = await res.json();
      setLiveStatus(data);
      router.refresh();
    } catch {
      alert("Failed to check status.");
    } finally {
      setTestingConnection(false);
    }
  }

  function copyToClipboard(text, id) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="admin-container">
      {/* ── TOP HEADER / NAVIGATION BAR ── */}
      <header className="admin-header">
        <div className="admin-header-left">
          <Link href="/" className="admin-brand">
            <img src="/images/dc-logo.png" alt="Logo" className="admin-logo-img" />
            <span className="admin-brand-name">
              Digital <em>Custard</em>
            </span>
          </Link>
          <span className="admin-badge">Admin Workspace</span>

          {/* Navigation Tabs */}
          <div className="admin-nav-switcher">
            <button
              onClick={() => setActiveTab("inquiries")}
              className={`switcher-btn ${activeTab === "inquiries" ? "active" : ""}`}
            >
              📥 Inquiries ({messages.length})
            </button>
            <button
              onClick={() => setActiveTab("seo")}
              className={`switcher-btn ${activeTab === "seo" ? "active" : ""}`}
            >
              🔍 SEO Manager
            </button>
          </div>
        </div>

        <div className="admin-header-right">
          <Link href="/" target="_blank" className="admin-btn-ghost">
            View Live Site <b>↗</b>
          </Link>
          {activeTab === "inquiries" && (
            <a href="/api/admin/export" className="admin-btn-secondary" title="Export inquiries as CSV file">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              Export CSV
            </a>
          )}
          <button onClick={handleLogout} className="admin-btn-logout">
            Logout
          </button>
        </div>
      </header>

      <main className="admin-main">
        {/* ═══════════════════════════════════════════
            TAB 1: INQUIRIES & CRM
        ════════════════════════════════════════════ */}
        {activeTab === "inquiries" && (
          <>
            {/* MongoDB Connection Card */}
            <section className={`mongo-status-card ${liveStatus.connected ? "is-connected" : "is-warning"}`}>
              <div className="mongo-status-icon">
                {liveStatus.connected ? (
                  <span className="dot pulse-green" />
                ) : (
                  <span className="dot pulse-amber" />
                )}
              </div>
              <div className="mongo-status-info">
                <div className="mongo-status-title-row">
                  <h4>
                    Database Status:{" "}
                    <strong>
                      {liveStatus.connected ? "MongoDB Atlas Connected" : "Local Backup Active (Atlas IP Pending)"}
                    </strong>
                  </h4>
                  <button
                    onClick={refreshConnection}
                    disabled={testingConnection}
                    className="btn-recheck"
                    title="Test live connection to MongoDB"
                  >
                    {testingConnection ? "Pinging..." : "Test MongoDB Connection ⟳"}
                  </button>
                </div>

                {liveStatus.connected ? (
                  <p className="mongo-status-text success-text">
                    Your MongoDB Atlas replica set is active. Inquiries & SEO configurations are synchronized in real-time.
                  </p>
                ) : (
                  <div className="mongo-guidance-box">
                    <p className="mongo-status-text">
                      <strong>Notice:</strong> {liveStatus.message}
                    </p>
                    <div className="mongo-ip-instruction">
                      <span className="step-label">Connect MongoDB Atlas in 1 minute:</span>
                      <ol>
                        <li>
                          Open <strong>MongoDB Atlas</strong> &gt; <strong>Network Access</strong>.
                        </li>
                        <li>
                          Click <strong>Add IP Address</strong> &gt; <strong>"ALLOW ACCESS FROM ANYWHERE"</strong> (adds <code>0.0.0.0/0</code>) &gt; Confirm.
                        </li>
                        <li>
                          Click <strong>"Test MongoDB Connection ⟳"</strong> above!
                        </li>
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Metric Stats Row */}
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <span className="stat-label">Total Inquiries</span>
                <div className="stat-val-row">
                  <span className="stat-value">{stats.total}</span>
                  <span className="stat-pill">All time</span>
                </div>
              </div>

              <div className="admin-stat-card">
                <span className="stat-label">Received Today</span>
                <div className="stat-val-row">
                  <span className="stat-value" style={{ color: "#D49520" }}>
                    {stats.today}
                  </span>
                  <span className="stat-pill">24 hrs</span>
                </div>
              </div>

              <div className="admin-stat-card">
                <span className="stat-label">With Phone Numbers</span>
                <div className="stat-val-row">
                  <span className="stat-value">{stats.withPhone}</span>
                  <span className="stat-pill">Call ready</span>
                </div>
              </div>

              <div className="admin-stat-card">
                <span className="stat-label">Current Storage Mode</span>
                <div className="stat-val-row">
                  <span className="stat-storage-type">
                    {liveStatus.connected ? "MongoDB Atlas" : "Local Backup Sync"}
                  </span>
                </div>
              </div>
            </div>

            {/* Toolbar: Search & Filters */}
            <div className="admin-toolbar">
              <div className="admin-search-wrap">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name, email, phone, or keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="admin-search-input"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")} className="search-clear-btn">
                    ✕
                  </button>
                )}
              </div>

              <div className="admin-filter-tabs">
                <button
                  className={`filter-tab ${filterPeriod === "all" ? "active" : ""}`}
                  onClick={() => setFilterPeriod("all")}
                >
                  All ({messages.length})
                </button>
                <button
                  className={`filter-tab ${filterPeriod === "today" ? "active" : ""}`}
                  onClick={() => setFilterPeriod("today")}
                >
                  Today ({stats.today})
                </button>
                <button
                  className={`filter-tab ${filterPeriod === "week" ? "active" : ""}`}
                  onClick={() => setFilterPeriod("week")}
                >
                  Past 7 Days
                </button>
              </div>
            </div>

            {/* Split Content: Messages List & Inspector */}
            <div className="admin-content-split">
              <div className="messages-list-col">
                <div className="list-col-header">
                  <h3>
                    Inquiries <span>({filteredMessages.length})</span>
                  </h3>
                </div>

                {filteredMessages.length === 0 ? (
                  <div className="empty-inbox-card">
                    <div className="empty-icon">📭</div>
                    <h4>No inquiries found</h4>
                    <p>
                      {searchTerm
                        ? "No messages match your search keyword. Try clearing the search."
                        : "When clients submit the contact form, inquiries will appear here."}
                    </p>
                  </div>
                ) : (
                  <div className="messages-scroll-deck">
                    {filteredMessages.map((m, idx) => {
                      const id = m._id?.toString() || m.id || m.createdAt || `msg-${idx}`;
                      const isSelected =
                        selectedMessage &&
                        (selectedMessage._id || selectedMessage.id || selectedMessage.createdAt) === id;
                      const dateStr = new Date(m.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                      const timeStr = new Date(m.createdAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                      return (
                        <div
                          key={id}
                          onClick={() => setSelectedMessage(m)}
                          className={`message-summary-card ${isSelected ? "selected" : ""}`}
                        >
                          <div className="msg-card-top">
                            <div className="sender-avatar">{m.name ? m.name[0].toUpperCase() : "U"}</div>
                            <div className="sender-meta">
                              <h4 className="sender-name">{m.name || "Anonymous Lead"}</h4>
                              <span className="sender-email">{m.email}</span>
                            </div>
                            <span className="msg-date-tag">{dateStr}</span>
                          </div>

                          <p className="msg-snippet">{m.message}</p>

                          <div className="msg-card-foot">
                            {m.phone ? (
                              <span className="phone-chip">📞 {m.phone}</span>
                            ) : (
                              <span className="phone-chip-muted">No phone</span>
                            )}
                            <span className="msg-time">{timeStr}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Message Inspector */}
              <div className="message-detail-col">
                {selectedMessage ? (
                  <div className="inspector-panel">
                    <div className="inspector-header">
                      <div className="inspector-title-area">
                        <div className="sender-large-avatar">
                          {selectedMessage.name ? selectedMessage.name[0].toUpperCase() : "U"}
                        </div>
                        <div>
                          <h2>{selectedMessage.name}</h2>
                          <span className="received-timestamp">
                            Received on{" "}
                            {new Date(selectedMessage.createdAt).toLocaleString("en-IN", {
                              dateStyle: "full",
                              timeStyle: "short",
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="inspector-quick-actions">
                        <button
                          onClick={(e) =>
                            handleDelete(
                              selectedMessage._id || selectedMessage.id || selectedMessage.createdAt,
                              e
                            )
                          }
                          disabled={isDeleting !== null}
                          className="btn-danger-del"
                          title="Permanently remove message"
                        >
                          {isDeleting ? "Deleting..." : "Delete Inquiry"}
                        </button>
                      </div>
                    </div>

                    <div className="inspector-contact-tiles">
                      <div className="contact-tile">
                        <span className="tile-title">Email Address</span>
                        <a
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                            selectedMessage.email
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="tile-link"
                        >
                          {selectedMessage.email}
                          <span className="tile-action-hint">Compose Gmail ↗</span>
                        </a>
                      </div>

                      {selectedMessage.phone ? (
                        <div className="contact-tile">
                          <span className="tile-title">Phone & WhatsApp</span>
                          <div className="phone-actions-row">
                            <a href={`tel:${selectedMessage.phone}`} className="tile-link">
                              {selectedMessage.phone}
                            </a>
                            <a
                              href={`https://wa.me/${selectedMessage.phone.replace(/[^0-9]/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="whatsapp-btn"
                              title="Chat on WhatsApp"
                            >
                              WhatsApp ↗
                            </a>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <div className="inspector-body-box">
                      <div className="body-box-header">
                        <span className="box-title">Client Message Content</span>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              selectedMessage.message,
                              selectedMessage._id || selectedMessage.createdAt
                            )
                          }
                          className="copy-btn"
                        >
                          {copiedId ? "✓ Copied" : "Copy Text"}
                        </button>
                      </div>
                      <div className="message-text-content">{selectedMessage.message}</div>
                    </div>

                    <div className="quick-reply-dock">
                      <span className="quick-reply-label">Take Action Now:</span>
                      <div className="quick-reply-btns">
                        <a
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                            selectedMessage.email
                          )}&su=Reply%20from%20Digital%20Custard`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary-action"
                        >
                          Reply via Gmail <b>↗</b>
                        </a>
                        {selectedMessage.phone && (
                          <a
                            href={`https://wa.me/${selectedMessage.phone.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(
                              selectedMessage.name
                            )},%20thank%20you%20for%20reaching%20out%20to%20Digital%20Custard!`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-whatsapp-action"
                          >
                            Message on WhatsApp <b>↗</b>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="empty-inspector">
                    <div className="select-prompt-icon">👈</div>
                    <h3>Select an inquiry to view details</h3>
                    <p>Click on any message in the list to inspect client info, reply via Gmail, or chat on WhatsApp.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════
            TAB 2: FULL SEO MANAGEMENT SYSTEM
        ════════════════════════════════════════════ */}
        {activeTab === "seo" && (
          <div className="admin-seo-layout">
            {/* Sidebar of Pages */}
            <aside className="seo-pages-sidebar">
              <div className="seo-sidebar-header">
                <h3>Website Pages</h3>
                <span className="seo-badge">Dynamic Metadata</span>
              </div>
              <div className="seo-page-list">
                {Object.keys(seoData).map((key) => {
                  const p = seoData[key];
                  const isCurrent = selectedSeoKey === key;
                  return (
                    <button
                      key={key}
                      onClick={() => selectSeoPage(key)}
                      className={`seo-page-item ${isCurrent ? "active" : ""}`}
                    >
                      <div className="seo-page-info">
                        <strong>{p.pageName || key}</strong>
                        <code>{p.path}</code>
                      </div>
                      <span className="seo-arrow">→</span>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* SEO Editor Form */}
            <section className="seo-editor-container">
              <div className="seo-editor-header">
                <div>
                  <span className="seo-tag-pill">Editing Page: {seoData[selectedSeoKey]?.path}</span>
                  <h2>{seoData[selectedSeoKey]?.pageName || "SEO Settings"}</h2>
                </div>
                {seoSaveMsg && <span className="seo-status-toast">{seoSaveMsg}</span>}
              </div>

              {/* Google Search Live Simulator Preview */}
              <div className="seo-google-preview-box">
                <span className="preview-label">Google Search Result Preview:</span>
                <div className="google-preview-inner">
                  <div className="google-url-row">
                    <img src="/images/dc-logo.png" alt="Favicon" className="google-favicon" />
                    <span className="google-site-name">Digital Custard</span>
                    <span className="google-url-text">https://digitalcustard.in{seoData[selectedSeoKey]?.path}</span>
                  </div>
                  <h4 className="google-title-preview">
                    {seoForm.title || "Page Title | Digital Custard"}
                  </h4>
                  <p className="google-desc-preview">
                    {seoForm.description || "Add a meta description to see how this page will display in Google search results."}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveSeo} className="seo-editor-form">
                <div className="seo-form-group">
                  <label>
                    <span className="label-text">Meta Title (Recommended: 50-60 characters)</span>
                    <span className="char-counter">
                      {seoForm.title?.length || 0} / 60
                    </span>
                  </label>
                  <input
                    type="text"
                    value={seoForm.title || ""}
                    onChange={(e) => handleSeoInputChange("title", e.target.value)}
                    placeholder="E.g. Digital Custard | AI, IT and Digital Marketing"
                    required
                    className="seo-input"
                  />
                </div>

                <div className="seo-form-group">
                  <label>
                    <span className="label-text">Meta Description (Recommended: 120-160 characters)</span>
                    <span className="char-counter">
                      {seoForm.description?.length || 0} / 160
                    </span>
                  </label>
                  <textarea
                    rows={3}
                    value={seoForm.description || ""}
                    onChange={(e) => handleSeoInputChange("description", e.target.value)}
                    placeholder="Brief description summarizing the content of this page for search engines..."
                    required
                    className="seo-textarea"
                  />
                </div>

                <div className="seo-form-group">
                  <label>
                    <span className="label-text">Focus Keywords (Comma-separated)</span>
                  </label>
                  <input
                    type="text"
                    value={seoForm.keywords || ""}
                    onChange={(e) => handleSeoInputChange("keywords", e.target.value)}
                    placeholder="digital marketing, web development, AI automation, Nashik agency"
                    className="seo-input"
                  />
                </div>

                <div className="seo-form-row">
                  <div className="seo-form-group" style={{ flex: 1 }}>
                    <label>
                      <span className="label-text">OpenGraph Social Title (Facebook/LinkedIn/Twitter)</span>
                    </label>
                    <input
                      type="text"
                      value={seoForm.ogTitle || ""}
                      onChange={(e) => handleSeoInputChange("ogTitle", e.target.value)}
                      placeholder="Title for social media sharing cards"
                      className="seo-input"
                    />
                  </div>

                  <div className="seo-form-group" style={{ flex: 1 }}>
                    <label>
                      <span className="label-text">Social Share Banner Image URL</span>
                    </label>
                    <input
                      type="text"
                      value={seoForm.ogImage || ""}
                      onChange={(e) => handleSeoInputChange("ogImage", e.target.value)}
                      placeholder="/images/dc-hero-monogram.jpg or https://..."
                      className="seo-input"
                    />
                  </div>
                </div>

                <div className="seo-form-group">
                  <label>
                    <span className="label-text">OpenGraph Social Description</span>
                  </label>
                  <textarea
                    rows={2}
                    value={seoForm.ogDescription || ""}
                    onChange={(e) => handleSeoInputChange("ogDescription", e.target.value)}
                    placeholder="Short description shown when this link is shared on WhatsApp, LinkedIn, or Twitter..."
                    className="seo-textarea"
                  />
                </div>

                <div className="seo-actions-bar">
                  <button type="submit" disabled={savingSeo} className="btn-save-seo">
                    {savingSeo ? "Publishing SEO..." : "Save & Publish SEO Changes ↗"}
                  </button>
                  <span className="seo-auto-sync-hint">
                    ⚡ Changes take effect immediately across search engines and social share meta tags.
                  </span>
                </div>
              </form>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
