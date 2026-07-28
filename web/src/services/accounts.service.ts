////////////////////////////////////////////////////////////////////////////////////?TYPES
import type { AccountsResponse } from '@/types/api-response.types'
////////////////////////////////////////////////////////////////////////////////////////??

export async function getAccounts(): Promise<AccountsResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/accounts`, { credentials: 'include' })

  if (!res.ok) {
    throw new Error('Failed to fetch accounts')
  }

  return res.json()
}
