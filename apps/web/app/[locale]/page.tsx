import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { AFTER_SIGN_IN_URL, SIGN_IN_URL } from '@passe/auth/constants'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function LocalePage({ params }: Props) {
  const { locale } = await params
  const { userId } = await auth()
  redirect(`/${locale}${userId ? AFTER_SIGN_IN_URL : SIGN_IN_URL}`)
}
