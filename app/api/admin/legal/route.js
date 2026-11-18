import { getAllLegalContent, saveLegalContent } from "@/lib/legalContent";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const legal = await getAllLegalContent(true);
    return Response.json({ ok: true, legal });
  } catch (err) {
    console.error("[Legal API GET]:", err);
    return Response.json({ error: "Failed to fetch legal content" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { key, pageName, lastUpdated, eyebrow, heading, leadText, sections } = body;

    if (!key || !["privacy", "terms"].includes(key)) {
      return Response.json({ error: "Valid key (privacy | terms) is required" }, { status: 400 });
    }
    if (!heading || !leadText) {
      return Response.json({ error: "Heading and lead text are required" }, { status: 400 });
    }

    const result = await saveLegalContent(key, {
      pageName,
      lastUpdated,
      eyebrow,
      heading,
      leadText,
      sections: sections || [],
    });

    // Revalidate the public-facing legal pages immediately
    try {
      revalidatePath(key === "privacy" ? "/privacy-policy" : "/terms-of-service");
      revalidatePath("/", "layout");
    } catch (revErr) {
      console.warn("[Legal] Revalidation warning:", revErr.message);
    }

    return Response.json(result);
  } catch (err) {
    console.error("[Legal API POST]:", err);
    return Response.json({ error: "Failed to save legal content" }, { status: 500 });
  }
}
