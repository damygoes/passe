import type { ComponentProps } from 'react'
import { cn } from '@passe/utils'
import { Link } from '@/i18n/navigation'

/**
 * A text link whose underline is a hand-drawn ink squiggle that wipes in
 * from the left on hover, instead of a plain color change.
 */
export function UnderlineLink({ className, children, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn('group relative inline-block w-fit transition-colors', className)}
      {...props}
    >
      {children}
      {/* Absolutely positioned so the SVG's own intrinsic aspect ratio can
          never influence the link's shrink-to-fit width (it would otherwise
          fall back to height * aspect-ratio and force every link to the same
          width, regardless of how short the text is). */}
      <span className="pointer-events-none absolute inset-x-0 -bottom-0.5 block h-[6px] overflow-hidden">
        <svg
          aria-hidden
          viewBox="0 0 120 8"
          preserveAspectRatio="none"
          className="h-full w-full -translate-x-full opacity-70 transition-transform duration-300 ease-out group-hover:translate-x-0"
        >
          <path
            d="M2 4.5c8-3 16-3 24 0s16 3 24 0 16-3 24 0 16 3 24 0 16-3 22 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </Link>
  )
}
