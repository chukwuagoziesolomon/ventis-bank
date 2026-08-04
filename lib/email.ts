import fs from "fs";
import path from "path";

const OUTBOX_PATH = path.resolve(process.cwd(), "data", "outbox.json");

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  sentAt: string;
}

function ensureOutbox() {
  if (!fs.existsSync(OUTBOX_PATH)) {
    fs.writeFileSync(OUTBOX_PATH, JSON.stringify([]));
  }
}

export function sendEmail(message: Omit<EmailMessage, "sentAt">) {
  ensureOutbox();
  const emails: EmailMessage[] = JSON.parse(fs.readFileSync(OUTBOX_PATH, "utf-8") || "[]");
  emails.unshift({
    ...message,
    sentAt: new Date().toISOString(),
  });
  fs.writeFileSync(OUTBOX_PATH, JSON.stringify(emails, null, 2));
  return message;
}

function getAppUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    "http://localhost:3000"
  );
}

export function sendVerificationEmail(to: string, name: string, token: string) {
  const url = `${getAppUrl()}/auth/verify?token=${encodeURIComponent(token)}`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #18181b; background: #f8fafc; padding: 24px;">
      <div style="max-width: 600px; margin: 0 auto; background: #0f172a; border-radius: 24px; overflow: hidden; box-shadow: 0 24px 80px rgba(15, 23, 42, 0.18);">
        <div style="padding: 32px; background: linear-gradient(135deg, #fbbf24 0%, #fb7185 100%); color: #111827;">
          <h1 style="margin: 0; font-size: 28px; letter-spacing: -0.03em;">Verify your Vantis email</h1>
        </div>
        <div style="padding: 32px; background: #0f172a; color: #e2e8f0;">
          <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7;">Hi ${name},</p>
          <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7;">Thanks for signing up for Vantis. Click the button below to confirm your email address and unlock your account experience.</p>
          <a href="${url}" style="display: inline-block; padding: 14px 24px; border-radius: 14px; background: #fbbf24; color: #111827; font-weight: 700; text-decoration: none;">Verify email</a>
          <p style="margin: 24px 0 0; font-size: 14px; line-height: 1.7; color: #94a3b8;">If you didn’t request this email, you can safely ignore it.</p>
        </div>
      </div>
    </div>
  `;
  return sendEmail({
    to,
    subject: "Confirm your Vantis email address",
    html,
  });
}

export function sendLockedAccountEmail(to: string, name: string) {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #18181b; background: #f8fafc; padding: 24px;">
      <div style="max-width: 600px; margin: 0 auto; background: #111827; border-radius: 24px; overflow: hidden; box-shadow: 0 24px 80px rgba(15, 23, 42, 0.18);">
        <div style="padding: 32px; background: linear-gradient(135deg, #fb7185 0%, #f97316 100%); color: #111827;">
          <h1 style="margin: 0; font-size: 28px; letter-spacing: -0.03em;">Your Vantis account has been locked</h1>
        </div>
        <div style="padding: 32px; background: #0f172a; color: #e2e8f0;">
          <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7;">Hi ${name},</p>
          <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7;">We’ve temporarily locked your account for security reasons. This helps protect your funds while we review your activity.</p>
          <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7;">If you believe this was a mistake, please contact our support team at <strong>support@vantis.bank</strong> and we’ll help restore your access quickly.</p>
          <div style="padding: 18px 22px; border-radius: 16px; background: #111827; border: 1px solid #334155; color: #cbd5e1; font-size: 14px; line-height: 1.7;">Why this happened: your account has been marked locked by the Vantis team. No action is required to keep your funds safe.</div>
        </div>
      </div>
    </div>
  `;
  return sendEmail({
    to,
    subject: "Your Vantis account has been locked",
    html,
  });
}

export function sendSupportReplyEmail(to: string, name: string, message: string) {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #18181b; background: #f8fafc; padding: 24px;">
      <div style="max-width: 600px; margin: 0 auto; background: #0f172a; border-radius: 24px; overflow: hidden; box-shadow: 0 24px 80px rgba(15, 23, 42, 0.18);">
        <div style="padding: 32px; background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%); color: #111827;">
          <h1 style="margin: 0; font-size: 28px; letter-spacing: -0.03em;">New reply from Vantis support</h1>
        </div>
        <div style="padding: 32px; background: #0f172a; color: #e2e8f0;">
          <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7;">Hi ${name},</p>
          <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7;">You have a new reply from our support team:</p>
          <blockquote style="margin: 0 0 24px; padding: 18px 22px; border-radius: 16px; background: #111827; border: 1px solid #334155; color: #cbd5e1; font-size: 15px; line-height: 1.7;">${message}</blockquote>
          <p style="margin: 0; font-size: 14px; line-height: 1.7; color: #94a3b8;">If you need more help, reply in the Vantis support chat or email support@vantis.bank.</p>
        </div>
      </div>
    </div>
  `;
  return sendEmail({
    to,
    subject: "Vantis support replied to your message",
    html,
  });
}

export function getOutbox() {
  ensureOutbox();
  return JSON.parse(fs.readFileSync(OUTBOX_PATH, "utf-8"));
}
