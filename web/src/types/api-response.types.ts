////////////////////////////////////////////////////////////////////////////////////?TYPES
import type { Account } from './account.types'
import type { Message } from './message.types'
import type { Prompt } from './prompt.types'
import type { Stats } from './stats.types'
import type { Summary } from './summary.types'
import type { User } from './user.types'
////////////////////////////////////////////////////////////////////////////////////////??

export type UserResponse = {
  message: string
  user: User
}

export type UsersResponse = {
  message: string
  users: User[]
}

export type UserAuthResponse = {
  message: string
  user: User
}

export type MeResponse = {
  message: 'Logged in session fetched'
  user: User
}

export type LogoutResponse = {
  message: string
}

export type AccountResponse = {
  message: string
  account: Account
}

export type AccountsResponse = {
  message: string
  accounts: Account[]
}

export type SummaryResponse = {
  message: string
  // Null until the first summary has been generated.
  summary: Summary | null
}

export type PromptResponse = {
  message: string
  prompt: Prompt
}

export type RunPromptResponse = {
  message: string
  summary: Summary
}

export type ClassifyMessagesResponse = {
  message: string
}

export type MessageResponse = {
  message: string
  emailMessage: Message
}

export type MessagesResponse = {
  message: string
  messages: Message[]
  page?: number
  limit?: number
  total?: number
}

export type SubjectsResponse = {
  message: string
  subjects: string[]
}

export type StatsResponse = {
  message: string
  stats: Stats
}
