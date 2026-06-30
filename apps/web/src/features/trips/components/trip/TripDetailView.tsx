'use client'

import { Link } from '@/i18n/navigation'
import { routes } from '@/lib/routes'
import { useMemories, useTrip } from '@passe/hooks'
import { Badge } from '@passe/ui/badge'
import { buttonVariants } from '@passe/ui/button'
import {
  PageHeader,
  PageHeaderAction,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@passe/ui/page-header'
import { formatTripDateFull } from '@passe/utils'
import { useTranslations } from 'next-intl'
import { notFound } from 'next/navigation'
import { MemoryCard } from '../memories/MemoryCard'
import { NoMemoriesEmpty } from '../memories/NoMemoriesEmpty'

interface Props {
  id: string
}

export function TripDetailView({ id }: Props) {
  const t = useTranslations('trips.detail')
  const { data: trip, isLoading: tripLoading } = useTrip(id)
  const { data: memories = [], isLoading: memoriesLoading } = useMemories(id)

  if (tripLoading || memoriesLoading) return null

  if (!trip) notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader>
        <PageHeaderTitle>{trip.title}</PageHeaderTitle>
        <PageHeaderDescription>
          {formatTripDateFull(trip.startDate)} – {formatTripDateFull(trip.endDate)}
        </PageHeaderDescription>
        <PageHeaderAction>
          <Link
            href={routes.dashboard}
            className={buttonVariants({ variant: 'ghost', size: 'sm' })}
          >
            {t('back')}
          </Link>
        </PageHeaderAction>
      </PageHeader>

      {trip.countries.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1">
          {trip.countries.map((country) => (
            <Badge key={country} variant="outline">
              {country}
            </Badge>
          ))}
        </div>
      )}

      {trip.coverImageUrl && (
        <div className="mt-6 overflow-hidden rounded-xl">
          <img
            src={trip.coverImageUrl}
            alt={`Cover photo for ${trip.title}`}
            className="aspect-video w-full object-cover"
          />
        </div>
      )}

      {trip.description && <p className="mt-4 text-muted-foreground">{trip.description}</p>}

      <div className="mt-8">
        <h2 className="font-heading mb-4 text-lg font-semibold">
          {t('memories_heading')}
          {memories.length > 0 && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              {memories.length}
            </span>
          )}
        </h2>

        {memories.length === 0 ? (
          <NoMemoriesEmpty />
        ) : (
          <div className="flex flex-col gap-4">
            {memories.map((memory) => (
              <MemoryCard key={memory.id} memory={memory} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
