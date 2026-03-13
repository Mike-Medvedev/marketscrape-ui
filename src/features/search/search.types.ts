import { z } from "zod/v4";
import type {
  GetSearchesResponse,
  CreateSearchData,
  UpdateSearchData,
  PostScrapeResponse,
} from "@/generated/types.gen";

export type ActiveSearch = GetSearchesResponse['data'][number];
export type SearchStatus = ActiveSearch["status"];
export type DateListedOption = ActiveSearch["dateListed"];
export type FrequencyOption = ActiveSearch["frequency"];
export type NotificationType = ActiveSearch["notificationType"];
export type CreateSearchPayload = NonNullable<CreateSearchData["body"]>;
export type UpdateSearchPayload = NonNullable<UpdateSearchData["body"]>;
export type Listing = PostScrapeResponse["data"]["listings"][number];

export const dateListedSchema = z.enum(["24h", "7d", "30d"]);

export const frequencySchema = z.enum([
  "every_1h",
  "every_2h",
  "every_6h",
  "every_12h",
  "every_24h",
]);

export const notificationTypeSchema = z.enum(["email", "sms", "webhook"]);

export const searchFormSchema = z.object({
  query: z.string().min(1),
  location: z.string().min(1),
  minPrice: z.string(),
  maxPrice: z.string(),
  dateListed: dateListedSchema,
  prompt: z.string(),
  frequency: frequencySchema,
  listingsPerCheck: z.number().int().min(1).max(10),
  notificationType: notificationTypeSchema,
  notificationTarget: z.string().min(1, "Notification target is required"),
});

export type SearchFormValues = z.infer<typeof searchFormSchema>;

export type SyncSSEEvent =
  | { status: "already_synced" }
  | { status: "starting_container" }
  | { status: "container_running" }
  | { status: "status_update"; message: string; step: string; userId?: string; novncUrl?: string }
  | { status: "synced" }
  | { status: "timeout" }
  | { status: "error"; message: string }
  | { status: "container_exited"; reason: string };

export interface SyncActivity {
  message: string;
  step?: string;
  userId?: string;
  createdAt: number;
}

export type SyncState =
  | "idle"
  | "starting"
  | "auto_login"
  | "vnc"
  | "vnc_error"
  | "success"
  | "timeout"
  | "error";

export const syncSSEEventSchema = z.discriminatedUnion("status", [
  z.object({ status: z.literal("already_synced") }),
  z.object({ status: z.literal("starting_container") }),
  z.object({ status: z.literal("container_running") }),
  z.object({
    status: z.literal("status_update"),
    message: z.string(),
    step: z.string(),
    userId: z.string().optional(),
    novncUrl: z.string().url().optional(),
  }),
  z.object({ status: z.literal("synced") }),
  z.object({ status: z.literal("timeout") }),
  z.object({ status: z.literal("error"), message: z.string() }),
  z.object({ status: z.literal("container_exited"), reason: z.string() }),
]);

export type SessionValidity = "valid" | "invalid" | "unknown";

export type ExecutionState = "idle" | "executing" | "completed" | "failed";

export type ExecutionSSEEvent =
  | { status: "executing"; message?: string }
  | { status: "completed"; runId: string; listingCount: number; executedAt: string }
  | { status: "failed"; message: string };

export const executionSSEEventSchema = z.discriminatedUnion("status", [
  z.object({ status: z.literal("executing"), message: z.string().optional() }),
  z.object({
    status: z.literal("completed"),
    runId: z.string(),
    listingCount: z.number(),
    executedAt: z.string(),
  }),
  z.object({ status: z.literal("failed"), message: z.string() }),
]);
