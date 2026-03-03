import { z } from 'zod/v4'

export const searchStatusSchema = z.enum(['running', 'refresh', 'error'])
export type SearchStatus = z.infer<typeof searchStatusSchema>

export const dateListedSchema = z.enum(['24h', '7d', '30d'])
export type DateListedOption = z.infer<typeof dateListedSchema>

export const notificationMethodSchema = z.enum(['email', 'sms', 'webhook'])
export type NotificationMethod = z.infer<typeof notificationMethodSchema>

export const searchCriteriaSchema = z.object({
  query: z.string().min(1),
  location: z.string().min(1),
  minPrice: z.string(),
  maxPrice: z.string(),
  dateListed: dateListedSchema,
})
export type SearchCriteria = z.infer<typeof searchCriteriaSchema>

export const monitoringSettingsSchema = z.object({
  frequency: z.string().min(1),
  listingsPerCheck: z.number().int().positive(),
  notifications: z.array(notificationMethodSchema),
})
export type MonitoringSettings = z.infer<typeof monitoringSettingsSchema>

export const activeSearchSchema = z.object({
  id: z.string(),
  criteria: searchCriteriaSchema,
  settings: monitoringSettingsSchema,
  status: searchStatusSchema,
  createdAt: z.coerce.date(),
  lastRun: z.coerce.date().optional(),
})
export type ActiveSearch = z.infer<typeof activeSearchSchema>

export interface CreateSearchPayload {
  criteria: SearchCriteria
  settings: MonitoringSettings
}

export interface UpdateSearchPayload {
  criteria: SearchCriteria
  settings: MonitoringSettings
}
