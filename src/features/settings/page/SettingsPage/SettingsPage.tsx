import { Container, Title, Text, Stack } from '@mantine/core'
import { IconSettings } from '@tabler/icons-react'
import './SettingsPage.css'

export function SettingsPage() {
  return (
    <Container size="sm" className="settings-page">
      <div className="settings-content">
        <Stack align="center" gap="md">
          <div className="settings-icon">
            <IconSettings size={40} />
          </div>
          <Title order={2} className="settings-title">
            Settings
          </Title>
          <Text size="sm" c="dimmed" ta="center">
            Settings will be available soon.
          </Text>
        </Stack>
      </div>
    </Container>
  )
}
