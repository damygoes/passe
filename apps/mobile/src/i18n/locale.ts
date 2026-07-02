import { DEFAULT_LOCALE, LOCALES, type Locale } from '@passe/i18n'
import * as Localization from 'expo-localization'

export function detectDeviceLocale(): Locale {
  const [preferred] = Localization.getLocales()
  const languageCode = preferred?.languageCode
  return (LOCALES as readonly string[]).includes(languageCode ?? '')
    ? (languageCode as Locale)
    : DEFAULT_LOCALE
}
