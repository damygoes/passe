import { getTranslations } from 'next-intl/server'
import { SupportView } from '@/features/info/views/SupportView'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'info.support.meta' })
  return { title: t('title'), description: t('description') }
}

export default function SupportPage() {
  return <SupportView />
}
