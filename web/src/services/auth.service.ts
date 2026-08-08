////////////////////////////////////////////////////////////////////////////////////?TYPES
import type { UserAuthResponse, LogoutResponse } from '@/types/api-response.types'
import { apiUrl } from './api-url'
////////////////////////////////////////////////////////////////////////////////////////??

export type LoginRequest = {
  username: string
  password: string
}

export async function login(request: LoginRequest): Promise<UserAuthResponse> {
  const res = await fetch(apiUrl('/api/auth/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(request),
  })

  if (!res.ok) {
    throw new Error('Failed to login')
  }

  return res.json()
}

export async function logout(): Promise<LogoutResponse> {
  const res = await fetch(apiUrl('/api/auth/logout'), {
    method: 'POST',
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error('Failed to logout')
  }

  return res.json()
}

export async function getMe(): Promise<UserAuthResponse | null> {
  const res = await fetch(apiUrl('/api/auth/me'), {
    credentials: 'include',
  })

  if (res.status === 401) {
    return null
  }

  if (!res.ok) {
    throw new Error('Failed to fetch me')
  }

  return res.json()
}
