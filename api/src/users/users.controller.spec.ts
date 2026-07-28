////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Test, TestingModule } from '@nestjs/testing'
////////////////////////////////////////////////////////////////////////////////??SERVICES
import { UsersService } from './users.service'
//////////////////////////////////////////////////////////////////////////////?CONTROLLERS
import { UsersController } from './users.controller'
////////////////////////////////////////////////////////////////////////////////////////??

describe('UsersController', () => {
  let controller: UsersController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile()

    controller = module.get<UsersController>(UsersController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
