import { Suspense, useState } from 'react'
import { useNavigate } from 'react-router'
import { Container, Text, Title } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import { SearchCard } from '../components/SearchCard'
import { SessionAlert } from '../components/SessionAlert'
import { IdentityAbsorber } from '../components/IdentityAbsorber'
import { NewSearchButton } from '../components/NewSearchButton'
import { DashboardSkeleton } from '../components/DashboardSkeleton'
import { QueryErrorBoundary } from '../../../theme/components/QueryErrorBoundary'
import { useSearches, useDeleteSearch } from '../hooks/search.hook'
import './DashboardPage.css'

export function DashboardPage() {
  return (
    <QueryErrorBoundary>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </QueryErrorBoundary>
  )
}

function DashboardContent() {
  const navigate = useNavigate()
  const { data: searches } = useSearches()
  const deleteMutation = useDeleteSearch()
  const [showIdentityModal, setShowIdentityModal] = useState(false)

  const hasExpiredSession = searches.some((s) => s.status === 'refresh')

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  const handleEdit = (id: string) => {
    navigate(`/edit/${id}`)
  }

  const handleQuickSync = () => {
    setShowIdentityModal(true)
  }

  return (
    <Container size="lg" className="dashboard-container">
      <div className="dashboard-header">
        <NewSearchButton onClick={() => navigate('/new')}>
          New Search
        </NewSearchButton>
      </div>

      {hasExpiredSession && (
        <div className="dashboard-alert">
          <SessionAlert onQuickSync={handleQuickSync} onClose={() => {}} />
        </div>
      )}

      <IdentityAbsorber
        isOpen={showIdentityModal}
        onClose={() => setShowIdentityModal(false)}
      />

      {searches.length > 0 ? (
        <div className="dashboard-grid">
          {searches.map((search) => (
            <SearchCard
              key={search.id}
              search={search}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      ) : (
        <div className="dashboard-empty">
          <div className="dashboard-empty-icon">
            <IconSearch size={32} color="var(--muted-foreground)" />
          </div>
          <Title order={3} className="dashboard-empty-title">No active searches</Title>
          <Text size="sm" c="dimmed" className="dashboard-empty-text">
            Create your first search to start monitoring
          </Text>
          <NewSearchButton onClick={() => navigate('/new')} size="large">
            Create Search
          </NewSearchButton>
        </div>
      )}
    </Container>
  )
}
