import type { Payload } from 'payload'

export async function notifySubmission(
  payload: Payload,
  { subject, lines }: { subject: string; lines: (string | null)[] },
): Promise<void> {
  const to = process.env.SUBMISSION_NOTIFICATION_EMAIL || 'info@beyondai.africa'

  if (!process.env.SMTP_HOST) {
    payload.logger.warn(
      { subject },
      'SMTP_HOST is not set — submission saved but no notification was sent.',
    )
    return
  }

  try {
    await payload.sendEmail({
      to,
      subject,
      text: lines.filter((line) => line !== null).join('\n'),
    })
  } catch (error) {
    payload.logger.error({ err: error, subject }, 'Failed to send submission notification')
  }
}
