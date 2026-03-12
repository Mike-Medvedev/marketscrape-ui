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
  | { status: "needs_login"; novncUrl: string }
  | { status: "synced" }
  | { status: "timeout" }
  | { status: "error"; message: string }
  | { status: "container_exited"; reason: string };

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
  z.object({ status: z.literal("needs_login"), novncUrl: z.string().url() }),
  z.object({ status: z.literal("synced") }),
  z.object({ status: z.literal("timeout") }),
  z.object({ status: z.literal("error"), message: z.string() }),
  z.object({ status: z.literal("container_exited"), reason: z.string() }),
]);

export const sessionStatusResponseSchema = z.object({
  valid: z.boolean(),
});

export type SessionStatusResponse = z.infer<typeof sessionStatusResponseSchema>;

export type SessionValidity = "valid" | "invalid" | "unknown";

