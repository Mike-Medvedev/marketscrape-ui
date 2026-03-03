import { useState, useEffect } from "react";
import { IconX, IconCircleCheck } from "@tabler/icons-react";
import { Modal, ActionIcon } from "@mantine/core";
import { toast } from "../../../utils/toast.utils";
import "./IdentityAbsorber.css";

interface IdentityAbsorberProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IdentityAbsorber({ isOpen, onClose }: IdentityAbsorberProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLogs([]);
      setIsAuthenticated(false);

      const logSequence = [
        "Launching Instance...",
        "Connecting to VNC...",
        "Loading Facebook Auth...",
        "Awaiting Auth...",
      ];

      const timeouts: ReturnType<typeof setTimeout>[] = [];

      logSequence.forEach((log, index) => {
        const t = setTimeout(() => {
          setLogs((prev) => [...prev, log]);
        }, index * 800);
        timeouts.push(t);
      });

      const authTimeout = setTimeout(() => {
        setLogs((prev) => [...prev, "Identity Absorbed \u2713"]);
        setIsAuthenticated(true);
        toast.success({ message: "Facebook session synced successfully" });

        const closeTimeout = setTimeout(() => {
          onClose();
        }, 2000);
        timeouts.push(closeTimeout);
      }, 5000);
      timeouts.push(authTimeout);

      return () => {
        timeouts.forEach(clearTimeout);
      };
    }
  }, [isOpen, onClose]);

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      size="xl"
      withCloseButton={false}
      centered
      classNames={{
        content: "identity-modal-content",
        body: "identity-modal-body",
      }}
      closeOnClickOutside={isAuthenticated}
    >
      <div className="identity-shimmer" />

      <div className="identity-header">
        <h2 className="identity-title">Identity Sync</h2>
        <ActionIcon
          variant="subtle"
          color="gray"
          onClick={onClose}
          disabled={!isAuthenticated}
          className="identity-close-btn"
        >
          <IconX size={16} />
        </ActionIcon>
      </div>

      <div className="identity-content">
        <div className="identity-browser">
          {isAuthenticated ? (
            <div className="identity-success">
              <div className="identity-success-icon">
                <IconCircleCheck size={32} color="var(--status-running)" />
              </div>
              <div>
                <h3 className="identity-success-title">
                  Session Cloned to Cloud
                </h3>
                <p className="identity-success-desc">
                  Auto-closing in 2 seconds...
                </p>
              </div>
            </div>
          ) : (
            <div className="identity-loading">
              <div className="identity-spinner" />
              <p className="identity-loading-text">
                Facebook login screen would appear here
              </p>
              <p className="identity-loading-hint">VNC component integration</p>
            </div>
          )}
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
