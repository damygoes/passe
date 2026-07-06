'use client'

import { FadeIn } from '@/components/motion/FadeIn'
import { SECTION_STEP } from '@/lib/motion'
import { PageHeader, PageHeaderDescription, PageHeaderTitle } from '@passe/ui/page-header'
import { useTranslations } from 'next-intl'
import { MapDataWrapper } from '../components/MapDataWrapper'

export function MapView() {
  const t = useTranslations('map')

  return (
    <div className="container mx-auto w-full px-4 py-8 flex flex-col gap-6">
      <FadeIn>
        <PageHeader className="w-full">
          <PageHeaderTitle>{t('title')}</PageHeaderTitle>
          <PageHeaderDescription>{t('subtitle')}</PageHeaderDescription>
        </PageHeader>
      </FadeIn>
      <FadeIn delay={SECTION_STEP}>
        <MapDataWrapper />
      </FadeIn>
    </div>
  )
}
