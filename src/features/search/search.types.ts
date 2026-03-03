import { z } from 'zod/v4'

export type {
  ActiveSearch,
  SearchCriteria,
  MonitoringSettings,
  SearchStatus,
  DateListedOption,
  NotificationMethod,
  CreateSearchPayload,
  UpdateSearchPayload,
} from '@/generated/types.gen'

export const dateListedSchema = z.enum(['24h', '7d', '30d'])

export const notificationMethodSchema = z.enum(['email', 'sms', 'webhook'])

export const searchCriteriaSchema = z.object({
  query: z.string().min(1),
  location: z.string().min(1),
  minPrice: z.string(),
  maxPrice: z.string(),
  dateListed: dateListedSchema,
})

export const monitoringSettingsSchema = z.object({
  frequency: z.string().min(1),
  listingsPerCheck: z.number().int().positive(),
  notifications: z.array(notificationMethodSchema),
})
