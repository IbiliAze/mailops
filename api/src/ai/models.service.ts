import { ChatOpenAI } from '@langchain/openai'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ModelService {
  classicationModel = new ChatOpenAI({
    model: 'gpt-5-nano',
    configuration: { maxRetries: 3 },
  })

  summaryModel = new ChatOpenAI({
    model: 'gpt-4o-mini',
    configuration: { maxRetries: 3 },
  })
}
