'use client'

import { useLocale } from 'next-intl'
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

const LOCALE_CONFIG: Record<Locale, { name: string; flag: string }> = {
  en: { name: 'English', flag: '🇬🇧' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
}

export function LocaleDropdownMenu() {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()

  const { flag } = LOCALE_CONFIG[locale]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" aria-label="Change language">
            <span aria-hidden>{flag}</span>
            {locale.toUpperCase()}
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={(value) => router.replace(pathname, { locale: value as Locale })}
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
