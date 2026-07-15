export function formatTripDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(
    new Date(date),
  )
}

export function formatTripDateFull(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateRange(start: Date | string, end: Date | string): string {
  return `${formatTripDateFull(start)} – ${formatTripDateFull(end)}`
}
