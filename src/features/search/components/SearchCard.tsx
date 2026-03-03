import {
  IconClock,
  IconTrash,
  IconAlertCircle,
  IconCircleCheck,
  IconRefresh,
  IconPencil,
} from "@tabler/icons-react";
import { ActionIcon } from "@mantine/core";
import type { ActiveSearch } from "@/generated/types.gen";
import '@/features/search/components/SearchCard.css'

interface SearchCardProps {
  search: ActiveSearch;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const statusConfig = {
  running: {
    icon: IconCircleCheck,
    label: "Sync Healthy",
    dotClass: "status-dot--running",
  },
  refresh: {
    icon: IconRefresh,
    label: "Action Required",
    dotClass: "status-dot--refresh",
  },
  error: {
    icon: IconAlertCircle,
    label: "Error",
    dotClass: "status-dot--error",
  },
} as const;

export function SearchCard({ search, onDelete, onEdit }: SearchCardProps) {
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
          <p className="detail-value">{search.settings.frequency}</p>
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
          <p className="detail-label">Notifications</p>
          <p className="detail-value detail-value--capitalize">
            {search.settings.notifications.length > 0
              ? search.settings.notifications.join(", ")
              : "None"}
          </p>
        </div>
      </div>

      {search.lastRun && (
        <div className="search-card-last-run">
          <IconClock size={12} />
          Last run: {search.lastRun.toLocaleString()}
        </div>
      )}
    </div>
  );
}
