import type { ReactNode } from 'react'

interface InfoPageShellProps {
  eyebrow: string
  title: string
  lastUpdated?: string
  children: ReactNode
}

export function InfoPageShell({ eyebrow, title, lastUpdated, children }: InfoPageShellProps) {
  return (
    <div className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          {eyebrow}
        </p>
        <h1 className="font-display mt-4 text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
        {lastUpdated && <p className="mt-3 text-sm text-muted-foreground">{lastUpdated}</p>}
        <div className="mt-12 flex flex-col gap-10">{children}</div>
      </div>
    </div>
  )
}
