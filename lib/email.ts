import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587", 10),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const OUTBOX_PATH = path.resolve(process.cwd(), "data", "outbox.json");

function ensureOutbox() {
  if (!fs.existsSync(OUTBOX_PATH)) {
    fs.mkdirSync(path.dirname(OUTBOX_PATH), { recursive: true });
    fs.writeFileSync(OUTBOX_PATH, JSON.stringify([]));
  }
}

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  sentAt: string;
}

export async function sendEmail(message: Omit<EmailMessage, "sentAt">) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: message.to,
      subject: message.subject,
      html: message.html,
    });
    console.log("Email sent:", info.messageId);
    return { ...message, sentAt: new Date().toISOString() };
  } catch (error) {
    const errMsg = error && typeof error === "object" && "message" in error ? (error as any).message : String(error);
    console.error("Failed to send email via SMTP, falling back to outbox:", errMsg);
    try {
      ensureOutbox();
      const emails: EmailMessage[] = JSON.parse(fs.readFileSync(OUTBOX_PATH, "utf-8") || "[]");
      const record: EmailMessage = { ...message, sentAt: new Date().toISOString() };
      emails.unshift(record);
      fs.writeFileSync(OUTBOX_PATH, JSON.stringify(emails, null, 2));
      console.log(`Wrote email to outbox: ${OUTBOX_PATH}`);
      return record;
    } catch (fsErr) {
      const fsErrMsg = fsErr && typeof fsErr === "object" && "message" in fsErr ? (fsErr as any).message : String(fsErr);
      console.error("Failed to write email to outbox:", fsErrMsg);
      throw error;
    }
  }
}

export function sendVerificationEmail(to: string, name: string, code: string) {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #18181b; background: #f8fafc; padding: 24px;">
      <div style="max-width: 600px; margin: 0 auto; background: #0f172a; border-radius: 24px; overflow: hidden; box-shadow: 0 24px 80px rgba(15, 23, 42, 0.18);">
        <div style="padding: 32px; background: linear-gradient(135deg, #fbbf24 0%, #fb7185 100%); color: #111827;">
          <h1 style="margin: 0; font-size: 28px; letter-spacing: -0.03em;">Verify your MidwesternBank email</h1>
        </div>
        <div style="padding: 32px; background: #0f172a; color: #e2e8f0;">
          <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7;">Hi ${name},</p>
          <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7;">Thanks for signing up for MidwesternBank. Use the verification code below to confirm your email address and unlock your account experience.</p>
          <div style="display: inline-block; padding: 16px 32px; border-radius: 14px; background: #111827; border: 1px solid #334155; color: #fbbf24; font-size: 32px; font-weight: 700; letter-spacing: 8px; text-align: center;">${code}</div>
          <p style="margin: 24px 0 0; font-size: 14px; line-height: 1.7; color: #94a3b8;">This code expires in 15 minutes. If you didn't request this email, you can safely ignore it.</p>
        </div>
      </div>
    </div>
  `;
  return sendEmail({
    to,
    subject: "Confirm your MidwesternBank email address",
    html,
  });
}

export function sendLoginCodeEmail(to: string, name: string, code: string) {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #18181b; background: #f8fafc; padding: 24px;">
      <div style="max-width: 600px; margin: 0 auto; background: #0f172a; border-radius: 24px; overflow: hidden; box-shadow: 0 24px 80px rgba(15, 23, 42, 0.18);">
        <div style="padding: 32px; background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%); color: #111827;">
          <h1 style="margin: 0; font-size: 28px; letter-spacing: -0.03em;">Your MidwesternBank sign‑in code</h1>
        </div>
        <div style="padding: 32px; background: #0f172a; color: #e2e8f0;">
          <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7;">Hi ${name},</p>
          <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7;">Use the code below to sign in to your MidwesternBank account. This code is valid for 10 minutes.</p>
          <div style="display: inline-block; padding: 16px 32px; border-radius: 14px; background: #111827; border: 1px solid #334155; color: #7dd3fc; font-size: 32px; font-weight: 700; letter-spacing: 8px; text-align: center;">${code}</div>
          <p style="margin: 24px 0 0; font-size: 14px; line-height: 1.7; color: #94a3b8;">If you didn't request this code, ignore this message.</p>
        </div>
      </div>
    </div>
  `;
  return sendEmail({
    to,
    subject: "Sign in to MidwesternBank — your code",
    html,
  });
}

export function sendLockedAccountEmail(to: string, name: string) {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #18181b; background: #f8fafc; padding: 24px;">
      <div style="max-width: 600px; margin: 0 auto; background: #111827; border-radius: 24px; overflow: hidden; box-shadow: 0 24px 80px rgba(15, 23, 42, 0.18);">
        <div style="padding: 32px; background: linear-gradient(135deg, #fb7185 0%, #f97316 100%); color: #111827;">
          <h1 style="margin: 0; font-size: 28px; letter-spacing: -0.03em;">Your MidwesternBank account has been locked</h1>
        </div>
        <div style="padding: 32px; background: #0f172a; color: #e2e8f0;">
          <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7;">Hi ${name},</p>
          <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7;">We've temporarily locked your account for security reasons. This helps protect your funds while we review your activity.</p>
          <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7;">If you believe this was a mistake, please contact our support team at <strong>support@midwesternbank.com</strong> and we'll help restore your access quickly.</p>
          <div style="padding: 18px 22px; border-radius: 16px; background: #111827; border: 1px solid #334155; color: #cbd5e1; font-size: 14px; line-height: 1.7;">Why this happened: your account has been marked locked by the MidwesternBank team. No action is required to keep your funds safe.</div>
        </div>
      </div>
    </div>
  `;
  return sendEmail({
    to,
    subject: "Your MidwesternBank account has been locked",
    html,
  });
}

export function sendSupportReplyEmail(to: string, name: string, message: string) {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #18181b; background: #f8fafc; padding: 24px;">
      <div style="max-width: 600px; margin: 0 auto; background: #111827; border-radius: 24px; overflow: hidden; box-shadow: 0 24px 80px rgba(15, 23, 42, 0.18);">
        <div style="padding: 32px; background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%); color: #111827;">
          <h1 style="margin: 0; font-size: 28px; letter-spacing: -0.03em;">New reply from MidwesternBank support</h1>
        </div>
        <div style="padding: 32px; background: #0f172a; color: #e2e8f0;">
          <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7;">Hi ${name},</p>
          <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7;">You have a new reply from our support team:</p>
          <blockquote style="margin: 0 0 24px; padding: 18px 22px; border-radius: 16px; background: #111827; border: 1px solid #334155; color: #cbd5e1; font-size: 15px; line-height: 1.7;">${message}</blockquote>
          <p style="margin: 0; font-size: 14px; line-height: 1.7; color: #94a3b8;">If you need more help, reply in the MidwesternBank support chat or email support@midwesternbank.com.</p>
        </div>
      </div>
    </div>
  `;
  return sendEmail({
    to,
    subject: "MidwesternBank support replied to your message",
    html,
  });
}
