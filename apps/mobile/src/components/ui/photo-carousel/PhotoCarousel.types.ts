export interface PhotoCarouselItem {
  id: string
  url: string
  placeholder?: string | null
  caption?: string | null
}

export interface PhotoCarouselProps {
  photos: PhotoCarouselItem[]
  selectedIndex: number
  onIndexChange: (index: number) => void
  height?: number
  // Extra offset added to the count pill's top position — for a full-bleed
  // carousel that extends under the status bar via a negative marginTop
  // trick, pass the safe-area top inset so the pill still lands in the
  // visible area rather than behind the notch.
  topInset?: number
  countLabel: string
  prevLabel: string
  nextLabel: string
}
