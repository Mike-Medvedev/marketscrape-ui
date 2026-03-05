import { Container, Skeleton } from '@mantine/core'
import './DashboardSkeleton.css'

export function DashboardSkeleton() {
  return (
    <Container size="lg" className="dashboard-skeleton">
      <Skeleton height={42} width={160} radius="md" mb="xl" />
      <div className="dashboard-skeleton-grid">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} height={180} radius="md" />
        ))}
      </div>
    </Container>
  )
}
