import { useState, useCallback } from 'react'
import { Text } from '@mantine/core'
import { IconArrowUp, IconX, IconLink } from '@tabler/icons-react'
import './SyncOnboarding.css'

const STORAGE_KEY = 'marketscrape:onboarding:sync-dismissed'

interface SyncOnboardingProps {
  onSyncClick: () => void
}

export function SyncOnboarding({ onSyncClick }: SyncOnboardingProps) {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(STORAGE_KEY) === 'true',
  )

  const handleDismiss = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setDismissed(true)
  }, [])

  const handleSync = useCallback(() => {
    onSyncClick()
    handleDismiss()
  }, [onSyncClick, handleDismiss])

  if (dismissed) return null

  return (
    <div className="sync-onboarding">
      <div className="sync-onboarding-arrow">
        <IconArrowUp size={20} />
      </div>
      <div className="sync-onboarding-content">
        <div className="sync-onboarding-icon">
          <IconLink size={20} />
        </div>
        <div className="sync-onboarding-text">
          <Text fw={600} size="sm" className="sync-onboarding-title">
            Connect your Marketplace session
          </Text>
          <Text size="xs" c="dimmed">
            Before running searches, sync your Facebook Marketplace session.
            Click the status pill above or{' '}
            <button
              type="button"
              className="sync-onboarding-link"
              onClick={handleSync}
            >
              sync now
            </button>
            .
          </Text>
        </div>
        <button
          type="button"
          className="sync-onboarding-close"
          onClick={handleDismiss}
          aria-label="Dismiss"
        >
          <IconX size={16} />
        </button>
      </div>
    </div>
  )
}
