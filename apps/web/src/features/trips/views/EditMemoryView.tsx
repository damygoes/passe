'use client'

import { useMemories } from '@passe/hooks'
import { PageHeader, PageHeaderDescription, PageHeaderTitle } from '@passe/ui/page-header'
import { Skeleton } from '@passe/ui/skeleton'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { tripRoute } from '@/lib/routes'
import { MemoryForm } from '../components/memories/MemoryForm'

interface Props {
  tripId: string
  memoryId: string
}

export function EditMemoryView({ tripId, memoryId }: Props) {
  const t = useTranslations('trips.edit_memory')
  const { data: memories, isLoading, isError } = useMemories(tripId)
  const memory = memories?.find((item) => item.id === memoryId)

  return (
    <div className="container mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8">
      <Link
        href={tripRoute(tripId)}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        {t('back')}
      </Link>
      <PageHeader>
        <PageHeaderTitle>{t('title')}</PageHeaderTitle>
        <PageHeaderDescription>{t('subtitle')}</PageHeaderDescription>
      </PageHeader>

      {isLoading && (
        <div className="space-y-5">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}

      {!isLoading && (isError || !memory) && (
        <p className="text-sm text-destructive">{t('not_found')}</p>
      )}

      {!isLoading && memory && <MemoryForm tripId={tripId} memory={memory} />}
    </div>
  )
}
