import { KeepsakesView } from '@/features/trips/views/KeepsakesView'

interface Props {
  params: Promise<{ id: string }>
}

export default async function KeepsakesPage({ params }: Props) {
  const { id } = await params
  return <KeepsakesView tripId={id} />
}
