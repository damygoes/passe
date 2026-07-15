import { useRouter } from 'expo-router'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { useTranslations } from '@/i18n/useTranslations'

interface NoMemoriesEmptyProps {
  tripId: string
}

export function NoMemoriesEmpty({ tripId }: NoMemoriesEmptyProps) {
  const t = useTranslations('trips.empty')
  const router = useRouter()

  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>{t('no_memories_title')}</EmptyTitle>
        <EmptyDescription>{t('no_memories_description')}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm" onPress={() => router.push(`/(app)/trips/new-memory/${tripId}`)}>
          {t('add_first_memory')}
        </Button>
      </EmptyContent>
    </Empty>
  )
}
