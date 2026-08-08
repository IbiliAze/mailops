////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Account } from './entities/account.entity'
////////////////////////////////////////////////////////////////////////////////??SERVICES
import { AccountsService } from './accounts.service'
////////////////////////////////////////////////////////////////////////////////////////??

describe('AccountsService', () => {
  let service: AccountsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountsService, { provide: getRepositoryToken(Account), useValue: { find: jest.fn() } }],
    }).compile()

    service = module.get<AccountsService>(AccountsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
