import { Resend } from "resend";
import { siteConfig } from "@/lib/site-config";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_ADDRESS = "BidShipDrive Notifications <notifications@bidshipdrive.com>";

export async function sendNotificationEmail(
  subject: string,
  lines: Record<string, string | null | undefined>,
  attachments?: { filename: string; content: Buffer }[]
) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping notification email:", subject);
    return;
  }

  const html = Object.entries(lines)
    .filter(([, value]) => value)
    .map(([label, value]) => `<p><strong>${label}:</strong> ${value}</p>`)
    .join("");

  try {
    // The Resend SDK returns { data, error } on API-level failures rather than
    // throwing — only network-level failures throw. Both cases need checking.
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: siteConfig.contactEmail,
      subject,
      html: html || "<p>(no details)</p>",
      attachments: attachments?.map((a) => ({ filename: a.filename, content: a.content })),
    });
    if (error) {
      console.error("Resend rejected notification email:", error);
    }
  } catch (error) {
    // Never let a notification failure break the actual form submission.
    console.error("Failed to send notification email:", error);
  }
}

export function looksLikeEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

// Customer-facing "we got it" auto-reply, only sent when the contact field they
// gave us is actually an email address (that field also accepts a phone number).
export async function sendCustomerConfirmationEmail(
  to: string,
  name: string,
  summary: Record<string, string | null | undefined>
) {
  if (!looksLikeEmail(to)) return false;

  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping confirmation email to", to);
    return false;
  }

  const summaryRows = Object.entries(summary)
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:2px 12px 2px 0;color:#64748b;white-space:nowrap;">${label}</td><td style="padding:2px 0;color:#0f172a;">${value}</td></tr>`
    )
    .join("");

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;color:#0f172a;">
      <p style="font-size:18px;font-weight:bold;color:#2563eb;margin:0 0 16px;">${siteConfig.businessName}</p>
      <p>Hi ${name},</p>
      <p>Thanks for reaching out to ${siteConfig.businessName}! We've received your message and our team will get back to you shortly — usually within 24 hours.</p>
      ${
        summaryRows
          ? `<table style="background:#f8fafc;border-radius:8px;padding:12px 16px;margin:16px 0;border-collapse:collapse;width:100%;"><tbody>${summaryRows}</tbody></table>`
          : ""
      }
      <p>If it's urgent, you can also reach us directly on WhatsApp: <a href="https://wa.me/${siteConfig.whatsappNumber}" style="color:#2563eb;">${siteConfig.whatsappDisplay}</a>.</p>
      <p style="margin-top:24px;">Talk soon,<br/>The ${siteConfig.businessName} Team</p>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject: `We've received your message — ${siteConfig.businessName}`,
      html,
    });
    if (error) {
      console.error("Resend rejected confirmation email:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
    return false;
  }
}
