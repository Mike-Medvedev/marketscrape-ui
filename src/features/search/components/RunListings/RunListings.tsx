import { Loader, Text, Title } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import { ListingCard } from '@/features/search/components/ListingCard/ListingCard'
import { useSearchRunResults } from '@/features/search/hooks/search.hook'
import './RunListings.css'

interface RunListingsProps {
  searchId: string
  runId: string | null
}

export function RunListings({ searchId, runId }: RunListingsProps) {
  const { data: runResultResponse, isLoading } = useSearchRunResults(searchId, runId)
  const runResult = runResultResponse?.data

  if (!runId) {
    return (
      <div className="run-listings-empty">
        <div className="run-listings-empty-icon">
          <IconSearch size={32} color="var(--muted-foreground)" />
        </div>
        <Title order={3} className="run-listings-empty-title">
          Select a run
        </Title>
        <Text size="sm" c="dimmed">
          Choose a search run from the list to view its results
        </Text>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="run-listings-loading">
        <Loader size={32} color="yellow" />
        <Text size="sm" c="dimmed" mt="md">
          Loading listings...
        </Text>
      </div>
    )
  }

  const listings = runResult?.listings ?? []

  if (listings.length === 0) {
    return (
      <div className="run-listings-empty">
        <div className="run-listings-empty-icon">
          <IconSearch size={32} color="var(--muted-foreground)" />
        </div>
        <Title order={3} className="run-listings-empty-title">
          No listings
        </Title>
        <Text size="sm" c="dimmed">
          This run didn't return any listings
        </Text>
      </div>
    )
  }

  return (
    <div className="run-listings">
      <Text size="sm" c="dimmed" className="run-listings-count">
        {listings.length} listing{listings.length !== 1 ? 's' : ''}
      </Text>
      <div className="run-listings-grid">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  )
}
