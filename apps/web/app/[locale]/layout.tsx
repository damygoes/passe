import { ClerkProvider } from '@clerk/nextjs'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { LOCALES } from '@passe/i18n'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!(LOCALES as readonly string[]).includes(locale)) notFound()
  const messages = await getMessages()

  return (
    <ClerkProvider>
      <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
    </ClerkProvider>
  )
}
