import {
  useSuspenseQuery,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getSearches,
  getSearchById,
  createSearch,
  updateSearch,
  deleteSearch,
} from "../service/search.service";
import type { CreateSearchPayload, UpdateSearchPayload } from "../search.types";
import { toast } from "../../../utils/toast.utils";

export const searchKeys = {
  all: ["searches"] as const,
  detail: (id: string) => ["searches", id] as const,
};

export function useSearches() {
  return useSuspenseQuery({
    queryKey: searchKeys.all,
    queryFn: getSearches,
  });
}

export function useSearch(id: string | undefined) {
  return useQuery({
    queryKey: searchKeys.detail(id!),
    queryFn: () => getSearchById(id!),
    enabled: !!id,
  });
}

export function useCreateSearch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSearchPayload) => createSearch(payload),
    onSuccess: (data) => {
      queryClient
        .invalidateQueries({ queryKey: searchKeys.all })
        .then(() =>
          toast.success({
            message: `Search for "${data.criteria.query}" created`,
          }),
        );
    },
    onError: () => {
      toast.error({ message: "Failed to create search. Please try again." });
    },
  });
}

export function useUpdateSearch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateSearchPayload;
    }) => updateSearch(id, payload),
    onSuccess: async (data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: searchKeys.all }),
        queryClient.invalidateQueries({
          queryKey: searchKeys.detail(variables.id),
        }),
      ]);

      toast.success({ message: `Search for "${data.criteria.query}" updated` });
    },
    onError: () => {
      toast.error({ message: "Failed to update search. Please try again." });
    },
  });
}

export function useDeleteSearch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSearch(id),
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: searchKeys.all })
        .then(() => toast.success({ message: "Search deleted" }));
    },
    onError: () => {
      toast.error({ message: "Failed to delete search. Please try again." });
    },
  });
}
