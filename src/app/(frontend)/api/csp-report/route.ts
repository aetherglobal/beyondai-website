import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const reports = Array.isArray(body) ? body : [body]

    for (const report of reports) {
      const violation = report?.body ?? report?.['csp-report'] ?? report
      console.warn('[csp]', {
        directive: violation?.effectiveDirective ?? violation?.['violated-directive'],
        blocked: violation?.blockedURL ?? violation?.['blocked-uri'],
        document: violation?.documentURL ?? violation?.['document-uri'],
      })
    }
  } catch {
  }

  return new NextResponse(null, { status: 204 })
}
