////////////////////////////////////////////////////////////////////////////////////?TYPES
import type { StatsResponse } from '@/types/api-response.types'
////////////////////////////////////////////////////////////////////////////////////////??

export async function getStats(): Promise<StatsResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stats`, { credentials: 'include' })

  if (!res.ok) {
    throw new Error('Failed to fetch stats')
  }

  return res.json()
}
