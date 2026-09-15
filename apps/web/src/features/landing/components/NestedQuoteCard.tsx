import type { ReactNode } from 'react'

export interface NestedQuoteCardProps {
  text: ReactNode
  who: ReactNode
}

export function NestedQuoteCard({ text, who }: NestedQuoteCardProps) {
  return (
    <div className="rounded-[26px] bg-aged-cream/10 p-[22px_24px]">
      <p className="text-[14.5px] leading-relaxed">{text}</p>
      <p className="mt-2 font-mono text-[10.5px] tracking-[0.1em] opacity-60 uppercase">{who}</p>
    </div>
  )
}
