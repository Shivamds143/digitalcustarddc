import { getLocalMessages, getDatabase } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  let list = [];
  try {
    const db = await getDatabase();
    if (db) {
      list = await db.collection("messages").find().sort({ createdAt: -1 }).toArray();
    }
  } catch {
    list = getLocalMessages();
  }

  if (!list || list.length === 0) {
    list = getLocalMessages();
  }

  // Format into CSV
  const headers = ["ID", "Name", "Email", "Phone", "Message", "Created At"];
  const rows = list.map((m) => [
    `"${(m._id?.toString() || "").replace(/"/g, '""')}"`,
    `"${(m.name || "").replace(/"/g, '""')}"`,
    `"${(m.email || "").replace(/"/g, '""')}"`,
    `"${(m.phone || "").replace(/"/g, '""')}"`,
    `"${(m.message || "").replace(/"/g, '""').replace(/\n/g, " ")}"`,
    `"${(m.createdAt || "").replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

  return new Response(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="inquiries-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}

