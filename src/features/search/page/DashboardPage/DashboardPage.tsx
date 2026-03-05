import { Suspense } from 'react'
import { DashboardContent } from '@/features/search/components/DashboardContent'
import { DashboardSkeleton } from '@/features/search/components/DashboardSkeleton/DashboardSkeleton'
import { QueryErrorBoundary } from '@/theme/components/QueryErrorBoundary'

export function DashboardPage() {
  return (
    <QueryErrorBoundary>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </QueryErrorBoundary>
  )
}
