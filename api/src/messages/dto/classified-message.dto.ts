export class ClassifiedMessage {
  id!: string
  threadId!: string
  topic!: string
  priority!: string
  from!: string
  date?: Date
  seen!: boolean
  answered!: boolean
  subject!: string
  trimmedText!: string
}
