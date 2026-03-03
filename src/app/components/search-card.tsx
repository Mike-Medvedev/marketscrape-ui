import { Clock, Trash2, AlertCircle, CheckCircle2, RefreshCw, Pencil } from "lucide-react";
import { ActiveSearch } from "../types/search";
import { Button } from "./ui/button";

interface SearchCardProps {
  search: ActiveSearch;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export function SearchCard({ search, onDelete, onEdit }: SearchCardProps) {
  const statusConfig = {
    running: {
      icon: CheckCircle2,
      label: "Sync Healthy",
      dotClass: "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]",
    },
    refresh: {
      icon: RefreshCw,
      label: "Action Required",
      dotClass: "bg-primary shadow-[0_0_8px_rgba(250,204,21,0.6)] animate-pulse",
    },
    error: {
      icon: AlertCircle,
      label: "Error",
      dotClass: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]",
    },
  };

  const config = statusConfig[search.status];

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/30 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg mb-1 text-card-foreground">{search.criteria.query}</h3>
          <p className="text-sm text-muted-foreground font-mono">
            {search.criteria.location}
            {(search.criteria.minPrice || search.criteria.maxPrice) && (
              <>
                {" • "}
                {search.criteria.minPrice ? `$${search.criteria.minPrice}` : "Any"}
                {" - "}
                {search.criteria.maxPrice ? `$${search.criteria.maxPrice}` : "Any"}
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border">
            <div className={`w-2 h-2 rounded-full ${config.dotClass}`} />
            <span className="text-xs text-foreground font-mono">{config.label}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(search.id)}
            className="text-muted-foreground hover:text-primary h-8 w-8"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(search.id)}
            className="text-muted-foreground hover:text-destructive h-8 w-8"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-mono">Frequency</p>
          <p className="text-sm text-card-foreground">{search.settings.frequency}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-mono">Listings</p>
          <p className="text-sm text-card-foreground">{search.settings.listingsPerCheck} per check</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-mono">Listed</p>
          <p className="text-sm text-card-foreground">{search.criteria.dateListed === "24h" ? "Last 24h" : search.criteria.dateListed === "7d" ? "Last 7 days" : "Last 30 days"}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-mono">Notifications</p>
          <p className="text-sm capitalize text-card-foreground">
            {search.settings.notifications.length > 0 
              ? search.settings.notifications.join(", ")
              : "None"}
          </p>
        </div>
      </div>

      {search.lastRun && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border text-xs text-muted-foreground font-mono">
          <Clock className="w-3 h-3" />
          Last run: {search.lastRun.toLocaleString()}
        </div>
      )}
    </div>
  );
}