import { getTranslations } from 'next-intl/server'
import { PrivacyPolicyView } from '@/features/info/views/PrivacyPolicyView'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'info.privacy.meta' })
  return { title: t('title'), description: t('description') }
}

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyView />
}
