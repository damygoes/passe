import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { useTranslations } from '@/i18n/useTranslations'

interface NoPublicTripsEmptyProps {
  displayName: string
}

export function NoPublicTripsEmpty({ displayName }: NoPublicTripsEmptyProps) {
  const t = useTranslations('portfolio')

  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>{t('empty_title')}</EmptyTitle>
        <EmptyDescription>{t('empty_description', { displayName })}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
