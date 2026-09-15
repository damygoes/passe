'use client'

import { Link } from '@/i18n/navigation'
import { tripKeepsakesRoute } from '@/lib/routes'
import { canExportPdf } from '@passe/auth/plan-gates'
import { useMemories, useTrip, useTrips, useUser } from '@passe/hooks'
import { Badge } from '@passe/ui/badge'
import { Button } from '@passe/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@passe/ui/dropdown-menu'
import { Icon } from '@passe/ui/icon'
import { Skeleton } from '@passe/ui/skeleton'
import { formatDateRange } from '@passe/utils'
import { useTranslations } from 'next-intl'

interface Props {
  tripId: string
}

// Every export is scoped to one trip — the sidebar's global "Keepsakes" link
// only gets you to the most recently created one, so this doubles as both
// the page's heading and the way to switch to a different trip's keepsakes.
// The "Keepsakes for" lead-in (rather than a bare trip name + chevron) is
// what actually tells a first-time visitor the name below is clickable and
// scopes the whole page, not just a label.
function KeepsakesHeading({
  trips,
  currentTripId,
  currentTitle,
}: {
  trips: { id: string; title: string }[]
  currentTripId: string
  currentTitle: string
}) {
  const t = useTranslations('trips.keepsakes')

  if (trips.length <= 1) {
    return (
      <h1 className="font-display text-4xl leading-tight sm:text-5xl">
        <span className="text-muted-foreground">{t('heading_prefix')} </span>
        {currentTitle}
      </h1>
    )
  }

  return (
    <h1 className="font-display text-4xl leading-tight sm:text-5xl">
      <span className="text-muted-foreground">{t('heading_prefix')} </span>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              aria-label={t('switch_trip', { title: currentTitle })}
              className="h-auto gap-2 rounded-lg p-0 align-baseline font-display text-4xl underline decoration-muted-foreground/40 decoration-dashed underline-offset-8 hover:bg-transparent hover:decoration-foreground sm:text-5xl"
            />
          }
        >
          {currentTitle}
          <Icon name="chevronDown" size="md" className="text-muted-foreground" aria-hidden />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {trips.map((trip) => (
            <DropdownMenuItem
              key={trip.id}
              render={<Link href={tripKeepsakesRoute(trip.id)} />}
              className={trip.id === currentTripId ? 'font-medium' : undefined}
            >
              {trip.title}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </h1>
  )
}

// Split out from the export cards below so switching trips only re-fetches
// and re-skeletons this header — the cards' content (titles, descriptions,
// locked state) doesn't depend on which trip is selected, only on the
// user's plan, so there's no reason for them to reload alongside it.
export function KeepsakesHeaderDataWrapper({ tripId }: Props) {
  const t = useTranslations('trips.keepsakes')
  const { data: trip, isLoading: tripLoading, isError: tripError } = useTrip(tripId)
  const { data: trips = [] } = useTrips()
  const { data: memories = [], isLoading: memoriesLoading } = useMemories(tripId)
  const { data: user } = useUser()

  if (tripLoading || memoriesLoading) {
    return <Skeleton className="h-14 w-96" />
  }

  if (tripError || !trip) {
    return <p className="text-sm text-destructive">{t('load_error')}</p>
  }

  const canExport = user ? canExportPdf(user.plan) : false

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <KeepsakesHeading trips={trips} currentTripId={tripId} currentTitle={trip.title} />
        <p className="mt-2 font-mono text-[10.5px] tracking-[0.14em] text-muted-foreground uppercase">
          {formatDateRange(trip.startDate, trip.endDate)} ·{' '}
          {t('memories_count', { count: memories.length })}
        </p>
      </div>
      <Badge variant={canExport ? 'shared' : 'neutral'} className="font-mono uppercase">
        {canExport ? t('badge_unlocked') : t('badge_locked')}
      </Badge>
    </div>
  )
}
