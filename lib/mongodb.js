import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";

const URI = process.env.MONGODB_URI;

function getDbName() {
  if (process.env.MONGODB_DB) return process.env.MONGODB_DB;
  try {
    const url = new URL(URI);
    return url.searchParams.get("dbName") || "digital_custard";
  } catch {
    return "digital_custard";
  }
}

let clientPromise = null;

export async function getDatabase() {
  if (!URI) return null;
  if (!clientPromise) {
    const client = new MongoClient(URI, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    });
    clientPromise = client.connect();
  }
  try {
    const connectedClient = await clientPromise;
    return connectedClient.db(getDbName());
  } catch (error) {
    clientPromise = null;
    throw error;
  }
}

/**
 * Diagnostics check: returns status and error details if MongoDB is unreachable
 */
export async function checkMongoStatus() {
  if (!URI) {
    return {
      connected: false,
      status: "missing_uri",
      message: "MONGODB_URI is not set in .env.local",
    };
  }

  try {
    const db = await getDatabase();
    if (!db) throw new Error("Database client not available");
    await db.command({ ping: 1 });
    return {
      connected: true,
      status: "connected",
      message: "MongoDB connected and active",
      dbName: getDbName(),
    };
  } catch (err) {
    const msg = err.message || String(err);
    let code = "connection_failed";
    let help = msg;

    if (msg.includes("SSL alert number 80") || msg.includes("tlsv1 alert internal error")) {
      code = "ip_whitelist_blocked";
      help =
        "MongoDB Atlas Network Access blocked your current IP (SSL alert 80). Please add your current IP address or '0.0.0.0/0' (Allow Access From Anywhere) in MongoDB Atlas > Network Access.";
    } else if (msg.includes("Authentication failed") || msg.includes("auth")) {
      code = "auth_failed";
      help = "Invalid MongoDB username or password. Check Database Access in Atlas.";
    } else if (msg.includes("ECONNREFUSED") || msg.includes("querySrv")) {
      code = "dns_blocked";
      help = "DNS resolution failed for the MongoDB Atlas cluster.";
    }

    return {
      connected: false,
      status: code,
      message: help,
      rawError: msg,
    };
  }
}

export function getLocalMessages() {
  const filePath = path.join(process.cwd(), "data", "inquiries.json");
  if (!fs.existsSync(filePath)) return [];

  try {
    const messages = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return Array.isArray(messages) ? messages : [];
  } catch {
    return [];
  }
}

export function saveLocalMessages(messages) {
  const dir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, "inquiries.json");
  fs.writeFileSync(filePath, JSON.stringify(messages, null, 2), "utf8");
}

export function deleteLocalMessage(id) {
  const messages = getLocalMessages();
  const filtered = messages.filter((m, idx) => {
    const msgId = m._id?.toString() || m.id || `local-${idx}`;
    return msgId !== id && m.createdAt !== id;
  });
  saveLocalMessages(filtered);
  return filtered;
}

/**
 * Saves contact inquiry to MongoDB with instant local failover backup
 * so no business leads are ever dropped even if Atlas cluster is paused or offline.
 */
export async function saveContactMessage(entry) {
  const record = {
    ...entry,
    createdAt: new Date().toISOString(),
  };

  // 1. Try MongoDB first if URI is provided
  if (URI) {
    try {
      const db = await getDatabase();
      if (db) {
        const result = await db.collection("messages").insertOne(record);
        console.log("[MongoDB] Inquiry saved successfully with ID:", result.insertedId);
        return { ok: true, storage: "mongodb", id: result.insertedId };
      }
    } catch (mongoErr) {
      console.warn("[MongoDB Warning]", mongoErr.message || mongoErr);
      console.warn("[MongoDB] Atlas unreachable. Saving to secure local inquiry backup...");
      clientPromise = null;
    }
  }

  // 2. Reliable local storage fallback (data/inquiries.json)
  try {
    const existing = getLocalMessages();
    existing.unshift({
      ...record,
      backupSavedAt: new Date().toISOString(),
    });
    saveLocalMessages(existing);
    console.log("[Inquiry Backup] Saved inquiry to data/inquiries.json");
    return { ok: true, storage: "backup" };
  } catch (fsErr) {
    console.error("[Inquiry Storage Error]", fsErr);
    throw new Error("Unable to record contact inquiry");
  }
}
