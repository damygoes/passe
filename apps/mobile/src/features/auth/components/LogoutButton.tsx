import { useClerk } from '@clerk/expo'
import { useRouter } from 'expo-router'

import { Button } from '@/components/ui/button'
import type { ButtonProps } from '@/components/ui/button/Button.types'

export function LogoutButton(props: Omit<ButtonProps, 'children' | 'onPress'>) {
  const { signOut } = useClerk()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.replace('/(auth)/sign-in')
  }

  return (
    <Button variant="secondary" onPress={handleSignOut} {...props}>
      Log out
    </Button>
  )
}
