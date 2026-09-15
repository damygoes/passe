'use client'

import { useMemories } from '@passe/hooks'
import { buttonVariants } from '@passe/ui/button'
import { Icon } from '@passe/ui/icon'
import { cn } from '@passe/utils'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { tripNewMemoryRoute } from '@/lib/routes'
import { MemoriesMasonryGrid } from './MemoriesMasonryGrid'
import { MemoriesListSkeleton } from './MemoriesListSkeleton'
import { NoMemoriesEmpty } from './NoMemoriesEmpty'

interface Props {
  tripId: string
}

export function MemoriesList({ tripId }: Props) {
  const t = useTranslations('trips.detail')
  const { data: memories = [], isLoading, isError } = useMemories(tripId)

  if (isLoading) return <MemoriesListSkeleton />

  if (isError) return <p className="mt-8 text-sm text-destructive">{t('memories_error')}</p>

  return (
    <div className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-mono text-[10.5px] tracking-[0.14em] text-muted-foreground uppercase">
          {memories.length} {t('memories_heading', { count: memories.length })}
        </h2>
        <Link
          href={tripNewMemoryRoute(tripId)}
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1.5')}
        >
          <Icon name="plus" size="sm" />
          {t('add_memory')}
        </Link>
      </div>

      {memories.length === 0 ? (
        <NoMemoriesEmpty tripId={tripId} />
      ) : (
        <MemoriesMasonryGrid tripId={tripId} memories={memories} />
      )}
    </div>
  )
}
