'use client'

import { Link } from '@/i18n/navigation'
import { routes } from '@/lib/routes'
import { Icon } from '@passe/ui/icon'
import { PageHeader, PageHeaderDescription, PageHeaderTitle } from '@passe/ui/page-header'
import { useTranslations } from 'next-intl'
import { NewTripForm } from '../components/trip/forms/NewTripForm'

export function NewTripView() {
  const t = useTranslations('trips.new')

  return (
    <div className="container mx-auto w-full max-w-2xl px-4 py-8 flex flex-col gap-6">
      <Link
        href={routes.trips}
        className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <Icon name="chevron-left" size="xs" aria-hidden />
        {t('back')}
      </Link>
      <PageHeader>
        <PageHeaderTitle>{t('title')}</PageHeaderTitle>
        <PageHeaderDescription>{t('subtitle')}</PageHeaderDescription>
      </PageHeader>
      <NewTripForm />
    </div>
  )
}
