import { routes } from '@/lib/routes'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">404</p>
      <h1 className="font-display text-3xl font-semibold">Portfolio not found</h1>
      <p className="mt-3 text-muted-foreground">
        This portfolio doesn&apos;t exist or isn&apos;t public.
      </p>
      <a
        href={routes.home}
        className="mt-8 text-sm underline underline-offset-4 hover:text-foreground"
      >
        Go home
      </a>
    </div>
  )
}
