////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Injectable } from '@nestjs/common'
////////////////////////////////////////////////////////////////////////////////??SERVICES
import { SummariesService } from 'src/summaries/summary.service'
import { MessagesService } from 'src/messages/messages.service'
import { ModelService } from './models.service'
////////////////////////////////////////////////////////////////////////////////////??DTOS
import { RunPromptRequest } from 'src/prompts/dto/run-prompt.dto'
////////////////////////////////////////////////////////////////////////////////??ENTITIES
import { Summary } from 'src/summaries/entities/summary.entity'
//////////////////////////////////////////////////////////////////////////////////?SCHEMAS
import { summarySchema } from './schemas/summary.schema'
////////////////////////////////////////////////////////////////////////////////////////??

@Injectable()
export class AiService {
  private readonly llm

  constructor(
    private readonly messagesService: MessagesService,
    private readonly summaryService: SummariesService,
    readonly modelService: ModelService,
  ) {
    this.llm = modelService.summaryModel.withStructuredOutput(summarySchema, {
      name: 'classifications',
      method: 'jsonSchema',
    })
  }

  async runPrompt(request: RunPromptRequest): Promise<Summary> {
    const days = request.timePeriod ?? 7
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const statistics = await this.messagesService.getClassificationStatistics({ since })

    const response = await this.llm.invoke([
      {
        role: 'system',
        content: [
          request.prompt,
          `The emails below cover the last ${days} day(s), as of ${new Date().toISOString()}.`,
          'Only state facts present in the supplied data.',
        ].join('\n'),
      },
      {
        role: 'user',
        content: JSON.stringify(statistics),
      },
    ])

    return await this.summaryService.upsert(response)
  }
}
