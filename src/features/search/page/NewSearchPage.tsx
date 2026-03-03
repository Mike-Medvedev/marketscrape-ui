import { useParams } from 'react-router'
import { Container, Skeleton } from '@mantine/core'
import { useSearch } from '@/features/search/hooks/search.hook'
import { SearchForm } from '@/features/search/components/SearchForm'
import { AppError } from '@/theme/components/AppError'
import './NewSearchPage.css'

export function NewSearchPage() {
  const { id } = useParams()
  const isEditing = !!id

  const { data: existingSearch, isLoading, isError, error } = useSearch(id)

  if (isEditing && isLoading) {
    return (
      <Container size="sm" className="new-search-container">
        <Skeleton height={32} width={300} mb="lg" />
        <Skeleton height={28} width={200} mb="xl" />
        <Skeleton height={400} radius="md" />
      </Container>
    )
  }

  if (isEditing && isError) {
    return <AppError error={error} />
  }

  return <SearchForm existingSearch={existingSearch} />
}
