import { NextResponse } from "next/server";
import { makeToken } from "@/lib/auth";

export async function middleware(req) {
  const path = req.nextUrl.pathname;
  if (path === "/admin/login" || path === "/api/admin/login") return NextResponse.next();

  const ok = req.cookies.get("admin")?.value === (await makeToken());
  if (ok) return NextResponse.next();

  if (path.startsWith("/api/")) {
    return NextResponse.json({ error: "Not allowed" }, { status: 401 });
  }
  return NextResponse.redirect(new URL("/admin/login", req.url));
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };