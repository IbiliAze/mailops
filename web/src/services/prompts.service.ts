////////////////////////////////////////////////////////////////////////////////////?TYPES
import type { PromptResponse, RunPromptResponse } from '@/types/api-response.types'
import type { Prompt, TimePeriod } from '@/types/prompt.types'
////////////////////////////////////////////////////////////////////////////////////////??

export type RunPromptRequest = {
  prompt: string
  subject?: string | null
  timePeriod?: TimePeriod | null
}

export type SavePromptRequest = {
  id?: string
  prompt: string
  subject?: string | null
  timePeriod?: TimePeriod | null
}

export async function getPrompt(): Promise<PromptResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prompt`, { credentials: 'include' })

  if (!res.ok) {
    throw new Error('Failed to fetch prompt')
  }

  return res.json()
}

export async function savePrompt(prompt: SavePromptRequest): Promise<PromptResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prompt`, {
    credentials: 'include',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prompt),
  })

  if (!res.ok) {
    throw new Error('Failed to save prompt')
  }

  return res.json()
}

export async function runPrompt(prompt: RunPromptRequest): Promise<RunPromptResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prompt/run`, {
    credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prompt),
  })

  if (!res.ok) {
    throw new Error('Failed to run prompt')
  }

  return res.json()
}
