import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

/**
 * Escapes user input to prevent HTML injection in emails.
 */
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Formats date into readable string with IST / local context.
 */
function formatDate(date = new Date()) {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "full",
      timeStyle: "medium",
      timeZone: "Asia/Kolkata",
    }).format(date);
  } catch {
    return date.toLocaleString();
  }
}

/**
 * Resolves the company logo CID attachment for bulletproof inline display in all email clients.
 */
export function getLogoAttachments() {
  try {
    const logoPath = path.join(process.cwd(), "public", "images", "dc-logo.png");
    if (fs.existsSync(logoPath)) {
      return [
        {
          filename: "dc-logo.png",
          path: logoPath,
          cid: "dc-company-logo",
        },
      ];
    }
  } catch (err) {
    console.warn("[Email Logo] Warning: Could not resolve logo file:", err.message);
  }
  return [];
}

/**
 * Returns the currently active email provider: "gmail" or "milesweb".
 * Defaults to "milesweb" if not explicitly specified.
 */
export function getEmailProvider() {
  const provider = (process.env.EMAIL_PROVIDER || "milesweb").toLowerCase().trim();
  return provider === "gmail" ? "gmail" : "milesweb";
}

/**
 * Checks if credentials for the active email provider are configured.
 */
export function isSmtpConfigured() {
  const provider = getEmailProvider();
  if (provider === "gmail") {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;
    return Boolean(user && pass && pass.trim().length > 0);
  }

  // MilesWeb business SMTP
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  return Boolean(host && user && pass && pass.trim().length > 0);
}

/**
 * Creates or retrieves the Nodemailer transporter for either Gmail or MilesWeb.
 */
export function getTransporter(providerOverride) {
  const provider = providerOverride || getEmailProvider();

  if (provider === "gmail") {
    // Gmail Testing SMTP with Google App Password
    return nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // SSL
      auth: {
        user: process.env.GMAIL_USER || "",
        pass: process.env.GMAIL_APP_PASSWORD || "",
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });
  }

  // MilesWeb Business SMTP
  const host = process.env.SMTP_HOST || "mail.digitalcustard.in";
  const port = Number(process.env.SMTP_PORT) || 587;
  // Port 465 is typically SSL (secure: true); port 587 uses STARTTLS (secure: false)
  const isSecure = process.env.SMTP_SECURE === "true" || port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure: isSecure,
    auth: {
      user: process.env.SMTP_USER || "info@digitalcustard.in",
      pass: process.env.SMTP_PASSWORD || "",
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === "production",
      minVersion: "TLSv1.2",
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

/**
 * Verifies SMTP connection and authentication with the configured provider.
 * Does not send any emails. Useful for diagnostics and testing mode.
 */
export async function verifySmtpConnection() {
  const provider = getEmailProvider();
  const configured = isSmtpConfigured();

  if (!configured) {
    const details =
      provider === "gmail"
        ? "GMAIL_USER or GMAIL_APP_PASSWORD missing or empty in environment"
        : "SMTP_HOST, SMTP_USER or SMTP_PASSWORD missing or empty in environment";

    console.warn(`[SMTP Test] Configuration incomplete for provider "${provider}": ${details}`);
    return {
      ok: false,
      provider,
      configured: false,
      message: `Configuration incomplete for provider "${provider}". ${details}.`,
    };
  }

  try {
    const transporter = getTransporter(provider);
    await transporter.verify();
    console.log(`[SMTP Test] SUCCESS: ${provider.toUpperCase()} SMTP connection & authentication verified.`);
    return {
      ok: true,
      provider,
      configured: true,
      message: `Connection to ${provider.toUpperCase()} SMTP server was verified successfully.`,
    };
  } catch (err) {
    console.error(`[SMTP Test] ERROR: Failed to verify ${provider} SMTP connection:`, err);
    return {
      ok: false,
      provider,
      configured: true,
      error: err.message || String(err),
      code: err.code,
      message: `Failed to connect/authenticate with ${provider.toUpperCase()} SMTP: ${err.message}`,
    };
  }
}

/**
 * Sends a single test email to verify end-to-end delivery when explicitly requested.
 */
export async function sendTestEmail({ recipient }) {
  const provider = getEmailProvider();
  const verified = await verifySmtpConnection();

  if (!verified.ok) {
    return {
      success: false,
      provider,
      message: verified.message,
      error: verified.error,
    };
  }

  const transporter = getTransporter(provider);
  const targetEmail =
    recipient ||
    (provider === "gmail"
      ? process.env.GMAIL_ADMIN_EMAIL || process.env.GMAIL_USER
      : process.env.ADMIN_EMAIL || process.env.SMTP_USER || "info@digitalcustard.in");

  const fromAddress =
    provider === "gmail"
      ? process.env.GMAIL_USER
      : process.env.FROM_EMAIL || process.env.SMTP_USER || "info@digitalcustard.in";

  const logoAttachments = getLogoAttachments();

  const mailOptions = {
    from: `"Digital Custard Testing" <${fromAddress}>`,
    to: targetEmail,
    subject: `[SMTP Test] Digital Custard Notification System (${provider.toUpperCase()})`,
    text: `SMTP Test Successful!\n\nProvider: ${provider}\nSender: ${fromAddress}\nTimestamp: ${formatDate()}\n\nYour ${provider} SMTP configuration is active and working properly.`,
    html: `<div style="font-family: sans-serif; padding: 24px; background: #F5F0E9; color: #211A17;">
      <div style="max-width: 500px; margin: 0 auto; background: #fff; padding: 28px 24px; border-radius: 12px; border: 1px solid #E9E0D5;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="cid:dc-company-logo" alt="Digital Custard" width="70" height="52" style="display: inline-block; width: 70px; height: auto; border: 0;" />
        </div>
        <h2 style="color: #D49520; margin-top: 0; text-align: center;">SMTP Test Successful</h2>
        <p style="text-align: center; color: #4A3E36;">This is a verification email from your <strong>Digital Custard</strong> notification system.</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 20px; background: #FBF9F5; padding: 12px; border-radius: 8px;">
          <tr><td style="padding: 8px 12px; color: #76675B;">Provider:</td><td style="font-weight: 700; padding: 8px 12px;">${provider.toUpperCase()}</td></tr>
          <tr><td style="padding: 8px 12px; color: #76675B;">Sender:</td><td style="padding: 8px 12px;">${fromAddress}</td></tr>
          <tr><td style="padding: 8px 12px; color: #76675B;">Recipient:</td><td style="padding: 8px 12px;">${targetEmail}</td></tr>
          <tr><td style="padding: 8px 12px; color: #76675B;">Timestamp:</td><td style="padding: 8px 12px;">${formatDate()}</td></tr>
        </table>
        <p style="margin-top: 20px; font-size: 13px; color: #4A3E36; text-align: center;">Your SMTP configuration is properly connected and ready.</p>
      </div>
    </div>`,
    attachments: logoAttachments,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[SMTP Test] Test email sent to ${targetEmail}. MessageId:`, info.messageId);
    return {
      success: true,
      provider,
      recipient: targetEmail,
      messageId: info.messageId,
      message: `Test email sent successfully to ${targetEmail}`,
    };
  } catch (err) {
    console.error(`[SMTP Test] Error sending test email:`, err);
    return {
      success: false,
      provider,
      recipient: targetEmail,
      error: err.message,
      message: `Failed to send test email: ${err.message}`,
    };
  }
}

/**
 * Generates responsive HTML and Plain Text templates for the Admin Notification email.
 */
export function renderAdminNotificationEmail({ name, email, phone, subject, message, submittedAt = new Date(), clientIp = "" }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone || "Not provided");
  const safeSubject = escapeHtml(subject || "New Website Inquiry");
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");
  const formattedTime = formatDate(submittedAt);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Lead: ${safeSubject}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #F5F0E9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    table { border-collapse: separate; }
    a { color: #B57512; text-decoration: none; }
    a:hover { text-decoration: underline; }
    @media only screen and (max-width: 620px) {
      .wrapper { width: 100% !important; padding: 12px !important; }
      .content-cell { padding: 20px 16px !important; }
      .field-label { width: 100% !important; display: block !important; margin-bottom: 4px !important; }
      .field-value { width: 100% !important; display: block !important; margin-bottom: 12px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F5F0E9;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F5F0E9; padding: 30px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card Wrapper -->
        <table role="presentation" class="wrapper" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(45, 32, 20, 0.08); border: 1px solid #E9E0D5;">
          
          <!-- Brand Header with Real Company Logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #211A17 0%, #352B24 100%); padding: 28px 36px; border-bottom: 4px solid #D49520; text-align: left;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="width: 58px; vertical-align: middle; padding-right: 14px;">
                    <a href="https://digitalcustard.in" target="_blank" rel="noopener noreferrer" style="text-decoration: none; display: inline-block;">
                      <img 
                        src="cid:dc-company-logo" 
                        alt="Digital Custard" 
                        width="54" 
                        height="40" 
                        style="display: block; width: 54px; height: auto; max-width: 60px; border: 0; outline: none; text-decoration: none;" 
                      />
                    </a>
                  </td>
                  <td style="vertical-align: middle;">
                    <div style="font-size: 11px; font-weight: 700; letter-spacing: 2.2px; text-transform: uppercase; color: #D49520; margin-bottom: 4px;">DIGITAL CUSTARD &bull; LEAD ALERT</div>
                    <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">New Contact Submission</h1>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <span style="display: inline-block; background-color: rgba(212, 149, 32, 0.2); border: 1px solid #D49520; color: #F0BF58; padding: 6px 12px; border-radius: 999px; font-size: 12px; font-weight: 700;">Action Required</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td class="content-cell" style="padding: 36px 36px 24px 36px; color: #211A17;">
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #4A3E36;">
                A new inquiry was just received through the <strong>Digital Custard</strong> contact form. Here are the customer details:
              </p>

              <!-- Lead Details Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FBF9F5; border: 1px solid #E9E0D5; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td class="field-label" style="padding: 8px 0; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #76675B; width: 130px; vertical-align: top;">Name</td>
                        <td class="field-value" style="padding: 8px 0; font-size: 16px; font-weight: 600; color: #211A17; vertical-align: top;">${safeName}</td>
                      </tr>
                      <tr>
                        <td class="field-label" style="padding: 8px 0; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #76675B; width: 130px; vertical-align: top;">Email</td>
                        <td class="field-value" style="padding: 8px 0; font-size: 15px; color: #211A17; vertical-align: top;">
                          <a href="mailto:${safeEmail}" style="color: #B57512; font-weight: 600; text-decoration: none;">${safeEmail}</a>
                        </td>
                      </tr>
                      <tr>
                        <td class="field-label" style="padding: 8px 0; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #76675B; width: 130px; vertical-align: top;">Phone</td>
                        <td class="field-value" style="padding: 8px 0; font-size: 15px; color: #211A17; vertical-align: top;">
                          ${phone ? `<a href="tel:${safePhone}" style="color: #211A17; text-decoration: none; font-weight: 500;">${safePhone}</a>` : '<span style="color: #8E8075; font-style: italic;">Not provided</span>'}
                        </td>
                      </tr>
                      <tr>
                        <td class="field-label" style="padding: 8px 0; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #76675B; width: 130px; vertical-align: top;">Subject</td>
                        <td class="field-value" style="padding: 8px 0; font-size: 15px; font-weight: 600; color: #211A17; vertical-align: top;">${safeSubject}</td>
                      </tr>
                      <tr>
                        <td class="field-label" style="padding: 8px 0; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #76675B; width: 130px; vertical-align: top;">Submitted At</td>
                        <td class="field-value" style="padding: 8px 0; font-size: 14px; color: #76675B; vertical-align: top;">${formattedTime} (IST)</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Customer Message Box -->
              <div style="margin-bottom: 28px;">
                <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #76675B; margin-bottom: 8px;">Customer Message:</div>
                <div style="background-color: #FFFFFF; border-left: 4px solid #D49520; border-top: 1px solid #E9E0D5; border-right: 1px solid #E9E0D5; border-bottom: 1px solid #E9E0D5; padding: 20px 22px; border-radius: 0 10px 10px 0; font-size: 15px; line-height: 1.7; color: #211A17; font-family: Georgia, serif;">
                  ${safeMessage}
                </div>
              </div>

              <!-- Quick Reply Action Button -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 12px;">
                <tr>
                  <td align="center">
                    <a href="mailto:${safeEmail}?subject=${encodeURIComponent("Re: " + (subject || "Inquiry to Digital Custard"))}" style="display: inline-block; background-color: #D49520; color: #211A17; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 8px; text-decoration: none; box-shadow: 0 2px 8px rgba(212, 149, 32, 0.35); text-align: center;">
                      Reply Directly to ${safeName} &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Metadata -->
          <tr>
            <td style="background-color: #FBF9F5; border-top: 1px solid #E9E0D5; padding: 20px 36px; font-size: 12px; color: #8E8075; text-align: center; line-height: 1.6;">
              This notification was generated automatically by the <strong>Digital Custard</strong> notification system.<br/>
              Lead stored in database &bull; IP: ${escapeHtml(clientIp || "Protected")}
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `NEW CONTACT INQUIRY - DIGITAL CUSTARD
----------------------------------------
Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Subject: ${subject || "Website Contact"}
Submitted: ${formattedTime} (IST)

CUSTOMER MESSAGE:
${message}
----------------------------------------
Reply directly to ${email}`;

  return { html, text };
}

/**
 * Generates responsive HTML and Plain Text templates for the Customer Thank You confirmation email.
 */
export function renderCustomerConfirmationEmail({ name, email, phone, subject, message, submittedAt = new Date() }) {
  const safeName = escapeHtml(name);
  const safeSubject = escapeHtml(subject || "Your Project Inquiry");
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");
  const formattedTime = formatDate(submittedAt);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Contacting Digital Custard</title>
  <style>
    body { margin: 0; padding: 0; background-color: #F5F0E9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    table { border-collapse: separate; }
    a { color: #B57512; text-decoration: none; }
    a:hover { text-decoration: underline; }
    @media only screen and (max-width: 620px) {
      .wrapper { width: 100% !important; padding: 12px !important; }
      .content-cell { padding: 24px 18px !important; }
      .pill-stack { display: block !important; width: 100% !important; margin-bottom: 8px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F5F0E9;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F5F0E9; padding: 32px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card Wrapper -->
        <table role="presentation" class="wrapper" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 6px 24px rgba(45, 32, 20, 0.08); border: 1px solid #E9E0D5;">
          
          <!-- Premium Brand Header with Real Company Logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #211A17 0%, #352B24 100%); padding: 36px 40px 32px 40px; border-bottom: 4px solid #D49520; text-align: center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <a href="https://digitalcustard.in" target="_blank" rel="noopener noreferrer" style="text-decoration: none; display: inline-block;">
                      <img 
                        src="cid:dc-company-logo" 
                        alt="Digital Custard" 
                        width="80" 
                        height="60" 
                        style="display: block; width: 80px; height: auto; max-width: 90px; margin: 0 auto 14px auto; border: 0; outline: none; text-decoration: none;" 
                      />
                    </a>
                    <h1 style="margin: 0 0 6px 0; font-size: 24px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">DIGITAL CUSTARD</h1>
                    <p style="margin: 0; font-size: 12px; font-weight: 600; letter-spacing: 2.2px; text-transform: uppercase; color: #F0BF58;">Crafting Digital Excellence</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Greeting & Main Message -->
          <tr>
            <td class="content-cell" style="padding: 38px 40px 24px 40px; color: #211A17;">
              <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #211A17;">
                Hello ${safeName},
              </h2>

              <p style="margin: 0 0 18px 0; font-size: 16px; line-height: 1.7; color: #4A3E36;">
                Thank you for reaching out to us! We have successfully received your inquiry regarding <strong>&ldquo;${safeSubject}&rdquo;</strong>.
              </p>

              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.7; color: #4A3E36;">
                Our team is currently reviewing your message and will get back to you within <strong>24 business hours</strong> with the next steps or to schedule a discovery conversation.
              </p>

              <!-- Submission Summary Box -->
              <div style="background-color: #FBF9F5; border: 1px solid #E9E0D5; border-radius: 12px; padding: 22px 24px; margin-bottom: 28px;">
                <div style="font-size: 12px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; color: #B57512; margin-bottom: 14px;">Summary of Your Inquiry</div>
                
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #76675B; width: 100px; vertical-align: top;">Subject:</td>
                    <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #211A17; vertical-align: top;">${safeSubject}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #76675B; width: 100px; vertical-align: top;">Received:</td>
                    <td style="padding: 6px 0; font-size: 14px; color: #76675B; vertical-align: top;">${formattedTime} (IST)</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #76675B; width: 100px; vertical-align: top;">Your Note:</td>
                    <td style="padding: 6px 0; font-size: 14px; line-height: 1.6; color: #4A3E36; vertical-align: top; font-style: italic;">
                      &ldquo;${safeMessage}&rdquo;
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Quick Highlights / What We Do -->
              <div style="margin-bottom: 28px; border-top: 1px solid #E9E0D5; padding-top: 24px;">
                <p style="margin: 0 0 14px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #211A17;">
                  What We Specialize In:
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding: 4px 0; font-size: 14px; color: #4A3E36; line-height: 1.6;">
                      &bull; <strong style="color: #211A17;">AI &amp; Agentic Workflows:</strong> Generative AI, intelligent automation &amp; governance.
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; font-size: 14px; color: #4A3E36; line-height: 1.6;">
                      &bull; <strong style="color: #211A17;">IT &amp; Product Engineering:</strong> High-performance modern web apps, mobile &amp; UI/UX.
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; font-size: 14px; color: #4A3E36; line-height: 1.6;">
                      &bull; <strong style="color: #211A17;">Digital Marketing:</strong> SEO, performance ads, social media &amp; brand strategy.
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Direct Contact Box -->
              <div style="background: linear-gradient(180deg, #FDFBF8 0%, #F5F0E9 100%); border: 1px dashed #D49520; border-radius: 12px; padding: 20px 22px; text-align: center; margin-bottom: 24px;">
                <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 700; color: #211A17;">
                  Need an immediate answer or want to discuss urgently?
                </p>
                <p style="margin: 0; font-size: 14px; color: #4A3E36;">
                  Reach out directly at <a href="mailto:info@digitalcustard.in" style="color: #B57512; font-weight: 700;">info@digitalcustard.in</a>
                  or call us at <a href="tel:+917020763979" style="color: #B57512; font-weight: 700;">+91 7020763979</a>.
                </p>
              </div>

              <!-- Closing -->
              <p style="margin: 0 0 6px 0; font-size: 15px; color: #211A17;">
                Warm regards,
              </p>
              <p style="margin: 0; font-size: 15px; font-weight: 700; color: #211A17;">
                The Digital Custard Team
              </p>
              <p style="margin: 2px 0 0 0; font-size: 13px; color: #76675B;">
                106, 1st Floor, Samrat Nucleus, Bhabha Nagar, Nashik, India
              </p>
            </td>
          </tr>

          <!-- Subtle Footer -->
          <tr>
            <td style="background-color: #211A17; padding: 24px 36px; text-align: center; font-size: 12px; color: #8E8075; line-height: 1.6;">
              <div style="margin-bottom: 8px;">
                <a href="https://digitalcustard.in" style="color: #F0BF58; margin: 0 8px; text-decoration: none;">Website</a> &bull;
                <a href="https://www.linkedin.com/company/digital-custard" style="color: #F0BF58; margin: 0 8px; text-decoration: none;">LinkedIn</a> &bull;
                <a href="https://www.instagram.com/digitalcustard" style="color: #F0BF58; margin: 0 8px; text-decoration: none;">Instagram</a>
              </div>
              <div>&copy; ${new Date().getFullYear()} Digital Custard. All rights reserved.</div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `HELLO ${name.toUpperCase()},

Thank you for contacting Digital Custard! We have received your inquiry regarding "${subject || "your project"}".

Our team is reviewing your requirements and will get back to you within 24 business hours.

YOUR INQUIRY DETAILS:
- Subject: ${subject || "General Inquiry"}
- Received At: ${formattedTime} (IST)
- Message: ${message}

NEED URGENT ASSISTANCE?
- Email: info@digitalcustard.in
- Phone / WhatsApp: +91 7020763979
- Office: 106, 1st Floor, Samrat Nucleus, Bhabha Nagar, Nashik, India

Warm regards,
The Digital Custard Team
https://digitalcustard.in`;

  return { html, text };
}

/**
 * Sends both the admin lead notification and customer thank you confirmation email
 * using the configured email provider (Gmail testing or MilesWeb production).
 */
export async function sendContactEmails({ name, email, phone, subject, message, clientIp = "" }) {
  const provider = getEmailProvider();
  const configured = isSmtpConfigured();

  // If credentials are not yet populated, simulate successfully and log diagnostics.
  if (!configured) {
    const missingVar = provider === "gmail" ? "GMAIL_APP_PASSWORD" : "SMTP_PASSWORD";
    console.log(`[SMTP Notification Service (${provider})] Notice: Credentials not fully configured (${missingVar} missing).`);
    console.log(`[SMTP Notification Service (${provider})] Simulated emails for lead: "${name}" <${email}>`);
    return {
      success: true,
      simulated: true,
      provider,
      message: `SMTP credentials for ${provider} not provided yet. Notification simulated in development mode.`,
      adminSent: false,
      customerSent: false,
    };
  }

  const transporter = getTransporter(provider);

  // Determine sender and admin recipient based on active provider
  let adminRecipient;
  let fromAddress;

  if (provider === "gmail") {
    // When using Gmail, SMTP envelope requires authenticated user
    fromAddress = process.env.GMAIL_USER;
    adminRecipient = process.env.GMAIL_ADMIN_EMAIL || process.env.ADMIN_EMAIL || process.env.GMAIL_USER;
  } else {
    // MilesWeb business SMTP
    fromAddress = process.env.FROM_EMAIL || process.env.SMTP_USER || "info@digitalcustard.in";
    adminRecipient = process.env.ADMIN_EMAIL || process.env.SMTP_USER || "info@digitalcustard.in";
  }

  const fromHeader = `"Digital Custard" <${fromAddress}>`;

  const adminEmailData = renderAdminNotificationEmail({
    name,
    email,
    phone,
    subject,
    message,
    clientIp,
  });

  const customerEmailData = renderCustomerConfirmationEmail({
    name,
    email,
    phone,
    subject,
    message,
  });

  const logoAttachments = getLogoAttachments();

  // 1. Admin Notification Email Options
  const adminMailOptions = {
    from: fromHeader,
    to: adminRecipient,
    replyTo: email, // Directly reply to the customer when hitting reply in email client
    subject: `🔔 New Lead: ${subject || "Website Contact"} - ${name}`,
    text: adminEmailData.text,
    html: adminEmailData.html,
    attachments: logoAttachments,
  };

  // 2. Customer Confirmation Email Options
  const customerMailOptions = {
    from: fromHeader,
    to: email,
    replyTo: adminRecipient,
    subject: `Thank you for contacting Digital Custard! We've received your message`,
    text: customerEmailData.text,
    html: customerEmailData.html,
    attachments: logoAttachments,
  };

  try {
    // Send both emails concurrently using Promise.allSettled
    const [adminResult, customerResult] = await Promise.allSettled([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(customerMailOptions),
    ]);

    const adminOk = adminResult.status === "fulfilled";
    const customerOk = customerResult.status === "fulfilled";

    if (!adminOk) {
      console.error(`[SMTP Error (${provider})] Failed to send Admin Notification Email:`, adminResult.reason);
    } else {
      console.log(`[SMTP Success (${provider})] Admin Notification Email sent successfully. MessageId:`, adminResult.value?.messageId);
    }

    if (!customerOk) {
      console.error(`[SMTP Error (${provider})] Failed to send Customer Confirmation Email:`, customerResult.reason);
    } else {
      console.log(`[SMTP Success (${provider})] Customer Confirmation Email sent successfully. MessageId:`, customerResult.value?.messageId);
    }

    return {
      success: adminOk || customerOk,
      simulated: false,
      provider,
      adminSent: adminOk,
      customerSent: customerOk,
      adminError: adminOk ? null : adminResult.reason?.message,
      customerError: customerOk ? null : customerResult.reason?.message,
    };
  } catch (transporterErr) {
    console.error(`[SMTP Fatal Error (${provider})] Nodemailer transport failure:`, transporterErr);
    return {
      success: false,
      simulated: false,
      provider,
      adminSent: false,
      customerSent: false,
      error: transporterErr.message,
    };
  }
}
