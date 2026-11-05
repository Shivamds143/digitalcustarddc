"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./AdminDashboard.css";

export default function AdminDashboard({ initialMessages, mongoStatus }) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filterPeriod, setFilterPeriod] = useState("all"); // 'all' | 'today' | 'week'
  const [copiedId, setCopiedId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const [liveStatus, setLiveStatus] = useState(mongoStatus);

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
        </div>

        <div className="admin-header-right">
          <Link href="/" target="_blank" className="admin-btn-ghost">
            View Live Site <b>↗</b>
          </Link>
          <a href="/api/admin/export" className="admin-btn-secondary" title="Export inquiries as CSV file">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Export CSV
          </a>
          <button onClick={handleLogout} className="admin-btn-logout">
            Logout
          </button>
        </div>
      </header>

      <main className="admin-main">
        {/* ── MONGODB CONNECTION ALERT / DIAGNOSTICS CARD ── */}
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
                Your MongoDB Atlas replica set is active. Inquiries are being stored directly in collection:{" "}
                <code>{liveStatus.dbName || "digital_custard"}.messages</code>.
              </p>
            ) : (
              <div className="mongo-guidance-box">
                <p className="mongo-status-text">
                  <strong>Notice:</strong> {liveStatus.message}
                </p>
                <div className="mongo-ip-instruction">
                  <span className="step-label">How to connect MongoDB Atlas in 1 minute:</span>
                  <ol>
                    <li>
                      Go to your <strong>MongoDB Atlas Console</strong> &gt; <strong>Network Access</strong> (under Security).
                    </li>
                    <li>
                      Click <strong>Add IP Address</strong>.
                    </li>
                    <li>
                      Click <strong>"ALLOW ACCESS FROM ANYWHERE"</strong> (adds <code>0.0.0.0/0</code>) or add your current IP, then click <strong>Confirm</strong>.
                    </li>
                    <li>
                      Once saved in Atlas, click the <strong>"Test MongoDB Connection ⟳"</strong> button above!
                    </li>
                  </ol>
                  <div className="backup-guarantee-badge">
                    🛡️ <strong>Zero Data Loss Guarantee:</strong> All customer inquiries are safely preserved and manageable in your encrypted local backup storage.
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── METRIC STATS ROW ── */}
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

        {/* ── TOOLBAR: SEARCH & FILTERS ── */}
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

        {/* ── MAIN CONTENT: LIST & DETAIL VIEW ── */}
        <div className="admin-content-split">
          {/* Messages List Column */}
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
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")} className="btn-recheck" style={{ marginTop: 12 }}>
                    Clear Search
                  </button>
                )}
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
                          <span className="phone-chip">
                            📞 {m.phone}
                          </span>
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

          {/* Message Detail / Action Inspector Column */}
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
      </main>
    </div>
  );
}
