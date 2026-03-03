import { AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";

interface SessionAlertProps {
  onQuickSync: () => void;
  onClose: () => void;
}

export function SessionAlert({ onQuickSync, onClose }: SessionAlertProps) {
  return (
    <div className="bg-card border border-primary rounded-lg p-4 flex items-center justify-between shadow-[0_0_12px_rgba(250,204,21,0.15)]">
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-primary" />
        <div>
          <p className="font-medium text-foreground">Your Facebook session has expired</p>
          <p className="text-sm text-muted-foreground">Click to refresh your identity clone</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={onQuickSync}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Quick Sync
        </Button>
        <Button
          onClick={onClose}
          variant="outline"
          className="border-border text-muted-foreground hover:bg-muted"
        >
          Close
        </Button>
      </div>
    </div>
  );
}