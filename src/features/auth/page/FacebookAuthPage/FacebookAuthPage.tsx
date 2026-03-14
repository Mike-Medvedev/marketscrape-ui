import { Container, Title, Text } from '@mantine/core'
import { IconDeviceDesktop } from '@tabler/icons-react'
import './FacebookAuthPage.css'

export function FacebookAuthPage() {
  return (
    <Container size="md" className="fb-auth-container">
      <div className="fb-auth-heading">
        <Title order={1} className="fb-auth-title">Marketplace Authentication</Title>
        <Text c="dimmed">Log in to your marketplace account to enable automated searches</Text>
      </div>

      <div className="fb-auth-card">
        <div className="fb-auth-toolbar">
          <div className="fb-auth-toolbar-label">
            <IconDeviceDesktop size={16} />
            Remote Browser
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
            <Text c="dimmed" mt="md">Remote browser will be integrated here</Text>
            <Text size="sm" c="dimmed" mt="xs" opacity={0.7}>
              Login session persists via Browserless
            </Text>
          </div>
        </div>
      </div>
    </Container>
  )
}
