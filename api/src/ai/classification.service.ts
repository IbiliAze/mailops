import { Injectable } from '@nestjs/common'
import { ModelService } from './models.service'
import { classificationBatchSchema, ClassificationBatchType, ClassificationType } from './schemas/classification.schma'
import { Repository } from 'typeorm'
import { Message } from 'src/messages/entities/message.entity'

@Injectable()
export class ClassificationService {
  private readonly classifierLlm

  constructor(
    readonly modelService: ModelService,
    private readonly messageRepository: Repository<Message>,
  ) {
    this.classifierLlm = modelService.classicationModel.withStructuredOutput(classificationBatchSchema, {
      name: 'classifications',
      method: 'jsonSchema',
    })
  }

  async classifyAllMessages(messages: Message[]): Promise<ClassificationBatchType['results']> {
    const groups = this.chunk(messages, 40)

    const groupedResults = await this.mapWithConcurrency(groups, 5, async (group) => this.clasifyGroup(group))

    const classifiedMessages = groupedResults.flat()

    await this.saveClassifications(classifiedMessages)

    return classifiedMessages
  }

  private async saveClassifications(results: ClassificationBatchType['results']): Promise<Message[]> {
    return await this.messageRepository.save(results)
  }

  private async clasifyGroup(messages: Message[]): Promise<ClassificationType> {
    const input = messages.map((message) => ({
      id: message.id,
      subject: message.subject ?? '',
      body: this.trimMessageBody(message.text),
    }))

    const response = await this.classifierLlm.invoke([
      {
        role: 'system',
        content: [
          'Classify every email provided.',
          '',
          'Priority definitions:',
          '- urgent: requires immediate attention or has a critical deadline',
          '- high: strong commercial intent or important action required',
          '- medium: relevant but not time-sensitive',
          '- low: informational, weak intent, or little required action',
          '',
          'Topic definitions:',
          '- sales: leads, pricing, purchasing, demos, contracts, renewals',
          '- marketing: campaigns, promotions, newsletters, advertising, branding',
          '',
          'Return exactly one result for every input email.',
          'Copy every email ID exactly.',
          'Do not omit or duplicate IDs.',
        ].join('\n'),
      },
      {
        role: 'user',
        content: JSON.stringify(input),
      },
    ])

    this.validateResults(messages, response.results)
    return response.results
  }

  private chunk<T>(items: T[], size: number): T[][] {
    const chunks: T[][] = []

    for (let index = 0; index < items.length; index += size) {
      chunks.push(items.slice(index, index + size))
    }

    return chunks
  }

  private async mapWithConcurrency<T, R>(items: T[], concurrency: number, callback: (item: T) => Promise<R>): Promise<R[]> {
    const results: R[] = new Array(items.length)
    let nextIndex = 0

    async function worker(): Promise<void> {
      while (true) {
        const currentIndex = nextIndex++

        if (currentIndex >= items.length) {
          return
        }

        results[currentIndex] = await callback(items[currentIndex])
      }
    }

    await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()))

    return results
  }

  private validateResults(messages: Message[], results: ClassificationBatchType['results']): void {
    const expectedIds = new Set(messages.map((message) => message.id))
    const returnedIds = new Set(results.map((result) => result.id))

    if (results.length !== returnedIds.size) {
      throw new Error('The model returned duplicate message IDs')
    }

    const missingIds = [...expectedIds].filter((id) => !returnedIds.has(id))

    const unknownIds = [...returnedIds].filter((id) => !expectedIds.has(id))

    if (missingIds.length > 0 || unknownIds.length > 0) {
      throw new Error(
        `Invalid classification response. ` +
          `Missing IDs: ${missingIds.join(', ') || 'none'}. ` +
          `Unknown IDs: ${unknownIds.join(', ') || 'none'}.`,
      )
    }
  }

  private trimMessageBody(body: string, maxCharacters = 1_000): string {
    const normalized = body.trim()

    if (normalized.length <= maxCharacters) {
      return normalized
    }

    const firstPartLength = Math.ceil(maxCharacters * 0.7)
    const lastPartLength = maxCharacters - firstPartLength

    return [normalized.slice(0, firstPartLength), '[...truncated...]', normalized.slice(-lastPartLength)].join('\n')
  }
}
