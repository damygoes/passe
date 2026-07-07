import { defineRouting } from 'next-intl/routing'
import { LOCALES, DEFAULT_LOCALE } from '@passe/i18n'

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'as-needed',
})
