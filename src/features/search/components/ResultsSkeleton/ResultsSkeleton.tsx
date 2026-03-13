import { Container, Skeleton } from '@mantine/core'
import './ResultsSkeleton.css'

export function ResultsSkeleton() {
  return (
    <Container size="xl" className="results-skeleton-container">
      <div className="results-skeleton-header">
        <div className="results-skeleton-header-info">
          <Skeleton height={32} width={260} radius="sm" />
          <Skeleton height={14} width={180} radius="sm" />
        </div>
        <Skeleton height={40} width={160} radius="md" />
      </div>

      <div className="results-skeleton-body">
        <aside className="results-skeleton-sidebar">
          <Skeleton height={14} width={90} mb="md" radius="sm" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height={52} mb="xs" radius="md" />
          ))}
        </aside>

        <div className="results-skeleton-main">
          <Skeleton height={14} width={100} mb="lg" radius="sm" />
          <div className="results-skeleton-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="results-skeleton-card">
                <Skeleton height={0} className="results-skeleton-image" />
                <div className="results-skeleton-card-body">
                  <Skeleton height={18} width="50%" radius="sm" />
                  <Skeleton height={14} width="80%" radius="sm" />
                  <Skeleton height={12} width="60%" radius="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  )
}
