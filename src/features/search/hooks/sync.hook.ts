import { useState, useRef, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSearchesQueryKey } from "@/generated/@tanstack/react-query.gen";
import { settings } from "@/settings";
import { toast } from "@/utils/toast.utils";
import { syncSSEEventSchema } from "@/features/search/search.types";
import type { SyncState } from "@/features/search/search.types";

interface UseIdentitySyncOptions {
  onDismiss?: () => void;
}

export function useIdentitySync({ onDismiss }: UseIdentitySyncOptions = {}) {
  const queryClient = useQueryClient();
  const [syncState, setSyncState] = useState<SyncState>("idle");
  const [vncUrl, setVncUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const eventSourceRef = useRef<EventSource | null>(null);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  const appendLog = useCallback((message: string) => {
    setLogs((prev) => [...prev, message]);
  }, []);

  const closeEventSource = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    closeEventSource();
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
    setSyncState("idle");
    setVncUrl(null);
    setErrorMessage(null);
    setLogs([]);
  }, [closeEventSource]);

  const startSync = useCallback(() => {
    closeEventSource();
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }

    setSyncState("starting");
    setVncUrl(null);
    setErrorMessage(null);
    setLogs(["Connecting to sync service..."]);

    const url = `${settings.env.VITE_API_URL}/api/v1/sync`;
    const evtSource = new EventSource(url);
    eventSourceRef.current = evtSource;

    evtSource.onmessage = (event) => {
      const parsed = syncSSEEventSchema.safeParse(JSON.parse(event.data));
      if (!parsed.success) {
        appendLog("Received unknown event");
        return;
      }

      const data = parsed.data;
      switch (data.status) {
        case "already_synced":
          toast.success({ message: "Session is already valid" });
          closeEventSource();
          reset();
          onDismissRef.current?.();
          break;

        case "starting_container":
          setSyncState("starting");
          appendLog("Launching instance...");
          break;

        case "container_running":
          setSyncState("auto_login");
          appendLog("Auto-login in progress...");
          break;

        case "needs_login":
          setVncUrl(data.novncUrl);
          setSyncState("vnc");
          appendLog("Manual login required");
          appendLog("Please log into Facebook in the window below");
          break;

        case "synced":
          setSyncState("success");
          closeEventSource();
          appendLog("Identity absorbed ✓");
          queryClient.invalidateQueries({ queryKey: getSearchesQueryKey() });
          toast.success({ message: "Facebook session synced successfully" });

          dismissTimerRef.current = setTimeout(() => {
            reset();
            onDismissRef.current?.();
          }, 3000);
          break;

        case "timeout":
          setSyncState("timeout");
          setErrorMessage("Sync timed out after 5 minutes");
          closeEventSource();
          appendLog("Timeout — no session captured");
          break;

        case "error":
          setSyncState("error");
          setErrorMessage(data.message);
          closeEventSource();
          appendLog(`Error: ${data.message}`);
          break;
      }
    };

    evtSource.onerror = () => {
      setSyncState("error");
      setErrorMessage("Connection lost");
      closeEventSource();
      appendLog("Connection lost");
    };
  }, [closeEventSource, reset, appendLog, queryClient]);

  const retry = useCallback(() => {
    startSync();
  }, [startSync]);

  useEffect(() => {
    return () => {
      closeEventSource();
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }
    };
  }, [closeEventSource]);

  const isSyncing =
    syncState === "starting" ||
    syncState === "auto_login" ||
    syncState === "vnc";

  const isTerminal =
    syncState === "idle" ||
    syncState === "success" ||
    syncState === "timeout" ||
    syncState === "error";

  return {
    syncState,
    vncUrl,
    errorMessage,
    logs,
    isSyncing,
    isTerminal,
    startSync,
    retry,
    reset,
  };
}
