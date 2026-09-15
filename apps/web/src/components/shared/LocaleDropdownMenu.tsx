'use client'

import { usePathname, useRouter } from '@/i18n/navigation'
import { LOCALES, type Locale } from '@passe/i18n'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@passe/ui'
import { useLocale } from 'next-intl'
import { useEffect, useTransition } from 'react'

type LocaleDropdownMenuVariant = 'icon' | 'sidebar-menu'

const LOCALE_CONFIG: Record<Locale, { name: string; flag: string }> = {
  en: { name: 'English', flag: '🇬🇧' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
}

export function LocaleDropdownMenu({
  variant = 'icon',
  className,
}: {
  variant?: LocaleDropdownMenuVariant
  className?: string
}) {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const { flag } = LOCALE_CONFIG[locale]

  // Prefetch this page's RSC payload in every other locale so switching never has to
  // wait on a first paint — that's what still shows a brief loading.tsx flash otherwise.
  useEffect(() => {
    for (const loc of LOCALES) {
      if (loc !== locale) router.prefetch(pathname, { locale: loc })
    }
  }, [locale, pathname, router])

  if (variant === 'sidebar-menu') {
    return (
      <DropdownMenuRadioGroup
        value={locale}
        onValueChange={(value) => {
          startTransition(() => {
            router.replace(pathname, { locale: value as Locale })
          })
        }}
      >
        {LOCALES.map((loc) => {
          const { name, flag: locFlag } = LOCALE_CONFIG[loc]
          return (
            <DropdownMenuRadioItem key={loc} value={loc}>
              <span aria-hidden>{locFlag}</span>
              {name}
            </DropdownMenuRadioItem>
          )
        })}
      </DropdownMenuRadioGroup>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            aria-label="Change language"
            className={className}
            disabled={isPending}
          >
            <span aria-hidden>{flag}</span>
            {locale.toUpperCase()}
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={(value) => {
            startTransition(() => {
              router.replace(pathname, { locale: value as Locale })
            })
          }}
        >
          {LOCALES.map((loc) => {
            const { name, flag: locFlag } = LOCALE_CONFIG[loc]
            return (
              <DropdownMenuRadioItem key={loc} value={loc}>
                <span aria-hidden>{locFlag}</span>
                {name}
              </DropdownMenuRadioItem>
            )
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
