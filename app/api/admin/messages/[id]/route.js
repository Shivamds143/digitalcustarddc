import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";

export async function DELETE(req, { params }) {
  if (!ObjectId.isValid(params.id)) {
    return Response.json({ error: "Invalid message ID" }, { status: 400 });
  }

  try {
    const database = await getDatabase();
    if (!database) {
      return Response.json({ error: "MONGODB_URI is not configured" }, { status: 503 });
    }
    await database.collection("messages").deleteOne({ _id: new ObjectId(params.id) });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[Admin] Could not delete message from MongoDB.", error);
    return Response.json({ error: "MongoDB is unavailable; message was not deleted" }, { status: 503 });
  }
}