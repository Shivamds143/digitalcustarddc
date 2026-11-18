import { saveContactMessage } from "@/lib/mongodb";
import { sendContactEmails, isSmtpConfigured } from "@/lib/email";

// In-memory rate limiting and duplicate submission tracking stores
// Keys auto-expire to prevent memory leaks in persistent environments
const rateLimitMap = new Map();
const duplicateSubmissionMap = new Map();

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5; // Max 5 requests per 10 minutes per IP
const DUPLICATE_WINDOW_MS = 60 * 1000; // 60 seconds cooldown for identical submissions

/**
 * Clean up expired rate limiting entries periodically
 */
function cleanupExpired(map, maxAgeMs) {
  const now = Date.now();
  for (const [key, timestamp] of map.entries()) {
    if (now - (typeof timestamp === "number" ? timestamp : timestamp.resetTime) > maxAgeMs) {
      map.delete(key);
    }
  }
}

/**
 * Extracts client IP from request headers safely
 */
function getClientIp(req) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const list = forwarded.split(",");
    return list[0].trim();
  }
  return req.headers.get("x-real-ip") || "127.0.0.1";
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON request payload." }, { status: 400 });
  }

  const clientIp = getClientIp(req);
  const now = Date.now();

  // 1. SPAM PROTECTION: Honeypot trap
  // Bots frequently fill hidden fields. If filled, return dummy 200 OK without processing.
  if (body.hp || body.website) {
    console.warn(`[Spam Blocked] Honeypot triggered by IP: ${clientIp}`);
    return Response.json({
      ok: true,
      message: "Thank you! Your message has been received.",
    });
  }

  // 2. RATE LIMITING: Check IP request frequency
  cleanupExpired(rateLimitMap, RATE_LIMIT_WINDOW_MS);
  const currentIpRate = rateLimitMap.get(clientIp);
  if (currentIpRate) {
    if (now < currentIpRate.resetTime) {
      if (currentIpRate.count >= MAX_REQUESTS_PER_WINDOW) {
        return Response.json(
          { error: "Too many requests. Please wait a few minutes before submitting again." },
          { status: 429 }
        );
      }
      currentIpRate.count += 1;
    } else {
      rateLimitMap.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    }
  } else {
    rateLimitMap.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
  }

  // Sanitize and trim fields
  const name    = String(body.name    || "").trim().slice(0, 120);
  const email   = String(body.email   || "").trim().slice(0, 160);
  const phone   = String(body.phone   || "").trim().slice(0, 30);
  const rawSub  = String(body.subject || "").trim().slice(0, 150);
  const subject = rawSub.length > 0 ? rawSub : "Website Contact Inquiry";
  const message = String(body.message || "").trim().slice(0, 3000);

  // 3. BACKEND VALIDATION
  if (!name || name.length < 2) {
    return Response.json({ error: "Please enter your full name (at least 2 characters)." }, { status: 400 });
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email || !emailRegex.test(email)) {
    return Response.json({ error: "A valid email address is required (e.g., you@example.com)." }, { status: 400 });
  }

  if (phone) {
    const phoneRegex = /^[+0-9\s\-()]{6,30}$/;
    if (!phoneRegex.test(phone)) {
      return Response.json({ error: "Please enter a valid phone number (or leave it blank)." }, { status: 400 });
    }
  }

  if (!message || message.length < 10) {
    return Response.json({ error: "Message must be at least 10 characters long." }, { status: 400 });
  }

  // 4. DUPLICATE SUBMISSION PREVENTION
  cleanupExpired(duplicateSubmissionMap, DUPLICATE_WINDOW_MS);
  const submissionKey = `${clientIp}:${email.toLowerCase()}:${message.toLowerCase().slice(0, 120)}`;
  const lastSubmittedTime = duplicateSubmissionMap.get(submissionKey);

  if (lastSubmittedTime && now - lastSubmittedTime < DUPLICATE_WINDOW_MS) {
    return Response.json(
      { error: "A message with identical content was already submitted recently. Please wait a moment." },
      { status: 429 }
    );
  }
  duplicateSubmissionMap.set(submissionKey, now);

  // 5. PERSIST TO DATABASE (MongoDB with local file failover backup)
  let storageResult;
  try {
    storageResult = await saveContactMessage({
      name,
      email,
      phone,
      subject,
      message,
      source: "website-contact-page",
      clientIp,
    });
  } catch (storageErr) {
    console.error("[Contact API Storage Error]", storageErr);
    return Response.json(
      { error: "Could not save your inquiry. Please try again or reach out at info@digitalcustard.in directly." },
      { status: 500 }
    );
  }

  // 6. TWO-WAY EMAIL NOTIFICATION (Nodemailer via MilesWeb business SMTP)
  const isConfigured = isSmtpConfigured();
  const emailResult = await sendContactEmails({
    name,
    email,
    phone,
    subject,
    message,
    clientIp,
  });

  return Response.json({
    ok: true,
    message: "Thank you! Your message has been received.",
    storage: storageResult?.storage || "ok",
    emailDelivery: {
      provider: emailResult.provider,
      isConfigured,
      simulated: emailResult.simulated,
      adminSent: emailResult.adminSent,
      customerSent: emailResult.customerSent,
      ...(emailResult.error ? { error: emailResult.error } : {}),
      ...(emailResult.simulated
        ? { note: `SMTP credentials for provider "${emailResult.provider}" not provided yet. Notification simulated in development mode.` }
        : {}),
    },
  });
}
