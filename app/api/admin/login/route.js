import { makeToken } from "@/lib/auth";

export async function POST(req) {
  const { password } = await req.json().catch(() => ({}));
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: "Wrong password" }, { status: 401 });
  }
  const res = Response.json({ ok: true });
  res.headers.append(
    "Set-Cookie",
    `admin=${await makeToken()}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }`
  );
  return res;
}

// Logout
export async function DELETE() {
  const res = Response.json({ ok: true });
  res.headers.append("Set-Cookie", "admin=; Path=/; HttpOnly; Max-Age=0");
  return res;
}