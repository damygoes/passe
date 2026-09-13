'use client'

import { FadeIn } from '@/components/motion/FadeIn'
import { Link } from '@/i18n/navigation'
import { SECTION_STEP } from '@/lib/motion'
import { routes } from '@/lib/routes'
import { Icon } from '@passe/ui/icon'
import { useTranslations } from 'next-intl'
import { MemoriesList } from '../components/memories/MemoriesList'
import { TripDetailHeader } from '../components/trip/trip-detail/TripDetailHeader'

interface Props {
  id: string
}

export function TripDetailView({ id }: Props) {
  const t = useTranslations('trips.detail')

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href={routes.trips}
        className="mb-4 inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <Icon name="chevron-left" size="xs" aria-hidden />
        {t('back_label')}
      </Link>
      <FadeIn>
        <TripDetailHeader id={id} />
      </FadeIn>
      <FadeIn delay={SECTION_STEP}>
        <MemoriesList tripId={id} />
      </FadeIn>
    </div>
  )
}
