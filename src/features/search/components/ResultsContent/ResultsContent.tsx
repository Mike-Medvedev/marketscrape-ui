import { useState, useEffect, useRef } from 'react'
import { useParams, useSearchParams } from 'react-router'
import { Container, Loader, Text, Title } from '@mantine/core'
import { IconPlayerPlay, IconSearch } from '@tabler/icons-react'
import { RunList } from '@/features/search/components/RunList/RunList'
import { RunListings } from '@/features/search/components/RunListings/RunListings'
import { ExecutionProgress } from '@/features/search/components/ExecutionProgress/ExecutionProgress'
import {
  useSearch,
  useSearchRuns,
} from '@/features/search/hooks/search.hook'
import { useSearchExecution } from '@/features/search/hooks/execution.hook'
import './ResultsContent.css'

export function ResultsContent() {
  const { id } = useParams<{ id: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: searchResponse } = useSearch(id!)
  const search = searchResponse.data
  const { data: runsResponse } = useSearchRuns(id!)
  const runs = runsResponse.data
  const execution = useSearchExecution(id!)

  const [selectedRunId, setSelectedRunId] = useState<string | null>(null)
  const autoExecutedRef = useRef(false)

  const shouldAutoExecute = searchParams.get('autoExecute') === 'true'

  useEffect(() => {
    if (
      shouldAutoExecute &&
      !autoExecutedRef.current &&
      runs.length === 0 &&
      !execution.isExecuting
    ) {
      autoExecutedRef.current = true
      setSearchParams({}, { replace: true })
      execution.execute()
    }
  }, [shouldAutoExecute, runs.length, execution, setSearchParams])

  const hasRuns = runs.length > 0

  const preferredRunId = execution.completedRunId ?? selectedRunId
  const currentSelectedRunId =
    preferredRunId && runs.some((run) => run.id === preferredRunId)
      ? preferredRunId
      : runs[0]?.id ?? null

  const handleExecute = () => {
    if (execution.isExecuting) return
    execution.execute()
  }

  const isPending = execution.isExecuting

  return (
    <Container size="xl" className="results-container">
      <div className={`results-header${hasRuns || execution.isExecuting ? '' : ' results-header--empty'}`}>
        <div className="results-header-info">
          <Title order={2} className="results-title">
            {search.query}
          </Title>
          <Text size="sm" className="results-subtitle">
            {search.location}
            {(search.minPrice != null || search.maxPrice != null) && (
              <>
                {' \u2022 '}
                {search.minPrice != null ? `$${search.minPrice}` : 'Any'}
                {' - '}
                {search.maxPrice != null ? `$${search.maxPrice}` : 'Any'}
              </>
            )}
          </Text>
        </div>

        <button
          className="results-execute-button"
          onClick={handleExecute}
          disabled={isPending}
        >
          {isPending ? (
            <Loader size={16} color="dark" />
          ) : (
            <IconPlayerPlay size={16} />
          )}
          <span>
            {isPending ? 'Searching...' : 'Execute Search'}
          </span>
        </button>
      </div>

      {execution.executionState !== 'idle' && (
        <ExecutionProgress
          executionState={execution.executionState}
          statusMessage={execution.statusMessage}
          listingCount={execution.listingCount}
        />
      )}

      {hasRuns ? (
        <div className="results-body">
          <aside className="results-sidebar">
            <RunList
              runs={runs}
              selectedRunId={currentSelectedRunId}
              onSelect={setSelectedRunId}
            />
          </aside>
          <main className="results-main">
            <RunListings searchId={id!} runId={currentSelectedRunId} />
          </main>
        </div>
      ) : !execution.isExecuting ? (
        <div className="results-empty">
          <div className="results-empty-icon">
            <IconSearch size={32} color="var(--muted-foreground)" />
          </div>
          <Title order={3} className="results-empty-title">
            No runs yet
          </Title>
          <Text size="sm" c="dimmed" className="results-empty-text">
            Hit the button above to run your first search
          </Text>
        </div>
      ) : null}
    </Container>
  )
}
