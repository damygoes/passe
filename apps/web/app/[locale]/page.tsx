import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { buttonVariants } from '@passe/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@passe/ui/card'
import { Link } from '@/i18n/navigation'
import { routes } from '@/lib/routes'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function LocalePage({ params }: Props) {
  const { locale } = await params
  const { userId } = await auth()

  if (userId) {
    redirect(`/${locale}${routes.dashboard}`)
  }

  const t = await getTranslations('common')

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Nav */}
      <header className="flex h-16 items-center justify-between border-b px-6">
        <span className="font-display text-lg font-bold tracking-tight">{t('app_name')}</span>
        <div className="flex items-center gap-2">
          <Link
            href={routes.signIn}
            className={buttonVariants({ variant: 'ghost', size: 'sm' })}
          >
            Sign in
          </Link>
          <Link href={routes.signUp} className={buttonVariants({ size: 'sm' })}>
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <p className="mb-4 text-sm uppercase tracking-widest text-muted-foreground">
          Travel memory
        </p>
        <h1 className="font-heading max-w-2xl text-5xl font-bold leading-tight tracking-tight">
          {t('app_tagline')}
        </h1>
        <p className="mt-6 max-w-lg text-lg text-muted-foreground">
          Create trips, attach geotagged memories, and share your world — beautifully.
        </p>
        <div className="mt-10 flex items-center gap-3">
          <Link href={routes.signUp} className={buttonVariants({ size: 'lg' })}>
            Start for free
          </Link>
          <Link
            href={routes.signIn}
            className={buttonVariants({ variant: 'outline', size: 'lg' })}
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-t py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading mb-12 text-center text-2xl font-semibold">
            Everything you need to preserve your travels
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Trips</CardTitle>
                <CardDescription>
                  Organise your travels by trip. Set dates, countries, and a cover image.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Memories</CardTitle>
                <CardDescription>
                  Attach geotagged photos and notes to any trip. Your story, in order.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Portfolios</CardTitle>
                <CardDescription>
                  Share a beautiful public portfolio of your travels with a personal link.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8 text-center text-sm text-muted-foreground">
        © 2026 Passé
      </footer>
    </div>
  )
}
