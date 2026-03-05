import { z } from "zod/v4";
import type {
  GetSearchesResponse,
  CreateSearchData,
  UpdateSearchData,
  PostScrapeResponse,
} from "@/generated/types.gen";

export type ActiveSearch = GetSearchesResponse['data'][number];
export type SearchCriteria = ActiveSearch["criteria"];
export type MonitoringSettings = ActiveSearch["settings"];
export type SearchStatus = ActiveSearch["status"];
export type DateListedOption = SearchCriteria["dateListed"];
export type NotificationMethod = MonitoringSettings["notifications"][number];
export type CreateSearchPayload = NonNullable<CreateSearchData["body"]>;
export type UpdateSearchPayload = NonNullable<UpdateSearchData["body"]>;
export type Listing = PostScrapeResponse["data"]["listings"][number];

export const dateListedSchema = z.enum(["24h", "7d", "30d"]);

export const notificationMethodSchema = z.enum(["email", "sms", "webhook"]);

export const searchCriteriaSchema = z.object({
  query: z.string().min(1),
  location: z.string().min(1),
  minPrice: z.string(),
  maxPrice: z.string(),
  dateListed: dateListedSchema,
});

export const monitoringSettingsSchema = z.object({
  frequency: z.string().min(1),
  listingsPerCheck: z.number().int().min(1).max(10),
  notifications: z.array(notificationMethodSchema),
});

export type SyncSSEEvent =
  | { status: "already_synced" }
  | { status: "starting_container" }
  | { status: "container_running" }
  | { status: "needs_login"; novncUrl: string }
  | { status: "synced" }
  | { status: "timeout" }
  | { status: "error"; message: string };

export type SyncState =
  | "idle"
  | "starting"
  | "auto_login"
  | "vnc"
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
]);
