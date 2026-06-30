import { DashboardView } from '@/features/trips/components/DashboardView'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function Dashboard({ params }: Props) {
  const { locale } = await params
  return <DashboardView locale={locale} />
}
