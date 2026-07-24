'use client'

import { Link } from '@/i18n/navigation'
import { routes } from '@/lib/routes'
import { canUseThemes } from '@passe/auth/plan-gates'
import { useUpdateUser } from '@passe/hooks'
import type { Plan } from '@passe/types'
import type { UserTheme } from '@passe/types/user'
import { Badge } from '@passe/ui/badge'
import { Button, buttonVariants } from '@passe/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@passe/ui/card'
import { Icon } from '@passe/ui/icon'
import { cn } from '@passe/utils'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

interface AppearanceFormProps {
  theme: UserTheme
  plan: Plan
}

const THEME_OPTIONS: UserTheme[] = ['editorial', 'scrapbook']

export function AppearanceForm({ theme, plan }: AppearanceFormProps) {
  const t = useTranslations('account.appearance')
  const tErrors = useTranslations('account.errors')
  const { mutate, isPending, isError, variables } = useUpdateUser()
  const [success, setSuccess] = useState(false)
  const unlocked = canUseThemes(plan)

  const activeTheme = variables?.theme ?? theme

  useEffect(() => {
    if (!success) return
    const id = setTimeout(() => setSuccess(false), 3000)
    return () => clearTimeout(id)
  }, [success])

  function selectTheme(next: UserTheme) {
    if (next === activeTheme || isPending) return
    setSuccess(false)
    mutate({ theme: next }, { onSuccess: () => setSuccess(true) })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">{t('title')}</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{t('description')}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {THEME_OPTIONS.map((option) => {
          const isLocked = option !== 'editorial' && !unlocked
          const isActive = activeTheme === option

          return (
            <Card key={option} className={cn('relative', isActive && 'ring-2 ring-primary')}>
              {isActive && <Badge className="absolute top-4 right-4">{t('current_label')}</Badge>}
              <CardHeader>
                <div
                  data-theme={option === 'scrapbook' ? 'scrapbook' : undefined}
                  className="relative flex h-16 items-center justify-center overflow-hidden rounded-lg bg-background"
                >
                  <span
                    className={cn(
                      'relative z-10 text-2xl',
                      option === 'scrapbook' ? 'font-annotation' : 'font-display',
                    )}
                  >
                    Aa
                  </span>
                  {option === 'scrapbook' && (
                    <div
                      aria-hidden="true"
                      className="absolute -top-1 right-4 z-10 h-4 w-10 -rotate-3 bg-sandy-beige/70 shadow-sm"
                    />
                  )}
                </div>
                <h3 className="mt-2 font-heading text-base font-semibold">
                  {t(`${option}_label`)}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t(`${option}_description`)}</p>
              </CardContent>
              <CardFooter>
                {isLocked ? (
                  <Link
                    href={routes.billing}
                    className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
                  >
                    <Icon name="lock" size="sm" />
                    {t('upgrade_cta')}
                  </Link>
                ) : (
                  <Button
                    variant={isActive ? 'secondary' : 'outline'}
                    className="w-full"
                    disabled={isActive || isPending}
                    isLoading={isPending && variables?.theme === option}
                    onClick={() => selectTheme(option)}
                  >
                    {isActive
                      ? t('current_label')
                      : t('select_cta', { theme: t(`${option}_label`) })}
                  </Button>
                )}
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {isError && (
        <p role="alert" className="text-sm text-destructive">
          {tErrors('update_failed')}
        </p>
      )}

      {!unlocked && <p className="text-sm text-muted-foreground">{t('locked_note')}</p>}
    </div>
  )
}
