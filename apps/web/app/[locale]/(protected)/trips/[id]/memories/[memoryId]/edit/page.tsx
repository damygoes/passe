import { EditMemoryView } from '@/features/trips/views/EditMemoryView'

interface Props {
  params: Promise<{ id: string; memoryId: string }>
}

export default async function EditMemoryPage({ params }: Props) {
  const { id, memoryId } = await params
  return <EditMemoryView tripId={id} memoryId={memoryId} />
}
