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

// The memory masonry grid's mono caption under each tile ("11 MAR") — day
// plus short month, no year, uppercased by the caller's CSS (the string
// itself stays sentence case so it composes with i18n date settings).
export function formatMemoryDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(new Date(date))
}

// The Home screen's mono date caption ("Tuesday, 12 May 2026") — day-before-
// month, always comma-separated from the weekday, per the design's exact
// copy. Built from two separate Intl calls (rather than one combined
// weekday+date format) because `en-GB` only auto-inserts that comma when a
// year is present — dropping the year for mobile's shorter form otherwise
// silently loses it too. `en-GB` (not `en-US`, like the formatters above) is
// what gives the day-before-month ordering.
export function formatWeekdayDate(
  date: Date | string,
  options: { withYear?: boolean } = {},
): string {
  const { withYear = true } = options
  const parsed = new Date(date)
  const weekday = new Intl.DateTimeFormat('en-GB', { weekday: 'long' }).format(parsed)
  const rest = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    ...(withYear ? { year: 'numeric' } : {}),
  }).format(parsed)
  return `${weekday}, ${rest}`
}
