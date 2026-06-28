import { getRequestConfig } from 'next-intl/server'
import { messages } from '@passe/i18n'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !(routing.locales as readonly string[]).includes(locale)) {
    locale = routing.defaultLocale
  }
  return {
    locale,
    messages: messages[locale as keyof typeof messages],
  }
})
