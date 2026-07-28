////////////////////////////////////////////////////////////////////////////////////?TYPES
import type { SummaryResponse } from '@/types/api-response.types'
////////////////////////////////////////////////////////////////////////////////////////??

export async function getLatestSummary(): Promise<SummaryResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/summary/latest`, { credentials: 'include' })

  if (!res.ok) {
    throw new Error('Failed to fetch latest summary')
  }

  return res.json()
}
