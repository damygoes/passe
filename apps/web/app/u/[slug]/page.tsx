import { PortfolioView } from '@/features/portfolio/views/PortfolioView'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function PortfolioPage({ params }: Props) {
  const { slug } = await params
  return <PortfolioView slug={slug} />
}
