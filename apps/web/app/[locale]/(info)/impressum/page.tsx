import { getTranslations } from 'next-intl/server'
import { ImpressumView } from '@/features/info/views/ImpressumView'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'info.impressum.meta' })
  return { title: t('title'), description: t('description') }
}

export default function ImpressumPage() {
  return <ImpressumView />
}
