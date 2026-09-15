import { Icon, type IconName } from '@passe/ui/icon'
import { cn } from '@passe/utils'
import type { ReactNode } from 'react'

export interface BenefitCardProps {
  icon: IconName
  tone: 'terracotta' | 'olive'
  title: ReactNode
  description: ReactNode
}

export function BenefitCard({ icon, tone, title, description }: BenefitCardProps) {
  return (
    <div className="flex h-full flex-col rounded-[32px] bg-popover p-7 shadow-soft-sm">
      <div
        className={cn(
          'flex size-[46px] items-center justify-center rounded-full',
          tone === 'terracotta'
            ? 'bg-terracotta-100 text-terracotta-500'
            : 'bg-deep-olive-100 text-deep-olive-500',
        )}
      >
        <Icon name={icon} size="lg" aria-hidden />
      </div>
      <h3 className="font-display mt-4 text-[25px] leading-[1.15]">{title}</h3>
      <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}
