import { messages, type Locale, type Messages } from '@passe/i18n'
import { createContext, useContext, useMemo, type ReactNode } from 'react'

import { detectDeviceLocale } from './locale'

interface I18nContextValue {
  locale: Locale
  messages: Messages
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const value = useMemo<I18nContextValue>(() => {
    const locale = detectDeviceLocale()
    return { locale, messages: messages[locale] }
  }, [])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18nContext() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18nContext must be used within an I18nProvider')
  }
  return context
}
