import { useState, useRef, useCallback, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  executeSearchMutation,
  getSearchRunsQueryKey,
  getSearchRunResultsQueryKey,
  getSearchByIdQueryKey,
} from '@/generated/@tanstack/react-query.gen'
import type {
  GetSearchRunsResponse,
  GetSearchRunResultsResponse,
} from '@/generated/types.gen'
import { settings } from '@/settings'
import { supabase } from '@/infra/supabase.client'
import { toast } from '@/utils/toast.utils'
import { notifyApiError } from '@/errors/api-errors'
import { executionSSEEventSchema } from '@/features/search/search.types'
import type { ExecutionState } from '@/features/search/search.types'

interface UseSearchExecutionReturn {
  executionState: ExecutionState
  statusMessage: string | null
  listingCount: number | null
  completedRunId: string | null
  execute: () => void
  reset: () => void
  isExecuting: boolean
}

export function useSearchExecution(searchId: string): UseSearchExecutionReturn {
  const queryClient = useQueryClient()
  const [executionState, setExecutionState] = useState<ExecutionState>('idle')
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [listingCount, setListingCount] = useState<number | null>(null)
  const [completedRunId, setCompletedRunId] = useState<string | null>(null)

  const eventSourceRef = useRef<EventSource | null>(null)

  const closeEventSource = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
  }, [])

  const reset = useCallback(() => {
    closeEventSource()
    setExecutionState('idle')
    setStatusMessage(null)
    setListingCount(null)
    setCompletedRunId(null)
  }, [closeEventSource])

  const connectSSE = useCallback(
    async () => {
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token
      const url = new URL(
        `${settings.env.VITE_API_URL}/api/v1/searches/${searchId}/events`,
      )
      if (token) {
        url.searchParams.set('token', token)
      }

      const evtSource = new EventSource(url.toString())
      eventSourceRef.current = evtSource

      evtSource.onmessage = (event) => {
        const parsed = executionSSEEventSchema.safeParse(JSON.parse(event.data))
        if (!parsed.success) {
          return
        }

        const evt = parsed.data
        switch (evt.status) {
          case 'executing':
            setStatusMessage(evt.message ?? 'Searching marketplace...')
            break

          case 'completed': {
            setExecutionState('completed')
            setStatusMessage(
              `Found ${evt.listingCount} listing${evt.listingCount !== 1 ? 's' : ''}`,
            )
            setListingCount(evt.listingCount)
            setCompletedRunId(evt.runId)
            closeEventSource()

            const runsQueryKey = getSearchRunsQueryKey({ path: { id: searchId } })
            const newRun = {
              id: evt.runId,
              searchId,
              listingCount: evt.listingCount,
              executedAt: evt.executedAt,
            }
            queryClient.setQueryData<GetSearchRunsResponse>(runsQueryKey, (old) => {
              if (!old) return { success: true as const, data: [newRun] }
              return { ...old, data: [newRun, ...old.data] }
            })
            queryClient.invalidateQueries({ queryKey: runsQueryKey })
            queryClient.invalidateQueries({
              queryKey: getSearchByIdQueryKey({ path: { id: searchId } }),
            })

            toast.success({
              message: `Found ${evt.listingCount} listing${evt.listingCount !== 1 ? 's' : ''}`,
            })
            break
          }

          case 'failed':
            setExecutionState('failed')
            setStatusMessage(evt.message)
            closeEventSource()
            toast.error({ message: evt.message || 'Search execution failed' })
            break
        }
      }

      evtSource.onerror = () => {
        if (!eventSourceRef.current) return
        closeEventSource()
      }
    },
    [searchId, closeEventSource, queryClient],
  )

  const executeMut = useMutation({
    ...executeSearchMutation(),
    onSuccess: async (data) => {
      const { runId, executedAt, listings } = data.data
      const count = listings.length

      setExecutionState('completed')
      setStatusMessage(`Found ${count} listing${count !== 1 ? 's' : ''}`)
      setListingCount(count)
      setCompletedRunId(runId)
      closeEventSource()

      const runsQueryKey = getSearchRunsQueryKey({ path: { id: searchId } })
      const newRun = { id: runId, searchId, listingCount: count, executedAt }

      queryClient.setQueryData<GetSearchRunsResponse>(runsQueryKey, (old) => {
        if (!old) return { success: true as const, data: [newRun] }
        return { ...old, data: [newRun, ...old.data] }
      })

      const resultsQueryKey = getSearchRunResultsQueryKey({
        path: { id: searchId, runId },
      })
      queryClient.setQueryData<GetSearchRunResultsResponse>(resultsQueryKey, {
        success: true,
        data: { runId, executedAt, listings },
      })

      queryClient.invalidateQueries({ queryKey: runsQueryKey })
      queryClient.invalidateQueries({
        queryKey: getSearchByIdQueryKey({ path: { id: searchId } }),
      })

      toast.success({
        message: `Found ${count} listing${count !== 1 ? 's' : ''}`,
      })
    },
    onError: (error) => {
      setExecutionState('failed')
      setStatusMessage('Search execution failed')
      closeEventSource()
      notifyApiError(error, 'Failed to execute search. Please try again.')
    },
  })

  const execute = useCallback(() => {
    closeEventSource()
    setExecutionState('executing')
    setStatusMessage('Starting search...')
    setListingCount(null)
    setCompletedRunId(null)

    connectSSE()
    executeMut.mutate({ path: { id: searchId } })
  }, [searchId, closeEventSource, connectSSE, executeMut])

  useEffect(() => {
    return () => closeEventSource()
  }, [closeEventSource])

  return {
    executionState,
    statusMessage,
    listingCount,
    completedRunId,
    execute,
    reset,
    isExecuting: executionState === 'executing',
  }
}
