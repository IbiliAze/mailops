////////////////////////////////////////////////////////////////////////////////////?TYPES
import type { AccountsResponse } from '@/types/api-response.types'
import { apiUrl } from './api-url'
////////////////////////////////////////////////////////////////////////////////////////??

export async function getAccounts(): Promise<AccountsResponse> {
  const res = await fetch(apiUrl('/api/accounts'), { credentials: 'include' })

  if (!res.ok) {
    throw new Error('Failed to fetch accounts')
  }

  return res.json()
}
