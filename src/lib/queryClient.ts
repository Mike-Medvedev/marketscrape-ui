import { QueryClient } from '@tanstack/react-query'

/**
 * Shared QueryClient with sensible defaults (TanStack Query best practices).
 * - staleTime: 1 min default — reduce refetches; override per-query for volatile data.
 * - gcTime: 10 min — keep inactive cache for back-navigation.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
})
