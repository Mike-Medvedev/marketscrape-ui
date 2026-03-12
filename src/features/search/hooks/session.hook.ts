import { useQuery } from "@tanstack/react-query";
import {
  getSessionStatusOptions,
  getSessionStatusQueryKey,
} from "@/generated/@tanstack/react-query.gen";
import { sessionStatusResponseSchema } from "@/features/search/search.types";
import type { SessionValidity } from "@/features/search/search.types";

export function useSessionStatus() {
  const { data, isFetching, refetch } = useQuery({
    ...getSessionStatusOptions(),
    refetchOnWindowFocus: true,
  });

  let status: SessionValidity = "unknown";
  if (data !== undefined) {
    const parsed = sessionStatusResponseSchema.safeParse(data);
    status = parsed.success && parsed.data.valid ? "valid" : "invalid";
  }

  return {
    status,
    isFetching,
    refetch,
    queryKey: getSessionStatusQueryKey(),
  };
}
