import { Suspense } from "react";
import { ResultsContent } from "@/features/search/components/ResultsContent";
import { ResultsSkeleton } from "@/features/search/components/ResultsSkeleton";
import { QueryErrorBoundary } from "@/theme/components/QueryErrorBoundary";

export function ResultsPage() {
  return (
    <QueryErrorBoundary>
      <Suspense fallback={<ResultsSkeleton />}>
        <ResultsContent />
      </Suspense>
    </QueryErrorBoundary>
  );
}
