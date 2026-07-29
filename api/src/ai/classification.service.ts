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

// A classification tied back to a database row. The model itself never sees or returns message ids.
type MessageClassification = {
  id: string
  priority: ClassificationType['priority']
  topic: ClassificationType['topic']
}

type ClassifyBatchResult = {
  results: MessageClassification[]
  failedIds: string[]
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
        const batch = await this.classifyAllMessages(messages)

        classified += batch.results.length

        if (batch.failedIds.length > 0) {
          // Park the groups the model mishandled so the next pass moves on to fresh messages instead
          // of re-selecting the same failures forever.
          failedBatches++
          skippedIds.push(...batch.failedIds)
          errors.push(...batch.errors)

          if (failedBatches >= MAX_FAILED_BATCHES) break
        }
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

  // Each group is isolated: one group the model mishandles no longer discards the results of the
  // groups that succeeded alongside it.
  private async classifyAllMessages(messages: Message[]): Promise<ClassifyBatchResult> {
    const groups = this.chunk(messages, 40)

    const outcomes = await this.mapWithConcurrency(groups, 5, async (group) => {
      try {
        return { results: await this.clasifyGroup(group), failedIds: [] as string[], error: '' }
      } catch (error) {
        const reason = error instanceof Error ? error.message : String(error)

        this.logger.warn(`[classification] group of ${group.length} failed: ${reason}`)

        return { results: [] as MessageClassification[], failedIds: group.map((message) => message.id), error: reason }
      }
    })

    const results = outcomes.flatMap((outcome) => outcome.results)

    await this.saveClassifications(results)

    return {
      results,
      failedIds: outcomes.flatMap((outcome) => outcome.failedIds),
      errors: outcomes.map((outcome) => outcome.error).filter(Boolean),
    }
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

  private async saveClassifications(results: MessageClassification[]): Promise<void> {
    const buckets = new Map<string, { classification: MessageClassification; ids: string[] }>()

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

  private async clasifyGroup(messages: Message[]): Promise<MessageClassification[]> {
    const input = messages.map((message, index) => ({
      index,
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
          `Return exactly one result for every input email: ${messages.length} in, ${messages.length} out.`,
          'Copy the "index" of each email into your result for it.',
          'Do not omit or duplicate an index.',
        ].join('\n'),
      },
      {
        role: 'user',
        content: JSON.stringify(input),
      },
    ])

    this.validateResults(messages, response.results)

    // The model only ever handles positions; the database ids never leave this method.
    return response.results.map((result) => ({
      id: messages[result.index].id,
      priority: result.priority,
      topic: result.topic,
    }))
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
    const returnedIndexes = new Set(results.map((result) => result.index))

    if (results.length !== returnedIndexes.size) {
      throw new Error('The model returned duplicate indexes')
    }

    const missingIndexes = messages.map((_, index) => index).filter((index) => !returnedIndexes.has(index))

    const unknownIndexes = [...returnedIndexes].filter((index) => index >= messages.length)

    if (missingIndexes.length > 0 || unknownIndexes.length > 0) {
      throw new Error(
        `Invalid classification response for ${messages.length} emails. ` +
          `Missing indexes: ${missingIndexes.join(', ') || 'none'}. ` +
          `Out of range indexes: ${unknownIndexes.join(', ') || 'none'}.`,
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
