const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendTestEmail() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: "chukwuagoziesolomon@gmail.com",
    subject: "Vantis email test",
    text: "This is a test email from Vantis using the SMTP settings in .env.",
    html: "<p>This is a test email from Vantis using the SMTP settings in <code>.env</code>.</p>",
  });

  console.log("Test email sent:", info.messageId);
  console.log("Response:", info.response);
}

sendTestEmail().catch((error) => {
  console.error("Error sending test email:", error);
  process.exit(1);
});
