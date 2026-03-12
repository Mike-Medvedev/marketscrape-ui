import { Tooltip } from '@mantine/core'
import './SyncStatusPill.css'

interface SyncStatusPillProps {
  status: 'healthy' | 'attention'
  disabled?: boolean
  onClick: () => void
}

const config = {
  healthy: {
    label: 'Sync Healthy',
    dotClass: 'sync-pill-dot--healthy',
    tooltip: 'Session is synced',
  },
  attention: {
    label: 'Action Required',
    dotClass: 'sync-pill-dot--attention',
    tooltip: 'Click to sync your session',
  },
} as const

export function SyncStatusPill({ status, disabled, onClick }: SyncStatusPillProps) {
  const { label, dotClass, tooltip } = config[status]

  return (
    <Tooltip label={tooltip} withArrow>
      <button
        type="button"
        className="sync-pill"
        disabled={disabled}
        onClick={onClick}
      >
        <div className={`sync-pill-dot ${dotClass}`} />
        <span className="sync-pill-label">{label}</span>
      </button>
    </Tooltip>
  )
}
