import { cn } from '@passe/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'

// Layout-agnostic on purpose — the redesign uses this same value+label pair
// as a padded card (home, portfolio stats strip), a bare right-aligned stack
// (web home header), and a divider-separated grid cell (the Stats screen).
// Callers own the grid/list/divider chrome around it.
const statTileVariants = cva('flex flex-col gap-1', {
  variants: {
    tone: {
      plain: '',
      surface: 'rounded-3xl bg-popover p-4 shadow-sm',
      sand: 'rounded-3xl bg-secondary p-4',
    },
    align: {
      start: 'items-start text-left',
      end: 'items-end text-right',
    },
  },
  defaultVariants: {
    tone: 'plain',
    align: 'start',
  },
})

const valueSizeClasses = {
  sm: 'text-[26px]',
  md: 'text-[34px]',
  lg: 'text-[44px]',
  xl: 'text-[58px]',
} as const

export interface StatTileProps extends VariantProps<typeof statTileVariants> {
  value: ReactNode
  label: ReactNode
  /** Optional right-aligned note, shown next to the label — matches the Stats screen's per-row copy. */
  note?: ReactNode
  size?: keyof typeof valueSizeClasses
  className?: string
}

function StatTile({ value, label, note, size = 'md', tone, align, className }: StatTileProps) {
  return (
    <div data-slot="stat-tile" className={cn(statTileVariants({ tone, align }), className)}>
      <div className={cn('font-display leading-none', valueSizeClasses[size])}>{value}</div>
      <div className="flex items-baseline justify-between gap-3">
        <div className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
          {label}
        </div>
        {note != null && <div className="text-sm text-muted-foreground">{note}</div>}
      </div>
    </div>
  )
}

export { StatTile, statTileVariants }
