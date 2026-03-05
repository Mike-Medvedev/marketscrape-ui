import { useState, useCallback } from 'react'
import { apiErrorSchema } from '@/features/auth/auth.types'

export function getApiErrorCode(error: unknown): string | null {
  if (
    error !== null &&
    typeof error === 'object' &&
    'isAxiosError' in error &&
    (error as { isAxiosError: boolean }).isAxiosError
  ) {
    const data = (error as { response?: { data?: unknown } }).response?.data
    const result = apiErrorSchema.safeParse(data)
    if (result.success) {
      return result.data.error.code
    }
  }
  return null
}

export function useAuthError() {
  const [error, setError] = useState<string | null>(null)

  const clear = useCallback(() => setError(null), [])

  const handleError = useCallback(
    (err: unknown, codeMap: Record<string, string>, fallback: string) => {
      const code = getApiErrorCode(err)
      if (code && codeMap[code]) {
        setError(codeMap[code])
      } else {
        setError(fallback)
      }
    },
    [],
  )

  return { error, setError, clear, handleError }
}
