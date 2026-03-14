import { useState, useRef, useCallback, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSearchesQueryKey,
  getSessionStatusQueryKey,
  abortSyncMutation,
} from "@/generated/@tanstack/react-query.gen";
import { settings } from "@/settings";
import { supabase } from "@/infra/supabase.client";
import { toast } from "@/utils/toast.utils";
import { syncSSEEventSchema } from "@/features/search/search.types";
import type { SyncActivity, SyncState } from "@/features/search/search.types";

interface UseIdentitySyncOptions {
  onDismiss?: () => void;
}

export function useIdentitySync({ onDismiss }: UseIdentitySyncOptions = {}) {
  const queryClient = useQueryClient();
  const [syncState, setSyncState] = useState<SyncState>("idle");
  const [debuggerUrl, setDebuggerUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [activities, setActivities] = useState<SyncActivity[]>([]);

  const eventSourceRef = useRef<EventSource | null>(null);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onDismissRef = useRef(onDismiss);

  useEffect(() => {
    onDismissRef.current = onDismiss;
  });

  const appendLog = useCallback((message: string) => {
    setLogs((prev) => [...prev, message]);
  }, []);

  const appendActivity = useCallback((activity: Omit<SyncActivity, "createdAt">) => {
    setActivities((prev) => [...prev, { ...activity, createdAt: Date.now() }]);
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
    setDebuggerUrl(null);
    setErrorMessage(null);
    setLogs([]);
    setActivities([]);
  }, [closeEventSource]);

  const startSync = useCallback(async () => {
    closeEventSource();
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }

    setSyncState("connecting");
    setDebuggerUrl(null);
    setErrorMessage(null);
    setLogs(["Connecting to sync service..."]);
    setActivities([]);

    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    const url = new URL(`${settings.env.VITE_API_URL}/api/v1/sync`);
    if (token) {
      url.searchParams.set("token", token);
    }
    const evtSource = new EventSource(url.toString());
    eventSourceRef.current = evtSource;

    evtSource.onmessage = (event) => {
      let payload: unknown;
      try {
        payload = JSON.parse(event.data);
      } catch (error) {
        console.error("SSE JSON parse error:", error, "data:", event.data);
        appendLog("Received malformed event data");
        return;
      }

      const parsed = syncSSEEventSchema.safeParse(payload);
      if (!parsed.success) {
        console.error(
          "SSE parse error:",
          parsed.error.issues,
          "data:",
          event.data,
        );
        appendLog("Received unknown event");
        return;
      }

      const data = parsed.data;
      switch (data.status) {
        case "already_synced":
          queryClient.invalidateQueries({ queryKey: getSessionStatusQueryKey() });
          toast.success({ message: "Session is already valid" });
          closeEventSource();
          reset();
          onDismissRef.current?.();
          break;

        case "connecting":
          setSyncState("connecting");
          appendLog("Connecting to remote browser...");
          break;

        case "status_update":
          appendActivity({
            message: data.message,
            step: data.step,
            userId: data.userId,
          });

          if (data.step === "needs_login" && data.debuggerUrl) {
            setDebuggerUrl(data.debuggerUrl);
            setSyncState("login");
            appendLog("Manual login required");
            appendLog("Please log into the marketplace in the browser below");
          } else if (syncState !== "login") {
            setSyncState("running");
          }
          break;

        case "synced":
          setSyncState("success");
          setDebuggerUrl(null);
          closeEventSource();
          appendLog("Session synced successfully");
          queryClient.invalidateQueries({ queryKey: getSearchesQueryKey() });
          queryClient.invalidateQueries({ queryKey: getSessionStatusQueryKey() });
          toast.success({ message: "Session synced successfully" });

          dismissTimerRef.current = setTimeout(() => {
            reset();
            onDismissRef.current?.();
          }, 3000);
          break;

        case "timeout":
          setSyncState("timeout");
          setDebuggerUrl(null);
          setErrorMessage("Sync timed out");
          closeEventSource();
          appendLog("Timeout — no session captured");
          break;

        case "error":
          setSyncState("error");
          setDebuggerUrl(null);
          setErrorMessage(data.message);
          closeEventSource();
          appendLog(`Error: ${data.message}`);
          break;
      }
    };

    evtSource.onerror = () => {
      if (!eventSourceRef.current) return;
      setSyncState("error");
      setDebuggerUrl(null);
      setErrorMessage("Connection lost");
      closeEventSource();
      appendLog("Connection lost");
    };
  }, [closeEventSource, reset, appendActivity, appendLog, queryClient, syncState]);

  const abortMutation = useMutation({ ...abortSyncMutation() });

  const abort = useCallback(async () => {
    closeEventSource();
    try {
      await abortMutation.mutateAsync({});
    } catch {
      // Best-effort — container may already be gone
    }
    reset();
    onDismissRef.current?.();
  }, [closeEventSource, reset, abortMutation]);

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

  const handleDebuggerError = useCallback(
    (reason: string) => {
      setSyncState("login_error");
      setErrorMessage(reason);
      appendLog(`Debugger error: ${reason}`);
    },
    [appendLog],
  );

  const isSyncing =
    syncState === "connecting" ||
    syncState === "running" ||
    syncState === "login";

  const isTerminal =
    syncState === "idle" ||
    syncState === "success" ||
    syncState === "timeout" ||
    syncState === "login_error" ||
    syncState === "error";

  return {
    syncState,
    debuggerUrl,
    errorMessage,
    logs,
    activities,
    isSyncing,
    isTerminal,
    isAborting: abortMutation.isPending,
    startSync,
    retry,
    reset,
    abort,
    handleDebuggerError,
  };
}
