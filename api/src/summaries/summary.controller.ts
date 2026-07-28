////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
////////////////////////////////////////////////////////////////////////////////??SERVICES
import { SummariesService } from './summary.service'
////////////////////////////////////////////////////////////////////////////////////??DTOS
import { CreateSummaryRequest } from './dto/create-summary.dto'
import { SummaryResponse } from './dto/summary-response.dto'
////////////////////////////////////////////////////////////////////////////////////?GUARD
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
////////////////////////////////////////////////////////////////////////////////////////??

@Controller('summary')
export class SummariesController {
  constructor(private readonly summariesService: SummariesService) {}

  @Get('latest')
  @UseGuards(JwtAuthGuard)
  async findLatest(): Promise<SummaryResponse> {
    const summary = await this.summariesService.findLatest()
    return { message: 'Summary fetched', summary }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() request: CreateSummaryRequest): Promise<SummaryResponse> {
    const summary = await this.summariesService.create(request)
    return { message: 'Summary created', summary }
  }
}
