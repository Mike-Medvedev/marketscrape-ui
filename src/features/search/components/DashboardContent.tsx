import { Suspense } from 'react'
import { Container } from '@mantine/core'
import { SearchesList } from '@/features/search/components/SearchesList'
import { SearchesListSkeleton } from '@/features/search/components/SearchesListSkeleton'
import { QueryErrorBoundary } from '@/theme/components/QueryErrorBoundary'
import '@/features/search/page/DashboardPage/DashboardPage.css'

export function DashboardContent() {
  return (
    <Container size="lg" className="dashboard-container">
      <QueryErrorBoundary>
        <Suspense fallback={<SearchesListSkeleton />}>
          <SearchesList />
        </Suspense>
      </QueryErrorBoundary>
    </Container>
  )
}
