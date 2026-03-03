import { z } from "zod/v4";
import type {
  GetSearchesResponse,
  CreateSearchData,
  UpdateSearchData,
} from "@/generated/types.gen";

export type ActiveSearch = GetSearchesResponse[number];
export type SearchCriteria = ActiveSearch["criteria"];
export type MonitoringSettings = ActiveSearch["settings"];
export type SearchStatus = ActiveSearch["status"];
export type DateListedOption = SearchCriteria["dateListed"];
export type NotificationMethod = MonitoringSettings["notifications"][number];
export type CreateSearchPayload = NonNullable<CreateSearchData["body"]>;
export type UpdateSearchPayload = NonNullable<UpdateSearchData["body"]>;

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
  listingsPerCheck: z.number().int().positive(),
  notifications: z.array(notificationMethodSchema),
});
