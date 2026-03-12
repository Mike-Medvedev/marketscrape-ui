import type { AxiosError } from "axios";
import { toast } from "@/utils/toast.utils";
import { requestIdentitySync } from "@/utils/identity-sync.utils";

interface ApiErrorBody {
  success: false;
  name: string;
  message: string;
  statusCode?: number;
}

interface ErrorAction {
  label: string;
  onClick: () => void;
}

interface ErrorEntry {
  title: string;
  message: string;
  severity: "error" | "warning";
  action?: ErrorAction;
}

const errorCodeRegistry: Record<string, ErrorEntry> = {
  FacebookSessionExpiredError: {
    title: "Session Expired",
    message:
      "Your Facebook session has expired. Please re-authenticate to continue.",
    severity: "warning",
    action: {
      label: "Sync Now",
      onClick: requestIdentitySync,
    },
  },
  GeocodingError: {
    title: "Location Not Found",
    message:
      "We couldn't find that location. Try a different city or zip code.",
    severity: "error",
  },
  SessionNotLoadedError: {
    title: "Session Not Loaded",
    message:
      "Your session is not loaded on the server. Please sync to continue.",
    severity: "warning",
    action: {
      label: "Sync Now",
      onClick: requestIdentitySync,
    },
  },
  UnauthorizedError: {
    title: "Unauthorized",
    message: "Your session has expired. Please log in again.",
    severity: "error",
  },
  FacebookRateLimitedError: {
    title: "Rate Limited",
    message:
      "Facebook is temporarily blocking requests. Please wait a few minutes before trying again.",
    severity: "warning",
  },
};

const defaultError: ErrorEntry = {
  title: "Error",
  message: "Something went wrong. Please try again.",
  severity: "error",
};

function parseApiErrorBody(error: unknown): ApiErrorBody | null {
  if (!isAxiosError(error)) return null;
  const data = error.response?.data as ApiErrorBody | undefined;
  if (data && data.success === false && data.name) {
    return data;
  }
  return null;
}

function isAxiosError(error: unknown): error is AxiosError {
  return (
    error !== null &&
    typeof error === "object" &&
    "isAxiosError" in error &&
    (error as AxiosError).isAxiosError === true
  );
}

function resolveEntry(code: string, serverMessage?: string): ErrorEntry {
  const registered = errorCodeRegistry[code];
  if (registered) return registered;

  if (serverMessage) {
    return { title: "Error", message: serverMessage, severity: "error" };
  }

  return defaultError;
}

function extractErrorMessage(error: unknown): string | null {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return null;
}

export function getApiErrorMessage(error: unknown, fallback?: string): string {
  const apiError = parseApiErrorBody(error);
  if (apiError) {
    return resolveEntry(apiError.name, apiError.message).message;
  }
  return extractErrorMessage(error) ?? fallback ?? defaultError.message;
}

export function notifyApiError(error: unknown, fallback?: string) {
  if (import.meta.env.DEV) {
    console.error("[API Error]", error);
  }

  const apiError = parseApiErrorBody(error);

  if (apiError) {
    const entry = resolveEntry(apiError.name, apiError.message);
    toast[entry.severity]({
      title: entry.title,
      message: entry.message,
      action: entry.action,
      autoClose: entry.action ? 8000 : undefined,
    });
    return;
  }

  const message = extractErrorMessage(error) ?? fallback ?? defaultError.message;
  toast.error({ message });
}
