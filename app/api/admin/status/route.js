import { checkMongoStatus, getDatabase, getLocalMessages } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  const status = await checkMongoStatus();

  let messageCount = 0;
  if (status.connected) {
    try {
      const db = await getDatabase();
      messageCount = await db.collection("messages").countDocuments();
    } catch {
      messageCount = getLocalMessages().length;
    }
  } else {
    messageCount = getLocalMessages().length;
  }

  return Response.json({
    ...status,
    messageCount,
    timestamp: new Date().toISOString(),
  });
}

