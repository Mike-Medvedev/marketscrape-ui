import { useQuery } from "@tanstack/react-query";
import {
  getSessionStatusOptions,
  getSessionStatusQueryKey,
} from "@/generated/@tanstack/react-query.gen";
import type { SessionValidity } from "@/features/search/search.types";

export function useSessionStatus() {
  const { data, isFetching, refetch } = useQuery({
    ...getSessionStatusOptions(),
    refetchOnWindowFocus: true,
  });

  let status: SessionValidity = "unknown";
  if (data !== undefined) {
    status = data.data.valid ? "valid" : "invalid";
  }

  return {
    status,
    isFetching,
    refetch,
    queryKey: getSessionStatusQueryKey(),
  };
}
