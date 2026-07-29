////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
////////////////////////////////////////////////////////////////////////////////??SERVICES
import { SummariesService } from './summary.service'
////////////////////////////////////////////////////////////////////////////////////??DTOS
import { UpsertSummaryRequest } from './dto/upsert-summary.dto'
import { SummaryResponse } from './dto/summary-response.dto'
////////////////////////////////////////////////////////////////////////////////////?GUARD
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
////////////////////////////////////////////////////////////////////////////////////////??

@Controller('summary')
export class SummariesController {
  constructor(private readonly summariesService: SummariesService) {}

  @Get('latest')
  @UseGuards(JwtAuthGuard)
  async find(): Promise<SummaryResponse> {
    const summary = await this.summariesService.find()
    return { message: 'Summary fetched', summary }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async upsert(@Body() request: UpsertSummaryRequest): Promise<SummaryResponse> {
    const summary = await this.summariesService.upsert(request)
    return { message: 'Summary saved', summary }
  }
}
