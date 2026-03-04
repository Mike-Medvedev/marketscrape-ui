import type { AxiosError } from "axios";
import { toast } from "@/utils/toast.utils";

interface ApiErrorBody {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

interface ErrorEntry {
  title: string;
  message: string;
  severity: "error" | "warning";
}

const errorCodeRegistry: Record<string, ErrorEntry> = {
  FACEBOOK_SESSION_EXPIRED: {
    title: "Session Expired",
    message:
      "Your Facebook session has expired. Please re-authenticate to continue.",
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

function resolveEntry(code: string): ErrorEntry {
  return errorCodeRegistry[code] ?? defaultError;
}

export function getApiErrorMessage(error: unknown, fallback?: string): string {
  const apiError = parseApiErrorBody(error);
  if (apiError) {
    return resolveEntry(apiError.code).message;
  }
  return fallback ?? defaultError.message;
}

export function notifyApiError(error: unknown, fallback?: string) {
  const apiError = parseApiErrorBody(error);

  if (apiError) {
    const entry = resolveEntry(apiError.code);
    toast[entry.severity]({ title: entry.title, message: entry.message });
    return;
  }

  toast.error({ message: fallback ?? defaultError.message });
}
