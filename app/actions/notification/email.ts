import { PrismaClient } from '@prisma/client'
import nodemailer from 'nodemailer'

const prisma = new PrismaClient()

export async function sendEmail(to: string, subject: string, html: string) {
  const cfg = await prisma.notificationConfig.findFirst()
  if (!cfg || !cfg.smtpHost || !cfg.smtpUsername || !cfg.smtpPassword || !cfg.smtpFrom) {
    // No SMTP configured — do nothing
    return
  }

  const transporter = nodemailer.createTransport({
    host: cfg.smtpHost,
    port: cfg.smtpPort || 587,
    secure: (cfg.smtpPort || 587) === 465,
    auth: {
      user: cfg.smtpUsername,
      pass: cfg.smtpPassword
    }
  })

  // plaintext fallback
  const text = html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ')

  await transporter.sendMail({
    from: cfg.smtpFrom,
    to,
    subject,
    text,
    html
  })
}
