'use client'

import { useUser } from '@passe/hooks'
import { buttonVariants } from '@passe/ui/button'
import { cn } from '@passe/utils'
import { useTranslations } from 'next-intl'
import { publicPortfolioRoute } from '@/lib/routes'

interface PortfolioLinkProps {
  username: string | null
  className?: string
  onClick?: () => void
}

export function PortfolioLink({ username: initialUsername, className, onClick }: PortfolioLinkProps) {
  const t = useTranslations('nav')
  const { data: user } = useUser()
  const username = user?.username ?? initialUsername

  if (!username) return null

  return (
    <a
      href={publicPortfolioRoute(username)}
      onClick={onClick}
      className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), className)}
    >
      {t('portfolio')}
    </a>
  )
}
