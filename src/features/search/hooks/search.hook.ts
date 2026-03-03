import { useSuspenseQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getSearches,
  getSearchById,
  createSearch,
  updateSearch,
  deleteSearch,
} from '../service/search.service'
import type { CreateSearchPayload, UpdateSearchPayload } from '../search.types'

export const searchKeys = {
  all: ['searches'] as const,
  detail: (id: string) => ['searches', id] as const,
}

export function useSearches() {
  return useSuspenseQuery({
    queryKey: searchKeys.all,
    queryFn: getSearches,
  })
}

export function useSearch(id: string | undefined) {
  return useQuery({
    queryKey: searchKeys.detail(id!),
    queryFn: () => getSearchById(id!),
    enabled: !!id,
  })
}

export function useCreateSearch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateSearchPayload) => createSearch(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: searchKeys.all })
    },
  })
}

export function useUpdateSearch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateSearchPayload }) =>
      updateSearch(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: searchKeys.all })
      queryClient.invalidateQueries({ queryKey: searchKeys.detail(variables.id) })
    },
  })
}

export function useDeleteSearch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteSearch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: searchKeys.all })
    },
  })
}
