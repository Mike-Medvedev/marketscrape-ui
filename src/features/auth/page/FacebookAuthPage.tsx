import { useNavigate } from 'react-router'
import { Container, Button, Title, Text } from '@mantine/core'
import { IconArrowLeft, IconDeviceDesktop } from '@tabler/icons-react'
import '@/features/auth/page/FacebookAuthPage.css'

export function FacebookAuthPage() {
  const navigate = useNavigate()

  return (
    <Container size="md" className="fb-auth-container">
      <Button
        variant="subtle"
        color="gray"
        onClick={() => navigate('/')}
        leftSection={<IconArrowLeft size={16} />}
        className="fb-auth-back"
      >
        Back to Dashboard
      </Button>

      <div className="fb-auth-heading">
        <Title order={1} className="fb-auth-title">Facebook Authentication</Title>
        <Text c="dimmed">Log in to Facebook to enable automated searches</Text>
      </div>

      <div className="fb-auth-card">
        <div className="fb-auth-toolbar">
          <div className="fb-auth-toolbar-label">
            <IconDeviceDesktop size={16} />
            VNC Session
          </div>
          <div className="fb-auth-toolbar-dots">
            <div className="fb-auth-dot fb-auth-dot--active" />
            <div className="fb-auth-dot" />
            <div className="fb-auth-dot" />
          </div>
        </div>

        <div className="fb-auth-viewport">
          <div className="fb-auth-placeholder">
            <IconDeviceDesktop size={64} color="var(--muted-foreground)" />
            <Text c="dimmed" mt="md">VNC component will be integrated here</Text>
            <Text size="sm" c="dimmed" mt="xs" opacity={0.7}>
              Login session persists via Playwright in Docker container
            </Text>
          </div>
        </div>
      </div>
    </Container>
  )
}
