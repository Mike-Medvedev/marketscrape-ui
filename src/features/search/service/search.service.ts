import { httpClient } from '@/infra/http.client'
import {
  searchRunsResponseSchema,
  searchRunResultResponseSchema,
} from '@/features/search/search.types'
import type { SearchRun, SearchRunResult } from '@/features/search/search.types'

// TODO: Replace with generated SDK functions after regenerating the OpenAPI client.

export async function getSearchRuns(searchId: string): Promise<SearchRun[]> {
  const response = await httpClient.get(`/api/v1/searches/${searchId}/runs`)
  const parsed = searchRunsResponseSchema.parse(response.data)
  return parsed.data
}

export async function getSearchRunResults(
  searchId: string,
  runId: string,
): Promise<SearchRunResult> {
  const response = await httpClient.get(
    `/api/v1/searches/${searchId}/runs/${runId}/results`,
  )
  const parsed = searchRunResultResponseSchema.parse(response.data)
  return parsed.data
}
