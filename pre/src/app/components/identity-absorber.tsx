import { useState, useEffect } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";

interface IdentityAbsorberProps {
  isOpen: boolean;
  onClose: () => void;
  onQuickSync: () => void;
}

export function IdentityAbsorber({ isOpen, onClose, onQuickSync }: IdentityAbsorberProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLogs([]);
      setIsAuthenticated(false);
      setIsClosing(false);

      // Simulate terminal logs
      const logSequence = [
        "Launching Instance...",
        "Connecting to VNC...",
        "Loading Facebook Auth...",
        "Awaiting Auth...",
      ];

      logSequence.forEach((log, index) => {
        setTimeout(() => {
          setLogs((prev) => [...prev, log]);
        }, index * 800);
      });

      // Simulate successful auth after 5 seconds
      setTimeout(() => {
        setLogs((prev) => [...prev, "Identity Absorbed ✓"]);
        setIsAuthenticated(true);
        
        // Auto-close after 2 seconds
        setTimeout(() => {
          setIsClosing(true);
          setTimeout(() => {
            onClose();
          }, 500);
        }, 2000);
      }, 5000);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-lg" onClick={isAuthenticated ? onClose : undefined} />

      {/* Modal */}
      <div className={`relative bg-card border border-border rounded-lg overflow-hidden max-w-5xl w-full mx-4 shadow-2xl transition-all duration-500 ${isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        {/* Yellow top border with shimmer effect */}
        <div className="h-1 bg-gradient-to-r from-primary via-primary/50 to-primary bg-[length:200%_100%] animate-[shimmer_2s_linear_infinite]" />

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-medium text-foreground">Identity Sync</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={!isAuthenticated}
            className="text-muted-foreground hover:text-foreground disabled:opacity-30"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex h-[500px]">
          {/* Browser Window */}
          <div className="flex-1 bg-muted/20 flex items-center justify-center p-8 relative">
            {isAuthenticated ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <div>
                  <h3 className="text-xl text-foreground mb-2">Session Cloned to Cloud</h3>
                  <p className="text-sm text-muted-foreground">Auto-closing in 2 seconds...</p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Facebook login screen would appear here</p>
                <p className="text-xs text-muted-foreground/70 mt-2">VNC component integration</p>
              </div>
            )}
          </div>

          {/* Terminal Logs */}
          <div className="w-80 bg-muted/10 border-l border-border p-4 overflow-y-auto">
            <div className="space-y-2 font-mono text-sm">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className="text-foreground/80 animate-[fadeIn_0.3s_ease-in]"
                >
                  <span className="text-primary mr-2">›</span>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-4px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}