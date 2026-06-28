import en from './locales/en.json'
import de from './locales/de.json'

export const LOCALES = ['en', 'de'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'en'

export const messages = { en, de } as const
export type Messages = typeof en
