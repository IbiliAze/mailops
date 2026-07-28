////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Test, TestingModule } from '@nestjs/testing'
//////////////////////////////////////////////////////////////////////////////?CONTROLLERS
import { SummariesController } from './summary.controller'
////////////////////////////////////////////////////////////////////////////////////////??

describe('SummariesController', () => {
  let controller: SummariesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SummariesController],
    }).compile()

    controller = module.get<SummariesController>(SummariesController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
