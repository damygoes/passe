import { Separator } from '@passe/ui/separator'
import { getTranslations } from 'next-intl/server'

export default async function BillingPage() {
  const t = await getTranslations('nav')

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 md:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">{t('billing')}</h1>
      <Separator className="my-6" />
      <p className="text-muted-foreground">Billing management coming soon.</p>
    </div>
  )
}
