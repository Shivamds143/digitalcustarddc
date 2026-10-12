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
      serverSelectionTimeoutMS: 2500,
      connectTimeoutMS: 2500,
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

export function getLocalMessages() {
  const filePath = path.join(process.cwd(), "data", "inquiries.json");
  if (!fs.existsSync(filePath)) return [];

  const messages = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (!Array.isArray(messages)) {
    throw new Error("Local inquiry backup must contain an array");
  }
  return messages;
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
      console.warn("[MongoDB] Atlas cluster unreachable. Saving to secure local inquiry backup...");
      // Reset client promise so future attempts can reconnect
      clientPromise = null;
    }
  }

  // 2. Reliable local storage fallback (data/inquiries.json)
  try {
    const dir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const filePath = path.join(dir, "inquiries.json");
    let existing = [];
    if (fs.existsSync(filePath)) {
      try {
        existing = JSON.parse(fs.readFileSync(filePath, "utf8"));
        if (!Array.isArray(existing)) existing = [];
      } catch {
        existing = [];
      }
    }
    existing.unshift({
      ...record,
      backupSavedAt: new Date().toISOString()
    });
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), "utf8");
    console.log("[Inquiry Backup] Saved inquiry to data/inquiries.json");
    return { ok: true, storage: "backup" };
  } catch (fsErr) {
    console.error("[Inquiry Storage Error]", fsErr);
    throw new Error("Unable to record contact inquiry");
  }
}
