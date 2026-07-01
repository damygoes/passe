import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@passe/ui/empty'

export function NoPublicMemoriesEmpty() {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyTitle>No memories shared yet</EmptyTitle>
        <EmptyDescription>The owner hasn&apos;t made any memories public for this trip.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
