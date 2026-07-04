import { EditTripView } from '@/features/trips/views/EditTripView'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditTripPage({ params }: Props) {
  const { id } = await params
  return <EditTripView id={id} />
}
