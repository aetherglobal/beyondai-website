import { NextResponse } from 'next/server'

const MAX_BODY_BYTES = 32 * 1024

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 5
const hits = new Map<string, number[]>()

const tooManyRequests = (ip: string): boolean => {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)

  if (hits.size > 5000) hits.clear()

  return recent.length > MAX_PER_WINDOW
}

const clientIp = (request: Request): string =>
  request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
  request.headers.get('x-real-ip') ||
  'unknown'

export type GuardResult<T> = { ok: true; data: T } | { ok: false; response: NextResponse }

export async function guardSubmission<T extends { email?: unknown }>(
  request: Request,
): Promise<GuardResult<T>> {
  if (tooManyRequests(clientIp(request))) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Too many submissions. Please wait a moment and try again.' },
        { status: 429, headers: { 'Retry-After': '60' } },
      ),
    }
  }

  const declared = Number(request.headers.get('content-length') || 0)
  if (declared > MAX_BODY_BYTES) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Submission is too large.' }, { status: 413 }),
    }
  }

  let data: T
  try {
    const raw = await request.text()
    if (raw.length > MAX_BODY_BYTES) {
      return {
        ok: false,
        response: NextResponse.json({ error: 'Submission is too large.' }, { status: 413 }),
      }
    }
    data = JSON.parse(raw) as T
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Invalid request body.' }, { status: 400 }),
    }
  }

  const honeypot = (data as { website?: unknown }).website
  if (typeof honeypot === 'string' && honeypot.trim().length > 0) {
    return { ok: false, response: NextResponse.json({ success: true }) }
  }

  if (typeof data.email === 'string' && !EMAIL_SHAPE.test(data.email.trim())) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 }),
    }
  }

  return { ok: true, data }
}

export const trim = (value: unknown, max: number): string | undefined => {
  if (typeof value !== 'string') return undefined
  const cleaned = value.trim()
  return cleaned ? cleaned.slice(0, max) : undefined
}

export function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms),
    ),
  ])
}

