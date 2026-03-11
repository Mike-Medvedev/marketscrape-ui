import { Suspense } from 'react'
import { useNavigate } from 'react-router'
import { Container } from '@mantine/core'
import { NewSearchButton } from '@/features/search/components/NewSearchButton/NewSearchButton'
import { SearchesList } from '@/features/search/components/SearchesList'
import { SearchesListSkeleton } from '@/features/search/components/SearchesListSkeleton'
import { QueryErrorBoundary } from '@/theme/components/QueryErrorBoundary'
import '@/features/search/page/DashboardPage/DashboardPage.css'

export function DashboardContent() {
  const navigate = useNavigate()

  return (
    <Container size="lg" className="dashboard-container">
      <div className="dashboard-header">
        <NewSearchButton onClick={() => navigate('/new')}>
          New Search
        </NewSearchButton>
      </div>

      <QueryErrorBoundary>
        <Suspense fallback={<SearchesListSkeleton />}>
          <SearchesList />
        </Suspense>
      </QueryErrorBoundary>
    </Container>
  )
}
