////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Summary } from './entities/summary.entity'
////////////////////////////////////////////////////////////////////////////////??SERVICES
import { SummariesService } from './summary.service'
////////////////////////////////////////////////////////////////////////////////////////??

describe('SummariesService', () => {
  let service: SummariesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SummariesService, { provide: getRepositoryToken(Summary), useValue: {} }],
    }).compile()

    service = module.get<SummariesService>(SummariesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
