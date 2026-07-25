import nodemailer from 'nodemailer'

// Reuse a single transporter across requests/hot-reloads, same pattern as
// the cached Firebase Admin app in src/lib/db/firestore.ts.
declare global {
  // eslint-disable-next-line no-var
  var __mailTransporter: ReturnType<typeof nodemailer.createTransport> | undefined
}

function isMailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
}

function getTransporter() {
  if (global.__mailTransporter) return global.__mailTransporter

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true', // true for port 465, false for 587/25
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  global.__mailTransporter = transporter
  return transporter
}

export async function sendPasswordResetEmail(to: string, name: string, resetUrl: string) {
  // If SMTP isn't configured yet (e.g. during local development before the
  // site owner has added real credentials to .env), log the link instead of
  // silently failing so the flow can still be tested end-to-end.
  if (!isMailConfigured()) {
    console.warn(
      '[mailer] SMTP is not configured — set SMTP_HOST / SMTP_USER / SMTP_PASS in .env to send real emails.\n' +
        `[mailer] Password reset link for ${to}: ${resetUrl}`
    )
    return
  }

  const transporter = getTransporter()
  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER

  await transporter.sendMail({
    from: `"Markaz-e-Durood" <${fromAddress}>`,
    to,
    subject: 'Reset your Markaz-e-Durood password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #1f2937;">
        <h2 style="color: #166534;">Markaz-e-Durood</h2>
        <p>Assalamu Alaikum ${name || ''},</p>
        <p>We received a request to reset your password. Click the button below to choose a new one. This link expires in 1 hour.</p>
        <p style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" style="background:#D4AF37;color:#000;padding:12px 28px;border-radius:999px;text-decoration:none;font-weight:bold;">
            Reset Password
          </a>
        </p>
        <p style="font-size: 13px; color: #6b7280;">If you didn't request this, you can safely ignore this email — your password won't be changed.</p>
        <p style="font-size: 13px; color: #6b7280;">If the button doesn't work, copy and paste this link into your browser:<br/>${resetUrl}</p>
      </div>
    `,
  })
}
