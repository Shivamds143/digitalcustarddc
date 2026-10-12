import { saveContactMessage } from "@/lib/mongodb";

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON request payload." }, { status: 400 });
  }

  const name    = String(body.name    || "").trim().slice(0, 120);
  const email   = String(body.email   || "").trim().slice(0, 160);
  const phone   = String(body.phone   || "").trim().slice(0, 30);
  const message = String(body.message || "").trim().slice(0, 3000);

  // Validate required inputs
  if (!name) {
    return Response.json({ error: "Name is required." }, { status: 400 });
  }
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return Response.json({ error: "A valid email address is required." }, { status: 400 });
  }
  if (!message) {
    return Response.json({ error: "Message is required." }, { status: 400 });
  }

  try {
    const result = await saveContactMessage({
      name,
      email,
      phone,
      message,
      source: "website-contact-page"
    });

    return Response.json({
      ok: true,
      message: "Thank you! Your message has been received.",
      storage: result.storage
    });
  } catch (err) {
    console.error("[Contact API Error]", err);
    return Response.json(
      { error: "Could not send message. Please try again or email us directly." },
      { status: 500 }
    );
  }
}
