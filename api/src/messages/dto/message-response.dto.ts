////////////////////////////////////////////////////////////////////////////////??ENTITIES
import { Message } from '../entities/message.entity'
////////////////////////////////////////////////////////////////////////////////////////??

export class MessageResponse {
  message!: string
  emailMessage!: Message
}

export class MessagesResponse {
  message!: string
  messages!: Message[]
  page?: number
  limit?: number
  total?: number
}

export class SubjectsResponse {
  message!: string
  subjects!: string[]
}
