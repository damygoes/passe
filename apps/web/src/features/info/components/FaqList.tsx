interface FaqItem {
  question: string
  answer: string
}

interface FaqListProps {
  items: FaqItem[]
}

export function FaqList({ items }: FaqListProps) {
  return (
    <dl className="flex flex-col gap-8">
      {items.map((item) => (
        <div key={item.question}>
          <dt className="font-display text-lg font-semibold tracking-tight">{item.question}</dt>
          <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.answer}</dd>
        </div>
      ))}
    </dl>
  )
}
