import { useEffect } from "react";
import {
  IconX,
  IconCircleCheck,
  IconAlertTriangle,
  IconAlertCircle,
} from "@tabler/icons-react";
import { Modal, ActionIcon, Button } from "@mantine/core";
import { VncScreen } from "react-vnc";
import { useIdentitySync } from "@/features/search/hooks/sync.hook";
import "./IdentityAbsorber.css";

interface IdentityAbsorberProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IdentityAbsorber({ isOpen, onClose }: IdentityAbsorberProps) {
  const {
    syncState,
    vncUrl,
    errorMessage,
    logs,
    isTerminal,
    startSync,
    retry,
    reset,
  } = useIdentitySync({ onDismiss: onClose });

  useEffect(() => {
    if (isOpen) {
      startSync();
    }
  }, [isOpen, startSync]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const shimmerClass =
    syncState === "success"
      ? "identity-shimmer identity-shimmer--success"
      : syncState === "error" || syncState === "timeout"
        ? "identity-shimmer identity-shimmer--error"
        : syncState === "vnc"
          ? "identity-shimmer identity-shimmer--hidden"
          : "identity-shimmer";

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      size="xl"
      withCloseButton={false}
      centered
      classNames={{
        content: "identity-modal-content",
        body: "identity-modal-body",
      }}
      closeOnClickOutside={isTerminal}
    >
      <div className={shimmerClass} />

      <div className="identity-header">
        <h2 className="identity-title">Identity Sync</h2>
        <ActionIcon
          variant="subtle"
          color="gray"
          onClick={handleClose}
          disabled={!isTerminal}
          className="identity-close-btn"
        >
          <IconX size={16} />
        </ActionIcon>
      </div>

      <div className="identity-content">
        <div className="identity-browser">
          <BrowserPanel
            syncState={syncState}
            vncUrl={vncUrl}
            errorMessage={errorMessage}
            onRetry={retry}
          />
        </div>

        <div className="identity-logs">
          <div className="identity-logs-inner">
            {logs.map((log, index) => (
              <div key={index} className="identity-log-line">
                <span className="identity-log-prompt">&rsaquo;</span>
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

interface BrowserPanelProps {
  syncState: string;
  vncUrl: string | null;
  errorMessage: string | null;
  onRetry: () => void;
}

function BrowserPanel({
  syncState,
  vncUrl,
  errorMessage,
  onRetry,
}: BrowserPanelProps) {
  switch (syncState) {
    case "starting":
      return (
        <div className="identity-loading">
          <div className="identity-spinner" />
          <p className="identity-loading-text">Starting sync container...</p>
          <p className="identity-loading-hint">This may take 30-60 seconds</p>
        </div>
      );

    case "auto_login":
      return (
        <div className="identity-loading">
          <div className="identity-spinner" />
          <p className="identity-loading-text">Attempting auto-login...</p>
          <p className="identity-loading-hint">
            Using saved browser context
          </p>
        </div>
      );

    case "vnc":
      return vncUrl ? (
        <div className="identity-vnc-container">
          <VncScreen
            url={vncUrl}
            scaleViewport
            background="#000000"
            className="identity-vnc-screen"
          />
        </div>
      ) : null;

    case "success":
      return (
        <div className="identity-success">
          <div className="identity-success-icon">
            <IconCircleCheck size={32} color="var(--status-running)" />
          </div>
          <div>
            <h3 className="identity-success-title">
              Session Synced Successfully
            </h3>
            <p className="identity-success-desc">
              Auto-closing in a few seconds...
            </p>
          </div>
        </div>
      );

    case "timeout":
      return (
        <div className="identity-terminal">
          <div className="identity-terminal-icon identity-terminal-icon--warning">
            <IconAlertTriangle size={32} color="var(--status-warning)" />
          </div>
          <h3 className="identity-terminal-title">Sync Timed Out</h3>
          <p className="identity-terminal-desc">
            No session was captured within 5 minutes.
          </p>
          <Button onClick={onRetry} color="amber" className="identity-retry-btn">
            Try Again
          </Button>
        </div>
      );

    case "error":
      return (
        <div className="identity-terminal">
          <div className="identity-terminal-icon identity-terminal-icon--error">
            <IconAlertCircle size={32} color="var(--status-error)" />
          </div>
          <h3 className="identity-terminal-title">Sync Failed</h3>
          <p className="identity-terminal-desc">
            {errorMessage ?? "An unexpected error occurred."}
          </p>
          <Button onClick={onRetry} color="amber" className="identity-retry-btn">
            Try Again
          </Button>
        </div>
      );

    default:
      return null;
  }
}
