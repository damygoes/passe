import { cn } from '@passe/utils'

/**
 * A hand-drawn passport-stamp / postmark doodle. Purely decorative (aria-hidden).
 */
export function PostmarkBadge({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 80 80" className={cn('pointer-events-none', className)}>
      <circle
        cx="40"
        cy="40"
        r="36"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="2.5 5"
      />
      <circle cx="40" cy="40" r="27" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M40 8v9M40 63v9M8 40h9M63 40h9M17.5 17.5l6.4 6.4M56.1 56.1l6.4 6.4M17.5 62.5l6.4-6.4M56.1 23.9l6.4-6.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="40" cy="40" r="3" fill="currentColor" />
    </svg>
  )
}
