////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
////////////////////////////////////////////////////////////////////////////////??ENTITIES
import { Summary } from 'src/summaries/entities/summary.entity'
import { Prompt } from './entities/prompt.entity'
////////////////////////////////////////////////////////////////////////////////??SERVICES
import { AiService } from 'src/ai/ai.service'
import { ClassificationService, type ClassifyPendingResult } from 'src/ai/classification.service'
////////////////////////////////////////////////////////////////////////////////////??DTOS
import { UpsertPromptRequest } from './dto/upsert-prompt.dto'
import { RunPromptRequest } from './dto/run-prompt.dto'
////////////////////////////////////////////////////////////////////////////////////////??

@Injectable()
export class PromptsService {
  constructor(
    @InjectRepository(Prompt)
    private readonly promptRepository: Repository<Prompt>,
    private readonly aiService: AiService,
    private readonly classificationService: ClassificationService,
  ) {}

  async findLatest(): Promise<Prompt> {
    const [prompt] = await this.promptRepository.find({ order: { createdAt: 'DESC' }, take: 1 })
    return prompt
  }

  async classifyMessages(): Promise<ClassifyPendingResult> {
    return await this.classificationService.classifyPendingMessages()
  }

  async upsert(request: UpsertPromptRequest): Promise<Prompt> {
    const prompt = await this.promptRepository.findOne({ where: { id: request.id } })
    if (!prompt) return await this.promptRepository.save(request)

    Object.assign(prompt, request)
    return await this.promptRepository.save(prompt)
  }

  async run(request: RunPromptRequest): Promise<Summary> {
    return await this.aiService.runPrompt(request)
  }

  async remove(id: string): Promise<Prompt> {
    const prompt = await this.promptRepository.findOne({ where: { id } })
    if (!prompt) throw new NotFoundException('Prompt not found')
    await this.promptRepository.delete({ id })
    return prompt
  }
}
