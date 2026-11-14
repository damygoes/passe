import { ClerkProvider } from '@clerk/nextjs'
import { ApiProvider } from '@/components/providers/ApiProvider'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { LOCALES } from '@passe/i18n'
import { routes } from '@/lib/routes'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  params: Promise<{ locale: string }>
}

// Unknown locales 404 before rendering. Without this, paths the proxy matcher skips
// (e.g. bot probes like /index.html) reach [locale] pages and auth() throws.
export const dynamicParams = false

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!(LOCALES as readonly string[]).includes(locale)) notFound()
  const messages = await getMessages()

  return (
    <ClerkProvider
      signInFallbackRedirectUrl={`/${locale}${routes.dashboard}`}
      signUpFallbackRedirectUrl={`/${locale}${routes.dashboard}`}
    >
      <NextIntlClientProvider messages={messages}>
        <ApiProvider>{children}</ApiProvider>
      </NextIntlClientProvider>
    </ClerkProvider>
  )
}
