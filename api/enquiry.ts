import { setDefaultResultOrder } from 'node:dns'

setDefaultResultOrder('ipv4first')

const TO = 'bookings@lunrlondon.co.uk'
const CONTACT_FROM = 'Contact <website@lunrlondon.co.uk>'
const BOOKING_FROM = 'Booking <website@lunrlondon.co.uk>'

export type EnquiryResult = { ok: true; status: 200 } | { ok: false; status: number; error: string }

type HandlerRequest = {
  method?: string
  body?: unknown
}

type HandlerResponse = {
  status: (code: number) => HandlerResponse
  json: (body: unknown) => void
}

function field(value: unknown, max: number) {
  if (typeof value !== 'string') return ''
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max)
}

function emailAddress(value: unknown) {
  const email = field(value, 200)
  if (!email || /[\r\n]/.test(email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return ''
  return email
}

function line(label: string, value: string) {
  return value ? `${label}: ${value}` : ''
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function brandedEmail(options: {
  kicker: string
  title: string
  rows: { label: string; value: string }[]
  note?: string
  quote?: string
  replyTo: string
}) {
  const rows = options.rows
    .filter((row) => row.value)
    .map(
      (row) => `
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid #2a2a2a;">
            <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#E1BE66;">${escapeHtml(row.label)}</div>
            <div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.45;color:#f3f1ee;padding-top:4px;">${escapeHtml(row.value)}</div>
          </td>
        </tr>`,
    )
    .join('')

  const quote = options.quote
    ? `<tr><td style="padding:22px 0 6px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#161616;border:1px solid #3a3018;">
          <tr><td style="padding:18px 20px;">
            <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#E1BE66;">Quoted fare</div>
            <div style="font-family:Georgia,'Times New Roman',serif;font-size:32px;line-height:1.1;color:#FCE488;padding-top:6px;">${escapeHtml(options.quote)}</div>
          </td></tr>
        </table>
      </td></tr>`
    : ''

  const note = options.note
    ? `<tr><td style="padding:22px 0 6px;">
        <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#E1BE66;">Message</div>
        <div style="font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:1.55;color:#f3f1ee;padding-top:8px;">${escapeHtml(options.note).replace(/\n/g, '<br>')}</div>
      </td></tr>`
    : ''

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#000000;">
    <div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(options.kicker)} from ${escapeHtml(options.title)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#000000;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#0F0F0F;border:1px solid #2a2a2a;">
            <tr><td style="height:3px;background:#FCE488;font-size:0;line-height:0;">&nbsp;</td></tr>
            <tr>
              <td align="center" style="padding:36px 32px 8px;">
                <img src="https://lunrlondon.co.uk/images/logo.png" width="168" alt="LUNR" style="display:block;width:168px;max-width:168px;height:auto;border:0;">
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:18px 32px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#E1BE66;">
                ${escapeHtml(options.kicker)}
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:10px 32px 0;font-family:Georgia,'Times New Roman',serif;font-size:36px;line-height:1.1;color:#f3f1ee;">
                ${escapeHtml(options.title)}
              </td>
            </tr>
            <tr>
              <td style="padding:8px 32px 28px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${quote}
                  ${note}
                  ${rows}
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:0 32px 36px;">
                <a href="mailto:${escapeHtml(options.replyTo)}" style="display:inline-block;background:#FCE488;color:#0F0F0F;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;text-decoration:none;padding:14px 28px;">Reply</a>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:0 32px 28px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#8a8a8a;">
                Luxury Chauffeur Services · Available 24/7<br>
                <a href="https://lunrlondon.co.uk" style="color:#E1BE66;text-decoration:none;">lunrlondon.co.uk</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

type BuiltEnquiry = { error: string } | { from: string; subject: string; replyTo: string; text: string; html: string }

function enquiryMessage(input: Record<string, string>): BuiltEnquiry {
  if (input.kind === 'contact') {
    const name = field(input.name, 120)
    const email = emailAddress(input.email)
    const message = field(input.message, 4000)
    const phone = field(input.phone, 40)
    if (!name || !email || !message) return { error: 'Name, email, and message are required.' }
    const rows = [
      { label: 'Email', value: email },
      { label: 'Phone', value: phone },
    ]
    return {
      from: CONTACT_FROM,
      subject: `LUNR enquiry from ${name.replace(/[\r\n]/g, ' ')}`,
      replyTo: email,
      text: ['New contact enquiry', '', line('Name', name), line('Email', email), line('Phone', phone), '', 'Message:', message]
        .filter((item) => item !== '')
        .join('\n'),
      html: brandedEmail({ kicker: 'Contact enquiry', title: name, rows, note: message, replyTo: email }),
    }
  }

  if (input.kind === 'booking') {
    const name = field(input.name, 120)
    const email = emailAddress(input.email)
    const phone = field(input.phone, 40)
    const pickup = field(input.pickup, 300)
    const date = field(input.date, 40)
    const time = field(input.time, 40)
    const vehicle = field(input.vehicle, 80)
    const quote = field(input.quote, 40)
    const summary = field(input.summary, 400)
    if (!name || !email || !phone || !pickup || !date || !time || !vehicle) {
      return { error: 'The booking is missing a required detail.' }
    }
    const rows = [
      { label: 'Email', value: email },
      { label: 'Phone', value: phone },
      { label: 'Trip', value: field(input.trip, 40) },
      { label: 'Airport', value: field(input.airport, 80) },
      { label: 'Pickup', value: pickup },
      { label: 'Drop-off', value: field(input.dropoff, 300) },
      { label: 'Date', value: date },
      { label: 'Time', value: time },
      { label: 'Hours', value: field(input.hours, 10) },
      { label: 'Return', value: field(input.returning, 10) },
      { label: 'Vehicle', value: vehicle },
      { label: 'Quote note', value: summary },
    ]
    return {
      from: BOOKING_FROM,
      subject: `LUNR booking request from ${name.replace(/[\r\n]/g, ' ')}`,
      replyTo: email,
      text: [
        'New booking request',
        '',
        line('Name', name),
        ...rows.map((row) => line(row.label, row.value)),
        line('Quoted fare', quote),
      ]
        .filter((item) => item !== '')
        .join('\n'),
      html: brandedEmail({ kicker: 'Booking request', title: name, rows, quote, replyTo: email }),
    }
  }

  return { error: 'Unknown enquiry.' }
}

export async function deliverEnquiry(input: unknown): Promise<EnquiryResult> {
  if (!input || typeof input !== 'object') return { ok: false, status: 400, error: 'Invalid request.' }
  const record = input as Record<string, unknown>
  if (field(record.website, 200)) return { ok: true, status: 200 }

  const values: Record<string, string> = {}
  for (const [key, value] of Object.entries(record)) {
    if (typeof value === 'string') values[key] = value
  }

  const message = enquiryMessage(values)
  if ('error' in message) return { ok: false, status: 400, error: message.error }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('RESEND_API_KEY is not set')
    return { ok: false, status: 500, error: 'Email is not configured.' }
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: message.from,
      to: [TO],
      reply_to: message.replyTo,
      subject: message.subject,
      text: message.text,
      html: message.html,
    }),
  })

  if (!response.ok) {
    const detail = await response.text()
    console.error('Resend rejected the enquiry', response.status, detail.slice(0, 500))
    return { ok: false, status: 502, error: 'The enquiry could not be sent.' }
  }

  return { ok: true, status: 200 }
}

export default async function handler(req: HandlerRequest, res: HandlerResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const body = typeof req.body === 'string' ? (JSON.parse(req.body) as unknown) : req.body
    const result = await deliverEnquiry(body)
    res.status(result.status).json(result.ok ? { ok: true } : { error: result.error })
  } catch {
    res.status(400).json({ error: 'Invalid request.' })
  }
}
