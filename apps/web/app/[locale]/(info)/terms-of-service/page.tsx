import { getTranslations } from 'next-intl/server'
import { TermsOfServiceView } from '@/features/info/views/TermsOfServiceView'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'info.terms.meta' })
  return { title: t('title'), description: t('description') }
}

export default function TermsOfServicePage() {
  return <TermsOfServiceView />
}
