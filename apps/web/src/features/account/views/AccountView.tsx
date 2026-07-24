'use client'

import { FadeIn } from '@/components/motion/FadeIn'
import { SECTION_STEP } from '@/lib/motion'
import { Separator } from '@passe/ui/separator'
import { useTranslations } from 'next-intl'
import { AccountTabView } from './AccountTabView'

export function AccountView() {
  const t = useTranslations('account')

  return (
    <div className="container mx-auto py-8 px-4 md:px-12">
      <FadeIn>
        <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
      </FadeIn>

      <Separator className="my-6" />

      <FadeIn delay={SECTION_STEP}>
        <AccountTabView />
      </FadeIn>
    </div>
  )
}
