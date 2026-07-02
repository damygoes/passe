import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { LandingView } from '@/features/landing/views/LandingView'
import { routes } from '@/lib/routes'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'landing.meta' })
  return { title: t('title'), description: t('description') }
}

export default async function LocalePage({ params }: Props) {
  const { locale } = await params
  const { userId } = await auth()

  if (userId) {
    redirect(`/${locale}${routes.dashboard}`)
  }

  return <LandingView />
}
