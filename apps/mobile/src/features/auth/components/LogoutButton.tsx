import { useClerk } from '@clerk/expo'
import { useRouter } from 'expo-router'

import { Button } from '@/components/ui/button'
import type { ButtonProps } from '@/components/ui/button/Button.types'
import { useTranslations } from '@/i18n/useTranslations'

export function LogoutButton(props: Omit<ButtonProps, 'children' | 'onPress'>) {
  const { signOut } = useClerk()
  const router = useRouter()
  const t = useTranslations('auth.form')

  const handleSignOut = async () => {
    await signOut()
    router.replace('/(auth)/sign-in')
  }

  return (
    <Button variant="danger" onPress={handleSignOut} {...props}>
      {t('log_out')}
    </Button>
  )
}
