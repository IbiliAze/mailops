////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { AppService } from './app.service'
//////////////////////////////////////////////////////////////////////////////?CONTROLLERS
import { AppController } from './app.controller'
////////////////////////////////////////////////////////////////////////////////////////??

describe('AppController', () => {
  let appController: AppController

  const appService = { getStats: jest.fn() }

  beforeEach(() => {
    appController = new AppController(appService as unknown as AppService)
  })

  describe('stats', () => {
    it('returns stats from the service', async () => {
      const response = { message: 'Stats fetched', stats: { inbox: 2, sent: 1, total: 3 } }
      appService.getStats.mockResolvedValue(response)

      await expect(appController.getStats()).resolves.toEqual(response)
    })
  })
})
