import { cn } from '@passe/utils'

/**
 * A torn-paper washi-tape strip, meant to overlap a photo's corner like it's
 * taped into a travel journal. Purely decorative (aria-hidden).
 */
export function WashiTapeCorner({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 34"
      className={cn('pointer-events-none absolute z-10 h-8 w-24 drop-shadow-sm', className)}
    >
      <rect width="100" height="34" className="fill-sandy-beige" fillOpacity="0.92" />
      <g className="stroke-dark-espresso" strokeOpacity="0.1" strokeWidth="2">
        <line x1="-10" y1="34" x2="10" y2="-10" />
        <line x1="4" y1="34" x2="24" y2="-10" />
        <line x1="18" y1="34" x2="38" y2="-10" />
        <line x1="32" y1="34" x2="52" y2="-10" />
        <line x1="46" y1="34" x2="66" y2="-10" />
        <line x1="60" y1="34" x2="80" y2="-10" />
        <line x1="74" y1="34" x2="94" y2="-10" />
        <line x1="88" y1="34" x2="108" y2="-10" />
      </g>
      <rect
        width="100"
        height="34"
        fill="none"
        className="stroke-dark-espresso"
        strokeOpacity="0.15"
        strokeWidth="1"
      />
    </svg>
  )
}
