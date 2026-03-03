import {
  useSuspenseQuery,
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import {
  getSearchesOptions,
  getSearchesQueryKey,
  getSearchByIdOptions,
  getSearchByIdQueryKey,
  createSearchMutation,
  updateSearchMutation,
  deleteSearchMutation,
} from '../../../generated/@tanstack/react-query.gen'
import type { Options } from '../../../generated/sdk.gen'
import type { UpdateSearchData } from '../../../generated/types.gen'
import { toast } from '../../../utils/toast.utils'

export function useSearches() {
  return useSuspenseQuery({
    ...getSearchesOptions(),
  })
}

export function useSearch(id: string | undefined) {
  return useQuery({
    ...getSearchByIdOptions({ path: { id: id! } }),
    enabled: !!id,
  })
}

export function useCreateSearch() {
  const queryClient = useQueryClient()
  return useMutation({
    ...createSearchMutation(),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: getSearchesQueryKey() })
      toast.success({ message: `Search for "${data.criteria.query}" created` })
    },
    onError: () => {
      toast.error({ message: 'Failed to create search. Please try again.' })
    },
  })
}

export function useUpdateSearch() {
  const queryClient = useQueryClient()
  return useMutation({
    ...updateSearchMutation(),
    onSuccess: async (data, variables: Options<UpdateSearchData>) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getSearchesQueryKey() }),
        queryClient.invalidateQueries({ queryKey: getSearchByIdQueryKey({ path: { id: variables.path!.id } }) }),
      ])
      toast.success({ message: `Search for "${data.criteria.query}" updated` })
    },
    onError: () => {
      toast.error({ message: 'Failed to update search. Please try again.' })
    },
  })
}

export function useDeleteSearch() {
  const queryClient = useQueryClient()
  return useMutation({
    ...deleteSearchMutation(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: getSearchesQueryKey() })
      toast.success({ message: 'Search deleted' })
    },
    onError: () => {
      toast.error({ message: 'Failed to delete search. Please try again.' })
    },
  })
}
