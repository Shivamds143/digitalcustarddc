import { getAllSeoSettings, saveSeoSetting } from "@/lib/seoManager";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const seo = await getAllSeoSettings();
    return Response.json({ ok: true, seo });
  } catch (err) {
    return Response.json({ error: "Failed to fetch SEO settings" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { key, title, description, keywords, ogTitle, ogDescription, ogImage } = body;

    if (!key || !title) {
      return Response.json({ error: "Key and Title are required" }, { status: 400 });
    }

    const result = await saveSeoSetting(key, {
      title,
      description,
      keywords,
      ogTitle,
      ogDescription,
      ogImage,
    });

    return Response.json(result);
  } catch (err) {
    console.error("[API SEO Save Error]:", err);
    return Response.json({ error: "Failed to update SEO settings" }, { status: 500 });
  }
}

