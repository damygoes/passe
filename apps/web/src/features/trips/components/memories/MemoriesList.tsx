'use client'

import { useMemories } from '@passe/hooks'
import { buttonVariants } from '@passe/ui/button'
import { Icon } from '@passe/ui/icon'
import { cn } from '@passe/utils'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { tripNewMemoryRoute } from '@/lib/routes'
import { MemoryCard } from './MemoryCard'
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
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold">
          {t('memories_heading')}
          {memories.length > 0 && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              {memories.length}
            </span>
          )}
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
        <div className="flex flex-col gap-4">
          {memories.map((memory) => (
            <MemoryCard key={memory.id} memory={memory} />
          ))}
        </div>
      )}
    </div>
  )
}
