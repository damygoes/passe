import { TripDetailView } from '@/features/trips/components/TripDetailView'

interface Props {
  params: Promise<{ locale: string; id: string }>
}

export default async function TripDetailPage({ params }: Props) {
  const { locale, id } = await params
  return <TripDetailView id={id} locale={locale} />
}
