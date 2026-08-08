import { ServiceUnavailableException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getDataSourceToken } from '@nestjs/typeorm'
import { HealthController } from './health.controller'

describe('HealthController', () => {
  const dataSource = { query: jest.fn() }
  let controller: HealthController

  beforeEach(async () => {
    dataSource.query.mockReset()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: getDataSourceToken(), useValue: dataSource }],
    }).compile()

    controller = module.get(HealthController)
  })

  it('reports a live database', async () => {
    dataSource.query.mockResolvedValue([{ '?column?': 1 }])

    await expect(controller.check()).resolves.toEqual({ status: 'ok', database: 'up' })
  })

  it('fails health checks when the database is unavailable', async () => {
    dataSource.query.mockRejectedValue(new Error('connection refused'))

    await expect(controller.check()).rejects.toBeInstanceOf(ServiceUnavailableException)
  })
})
