import { Suspense } from 'react'
import { DashboardContent } from '../components/DashboardContent'
import { DashboardSkeleton } from '../components/DashboardSkeleton'
import { QueryErrorBoundary } from '../../../theme/components/QueryErrorBoundary'

export function DashboardPage() {
  return (
    <QueryErrorBoundary>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </QueryErrorBoundary>
  )
}
