import { Container, Title, Text, Button, Stack } from '@mantine/core'
import { IconAlertTriangle } from '@tabler/icons-react'
import '@/theme/components/AppError.css'

interface AppErrorProps {
  error?: unknown
  onRetry?: () => void
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'An unexpected error occurred.'
}

export function AppError({ error, onRetry }: AppErrorProps) {
  return (
    <Container size="sm" className="app-error">
      <Stack align="center" gap="md">
        <div className="app-error-icon">
          <IconAlertTriangle size={32} color="var(--destructive)" />
        </div>
        <Title order={3} className="app-error-title">Something went wrong</Title>
        <Text size="sm" c="dimmed" ta="center">
          {getErrorMessage(error)}
        </Text>
        {onRetry && (
          <Button variant="outline" color="gray" onClick={onRetry}>
            Try Again
          </Button>
        )}
      </Stack>
    </Container>
  )
}
