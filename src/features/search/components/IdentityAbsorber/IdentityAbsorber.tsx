import { useEffect, useRef, useState, useCallback } from "react";
import {
  IconX,
  IconCircleCheck,
  IconAlertTriangle,
  IconAlertCircle,
  IconPlugConnectedX,
  IconPointFilled,
} from "@tabler/icons-react";
import { Badge, Modal, ActionIcon, Button, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { VncScreen, type VncScreenHandle } from "react-vnc";
import { useIdentitySync } from "@/features/search/hooks/sync.hook";
import type { SyncActivity, SyncState } from "@/features/search/search.types";
import "./IdentityAbsorber.css";

interface IdentityAbsorberProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IdentityAbsorber({ isOpen, onClose }: IdentityAbsorberProps) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [showAbortConfirm, setShowAbortConfirm] = useState(false);
  const {
    syncState,
    vncUrl,
    errorMessage,
    logs,
    activities,
    isSyncing,
    isTerminal,
    isAborting,
    startSync,
    retry,
    reset,
    abort,
    handleVncError,
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

  const handleCloseClick = () => {
    if (isSyncing) {
      setShowAbortConfirm(true);
    } else {
      handleClose();
    }
  };

  const handleAbortConfirm = async () => {
    setShowAbortConfirm(false);
    await abort();
  };

  const shimmerClass =
    syncState === "success"
      ? "identity-shimmer identity-shimmer--success"
      : syncState === "error" || syncState === "timeout" || syncState === "vnc_error"
        ? "identity-shimmer identity-shimmer--error"
        : syncState === "vnc"
          ? "identity-shimmer identity-shimmer--hidden"
          : "identity-shimmer";

  return (
    <>
      <Modal
        opened={isOpen}
        onClose={handleCloseClick}
        size="xl"
        withCloseButton={false}
        centered
        fullScreen={isMobile ?? false}
        classNames={{
          content: "identity-modal-content",
          body: "identity-modal-body",
        }}
        closeOnClickOutside={isTerminal}
        closeOnEscape={isTerminal}
      >
        <div className={shimmerClass} />

        <div className="identity-header">
          <h2 className="identity-title">Identity Sync</h2>
          <ActionIcon
            variant="subtle"
            color={isSyncing ? "red" : "gray"}
            onClick={handleCloseClick}
            className={`identity-close-btn ${isSyncing ? "identity-close-btn--abort" : ""}`}
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
              onVncError={handleVncError}
            />
          </div>

          <div className="identity-logs">
            <SyncActivityPanel
              syncState={syncState}
              activities={activities}
              logs={logs}
            />
          </div>
        </div>
      </Modal>

      <Modal
        opened={showAbortConfirm}
        onClose={() => setShowAbortConfirm(false)}
        centered
        size="sm"
        withCloseButton={false}
        classNames={{
          content: "identity-abort-modal-content",
          body: "identity-abort-modal-body",
        }}
      >
        <div className="identity-abort-content">
          <div className="identity-abort-icon">
            <IconAlertTriangle size={28} color="var(--status-error)" />
          </div>
          <h3 className="identity-abort-title">Abort Sync?</h3>
          <Text size="sm" c="dimmed" className="identity-abort-desc">
            Your marketplace session must be synced for searches to work.
            Aborting will cancel the current sync.
          </Text>
          <div className="identity-abort-actions">
            <Button
              variant="subtle"
              color="gray"
              onClick={() => setShowAbortConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              color="red"
              onClick={handleAbortConfirm}
              loading={isAborting}
            >
              Abort Sync
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

interface SyncActivityPanelProps {
  syncState: SyncState;
  activities: SyncActivity[];
  logs: string[];
}

function SyncActivityPanel({
  syncState,
  activities,
  logs,
}: SyncActivityPanelProps) {
  const currentActivity = activities.at(-1);
  const currentStatus = getSyncStatusCopy(syncState, currentActivity);

  return (
    <div className="identity-progress">
      <div className="identity-progress-card">
        <div className="identity-progress-label">Current status</div>
        <div className="identity-progress-value">{currentStatus.title}</div>
        <p className="identity-progress-desc">{currentStatus.description}</p>
        {currentActivity?.step ? (
          <Badge variant="light" color="yellow" radius="sm" className="identity-step-badge">
            {currentActivity.step}
          </Badge>
        ) : null}
      </div>

      <div className="identity-progress-section">
        <div className="identity-progress-section-header">
          <h3 className="identity-progress-section-title">Automation activity</h3>
          <span className="identity-progress-count">{activities.length}</span>
        </div>

        {activities.length > 0 ? (
          <div className="identity-timeline">
            {activities.map((activity, index) => (
              <div key={`${activity.createdAt}-${index}`} className="identity-timeline-item">
                <div className="identity-timeline-marker">
                  <IconPointFilled size={12} />
                </div>
                <div className="identity-timeline-content">
                  <div className="identity-timeline-message">{activity.message}</div>
                  {activity.step ? (
                    <div className="identity-timeline-meta">{activity.step}</div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="identity-empty-state">
            Waiting for progress updates from the Playwright container.
          </div>
        )}
      </div>

      <div className="identity-progress-section">
        <div className="identity-progress-section-header">
          <h3 className="identity-progress-section-title">System log</h3>
        </div>
        <div className="identity-logs-inner">
          {logs.map((log, index) => (
            <div key={`${log}-${index}`} className="identity-log-line">
              <span className="identity-log-prompt">&rsaquo;</span>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getSyncStatusCopy(
  syncState: SyncState,
  currentActivity?: SyncActivity,
): { title: string; description: string } {
  if (currentActivity) {
    return {
      title: "Playwright automation running",
      description: currentActivity.message,
    };
  }

  switch (syncState) {
    case "starting":
      return {
        title: "Preparing browser session",
        description: "Starting the sync container and restoring browser state.",
      };
    case "auto_login":
      return {
        title: "Checking saved session",
        description: "The backend is testing the stored browser profile before asking for login.",
      };
    case "vnc":
      return {
        title: "Waiting for manual login",
        description: "Log into the marketplace in the remote browser. Automation resumes automatically after login.",
      };
    case "success":
      return {
        title: "Session captured",
        description: "Authenticated session data was saved successfully.",
      };
    case "timeout":
      return {
        title: "Sync timed out",
        description: "The backend did not finish before the timeout window expired.",
      };
    case "vnc_error":
    case "error":
      return {
        title: "Sync failed",
        description: "The session could not be completed. Check the system log for details.",
      };
    case "idle":
    default:
      return {
        title: "Initializing sync",
        description: "Connecting to the sync service.",
      };
  }
}

interface BrowserPanelProps {
  syncState: SyncState;
  vncUrl: string | null;
  errorMessage: string | null;
  onRetry: () => void;
  onVncError: (reason: string) => void;
}

function BrowserPanel({
  syncState,
  vncUrl,
  errorMessage,
  onRetry,
  onVncError,
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
        <VncPanel url={vncUrl} onVncError={onVncError} />
      ) : null;

    case "vnc_error":
      return (
        <div className="identity-terminal">
          <div className="identity-terminal-icon identity-terminal-icon--error">
            <IconPlugConnectedX size={32} color="var(--status-error)" />
          </div>
          <h3 className="identity-terminal-title">Connection Lost</h3>
          <p className="identity-terminal-desc">
            {errorMessage ?? "Could not connect to the remote browser."}
          </p>
          <p className="identity-terminal-hint">
            The remote session may have ended or the connection was refused.
          </p>
          <Button onClick={onRetry} color="amber" className="identity-retry-btn">
            Reconnect
          </Button>
        </div>
      );

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

interface VncPanelProps {
  url: string;
  onVncError: (reason: string) => void;
}

function VncPanel({ url, onVncError }: VncPanelProps) {
  const vncRef = useRef<VncScreenHandle>(null);
  const [connected, setConnected] = useState(false);
  const errorFiredRef = useRef(false);

  const handleConnect = useCallback(() => {
    setConnected(true);
    errorFiredRef.current = false;
  }, []);

  const handleDisconnect = useCallback(
    (event: CustomEvent<{ clean: boolean }> | undefined) => {
      if (errorFiredRef.current) return;

      const clean = event?.detail?.clean ?? false;
      if (!clean) {
        errorFiredRef.current = true;
        const reason = connected
          ? "The remote browser disconnected unexpectedly."
          : "Could not establish a connection to the remote browser.";
        onVncError(reason);
      }
    },
    [connected, onVncError],
  );

  const handleSecurityFailure = useCallback(
    (event: CustomEvent<{ status: number; reason: string }> | undefined) => {
      if (errorFiredRef.current) return;
      errorFiredRef.current = true;
      const reason = event?.detail?.reason ?? "Security handshake failed";
      onVncError(`Security failure: ${reason}`);
    },
    [onVncError],
  );

  return (
    <div className="identity-vnc-container">
      {!connected && (
        <div className="identity-vnc-connecting">
          <div className="identity-spinner identity-spinner--small" />
          <p className="identity-loading-text">Connecting to remote browser...</p>
        </div>
      )}
      <VncScreen
        ref={vncRef}
        url={url}
        scaleViewport
        background="#000000"
        className={`identity-vnc-screen ${connected ? "" : "identity-vnc-screen--connecting"}`}
        retryDuration={0}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        onSecurityFailure={handleSecurityFailure}
      />
    </div>
  );
}
