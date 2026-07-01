import { PortfolioTripView } from '@/features/portfolio/views/PortfolioTripView'

interface Props {
  params: Promise<{ slug: string; tripId: string }>
}

export default async function PublicTripPage({ params }: Props) {
  const { slug, tripId } = await params
  return <PortfolioTripView slug={slug} tripId={tripId} />
}
