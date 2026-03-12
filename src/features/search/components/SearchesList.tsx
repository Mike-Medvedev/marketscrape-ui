import { useNavigate } from 'react-router'
import { Button, Text, Title } from '@mantine/core'
import { IconSearch, IconRefresh } from '@tabler/icons-react'
import { SearchCard } from '@/features/search/components/SearchCard/SearchCard'
import { NewSearchButton } from '@/features/search/components/NewSearchButton/NewSearchButton'
import { useSearches, useDeleteSearch } from '@/features/search/hooks/search.hook'
import { requestIdentitySync } from '@/utils/identity-sync.utils'

export function SearchesList() {
  const navigate = useNavigate()
  const { data: response } = useSearches()
  const searches = response.data
  const deleteMutation = useDeleteSearch()

  const handleDelete = (id: string) => {
    deleteMutation.mutate({ path: { id } })
  }

  const handleEdit = (id: string) => {
    navigate(`/edit/${id}`)
  }

  const handleViewResults = (id: string) => {
    navigate(`/results/${id}`)
  }

  return (
    <>
      {searches.length > 0 ? (
        <>
          <div className="dashboard-header">
            <Button
              variant="outline"
              color="gray"
              leftSection={<IconRefresh size={16} />}
              onClick={requestIdentitySync}
              className="dashboard-sync-btn"
            >
              Sync Session
            </Button>
            <NewSearchButton onClick={() => navigate('/new')}>
              New Search
            </NewSearchButton>
          </div>
          <div className="dashboard-grid">
            {searches.map((search) => (
              <SearchCard
                key={search.id}
                search={search}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onViewResults={handleViewResults}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="dashboard-empty">
          <div className="dashboard-empty-icon">
            <IconSearch size={32} color="var(--muted-foreground)" />
          </div>
          <Title order={3} className="dashboard-empty-title">
            No active searches
          </Title>
          <Text size="sm" c="dimmed" className="dashboard-empty-text">
            Create your first search to start monitoring
          </Text>
          <div className="dashboard-empty-actions">
            <NewSearchButton onClick={() => navigate('/new')} size="large">
              Create Search
            </NewSearchButton>
            <Button
              variant="outline"
              color="gray"
              size="lg"
              leftSection={<IconRefresh size={20} />}
              onClick={requestIdentitySync}
              className="dashboard-sync-btn"
            >
              Sync Session
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
