import { NewMemoryView } from '@/features/trips/views/NewMemoryView'

interface Props {
  params: Promise<{ id: string }>
}

export default async function NewMemoryPage({ params }: Props) {
  const { id } = await params
  return <NewMemoryView tripId={id} />
}
