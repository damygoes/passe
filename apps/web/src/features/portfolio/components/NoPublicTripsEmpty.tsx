import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@passe/ui/empty'

interface Props {
  displayName: string
}

export function NoPublicTripsEmpty({ displayName }: Props) {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyTitle>Nothing to see here yet</EmptyTitle>
        <EmptyDescription>{displayName} hasn&apos;t shared any public trips yet.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
