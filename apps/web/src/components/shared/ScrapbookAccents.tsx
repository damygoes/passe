import { cn } from '@passe/utils'

interface AccentProps {
  // Some callers (e.g. PolaroidSection) show the accent under any theme
  // because it's a content choice, not a theme effect; others only want it
  // under the scrapbook theme — this switches between "always visible" and
  // "hidden scrapbook:block" without duplicating the accent markup.
  scrapbookOnly?: boolean
}

// A short strip of "washi tape" pinning the top of a framed photo.
export function TapeAccent({ scrapbookOnly = false }: AccentProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'absolute -top-3 left-1/2 h-7 w-24 -translate-x-1/2 -rotate-1 bg-sandy-beige/60',
        scrapbookOnly && 'hidden scrapbook:block',
      )}
    />
  )
}

// Two diagonal paper corners (top-left + bottom-right) holding the photo in
// place, the classic scrapbook-mount alternative to a tape strip.
export function PhotoCornerAccent({ scrapbookOnly = false }: AccentProps) {
  const base = 'absolute h-6 w-6 bg-sandy-beige-dark/80 shadow-sm'
  return (
    <>
      <div
        aria-hidden="true"
        className={cn(
          base,
          'left-0 top-0 [clip-path:polygon(0_0,100%_0,0_100%)]',
          scrapbookOnly && 'hidden scrapbook:block',
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          base,
          'bottom-0 right-0 [clip-path:polygon(100%_0,100%_100%,0_100%)]',
          scrapbookOnly && 'hidden scrapbook:block',
        )}
      />
    </>
  )
}
