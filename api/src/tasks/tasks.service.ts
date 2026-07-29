////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cron, CronExpression } from '@nestjs/schedule'
////////////////////////////////////////////////////////////////////////////////??SERVICES
import { ImapService } from 'src/imap/imap.service'
import { PromptsService } from 'src/prompts/prompts.service'
import { AiService } from 'src/ai/ai.service'
import { ClassificationService } from 'src/ai/classification.service'
////////////////////////////////////////////////////////////////////////////////////////??

@Injectable()
export class TasksService implements OnModuleInit {
  private readonly logger = new Logger(TasksService.name)
  private polling = false
  private classifying = false

  constructor(
    private readonly configService: ConfigService,
    private readonly imapService: ImapService,
    private readonly promptsService: PromptsService,
    private readonly aiService: AiService,
    private readonly classificationService: ClassificationService,
  ) {}

  async onModuleInit() {
    this.pollAllAccountsOnce()
    this.startImapPolling()
  }

  private startImapPolling() {
    const seconds = Number(this.configService.get('IMAP_POLL_SECONDS') ?? 60)

    setInterval(() => {
      this.pollAllAccountsOnce()
    }, seconds * 1000)
  }

  private async pollAllAccountsOnce() {
    if (this.polling) return

    this.polling = true

    try {
      await this.imapService.pollAllAccountsOnce()
    } catch (error) {
      this.logger.error('[imap] poll error', error)
    } finally {
      this.polling = false
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    timeZone: 'Europe/London',
  })
  async runDailySummary() {
    try {
      this.logger.log('[summary] running AI summary cron job')

      const prompt = await this.promptsService.findLatest()
      if (!prompt) return

      const summary = await this.aiService.runPrompt({ ...prompt, timePeriod: 1 })

      this.logger.log(`[summary] generated ${summary.generatedAt.toISOString()}`)
    } catch (error) {
      this.logger.error('[summary] error', error)
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    timeZone: 'Europe/London',
  })
  async runClassifyMessages() {
    if (this.classifying) return

    this.classifying = true

    try {
      this.logger.log('[classification] running classification cron job')

      const { classified, skipped, remaining } = await this.classificationService.classifyPendingMessages()

      this.logger.log(`[classification] classified ${classified} messages, ${remaining} still unclassified`)

      if (skipped > 0) this.logger.warn(`[classification] skipped ${skipped} messages after batch failures`)
    } catch (error) {
      this.logger.error('[classification] error', error)
    } finally {
      this.classifying = false
    }
  }
}
