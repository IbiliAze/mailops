////////////////////////////////////////////////////////////////////////////////////?TYPES
import type { SummaryResponse } from '@/types/api-response.types'
import { apiUrl } from './api-url'
////////////////////////////////////////////////////////////////////////////////////////??

export async function getLatestSummary(): Promise<SummaryResponse> {
  const res = await fetch(apiUrl('/api/summary/latest'), { credentials: 'include' })

  if (!res.ok) {
    throw new Error('Failed to fetch latest summary')
  }

  return res.json()
}
