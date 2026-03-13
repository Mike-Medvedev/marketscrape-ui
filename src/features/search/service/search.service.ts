import type { ActiveSearch, CreateSearchPayload } from "@/features/search/search.types";

export function findDuplicateSearch(
  existingSearches: ActiveSearch[],
  payload: CreateSearchPayload,
  excludeId?: string,
): ActiveSearch | undefined {
  return existingSearches.find((s) => {
    if (excludeId && s.id === excludeId) return false;

    return (
      s.query === payload.query &&
      s.location === payload.location &&
      s.minPrice === (payload.minPrice ?? 0) &&
      s.maxPrice === (payload.maxPrice ?? null) &&
      s.dateListed === payload.dateListed &&
      s.frequency === payload.frequency &&
      s.listingsPerCheck === (payload.listingsPerCheck ?? 1) &&
      s.notificationType === payload.notificationType &&
      s.notificationTarget === payload.notificationTarget &&
      (s.prompt ?? null) === (payload.prompt ?? null)
    );
  });
}
