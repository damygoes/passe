import { Logo } from '@passe/ui/logo'

interface Props {
  username: string
}

export function PortfolioHeader({ username }: Props) {
  return (
    <header className="flex items-center justify-between border-b px-6 py-5 sm:px-14">
      <Logo className="h-5 w-auto" />
      <span className="font-mono text-[10.5px] tracking-[0.1em] text-muted-foreground uppercase">
        passe.cc/u/{username}
      </span>
    </header>
  )
}
