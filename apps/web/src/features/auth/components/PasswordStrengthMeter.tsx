'use client'

import { PASSWORD_RULES } from '@/features/auth/schemas/auth'
import { Icon } from '@passe/ui/icon'
import { cn } from '@passe/utils'
import { useTranslations } from 'next-intl'

interface PasswordStrengthMeterProps {
  password: string
  className?: string
}

const STRENGTH_LEVELS = [
  { key: 'weak', barColor: 'bg-destructive', textColor: 'text-destructive', bars: 1 },
  { key: 'fair', barColor: 'bg-terracotta', textColor: 'text-terracotta', bars: 2 },
  { key: 'good', barColor: 'bg-terracotta-light', textColor: 'text-terracotta', bars: 3 },
  { key: 'strong', barColor: 'bg-deep-olive-light', textColor: 'text-deep-olive', bars: 4 },
  { key: 'very_strong', barColor: 'bg-deep-olive', textColor: 'text-deep-olive-dark', bars: 4 },
] as const

export function PasswordStrengthMeter({ password, className }: PasswordStrengthMeterProps) {
  const t = useTranslations('auth.password_strength')

  if (!password) return null

  const results = PASSWORD_RULES.map((rule) => rule.test(password))
  const score = results.filter(Boolean).length

  if (score === 0) return null

  const level = STRENGTH_LEVELS[score - 1]!

  return (
    <div role="status" aria-label={t('aria_label')} className={cn('space-y-2', className)}>
      <div className="flex items-center gap-3">
        <div className="flex flex-1 gap-1">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className={cn(
                'h-1 flex-1 rounded-full transition-all duration-300',
                i < level.bars ? level.barColor : 'bg-border',
              )}
            />
          ))}
        </div>
        <span className={cn('w-24 text-right text-xs font-medium', level.textColor)}>
          {t(level.key)}
        </span>
      </div>

      <ul className="space-y-0.5">
        {PASSWORD_RULES.map((rule, i) => {
          const passed = results[i]!
          return (
            <li
              key={rule.id}
              className={cn(
                'flex items-center gap-1.5 text-xs transition-colors duration-200',
                passed ? 'text-deep-olive' : 'text-muted-foreground',
              )}
            >
              <Icon name={passed ? 'check' : 'close'} size="xs" aria-hidden />
              {rule.label}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
