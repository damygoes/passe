import { routes } from '@/lib/routes'

export function PortfolioFooter() {
  return (
    <footer className="border-t px-6 py-6 text-center text-xs text-muted-foreground">
      Powered by{' '}
      <a href={routes.home} className="underline underline-offset-4 hover:text-foreground">
        Passé.
      </a>
    </footer>
  )
}
