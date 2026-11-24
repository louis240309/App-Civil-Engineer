import type { ApiResponse, HealthStatus } from '../types/api'

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '')

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    signal,
    headers: { Accept: 'application/json' },
  })

  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null

  if (!response.ok || payload === null || !payload.success) {
    const message =
      payload !== null && !payload.success
        ? payload.error.message
        : `Request failed with status ${response.status}`
    throw new ApiError(message, response.status)
  }

  return payload.data
}

export function getHealth(signal?: AbortSignal): Promise<HealthStatus> {
  return request<HealthStatus>('/health', signal)
}
