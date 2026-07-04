'use client'

import { PageHeader, PageHeaderDescription, PageHeaderTitle } from '@passe/ui/page-header'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { tripRoute } from '@/lib/routes'
import { MemoryForm } from '../components/memories/MemoryForm'

interface Props {
  tripId: string
}

export function NewMemoryView({ tripId }: Props) {
  const t = useTranslations('trips.new_memory')

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
      <MemoryForm tripId={tripId} />
    </div>
  )
}
