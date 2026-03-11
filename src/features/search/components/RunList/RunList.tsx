import { IconCalendarEvent, IconStack2 } from '@tabler/icons-react'
import type { GetSearchRunsResponse } from '@/generated/types.gen'
import { relativeTime } from '@/utils/date.utils'
import './RunList.css'

type SearchRun = GetSearchRunsResponse['data'][number]

interface RunListProps {
  runs: SearchRun[]
  selectedRunId: string | null
  onSelect: (runId: string) => void
}

function formatRunDate(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function RunList({ runs, selectedRunId, onSelect }: RunListProps) {
  if (runs.length === 0) {
    return (
      <div className="run-list-empty">
        <IconStack2 size={24} color="var(--muted-foreground)" />
        <p className="run-list-empty-text">No runs yet</p>
      </div>
    )
  }

  return (
    <div className="run-list">
      <p className="run-list-heading">Search Runs</p>
      <div className="run-list-items">
        {runs.map((run) => (
          <button
            key={run.id}
            className={`run-list-item${selectedRunId === run.id ? ' run-list-item--active' : ''}`}
            onClick={() => onSelect(run.id)}
          >
            <div className="run-list-item-date">
              <IconCalendarEvent size={14} />
              <span>{formatRunDate(run.executedAt)}</span>
            </div>
            <div className="run-list-item-meta">
              <span className="run-list-item-count">
                {run.listingCount} listing{run.listingCount !== 1 ? 's' : ''}
              </span>
              <span className="run-list-item-relative">
                {relativeTime(run.executedAt)}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
