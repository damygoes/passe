import { Card, CardContent, CardFooter, CardHeader, Skeleton } from '@passe/ui'

export function TripCardSkeleton() {
  return (
    <Card>
      <Skeleton className="aspect-video w-full" />
      <CardHeader>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="mt-1 h-3 w-1/2" />
      </CardHeader>
      <CardContent>
        <div className="flex gap-1">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-7 w-16" />
      </CardFooter>
    </Card>
  )
}
