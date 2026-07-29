////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
////////////////////////////////////////////////////////////////////////////////??ENTITIES
import { Summary, SUMMARY_ID } from './entities/summary.entity'
////////////////////////////////////////////////////////////////////////////////////??DTOS
import { UpsertSummaryRequest } from './dto/upsert-summary.dto'
////////////////////////////////////////////////////////////////////////////////////////??

@Injectable()
export class SummariesService {
  constructor(
    @InjectRepository(Summary)
    private readonly summaryRepository: Repository<Summary>,
  ) {}

  async upsert(request: UpsertSummaryRequest): Promise<Summary> {
    await this.summaryRepository.upsert({ ...request, id: SUMMARY_ID, generatedAt: new Date() }, ['id'])

    return await this.summaryRepository.findOneOrFail({ where: { id: SUMMARY_ID } })
  }

  async find(): Promise<Summary | null> {
    return await this.summaryRepository.findOne({ where: { id: SUMMARY_ID } })
  }
}
