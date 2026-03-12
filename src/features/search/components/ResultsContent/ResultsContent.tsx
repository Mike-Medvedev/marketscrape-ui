import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { Container, Loader, Text, Title } from '@mantine/core'
import { IconPlayerPlay, IconSearch } from '@tabler/icons-react'
import { BackButton } from '@/theme/components/BackButton/BackButton'
import { RunList } from '@/features/search/components/RunList/RunList'
import { RunListings } from '@/features/search/components/RunListings/RunListings'
import {
  useSearch,
  useSearchRuns,
  useExecuteSearch,
} from '@/features/search/hooks/search.hook'
import './ResultsContent.css'

export function ResultsContent() {
  const { id } = useParams<{ id: string }>()
  const { data: searchResponse, isLoading: searchLoading } = useSearch(id)
  const search = searchResponse?.data

  if (searchLoading || !search || !id) return null

  return <ResultsContentInner searchId={id} />
}

interface ResultsContentInnerProps {
  searchId: string
}

function ResultsContentInner({ searchId }: ResultsContentInnerProps) {
  const { data: searchResponse } = useSearch(searchId)
  const search = searchResponse!.data
  const { data: runsResponse } = useSearchRuns(searchId)
  const runs = runsResponse.data
  const executeMutation = useExecuteSearch(searchId)

  const [selectedRunId, setSelectedRunId] = useState<string | null>(null)

  useEffect(() => {
    if (runs.length > 0 && !selectedRunId) {
      setSelectedRunId(runs[0].id)
    }
  }, [runs, selectedRunId])

  const handleExecute = () => {
    executeMutation.mutate({
      body: {
        query: search.query,
        location: search.location,
        ...(search.minPrice != null && search.minPrice > 0 && { minPrice: search.minPrice }),
        ...(search.listingsPerCheck > 0 && {
          pageCount: search.listingsPerCheck,
        }),
      },
    })
  }

  return (
    <Container size="xl" className="results-container">
      <div className="results-header">
        <BackButton />

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
          disabled={executeMutation.isPending}
        >
          {executeMutation.isPending ? (
            <Loader size={16} color="dark" />
          ) : (
            <IconPlayerPlay size={16} />
          )}
          <span>
            {executeMutation.isPending ? 'Searching...' : 'Execute Search'}
          </span>
        </button>
      </div>

      {runs.length === 0 && !executeMutation.isPending ? (
        <div className="results-empty">
          <div className="results-empty-icon">
            <IconSearch size={32} color="var(--muted-foreground)" />
          </div>
          <Title order={3} className="results-empty-title">
            No runs yet
          </Title>
          <Text size="sm" c="dimmed" className="results-empty-text">
            Execute a search manually or wait for the next scheduled run
          </Text>
          <button className="results-execute-button" onClick={handleExecute}>
            <IconPlayerPlay size={16} />
            <span>Execute Search</span>
          </button>
        </div>
      ) : (
        <div className="results-body">
          <aside className="results-sidebar">
            <RunList
              runs={runs}
              selectedRunId={selectedRunId}
              onSelect={setSelectedRunId}
            />
          </aside>
          <main className="results-main">
            <RunListings searchId={searchId} runId={selectedRunId} />
          </main>
        </div>
      )}
    </Container>
  )
}
