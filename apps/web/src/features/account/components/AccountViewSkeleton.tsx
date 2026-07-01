export function AccountViewSkeleton() {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 md:px-6 animate-pulse">
      <div className="h-8 w-48 rounded-lg bg-muted" />
      <div className="mt-6 h-px bg-border" />
      <div className="flex flex-col md:flex-row gap-8 mt-6">
        <div className="flex flex-row md:flex-col gap-1 md:w-52">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 rounded-lg bg-muted flex-1 md:flex-none" />
          ))}
        </div>
        <div className="flex-1 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    </div>
  )
}
