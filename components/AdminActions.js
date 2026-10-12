"use client";
import { useRouter } from "next/navigation";

export function DeleteBtn({ id }) {
  const router = useRouter();
  async function del() {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    router.refresh();
  }
  return <button className="btn out sm" onClick={del}>Delete</button>;
}

export function LogoutBtn() {
  async function out() {
    await fetch("/api/admin/login", { method: "DELETE" });
    location.href = "/admin/login";
  }
  return <button className="btn out sm" onClick={out}>Logout</button>;
}