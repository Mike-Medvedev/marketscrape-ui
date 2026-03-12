import {
  IconClock,
  IconTrash,
  IconPencil,
  IconListSearch,
  IconCalendarEvent,
  IconCalendarOff,
} from "@tabler/icons-react";
import { ActionIcon, Loader, Tooltip } from "@mantine/core";
import type { ActiveSearch } from "@/features/search/search.types";
import { relativeTime } from "@/utils/date.utils";
import './SearchCard.css'

interface SearchCardProps {
  search: ActiveSearch;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onViewResults: (id: string) => void;
  isDeleting?: boolean;
}

const FREQUENCY_LABELS: Record<ActiveSearch["frequency"], string> = {
  every_1h: "Every hour",
  every_2h: "Every 2 hours",
  every_6h: "Every 6 hours",
  every_12h: "Every 12 hours",
  every_24h: "Every 24 hours",
};

export function SearchCard({ search, onDelete, onEdit, onViewResults, isDeleting }: SearchCardProps) {
  const dateLabel =
    search.dateListed === "24h"
      ? "Last 24h"
      : search.dateListed === "7d"
        ? "Last 7 days"
        : "Last 30 days";

  return (
    <div className="search-card">
      <div className="search-card-header">
        <div className="search-card-info">
          <h3 className="search-card-title">{search.query}</h3>
          <p className="search-card-subtitle">
            {search.location}
            {(search.minPrice != null || search.maxPrice != null) && (
              <>
                {" \u2022 "}
                {search.minPrice != null
                  ? `$${search.minPrice}`
                  : "Any"}
                {" - "}
                {search.maxPrice != null
                  ? `$${search.maxPrice}`
                  : "Any"}
              </>
            )}
          </p>
        </div>
        <div className="search-card-actions">
          <Tooltip label="View listings" withArrow>
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={() => onViewResults(search.id)}
              className="action-icon-results"
            >
              <IconListSearch size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Edit search" withArrow>
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={() => onEdit(search.id)}
              className="action-icon-edit"
            >
              <IconPencil size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete search" withArrow>
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={() => onDelete(search.id)}
              className="action-icon-delete"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader size={14} color="gray" /> : <IconTrash size={16} />}
            </ActionIcon>
          </Tooltip>
        </div>
      </div>

      <div className="search-card-details">
        <div className="search-card-detail">
          <p className="detail-label">Frequency</p>
          <p className="detail-value">{FREQUENCY_LABELS[search.frequency]}</p>
        </div>
        <div className="search-card-detail">
          <p className="detail-label">Listings</p>
          <p className="detail-value">
            {search.listingsPerCheck} per check
          </p>
        </div>
        <div className="search-card-detail">
          <p className="detail-label">Listed</p>
          <p className="detail-value">{dateLabel}</p>
        </div>
        <div className="search-card-detail">
          <p className="detail-label">Notification</p>
          <p className="detail-value detail-value--capitalize">
            {search.notificationType}
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
