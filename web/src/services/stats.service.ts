////////////////////////////////////////////////////////////////////////////////////?TYPES
import type { StatsResponse } from '@/types/api-response.types'
import { apiUrl } from './api-url'
////////////////////////////////////////////////////////////////////////////////////////??

export async function getStats(): Promise<StatsResponse> {
  const res = await fetch(apiUrl('/api/stats'), { credentials: 'include' })

  if (!res.ok) {
    throw new Error('Failed to fetch stats')
  }

  return res.json()
}
