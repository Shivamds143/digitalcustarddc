import fs from "fs";
import path from "path";
import { getDatabase } from "@/lib/mongodb";

// ─── DEFAULT CONTENT ─────────────────────────────────────────────────────────

export const defaultLegalContent = {
  privacy: {
    key: "privacy",
    pageName: "Privacy Policy",
    lastUpdated: "November 2026",
    eyebrow: "Legal & Compliance",
    heading: "Privacy Policy",
    leadText:
      "Last updated: November 2026. Your privacy and trust are paramount to Digital Custard.",
    sections: [
      {
        title: "1. Introduction",
        content:
          "Digital Custard (\"we\", \"our\", or \"us\") operates digital marketing, AI, and IT consultation services. This Privacy Policy explains how we collect, use, and protect your information when you visit our website or engage with our services.",
      },
      {
        title: "2. Information We Collect",
        content:
          "We collect information you provide directly to us through contact forms, emails, phone inquiries, and service consultations. This may include your name, email address, phone number, company name, and project specifications.",
      },
      {
        title: "3. How We Use Your Information",
        content:
          "We use the collected information solely to respond to your inquiries, deliver our digital marketing and IT solutions, send requested project updates, and enhance your website experience. We do not sell or lease your personal information to third parties.",
      },
      {
        title: "4. Data Security",
        content:
          "We implement industry-standard technical and organizational security measures to protect your data against unauthorized access, alteration, or disclosure.",
      },
      {
        title: "5. Contact Us",
        content:
          "If you have any questions about this Privacy Policy, please reach out to us at info@digitalcustard.in.",
      },
    ],
  },
  terms: {
    key: "terms",
    pageName: "Terms of Service",
    lastUpdated: "November 2026",
    eyebrow: "Legal & Compliance",
    heading: "Terms of Service",
    leadText:
      "Last updated: November 2026. Please read these terms carefully before utilizing our services.",
    sections: [
      {
        title: "1. Acceptance of Terms",
        content:
          "By accessing or using the Digital Custard website and our services, you agree to comply with and be bound by these Terms of Service and all applicable laws and regulations.",
      },
      {
        title: "2. Services Provided",
        content:
          "Digital Custard provides artificial intelligence integration, IT development, search engine optimization, performance marketing, and creative digital agency services. Detailed project scopes and deliverables are governed by individual client agreements.",
      },
      {
        title: "3. Intellectual Property",
        content:
          "All content, trademarks, logos, and digital collateral produced by Digital Custard remain our intellectual property until full transfer upon agreed project completion and payment terms.",
      },
      {
        title: "4. Limitation of Liability",
        content:
          "Digital Custard will not be liable for any indirect, consequential, or incidental damages arising out of the use or inability to use our website or services beyond the terms specified in written contracts.",
      },
      {
        title: "5. Governing Law",
        content:
          "These Terms are governed by and construed in accordance with the laws of India, under the jurisdiction of courts in Nashik, Maharashtra.",
      },
      {
        title: "6. Inquiries",
        content:
          "For legal questions regarding our terms, please contact info@digitalcustard.in.",
      },
    ],
  },
};

// ─── FILE PATH HELPER ─────────────────────────────────────────────────────────

function getLocalLegalFilePath() {
  const dir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, "legal.json");
}

// ─── IN-MEMORY CACHE ──────────────────────────────────────────────────────────

let cachedLegal = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 15000; // 15 seconds

// ─── GET ALL LEGAL CONTENT ───────────────────────────────────────────────────

export async function getAllLegalContent(forceFresh = false) {
  const now = Date.now();
  if (!forceFresh && cachedLegal && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedLegal;
  }

  let dbData = null;

  try {
    const db = await getDatabase();
    if (db) {
      const records = await db.collection("legal").find().toArray();
      if (records && records.length > 0) {
        dbData = {};
        records.forEach((r) => {
          if (r.key) {
            const { _id, ...clean } = r;
            dbData[r.key] = { ...clean, _id: _id ? _id.toString() : undefined };
          }
        });
      }
    }
  } catch (err) {
    console.warn("[Legal] MongoDB unavailable, using local fallback:", err.message);
  }

  if (dbData) {
    const merged = {
      privacy: { ...defaultLegalContent.privacy, ...(dbData.privacy || {}) },
      terms: { ...defaultLegalContent.terms, ...(dbData.terms || {}) },
    };
    cachedLegal = merged;
    cacheTimestamp = now;
    return merged;
  }

  // Check local JSON fallback
  const filePath = getLocalLegalFilePath();
  if (fs.existsSync(filePath)) {
    try {
      const local = JSON.parse(fs.readFileSync(filePath, "utf8"));
      const merged = {
        privacy: { ...defaultLegalContent.privacy, ...(local.privacy || {}) },
        terms: { ...defaultLegalContent.terms, ...(local.terms || {}) },
      };
      cachedLegal = merged;
      cacheTimestamp = now;
      return merged;
    } catch {
      // fall through to defaults
    }
  }

  cachedLegal = { ...defaultLegalContent };
  cacheTimestamp = now;
  return cachedLegal;
}

// ─── SAVE LEGAL CONTENT ───────────────────────────────────────────────────────

export async function saveLegalContent(key, payload) {
  if (!["privacy", "terms"].includes(key)) {
    throw new Error(`Invalid legal key: ${key}`);
  }

  const data = {
    ...payload,
    key,
    updatedAt: new Date().toISOString(),
  };

  // Invalidate cache immediately
  if (cachedLegal) {
    cachedLegal[key] = { ...(cachedLegal[key] || defaultLegalContent[key]), ...data };
    cacheTimestamp = Date.now();
  }

  let savedToMongo = false;

  // 1. Save to MongoDB
  try {
    const db = await getDatabase();
    if (db) {
      await db.collection("legal").updateOne({ key }, { $set: data }, { upsert: true });
      savedToMongo = true;
    }
  } catch (err) {
    console.warn("[Legal] MongoDB save error, saving locally:", err.message);
  }

  // 2. Save to local JSON fallback
  try {
    const filePath = getLocalLegalFilePath();
    let current = {};
    if (fs.existsSync(filePath)) {
      try {
        current = JSON.parse(fs.readFileSync(filePath, "utf8"));
      } catch {
        current = {};
      }
    }
    current[key] = data;
    fs.writeFileSync(filePath, JSON.stringify(current, null, 2), "utf8");
  } catch (fsErr) {
    console.error("[Legal] Local file write error:", fsErr);
  }

  return { ok: true, savedToMongo, data };
}
