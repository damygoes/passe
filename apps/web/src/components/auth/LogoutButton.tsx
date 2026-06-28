'use client'

import { useClerk } from '@clerk/nextjs'
import { Button } from '@passe/ui/button'
import { useRouter } from 'next/navigation'
import { SIGN_IN_URL } from '@passe/auth/constants'

interface LogoutButtonProps {
  className?: string
}

export function LogoutButton({ className }: LogoutButtonProps) {
  const { signOut } = useClerk()
  const router = useRouter()

  const handleSignOut = () => {
    signOut(() => router.push(SIGN_IN_URL))
  }

  return (
    <Button variant="outline" onClick={handleSignOut} className={className}>
      Log out
    </Button>
  )
}
