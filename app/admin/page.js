import { getDatabase, getLocalMessages } from "@/lib/mongodb";
import { DeleteBtn, LogoutBtn } from "@/components/AdminActions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin | Digital Custard", robots: "noindex" };

export default async function Admin() {
  let list;
  let usingLocalBackup = false;
  try {
    const database = await getDatabase();
    if (!database) throw new Error("MONGODB_URI is not configured");
    list = await database.collection("messages").find().sort({ createdAt: -1 }).toArray();
  } catch (error) {
    console.error("[Admin] MongoDB unavailable; showing the local inquiry backup.", error);
    list = getLocalMessages();
    usingLocalBackup = true;
  }

  return (
    <section className="page-h">
      <div className="wrap">
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ fontSize: 40 }}>Messages ({list.length})</h1>
          <LogoutBtn />
        </div>

        {usingLocalBackup && (
          <p className="bad mt">
            MongoDB is unavailable. Showing locally backed-up messages; deleting is disabled until MongoDB reconnects.
          </p>
        )}

        {list.length === 0 && <p className="lead mt">No messages yet.</p>}

        <div className="grid mt">
          {list.map((m, index) => {
            const id = m._id?.toString();
            return (
              <div className="card" key={id || `${m.createdAt}-${index}`}>
                <div className="row" style={{ justifyContent: "space-between", alignItems: "start" }}>
                  <div>
                    <h3>{m.name}</h3>
                    <p>
                      <a href={`mailto:${m.email}`}>{m.email}</a>
                      {m.phone ? <> · <a href={`tel:${m.phone}`}>{m.phone}</a></> : null}
                    </p>
                  </div>
                  {id && !usingLocalBackup && <DeleteBtn id={id} />}
                </div>
                <p style={{ margin: "14px 0", color: "#0F172A", whiteSpace: "pre-wrap" }}>{m.message}</p>
                <small>{new Date(m.createdAt).toLocaleString("en-IN")}</small>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}