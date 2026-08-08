////////////////////////////////////////////////////////////////////////////////////?TYPES
import type { MessagesResponse, SubjectsResponse } from '@/types/api-response.types'
import { apiUrl } from './api-url'
////////////////////////////////////////////////////////////////////////////////////////??

export async function getMessages(params: URLSearchParams): Promise<MessagesResponse> {
  const query = params.toString()

  const res = await fetch(`${apiUrl('/api/messages')}${query ? `?${query}` : ''}`, {
    method: 'GET',
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch messages')
  }

  return res.json()
}

export async function getSubjects(params: URLSearchParams): Promise<SubjectsResponse> {
  const query = params.toString()

  const res = await fetch(`${apiUrl('/api/messages/subjects')}${query ? `?${query}` : ''}`, {
    method: 'GET',
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch subjects')
  }

  return res.json()
}
