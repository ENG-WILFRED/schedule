import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function sendSms(to: string, content: string) {
  const cfg = await prisma.notificationConfig.findFirst()
  if (!cfg || !cfg.smsUrl || !cfg.smsApiKey) {
    // No SMS provider configured — do nothing
    return
  }

  // Normalize mobile number
  let mobile = String(to).trim()
  if (mobile.startsWith('+')) mobile = mobile.slice(1)
  if (/^0\d{9}$/.test(mobile)) {
    mobile = '254' + mobile.slice(1)
  }

  const text = content.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim()
  const finalMessage = text.length >= 3 ? text : (text + ' - message')

  const form = new URLSearchParams()
  form.append('apikey', String(cfg.smsApiKey || ''))
  form.append('partnerID', String(cfg.smsPartnerId || ''))
  form.append('shortcode', String(cfg.smsShortcode || ''))
  form.append('pass_type', String(cfg.smsPassType || 'plain'))
  form.append('mobile', mobile)
  form.append('message', finalMessage)

  const res = await fetch(cfg.smsUrl!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString()
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`SMS provider error: ${res.status} ${body}`)
  }
}
