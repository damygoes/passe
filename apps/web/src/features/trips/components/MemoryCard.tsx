import { Card, CardContent, CardDescription, CardHeader } from '@passe/ui/card'

interface MemoryCardData {
  id: string
  note?: string | null
  photoUrl?: string | null
  city?: string | null
  country?: string | null
}

interface Props {
  memory: MemoryCardData
}

export function MemoryCard({ memory }: Props) {
  return (
    <Card>
      {memory.photoUrl && <img src={memory.photoUrl} alt="Memory photo" />}
      <CardHeader>
        {(memory.city || memory.country) && (
          <CardDescription>
            {[memory.city, memory.country].filter(Boolean).join(', ')}
          </CardDescription>
        )}
      </CardHeader>
      {memory.note && (
        <CardContent>
          <p className="text-sm">{memory.note}</p>
        </CardContent>
      )}
    </Card>
  )
}
