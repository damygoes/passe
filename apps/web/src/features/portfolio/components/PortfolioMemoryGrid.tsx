import { NoPublicMemoriesEmpty } from './NoPublicMemoriesEmpty'
import { PublicMemoryCard } from './PublicMemoryCard'

interface MemoryData {
  id: string
  note?: string | null
  media: { id: string; url: string }[]
  city?: string | null
  country?: string | null
}

interface Props {
  memories: MemoryData[]
}

export function PortfolioMemoryGrid({ memories }: Props) {
  if (memories.length === 0) {
    return <NoPublicMemoriesEmpty />
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {memories.map((memory) => (
        <PublicMemoryCard key={memory.id} memory={memory} />
      ))}
    </div>
  )
}
