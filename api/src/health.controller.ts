import { Controller, Get, ServiceUnavailableException } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

@Controller('health')
export class HealthController {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  @Get()
  async check(): Promise<{ status: 'ok'; database: 'up' }> {
    try {
      await this.dataSource.query('SELECT 1')
      return { status: 'ok', database: 'up' }
    } catch {
      throw new ServiceUnavailableException({ status: 'error', database: 'down' })
    }
  }
}
