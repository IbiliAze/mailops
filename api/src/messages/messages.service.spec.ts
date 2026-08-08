////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Message } from './entities/message.entity'
////////////////////////////////////////////////////////////////////////////////??SERVICES
import { MessagesService } from './messages.service'
////////////////////////////////////////////////////////////////////////////////////////??

describe('MessagesService', () => {
  let service: MessagesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessagesService, { provide: getRepositoryToken(Message), useValue: {} }],
    }).compile()

    service = module.get<MessagesService>(MessagesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
