// Minimal memory shape the editorial section components render. Both the
// API `Memory` type and raw Drizzle rows with joined media satisfy it, so
// the same components serve the owner page (client) and public page (server).
export interface EditorialMemoryData {
  id: string
  note?: string | null
  city?: string | null
  country?: string | null
  capturedAt: Date | string
  media: {
    id: string
    url: string
    width?: number | null
    height?: number | null
    placeholder?: string | null
    srcset?: Record<string, string> | null
  }[]
}

export function memoryMetaLabel(memory: EditorialMemoryData): string {
  return [memory.city, memory.country].filter(Boolean).join(', ')
}
