import { IntlMessageFormat } from 'intl-messageformat'
import { useCallback } from 'react'

import { useI18nContext } from './I18nProvider'

function getNestedValue(source: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((value, key) => {
    if (value && typeof value === 'object' && key in value) {
      return (value as Record<string, unknown>)[key]
    }
    return undefined
  }, source)
}

export function useTranslations(namespace: string) {
  const { locale, messages } = useI18nContext()

  return useCallback(
    (key: string, values?: Record<string, string | number>) => {
      const fullKey = `${namespace}.${key}`
      const template = getNestedValue(messages, fullKey)
      if (typeof template !== 'string') return fullKey
      return new IntlMessageFormat(template, locale).format(values) as string
    },
    [namespace, locale, messages],
  )
}
