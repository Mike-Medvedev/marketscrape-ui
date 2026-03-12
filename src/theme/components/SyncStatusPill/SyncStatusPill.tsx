import { Tooltip } from '@mantine/core'
import type { SessionValidity } from '@/features/search/search.types'
import './SyncStatusPill.css'

interface SyncStatusPillProps {
  status: SessionValidity
  isFetching: boolean
  onRecheck: () => void
  onSyncRequest: () => void
}

const config = {
  valid: {
    label: 'Session Active',
    dotClass: 'sync-pill-dot--valid',
    tooltip: 'Facebook session is active — click to recheck',
  },
  invalid: {
    label: 'Sync Required',
    dotClass: 'sync-pill-dot--invalid',
    tooltip: 'Session expired — click to sync',
  },
  unknown: {
    label: 'Checking...',
    dotClass: 'sync-pill-dot--unknown',
    tooltip: 'Checking session status',
  },
} as const

export function SyncStatusPill({ status, isFetching, onRecheck, onSyncRequest }: SyncStatusPillProps) {
  const displayStatus = isFetching ? 'unknown' : status
  const { label, dotClass, tooltip } = config[displayStatus]

  const handleClick = () => {
    if (isFetching) return
    if (status === 'invalid') {
      onSyncRequest()
    } else {
      onRecheck()
    }
  }

  return (
    <Tooltip label={tooltip} withArrow>
      <button
        type="button"
        className={`sync-pill ${isFetching ? 'sync-pill--fetching' : ''} ${status === 'invalid' && !isFetching ? 'sync-pill--invalid' : ''}`}
        disabled={isFetching}
        onClick={handleClick}
      >
        <div className={`sync-pill-dot ${dotClass}`} />
        <span className="sync-pill-label">{isFetching ? 'Checking...' : label}</span>
      </button>
    </Tooltip>
  )
}
