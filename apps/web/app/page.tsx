import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { AFTER_SIGN_IN_URL, SIGN_IN_URL } from '@passe/auth/constants'

export default async function Page() {
  const { userId } = await auth()
  redirect(userId ? AFTER_SIGN_IN_URL : SIGN_IN_URL)
}
