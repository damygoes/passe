import { MemoryDetailView } from '@/features/trips/views/MemoryDetailView'

interface Props {
  params: Promise<{ id: string; memoryId: string }>
}

export default async function MemoryDetailPage({ params }: Props) {
  const { id, memoryId } = await params
  return <MemoryDetailView tripId={id} memoryId={memoryId} />
}
