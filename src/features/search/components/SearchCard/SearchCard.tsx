import {
  IconClock,
  IconTrash,
  IconAlertCircle,
  IconCircleCheck,
  IconRefresh,
  IconPencil,
  IconListSearch,
  IconCalendarEvent,
  IconCalendarOff,
} from "@tabler/icons-react";
import { ActionIcon } from "@mantine/core";
import type { ActiveSearch } from "@/features/search/search.types";
import { relativeTime } from "@/utils/date.utils";
import './SearchCard.css'

interface SearchCardProps {
  search: ActiveSearch;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onViewResults: (id: string) => void;
}

const FREQUENCY_LABELS: Record<ActiveSearch["settings"]["frequency"], string> = {
  every_1h: "Every hour",
  every_2h: "Every 2 hours",
  every_6h: "Every 6 hours",
  every_12h: "Every 12 hours",
  every_24h: "Every 24 hours",
};

const attentionConfig = {
  icon: IconRefresh,
  label: "Action Required",
  dotClass: "status-dot--refresh",
} as const;

const statusConfig: Record<ActiveSearch["status"], { icon: typeof IconCircleCheck; label: string; dotClass: string }> = {
  running: {
    icon: IconCircleCheck,
    label: "Sync Healthy",
    dotClass: "status-dot--running",
  },
  needs_attention: attentionConfig,
  refresh: attentionConfig,
  error: {
    icon: IconAlertCircle,
    label: "Error",
    dotClass: "status-dot--error",
  },
};

export function SearchCard({ search, onDelete, onEdit, onViewResults }: SearchCardProps) {
  const config = statusConfig[search.status];

  const dateLabel =
    search.criteria.dateListed === "24h"
      ? "Last 24h"
      : search.criteria.dateListed === "7d"
        ? "Last 7 days"
        : "Last 30 days";

  return (
    <div className="search-card">
      <div className="search-card-header">
        <div className="search-card-info">
          <h3 className="search-card-title">{search.criteria.query}</h3>
          <p className="search-card-subtitle">
            {search.criteria.location}
            {(search.criteria.minPrice || search.criteria.maxPrice) && (
              <>
                {" \u2022 "}
                {search.criteria.minPrice
                  ? `$${search.criteria.minPrice}`
                  : "Any"}
                {" - "}
                {search.criteria.maxPrice
                  ? `$${search.criteria.maxPrice}`
                  : "Any"}
              </>
            )}
          </p>
        </div>
        <div className="search-card-actions">
          <div className="search-card-status">
            <div className={`status-dot ${config.dotClass}`} />
            <span className="status-label">{config.label}</span>
          </div>
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={() => onViewResults(search.id)}
            className="action-icon-results"
          >
            <IconListSearch size={16} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={() => onEdit(search.id)}
            className="action-icon-edit"
          >
            <IconPencil size={16} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={() => onDelete(search.id)}
            className="action-icon-delete"
          >
            <IconTrash size={16} />
          </ActionIcon>
        </div>
      </div>

      <div className="search-card-details">
        <div className="search-card-detail">
          <p className="detail-label">Frequency</p>
          <p className="detail-value">{FREQUENCY_LABELS[search.settings.frequency]}</p>
        </div>
        <div className="search-card-detail">
          <p className="detail-label">Listings</p>
          <p className="detail-value">
            {search.settings.listingsPerCheck} per check
          </p>
        </div>
        <div className="search-card-detail">
          <p className="detail-label">Listed</p>
          <p className="detail-value">{dateLabel}</p>
        </div>
        <div className="search-card-detail">
          <p className="detail-label">Notification</p>
          <p className="detail-value detail-value--capitalize">
            {search.settings.notificationType}
          </p>
        </div>
      </div>

      <div className="search-card-schedule">
        {search.isScheduled ? (
          <div className="schedule-active">
            <div className="schedule-badge schedule-badge--active">
              <IconCalendarEvent size={14} />
              <span>Scheduled</span>
            </div>
            {search.nextRunAt && (
              <span className="schedule-next-run">
                Next run {relativeTime(search.nextRunAt)}
              </span>
            )}
          </div>
        ) : (
          <div className="schedule-inactive">
            <div className="schedule-badge schedule-badge--inactive">
              <IconCalendarOff size={14} />
              <span>Not scheduled</span>
            </div>
            <button
              type="button"
              className="schedule-edit-link"
              onClick={() => onEdit(search.id)}
            >
              Edit to re-schedule
            </button>
          </div>
        )}

        {search.lastRun && (
          <div className="schedule-last-run">
            <IconClock size={12} />
            <span>Last ran {relativeTime(search.lastRun)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
