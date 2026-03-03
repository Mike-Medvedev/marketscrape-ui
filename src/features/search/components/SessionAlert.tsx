import { IconAlertTriangle } from '@tabler/icons-react'
import { Button } from '@mantine/core'
import '@/features/search/components/SessionAlert.css'

interface SessionAlertProps {
  onQuickSync: () => void
  onClose: () => void
}

export function SessionAlert({ onQuickSync, onClose }: SessionAlertProps) {
  return (
    <div className="session-alert">
      <div className="session-alert-content">
        <IconAlertTriangle size={20} className="session-alert-icon" />
        <div>
          <p className="session-alert-title">Your Facebook session has expired</p>
          <p className="session-alert-desc">Click to refresh your identity clone</p>
        </div>
      </div>
      <div className="session-alert-actions">
        <Button onClick={onQuickSync} color="amber">
          Quick Sync
        </Button>
        <Button onClick={onClose} variant="outline" color="gray">
          Close
        </Button>
      </div>
    </div>
  )
}
