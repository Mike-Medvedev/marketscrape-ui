import { Skeleton } from '@mantine/core'

export function SearchesListSkeleton() {
  return (
    <div className="dashboard-grid">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} height={180} radius="md" />
      ))}
    </div>
  )
}
