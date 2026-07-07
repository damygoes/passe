import { Logo } from '@passe/ui/logo'
import { routes } from '@/lib/routes'

export function PortfolioFooter() {
  return (
    <footer className="border-t px-6 py-6 text-center text-xs text-muted-foreground">
      Powered by{' '}
      <a
        href={routes.home}
        className="inline-flex items-baseline hover:text-foreground"
        aria-label="Passé"
      >
        <Logo className="h-3 w-auto translate-y-px" />
      </a>
    </footer>
  )
}
