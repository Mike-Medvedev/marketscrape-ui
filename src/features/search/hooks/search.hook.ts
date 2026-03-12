import {
  useSuspenseQuery,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getSearchesOptions,
  getSearchesQueryKey,
  getSearchByIdOptions,
  getSearchByIdQueryKey,
  getSearchRunsOptions,
  getSearchRunsQueryKey,
  getSearchRunResultsOptions,
  createSearchMutation,
  updateSearchMutation,
  deleteSearchMutation,
  executeSearchMutation,
} from "@/generated/@tanstack/react-query.gen";
import type { Options } from "@/generated/sdk.gen";
import type { UpdateSearchData } from "@/generated/types.gen";
import { toast } from "@/utils/toast.utils";
import { notifyApiError } from "@/errors/api-errors";

export function useSearches() {
  return useSuspenseQuery({
    ...getSearchesOptions(),
  });
}

export function useSearch(id: string) {
  return useSuspenseQuery({
    ...getSearchByIdOptions({ path: { id } }),
  });
}

export function useSearchConditional(id: string | undefined) {
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
      queryClient.removeQueries({ queryKey: getSearchesQueryKey() });
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
      queryClient.removeQueries({ queryKey: getSearchesQueryKey() });
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

export function useExecuteSearch(searchId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    ...executeSearchMutation(),
    onSuccess: async (data) => {
      const count = data.data.listings.length;
      toast.success({ message: `Found ${count} listing${count !== 1 ? "s" : ""}` });
      await queryClient.invalidateQueries({
        queryKey: getSearchRunsQueryKey({ path: { id: searchId } }),
      });
    },
    onError: (error) => {
      notifyApiError(error, "Failed to execute search. Please try again.");
    },
  });
}

export function useSearchRuns(searchId: string) {
  return useSuspenseQuery({
    ...getSearchRunsOptions({ path: { id: searchId } }),
  });
}

export function useSearchRunResults(searchId: string, runId: string | null) {
  return useQuery({
    ...getSearchRunResultsOptions({ path: { id: searchId, runId: runId ?? "" } }),
    staleTime: Infinity,
    gcTime: 30 * 60 * 1000,
    enabled: !!runId,
  });
}
