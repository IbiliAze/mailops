////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { AiService } from '../ai/ai.service'
import { ClassificationService } from '../ai/classification.service'
import { Prompt } from './entities/prompt.entity'
////////////////////////////////////////////////////////////////////////////////??SERVICES
import { PromptsService } from './prompts.service'
////////////////////////////////////////////////////////////////////////////////////////??

describe('PromptsService', () => {
  let service: PromptsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromptsService,
        { provide: getRepositoryToken(Prompt), useValue: {} },
        { provide: AiService, useValue: {} },
        { provide: ClassificationService, useValue: {} },
      ],
    }).compile()

    service = module.get<PromptsService>(PromptsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
