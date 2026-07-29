////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, IsNull, Not, Repository } from 'typeorm'
////////////////////////////////////////////////////////////////////////////////??SERVICES
import { ModelService } from './models.service'
////////////////////////////////////////////////////////////////////////////////??ENTITIES
import { Message } from 'src/messages/entities/message.entity'
/////////////////////////////////////////////////////////////////////////////////??SCHEMAS
import { classificationBatchSchema, ClassificationBatchType, ClassificationType } from './schemas/classification.schma'
////////////////////////////////////////////////////////////////////////////////////////??

// How many batches may fail before a run gives up instead of burning the whole budget on errors.
const MAX_FAILED_BATCHES = 3

type ClassifyPendingOptions = {
  batchSize?: number
  maxMessages?: number
  timeBudgetMs?: number
}

export type ClassifyPendingResult = {
  classified: number
  skipped: number
  remaining: number
  errors: string[]
}

@Injectable()
export class ClassificationService {
  private readonly logger = new Logger(ClassificationService.name)
  private readonly classifierLlm

  constructor(
    readonly modelService: ModelService,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {
    this.classifierLlm = modelService.classicationModel.withStructuredOutput(classificationBatchSchema, {
      name: 'classifications',
      method: 'jsonSchema',
    })
  }

  async classifyPendingMessages({
    batchSize = 500,
    maxMessages = 10_000,
    timeBudgetMs = 30 * 60 * 1_000,
  }: ClassifyPendingOptions = {}): Promise<ClassifyPendingResult> {
    const startedAt = Date.now()
    const skippedIds: string[] = []
    const errors: string[] = []
    let classified = 0
    let failedBatches = 0

    while (classified < maxMessages && Date.now() - startedAt < timeBudgetMs) {
      const take = Math.min(batchSize, maxMessages - classified)
      const messages = await this.findUnclassified(take, skippedIds)

      if (messages.length === 0) break

      try {
        const results = await this.classifyAllMessages(messages)
        classified += results.length
      } catch (error) {
        failedBatches++
        skippedIds.push(...messages.map((message) => message.id))

        // A skipped batch is otherwise invisible: the ids are parked and the loop moves on, so the
        // reason has to be recorded here or it is lost entirely.
        const reason = error instanceof Error ? error.message : String(error)

        errors.push(reason)
        this.logger.error(`[classification] batch of ${messages.length} failed: ${reason}`, (error as Error)?.stack)

        if (failedBatches >= MAX_FAILED_BATCHES) throw error
      }
    }

    return { classified, skipped: skippedIds.length, remaining: await this.countUnclassified(), errors }
  }

  private async classifyAllMessages(messages: Message[]): Promise<ClassificationBatchType['results']> {
    const groups = this.chunk(messages, 40)

    const groupedResults = await this.mapWithConcurrency(groups, 5, async (group) => this.clasifyGroup(group))

    const classifiedMessages = groupedResults.flat()

    await this.saveClassifications(classifiedMessages)

    return classifiedMessages
  }

  private async findUnclassified(limit = 500, excludeIds: string[] = []): Promise<Message[]> {
    return await this.messageRepository.find({
      where: { topic: IsNull(), ...(excludeIds.length > 0 && { id: Not(In(excludeIds)) }) },
      select: { id: true, subject: true, text: true },
      order: { date: 'DESC' },
      take: limit,
    })
  }

  private async countUnclassified(): Promise<number> {
    return await this.messageRepository.count({ where: { topic: IsNull() } })
  }

  private async saveClassifications(results: ClassificationBatchType['results']): Promise<void> {
    const buckets = new Map<string, { classification: ClassificationType; ids: string[] }>()

    for (const result of results) {
      const key = `${result.priority}:${result.topic}`
      const bucket = buckets.get(key) ?? { classification: result, ids: [] }

      bucket.ids.push(result.id)
      buckets.set(key, bucket)
    }

    for (const { classification, ids } of buckets.values()) {
      for (const idChunk of this.chunk(ids, 1_000)) {
        await this.messageRepository.update(
          { id: In(idChunk) },
          { priority: classification.priority, topic: classification.topic },
        )
      }
    }
  }

  private async clasifyGroup(messages: Message[]): Promise<ClassificationBatchType['results']> {
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
    const results: R[] = new Array<R>(items.length)
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
