'use client'

import { Separator } from '@passe/ui/separator'
import { useTranslations } from 'next-intl'
import { AccountTabView } from './AccountTabView'

export function AccountView() {
  const t = useTranslations('account')

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 md:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>

      <Separator className="my-6" />

      <AccountTabView />
    </div>
  )
}
