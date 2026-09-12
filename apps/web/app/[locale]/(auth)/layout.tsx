import { Link } from '@/i18n/navigation'
import { Logo } from '@passe/ui'
import { getTranslations } from 'next-intl/server'
import type { ReactNode } from 'react'

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const tCommon = await getTranslations('common')
  const tLayout = await getTranslations('auth.layout')

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Brand panel — hidden on mobile */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-dark-espresso px-12 py-10">
        {/* Subtle texture overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)] [background-size:24px_24px]" />

        <div className="relative">
          <Link
            href="/"
            className="text-foreground transition-opacity hover:opacity-80"
            aria-label="Passe"
          >
            <Logo className="h-6 w-auto" />
          </Link>
        </div>

        <div className="relative space-y-5">
          <blockquote className="font-heading text-3xl leading-snug text-sandy-beige">
            &ldquo;{tCommon('app_tagline')}&rdquo;
          </blockquote>
          <p className="text-sm leading-relaxed text-muted-taupe max-w-xs">
            {tLayout('description')}
          </p>
        </div>

        <p className="relative text-xs text-muted-taupe-dark">{tLayout('copyright')}</p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col items-center justify-center bg-background px-6 py-12">
        {/* Mobile logo */}
        <div className="mb-10 lg:hidden">
          <span className="font-display text-2xl font-bold tracking-tight text-foreground">
            {tCommon('app_name')}
          </span>
        </div>

        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  )
}
