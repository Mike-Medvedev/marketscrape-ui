import { Tooltip } from '@mantine/core'
import type { SessionValidity } from '@/features/search/search.types'
import './SyncStatusPill.css'

interface SyncStatusPillProps {
  status: SessionValidity
  isFetching: boolean
  onClick: () => void
  onHover: () => void
}

const config = {
  valid: {
    label: 'Session Valid',
    dotClass: 'sync-pill-dot--valid',
    tooltip: 'Facebook session is active',
  },
  invalid: {
    label: 'Session Invalid',
    dotClass: 'sync-pill-dot--invalid',
    tooltip: 'Facebook session expired or missing',
  },
  unknown: {
    label: 'Checking...',
    dotClass: 'sync-pill-dot--unknown',
    tooltip: 'Checking session status',
  },
} as const

export function SyncStatusPill({ status, isFetching, onClick, onHover }: SyncStatusPillProps) {
  const displayStatus = isFetching ? 'unknown' : status
  const { label, dotClass, tooltip } = config[displayStatus]

  return (
    <Tooltip label={tooltip} withArrow>
      <button
        type="button"
        className={`sync-pill ${isFetching ? 'sync-pill--fetching' : ''}`}
        disabled={isFetching}
        onClick={onClick}
        onMouseEnter={onHover}
      >
        <div className={`sync-pill-dot ${dotClass}`} />
        <span className="sync-pill-label">{isFetching ? 'Checking...' : label}</span>
      </button>
    </Tooltip>
  )
}
