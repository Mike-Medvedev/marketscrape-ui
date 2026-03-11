import { createElement } from "react";
import type { AxiosError } from "axios";
import { toast } from "@/utils/toast.utils";
import { requestIdentitySync } from "@/utils/identity-sync.utils";

interface ApiErrorBody {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
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
  FACEBOOK_SESSION_EXPIRED: {
    title: "Session Expired",
    message:
      "Your Facebook session has expired. Please re-authenticate to continue.",
    severity: "warning",
    action: {
      label: "Sync Now",
      onClick: requestIdentitySync,
    },
  },
  GEOCODING_ERROR: {
    title: "Location Not Found",
    message:
      "We couldn't find that location. Try a different city or zip code.",
    severity: "error",
  },
  SESSION_NOT_LOADED: {
    title: "Session Not Loaded",
    message:
      "Your session is not loaded on the server. Please sync to continue.",
    severity: "warning",
    action: {
      label: "Sync Now",
      onClick: requestIdentitySync,
    },
  },
  UNAUTHORIZED: {
    title: "Unauthorized",
    message: "Your session has expired. Please log in again.",
    severity: "error",
  },
  FACEBOOK_RATE_LIMITED: {
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

function parseApiErrorBody(error: unknown): ApiErrorBody["error"] | null {
  if (!isAxiosError(error)) return null;
  const data = error.response?.data as ApiErrorBody | undefined;
  if (data && data.success === false && data.error?.code) {
    return data.error;
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

function buildToastMessage(text: string, action?: ErrorAction) {
  if (!action) return text;

  return createElement(
    "div",
    { className: "api-error-toast" },
    createElement("span", null, text),
    createElement(
      "button",
      {
        className: "api-error-toast-action",
        onClick: action.onClick,
      },
      action.label,
    ),
  );
}

export function getApiErrorMessage(error: unknown, fallback?: string): string {
  const apiError = parseApiErrorBody(error);
  if (apiError) {
    return resolveEntry(apiError.code, apiError.message).message;
  }
  return extractErrorMessage(error) ?? fallback ?? defaultError.message;
}

export function notifyApiError(error: unknown, fallback?: string) {
  if (import.meta.env.DEV) {
    console.error("[API Error]", error);
  }

  const apiError = parseApiErrorBody(error);

  if (apiError) {
    const entry = resolveEntry(apiError.code, apiError.message);
    const message = buildToastMessage(entry.message, entry.action);
    toast[entry.severity]({
      title: entry.title,
      message,
      autoClose: entry.action ? 8000 : undefined,
    });
    return;
  }

  const message = extractErrorMessage(error) ?? fallback ?? defaultError.message;
  toast.error({ message });
}
