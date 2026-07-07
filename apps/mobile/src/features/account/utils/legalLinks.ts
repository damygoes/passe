import type { Locale } from '@passe/i18n'

export type LegalPageKey = 'privacyPolicy' | 'termsOfService' | 'impressum' | 'support'

const LEGAL_PATHS: Record<LegalPageKey, string> = {
  privacyPolicy: 'privacy-policy',
  termsOfService: 'terms-of-service',
  impressum: 'impressum',
  support: 'support',
}

export function buildLegalUrl(key: LegalPageKey, locale: Locale): string {
  return `${process.env.EXPO_PUBLIC_API_URL}/${locale}/${LEGAL_PATHS[key]}`
}
