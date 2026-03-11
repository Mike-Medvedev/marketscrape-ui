import { useNavigate } from 'react-router'
import { Container, Title, Text, Button, Stack } from '@mantine/core'
import { IconError404 } from '@tabler/icons-react'
import './NotFoundPage.css'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <Container size="sm" className="not-found-page">
      <Stack align="center" gap="md">
        <div className="not-found-icon">
          <IconError404 size={64} />
        </div>
        <Title order={2} className="not-found-title">
          Page not found
        </Title>
        <Text size="sm" c="dimmed" ta="center" className="not-found-text">
          The page you're looking for doesn't exist or has been moved.
        </Text>
        <Button
          variant="outline"
          color="yellow"
          onClick={() => navigate('/')}
          className="not-found-button"
        >
          Back to home
        </Button>
      </Stack>
    </Container>
  )
}
