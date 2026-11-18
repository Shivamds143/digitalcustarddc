/**
 * SMTP Connection Testing & Verification Script
 * 
 * Usage:
 *   node scripts/test-email.js
 *   (or: npm run test:email)
 * 
 * To also send a sample test email:
 *   node scripts/test-email.js --send
 *   (or: npm run test:email -- --send)
 */

const path = require("path");
const { loadEnvConfig } = require("@next/env");

// Load .env.local and .env
loadEnvConfig(process.cwd());

async function runTest() {
  const {
    getEmailProvider,
    isSmtpConfigured,
    verifySmtpConnection,
    sendTestEmail,
  } = await import("../lib/email.js");

  const provider = getEmailProvider();
  const shouldSend = process.argv.includes("--send");

  console.log("\n==================================================");
  console.log("   DIGITAL CUSTARD - SMTP CONNECTION TEST");
  console.log("==================================================");
  console.log(`Active Provider (EMAIL_PROVIDER) : ${provider.toUpperCase()}`);

  if (provider === "gmail") {
    console.log(`Gmail User (GMAIL_USER)          : ${process.env.GMAIL_USER || "(not set)"}`);
    console.log(`Gmail Admin (GMAIL_ADMIN_EMAIL)  : ${process.env.GMAIL_ADMIN_EMAIL || process.env.GMAIL_USER || "(not set)"}`);
    console.log(`Gmail Password Set               : ${process.env.GMAIL_APP_PASSWORD ? "Yes (App Password loaded)" : "NO (empty)"}`);
    console.log("Server / Port                    : smtp.gmail.com:465 (SSL)");
  } else {
    console.log(`SMTP Host (SMTP_HOST)            : ${process.env.SMTP_HOST || "mail.digitalcustard.in"}`);
    console.log(`SMTP Port (SMTP_PORT)            : ${process.env.SMTP_PORT || "587"}`);
    console.log(`SMTP User (SMTP_USER)            : ${process.env.SMTP_USER || "info@digitalcustard.in"}`);
    console.log(`Admin Email (ADMIN_EMAIL)        : ${process.env.ADMIN_EMAIL || "info@digitalcustard.in"}`);
    console.log(`Password Set                     : ${process.env.SMTP_PASSWORD ? "Yes" : "NO (empty)"}`);
  }

  console.log("--------------------------------------------------");
  console.log("Checking credentials & establishing handshake...");

  const isConfigured = isSmtpConfigured();
  if (!isConfigured) {
    console.log(`\n❌ CONFIGURATION STATUS: Incomplete.`);
    if (provider === "gmail") {
      console.log("👉 Please make sure GMAIL_USER and GMAIL_APP_PASSWORD are set in .env.local.");
      console.log("   Note: For Gmail, use an App Password generated at: https://myaccount.google.com/apppasswords");
    } else {
      console.log("👉 Please make sure SMTP_HOST, SMTP_USER, and SMTP_PASSWORD are set in .env.local.");
    }
    console.log("==================================================\n");
    return;
  }

  const result = await verifySmtpConnection();

  if (result.ok) {
    console.log(`\n✅ CONNECTION STATUS: SUCCESS!`);
    console.log(`   Connected to ${provider.toUpperCase()} SMTP server and authenticated successfully.`);

    if (shouldSend) {
      console.log("\nSending live test verification email...");
      const sendResult = await sendTestEmail({});
      if (sendResult.success) {
        console.log(`✅ TEST EMAIL DELIVERED!`);
        console.log(`   Recipient: ${sendResult.recipient}`);
        console.log(`   Message ID: ${sendResult.messageId}`);
        console.log("   Check your inbox/spam folder to confirm receipt.");
      } else {
        console.log(`❌ FAILED TO DELIVER TEST EMAIL:`);
        console.log(`   ${sendResult.error || sendResult.message}`);
      }
    } else {
      console.log("\n💡 Note: Real emails were NOT sent (Connection verification only).");
      console.log("   To send a live test verification email to your admin address, run:");
      console.log("   npm run test:email -- --send\n");
    }
  } else {
    console.log(`\n❌ CONNECTION STATUS: FAILED.`);
    console.log(`   Error: ${result.error || result.message}`);
    if (result.code) console.log(`   Error Code: ${result.code}`);

    if (provider === "gmail" && (result.code === "EAUTH" || String(result.error).includes("535"))) {
      console.log("\n👉 GMAIL AUTHENTICATION TIP:");
      console.log("   Standard Gmail account passwords will be rejected by Google.");
      console.log("   You MUST use a 16-character Google App Password:");
      console.log("   1. Go to https://myaccount.google.com/security");
      console.log("   2. Ensure 2-Step Verification is turned ON");
      console.log("   3. Go to 'App passwords' (or search 'App passwords')");
      console.log("   4. Create an App password named 'Digital Custard' and paste the 16 letters into GMAIL_APP_PASSWORD in .env.local");
    }
  }

  console.log("==================================================\n");
}

runTest().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
