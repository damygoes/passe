'use client'

import { useClerk } from '@clerk/nextjs'
import { Button } from '@passe/ui/button'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { routes } from '@/lib/routes'

interface LogoutButtonProps {
  className?: string
}

export function LogoutButton({ className }: LogoutButtonProps) {
  const { signOut } = useClerk()
  const router = useRouter()
  const t = useTranslations('auth.form')

  const handleSignOut = () => {
    signOut(() => router.push(routes.signIn))
  }

  return (
    <Button variant="outline" onClick={handleSignOut} className={className}>
      {t('log_out')}
    </Button>
  )
}
