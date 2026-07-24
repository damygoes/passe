interface Props {
  title: string
}

// Rendered in place of the cover photo when a trip has none. Sits under
// MediaCardScrim, so the initial stays legible beneath the espresso fade.
export function TripCardCoverFallback({ title }: Props) {
  return (
    <div
      aria-hidden
      className="from-sandy-beige via-aged-cream to-terracotta/30 absolute inset-0 flex items-center justify-center bg-gradient-to-br"
    >
      <span className="font-display text-dark-espresso/35 text-6xl font-bold select-none">
        {title.trim().charAt(0)}
      </span>
    </div>
  )
}
