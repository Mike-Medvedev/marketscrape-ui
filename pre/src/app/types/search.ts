export type SearchStatus = "running" | "refresh" | "error";

export type DateListedOption = "24h" | "7d" | "30d";

export type NotificationMethod = "email" | "sms" | "webhook";

export interface SearchCriteria {
  query: string;
  location: string;
  minPrice: string;
  maxPrice: string;
  dateListed: DateListedOption;
}

export interface MonitoringSettings {
  frequency: string;
  listingsPerCheck: number;
  notifications: NotificationMethod[];
}

export interface ActiveSearch {
  id: string;
  criteria: SearchCriteria;
  settings: MonitoringSettings;
  status: SearchStatus;
  createdAt: Date;
  lastRun?: Date;
}
