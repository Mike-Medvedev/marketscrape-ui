import { Loader, Text } from '@mantine/core'
import { IconCheck, IconX, IconRadar } from '@tabler/icons-react'
import type { ExecutionState } from '@/features/search/search.types'
import './ExecutionProgress.css'

interface ExecutionProgressProps {
  executionState: ExecutionState
  statusMessage: string | null
  listingCount: number | null
}

export function ExecutionProgress({
  executionState,
  statusMessage,
  listingCount,
}: ExecutionProgressProps) {
  if (executionState === 'idle') return null

  return (
    <div className={`execution-progress execution-progress--${executionState}`}>
      <div className="execution-progress-indicator">
        {executionState === 'executing' && (
          <div className="execution-progress-pulse">
            <Loader size={28} color="var(--primary)" type="dots" />
          </div>
        )}
        {executionState === 'completed' && (
          <div className="execution-progress-icon execution-progress-icon--success">
            <IconCheck size={24} />
          </div>
        )}
        {executionState === 'failed' && (
          <div className="execution-progress-icon execution-progress-icon--error">
            <IconX size={24} />
          </div>
        )}
      </div>

      <div className="execution-progress-content">
        <div className="execution-progress-header">
          {executionState === 'executing' && (
            <div className="execution-progress-radar">
              <IconRadar size={18} className="execution-progress-radar-icon" />
              <Text fw={600} size="sm" className="execution-progress-title">
                Searching Marketplace
              </Text>
            </div>
          )}
          {executionState === 'completed' && (
            <Text fw={600} size="sm" className="execution-progress-title">
              Search Complete
            </Text>
          )}
          {executionState === 'failed' && (
            <Text fw={600} size="sm" className="execution-progress-title">
              Search Failed
            </Text>
          )}
        </div>

        <Text size="sm" c="dimmed" className="execution-progress-message">
          {statusMessage}
        </Text>

        {executionState === 'completed' && listingCount != null && (
          <div className="execution-progress-count">
            <Text size="xs" fw={600} className="execution-progress-count-text">
              {listingCount} listing{listingCount !== 1 ? 's' : ''} found
            </Text>
          </div>
        )}
      </div>

      {executionState === 'executing' && (
        <div className="execution-progress-bar-track">
          <div className="execution-progress-bar" />
        </div>
      )}
    </div>
  )
}
