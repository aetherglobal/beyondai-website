export const EVENT_TIME_ZONE = 'Africa/Accra'

const withZone = (options: Intl.DateTimeFormatOptions): Intl.DateTimeFormatOptions => ({
  ...options,
  timeZone: EVENT_TIME_ZONE,
})

const toDate = (value: string | Date): Date => (value instanceof Date ? value : new Date(value))

export const eventMonth = (value: string | Date): string =>
  toDate(value).toLocaleDateString('en-US', withZone({ month: 'short' })).toUpperCase()

export const eventDay = (value: string | Date): number =>
  Number(toDate(value).toLocaleDateString('en-US', withZone({ day: 'numeric' })))

export const eventTime = (value: string | Date): string =>
  toDate(value).toLocaleTimeString('en-US', withZone({ hour: 'numeric', minute: '2-digit' }))

export const eventDate = (
  value: string | Date,
  { weekday = true }: { weekday?: boolean } = {},
): string =>
  toDate(value).toLocaleDateString(
    'en-US',
    withZone({
      ...(weekday ? { weekday: 'long' as const } : {}),
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
  )

export const eventDateShort = (value: string | Date): string =>
  toDate(value).toLocaleDateString(
    'en-US',
    withZone({ month: 'short', day: 'numeric', year: 'numeric' }),
  )

export const eventDateParts = (value: string | Date) => ({
  month: eventMonth(value),
  day: eventDay(value),
  time: eventTime(value),
})

export const eventDateRange = (start: string | Date, end?: string | Date | null): string => {
  const year = toDate(start).toLocaleDateString('en-US', withZone({ year: 'numeric' }))
  const startPart = toDate(start).toLocaleDateString(
    'en-US',
    withZone({ month: 'long', day: 'numeric' }),
  )

  if (!end) return `${startPart}, ${year}`

  const endYear = toDate(end).toLocaleDateString('en-US', withZone({ year: 'numeric' }))
  const endPart = toDate(end).toLocaleDateString(
    'en-US',
    withZone(endYear === year ? { day: 'numeric' } : { month: 'long', day: 'numeric' }),
  )

  return endYear === year
    ? `${startPart} - ${endPart}, ${year}`
    : `${startPart}, ${year} - ${endPart}, ${endYear}`
}
