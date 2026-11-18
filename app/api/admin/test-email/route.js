import {
  getEmailProvider,
  isSmtpConfigured,
  verifySmtpConnection,
  sendTestEmail,
} from "@/lib/email";

export const dynamic = "force-dynamic";

/**
 * GET: Performs SMTP handshake and verification without sending any emails.
 */
export async function GET() {
  const provider = getEmailProvider();
  const configured = isSmtpConfigured();

  if (!configured) {
    return Response.json({
      ok: false,
      provider,
      configured: false,
      message: `SMTP credentials for "${provider}" are not fully configured in environment.`,
    });
  }

  const result = await verifySmtpConnection();
  return Response.json(result, { status: result.ok ? 200 : 500 });
}

/**
 * POST: Verifies connection and optionally sends a single test email if requested.
 */
export async function POST(req) {
  let body = {};
  try {
    body = await req.json();
  } catch {
    // Body is optional
  }

  const provider = getEmailProvider();
  const configured = isSmtpConfigured();

  if (!configured) {
    return Response.json({
      ok: false,
      provider,
      configured: false,
      message: `SMTP credentials for "${provider}" are not fully configured in environment.`,
    }, { status: 400 });
  }

  // If client only requested connection verification
  if (!body.sendTest) {
    const verification = await verifySmtpConnection();
    return Response.json(verification, { status: verification.ok ? 200 : 500 });
  }

  // If client explicitly requested a test email
  const sendResult = await sendTestEmail({ recipient: body.recipient });
  return Response.json(sendResult, { status: sendResult.success ? 200 : 500 });
}
