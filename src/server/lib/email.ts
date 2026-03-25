import { Resend } from 'resend'

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  // Log to console when Resend is not fully configured
  if (!process.env.RESEND_API_KEY) {
    console.log('[email] Would send to:', options.to)
    console.log('[email] Subject:', options.subject)
    // body intentionally omitted to avoid logging OTP codes
    return
  }

  // Fix 13: fail fast if EMAIL_FROM is not set so misconfiguration is caught early
  const from = process.env.EMAIL_FROM
  if (!from) throw new Error('EMAIL_FROM environment variable is not set')

  const resend = new Resend(process.env.RESEND_API_KEY)

  const { data, error } = await resend.emails.send({
    from,
    to: [options.to],
    subject: options.subject,
    html: options.html,
  })

  if (error) {
    console.error('Error sending email:', error)
    throw new Error(`Failed to send email: ${error.message}`)
  }

  console.log('Email sent to:', options.to, data?.id)
}
