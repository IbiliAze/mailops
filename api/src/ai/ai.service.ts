////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
////////////////////////////////////////////////////////////////////////////////??SERVICES
import { SummariesService } from 'src/summaries/summary.service'
import { MessagesService } from 'src/messages/messages.service'
////////////////////////////////////////////////////////////////////////////////////??DTOS
import { CompactMessage } from 'src/messages/dto/compact-message.dto'
import { MessageFilters } from 'src/messages/dto/message-filters.dto'
import { RunPromptRequest } from 'src/prompts/dto/run-prompt.dto'
////////////////////////////////////////////////////////////////////////////////??ENTITIES
import { Summary } from 'src/summaries/entities/summary.entity'
////////////////////////////////////////////////////////////////////////////////?TEMPLATES
import { FINAL_SUMMARY_TEMPLATE } from './templates/final-summary.template'
import { EMPTY_EMAIL_SUMMARY_TEMPLATE } from './templates/empty-summary.template'
import { COMBINED_SUMMARY_TEMPLATE } from './templates/combined-summary.template'
import { SUMMARY_TEMPLATE } from './templates/summary.template'
////////////////////////////////////////////////////////////////////////////////////?UTILS
import { chunkByCharLimit } from 'src/common/utils/chunk.util'
import { dateKeyInTz } from 'src/common/utils/date.util'
////////////////////////////////////////////////////////////////////////////////////////??

type ChatMessage = { role: 'system' | 'user'; content: string }

@Injectable()
export class AiService {
  private readonly timezone: string
  private readonly openAiApiKey: string
  private readonly openAiModel: string

  constructor(
    private readonly messagesService: MessagesService,
    private readonly summaryService: SummariesService,
    private readonly configService: ConfigService,
  ) {
    this.timezone = this.configService.get<string>('TIMEZONE') || 'Europe/London'
    this.openAiApiKey = this.configService.getOrThrow<string>('OPENAI_API_KEY')
    this.openAiModel = this.configService.get<string>('OPENAI_MODEL') || 'gpt-4o-mini'
  }

  async run(prompt: RunPromptRequest): Promise<Summary> {
    const todayKey = dateKeyInTz(this.timezone)
    const timePeriod = prompt?.timePeriod ?? 30
    const start = new Date(Date.now() - timePeriod * 24 * 60 * 60 * 1000)
    const query: MessageFilters = { dateFrom: start }

    if (prompt?.subject) query.subject = prompt.subject

    const { messages } = await this.messagesService.findAll(query)
    const relevantMessages = messages.filter(
      (m) => m.mailbox?.toUpperCase().includes('INBOX') || m.mailbox?.toUpperCase().includes('SENT'),
    )

    console.log('Relevant messages:', relevantMessages.length)

    if (!relevantMessages.length) {
      const summary = await this.summaryService.findByDateKey(todayKey)
      if (!summary) return await this.summaryService.create({ content: EMPTY_EMAIL_SUMMARY_TEMPLATE, dateKey: todayKey })
      return await this.summaryService.update(summary.id, { content: EMPTY_EMAIL_SUMMARY_TEMPLATE, dateKey: todayKey })
    }

    const content = await this.summariseLargeEmailSet({
      promptText: prompt.prompt,
      compactMessages: relevantMessages.map((m) => m.getCompactMessage()),
    })

    const summary = await this.summaryService.findByDateKey(todayKey)
    if (!summary) return await this.summaryService.create({ content, dateKey: todayKey })
    return await this.summaryService.update(summary.id, { content, dateKey: todayKey })
  }

  private async summariseChunks(promptText: string, chunks: CompactMessage[][]): Promise<string[]> {
    const summaries: string[] = []

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]

      const content = await this.callOpenAIWithRetry([
        { role: 'system', content: SUMMARY_TEMPLATE({ chunk, i, promptText, total: chunks.length }) },
        { role: 'user', content: this.serializeMessages(chunk) },
      ])

      summaries.push(content)

      // small throttle
      await new Promise((res) => setTimeout(res, 300))
    }

    return summaries
  }

  private serializeMessages(messages: CompactMessage[]): string {
    return messages
      .map((m) => {
        const text = (m.text ?? '').slice(0, 100)

        return `From: ${m.from}\nSubject: ${m.subject}\nDate: ${m.date}\nMailbox: ${m.mailbox}\nText: ${text}`
      })
      .join('\n\n')
  }

  private async reduceSummaries(promptText: string, summaries: string[]): Promise<string[]> {
    const MAX_CHARS = 80_000

    const chunks = chunkByCharLimit(summaries, (s) => s, MAX_CHARS)

    if (chunks.length <= 1) return summaries

    const reduced: string[] = []

    for (let i = 0; i < chunks.length; i++) {
      const combined = chunks[i].join('\n\n')

      const content = await this.callOpenAIWithRetry([
        { role: 'system', content: COMBINED_SUMMARY_TEMPLATE(promptText) },
        { role: 'user', content: combined },
      ])

      reduced.push(content)

      await new Promise((res) => setTimeout(res, 300))
    }

    return this.reduceSummaries(promptText, reduced)
  }

  private async callOpenAIWithRetry(chatMessages: ChatMessage[], retries = 5): Promise<string> {
    try {
      return await this.callOpenAI(chatMessages)
    } catch (err: any) {
      const msg = err?.message || ''

      if (msg.includes('rate limit') && retries > 0) {
        const wait = 2000
        console.warn(`⚠️ Rate limited. Retrying in ${wait}ms...`)
        await new Promise((res) => setTimeout(res, wait))
        return this.callOpenAIWithRetry(chatMessages, retries - 1)
      }

      throw err
    }
  }

  private async callOpenAI(chatMessages: ChatMessage[]): Promise<string> {
    try {
      // No official SDK required; simple fetch (works everywhere)
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.openAiApiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: this.openAiModel, temperature: 0.2, messages: chatMessages }),
      })

      if (!res.ok) {
        const txt = await res.text()
        throw new Error(`OpenAI error: ${res.status} ${txt}`)
      }

      const data: any = await res.json()
      return data.choices?.[0]?.message?.content ?? ''
    } catch (e) {
      console.error(e)
      return (e as Error)?.message
    }
  }

  private async summariseLargeEmailSet({
    compactMessages,
    promptText,
  }: {
    promptText: string
    compactMessages: CompactMessage[]
  }) {
    const trimmedMessages = this.getTrimmedMessages(compactMessages)

    const emailChunks = chunkByCharLimit(trimmedMessages, (m) => JSON.stringify(m), 50_000)

    console.log(`Chunks created: ${emailChunks.length}`)

    const chunkSummaries = await this.summariseChunks(promptText, emailChunks)

    const reduced = await this.reduceSummaries(promptText, chunkSummaries)

    const totalEmails = compactMessages.length

    const finalSummary = await this.callOpenAIWithRetry([
      { role: 'system', content: FINAL_SUMMARY_TEMPLATE({ promptText, totalEmails }) },
      { role: 'user', content: `TOTAL EMAILS: ${totalEmails}\n\n` + reduced.join('\n\n') },
    ])

    return finalSummary
  }

  private getTrimmedMessages(messages: CompactMessage[]): CompactMessage[] {
    return messages.map((m) => ({
      ...m,
      text: (m.text ?? '').slice(0, 100),
    }))
  }
}
