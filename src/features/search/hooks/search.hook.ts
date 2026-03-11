import {
  useSuspenseQuery,
  useQuery,
  useMutation,
  useQueryClient,
  queryOptions,
} from "@tanstack/react-query";
import {
  getSearchesOptions,
  getSearchesQueryKey,
  getSearchByIdOptions,
  getSearchByIdQueryKey,
  createSearchMutation,
  updateSearchMutation,
  deleteSearchMutation,
  postScrapeMutation,
} from "@/generated/@tanstack/react-query.gen";
import type { Options } from "@/generated/sdk.gen";
import type { UpdateSearchData } from "@/generated/types.gen";
import {
  getSearchRuns,
  getSearchRunResults,
} from "@/features/search/service/search.service";
import { toast } from "@/utils/toast.utils";
import { notifyApiError } from "@/errors/api-errors";

export const searchRunsQueryKey = (searchId: string) =>
  ["searchRuns", searchId] as const;

export const searchRunResultsQueryKey = (searchId: string, runId: string) =>
  ["searchRunResults", searchId, runId] as const;

export const searchRunsOptions = (searchId: string) =>
  queryOptions({
    queryKey: searchRunsQueryKey(searchId),
    queryFn: () => getSearchRuns(searchId),
  });

export const searchRunResultsOptions = (searchId: string, runId: string) =>
  queryOptions({
    queryKey: searchRunResultsQueryKey(searchId, runId),
    queryFn: () => getSearchRunResults(searchId, runId),
    staleTime: Infinity,
    gcTime: 30 * 60 * 1000,
  });

export function useSearches() {
  return useSuspenseQuery({
    ...getSearchesOptions(),
  });
}

export function useSearch(id: string | undefined) {
  return useQuery({
    ...getSearchByIdOptions({ path: { id: id! } }),
    enabled: !!id,
  });
}

export function useCreateSearch() {
  const queryClient = useQueryClient();
  return useMutation({
    ...createSearchMutation(),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: getSearchesQueryKey() });
      toast.success({ message: `Search for "${data.data.query}" created` });
    },
    onError: (error) => {
      notifyApiError(error, "Failed to create search. Please try again.");
    },
  });
}

export function useUpdateSearch() {
  const queryClient = useQueryClient();
  return useMutation({
    ...updateSearchMutation(),
    onSuccess: async (data, variables: Options<UpdateSearchData>) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getSearchesQueryKey() }),
        queryClient.invalidateQueries({
          queryKey: getSearchByIdQueryKey({ path: { id: variables.path!.id } }),
        }),
      ]);
      toast.success({ message: `Search for "${data.data.query}" updated` });
    },
    onError: (error) => {
      notifyApiError(error, "Failed to update search. Please try again.");
    },
  });
}

export function useDeleteSearch() {
  const queryClient = useQueryClient();
  return useMutation({
    ...deleteSearchMutation(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: getSearchesQueryKey() });
      toast.success({ message: "Search deleted" });
    },
    onError: (error) => {
      notifyApiError(error, "Failed to delete search. Please try again.");
    },
  });
}

export function useExecuteSearch(searchId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    ...postScrapeMutation(),
    onSuccess: async (data) => {
      const count = data.data.listings.length;
      toast.success({ message: `Found ${count} listing${count !== 1 ? "s" : ""}` });
      if (searchId) {
        await queryClient.invalidateQueries({
          queryKey: searchRunsQueryKey(searchId),
        });
      }
    },
    onError: (error) => {
      notifyApiError(error, "Failed to execute search. Please try again.");
    },
  });
}

export function useSearchRuns(searchId: string) {
  return useSuspenseQuery(searchRunsOptions(searchId));
}

export function useSearchRunResults(searchId: string, runId: string | null) {
  return useQuery({
    ...searchRunResultsOptions(searchId, runId ?? ""),
    enabled: !!runId,
  });
}
