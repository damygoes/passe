'use client'

import { useMemories } from '@passe/hooks'
import { useTranslations } from 'next-intl'
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
      <h2 className="font-heading mb-4 text-lg font-semibold">
        {t('memories_heading')}
        {memories.length > 0 && (
          <span className="ml-2 text-sm font-normal text-muted-foreground">{memories.length}</span>
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
  )
}
