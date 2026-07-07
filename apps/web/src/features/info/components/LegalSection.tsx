interface LegalSectionProps {
  heading: string
  paragraphs: string[]
  listItems?: string[]
  outro?: string[]
}

export function LegalSection({ heading, paragraphs, listItems, outro }: LegalSectionProps) {
  return (
    <section>
      <h2 className="font-display text-xl font-semibold tracking-tight">{heading}</h2>
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {paragraph}
        </p>
      ))}
      {listItems && listItems.length > 0 && (
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          {listItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      {outro?.map((paragraph) => (
        <p key={paragraph} className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {paragraph}
        </p>
      ))}
    </section>
  )
}
