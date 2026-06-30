import { TripDetailView } from '@/features/trips/views/TripDetailView'

interface Props {
  params: Promise<{ id: string }>
}

export default async function TripDetailPage({ params }: Props) {
  const { id } = await params
  return <TripDetailView id={id} />
}
