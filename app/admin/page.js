import { getDatabase, getLocalMessages, checkMongoStatus } from "@/lib/mongodb";
import AdminDashboard from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin Portal | Digital Custard", robots: "noindex" };

export default async function Admin() {
  const mongoStatus = await checkMongoStatus();

  let list = [];
  if (mongoStatus.connected) {
    try {
      const database = await getDatabase();
      if (database) {
        list = await database
          .collection("messages")
          .find()
          .sort({ createdAt: -1 })
          .toArray();
      }
    } catch (err) {
      console.warn("[Admin] Failed reading from MongoDB:", err.message);
      list = getLocalMessages();
    }
  }

  // If MongoDB returns 0 messages or was offline, load backed-up inquiries
  if (!list || list.length === 0) {
    list = getLocalMessages();
  }

  // Format serializable fields for Next.js Client Component props
  const serialized = list.map((m) => ({
    _id: m._id ? m._id.toString() : null,
    id: m._id ? m._id.toString() : m.id || m.createdAt,
    name: m.name || "",
    email: m.email || "",
    phone: m.phone || "",
    message: m.message || "",
    createdAt: m.createdAt || new Date().toISOString(),
    source: m.source || "website",
  }));

  return <AdminDashboard initialMessages={serialized} mongoStatus={mongoStatus} />;
}
