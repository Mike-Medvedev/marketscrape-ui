import { useEffect, useRef, useState } from "react";
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
    debuggerUrl,
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
    handleDebuggerError,
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
      : syncState === "error" || syncState === "timeout" || syncState === "login_error"
        ? "identity-shimmer identity-shimmer--error"
        : syncState === "login"
          ? "identity-shimmer identity-shimmer--hidden"
          : "identity-shimmer";

  return (
    <>
      <Modal
        opened={isOpen}
        onClose={handleCloseClick}
        size="92vw"
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
              debuggerUrl={debuggerUrl}
              errorMessage={errorMessage}
              onRetry={retry}
              onDebuggerError={handleDebuggerError}
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
                  <div className="identity-timeline-meta">{activity.step}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="identity-empty-state">
            Waiting for progress updates from the automation.
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
      title: "Automation running",
      description: currentActivity.message,
    };
  }

  switch (syncState) {
    case "connecting":
      return {
        title: "Connecting",
        description: "Connecting to the remote browser...",
      };
    case "running":
      return {
        title: "Checking session",
        description: "The backend is verifying the stored browser session.",
      };
    case "login":
      return {
        title: "Waiting for manual login",
        description: "Log into Facebook in the browser below. Automation resumes automatically after login.",
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
    case "login_error":
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
  debuggerUrl: string | null;
  errorMessage: string | null;
  onRetry: () => void;
  onDebuggerError: (reason: string) => void;
}

function BrowserPanel({
  syncState,
  debuggerUrl,
  errorMessage,
  onRetry,
  onDebuggerError,
}: BrowserPanelProps) {
  switch (syncState) {
    case "connecting":
      return (
        <div className="identity-loading">
          <div className="identity-spinner" />
          <p className="identity-loading-text">Connecting...</p>
          <p className="identity-loading-hint">This usually takes under a second</p>
        </div>
      );

    case "running":
      return (
        <div className="identity-loading">
          <div className="identity-spinner" />
          <p className="identity-loading-text">Automation in progress...</p>
          <p className="identity-loading-hint">
            Checking session and capturing data
          </p>
        </div>
      );

    case "login":
      return debuggerUrl ? (
        <div className="identity-debugger-layout">
          <div className="identity-debugger-instructions">
            <div className="identity-debugger-instructions-title">Manual login required</div>
            <p className="identity-debugger-instructions-text">
              Log into Facebook in the browser below. If you get a notification approval
              or two-factor prompt on another device, complete it there and this sync will
              continue automatically.
            </p>
          </div>
          <DebuggerPanel url={debuggerUrl} onError={onDebuggerError} />
        </div>
      ) : null;

    case "login_error":
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
            No session was captured within the timeout window.
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

interface DebuggerPanelProps {
  url: string;
  onError: (reason: string) => void;
}

function DebuggerPanel({ url, onError }: DebuggerPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);
  const errorFiredRef = useRef(false);

  useEffect(() => {
    errorFiredRef.current = false;
    setLoaded(false);
  }, [url]);

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = () => {
    if (errorFiredRef.current) return;
    errorFiredRef.current = true;
    onError("Could not load the remote browser session.");
  };

  return (
    <div className="identity-debugger-container">
      {!loaded && (
        <div className="identity-debugger-connecting">
          <div className="identity-spinner identity-spinner--small" />
          <p className="identity-loading-text">Loading remote browser...</p>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={url}
        title="Remote browser session"
        className={`identity-debugger-frame ${loaded ? "" : "identity-debugger-frame--loading"}`}
        onLoad={handleLoad}
        onError={handleError}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
}
