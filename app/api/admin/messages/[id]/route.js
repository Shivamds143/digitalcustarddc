import { ObjectId } from "mongodb";
import { getDatabase, deleteLocalMessage } from "@/lib/mongodb";

export async function DELETE(req, { params }) {
  const id = params.id;
  if (!id) {
    return Response.json({ error: "Missing message ID" }, { status: 400 });
  }

  // 1. Try deleting from MongoDB if it's a valid ObjectId
  let deletedFromMongo = false;
  if (ObjectId.isValid(id)) {
    try {
      const database = await getDatabase();
      if (database) {
        const result = await database.collection("messages").deleteOne({ _id: new ObjectId(id) });
        if (result && result.deletedCount > 0) deletedFromMongo = true;
      }
    } catch (error) {
      console.warn("[Admin API] Could not delete from MongoDB, proceeding to local check:", error.message);
    }
  }

  // 2. Also ensure local backup removes it
  try {
    deleteLocalMessage(id);
    return Response.json({ ok: true, deletedFromMongo });
  } catch (err) {
    console.error("[Admin API] Failed to delete message:", err);
    return Response.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
