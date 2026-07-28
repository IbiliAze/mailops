////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common'
////////////////////////////////////////////////////////////////////////////////??SERVICES
import { PromptsService } from './prompts.service'
////////////////////////////////////////////////////////////////////////////////////??DTOS
import { UpsertPromptRequest } from './dto/upsert-prompt.dto'
import { RunPromptRequest, RunPromptResponse } from './dto/run-prompt.dto'
import { PromptResponse } from './dto/prompt-response.dto'
////////////////////////////////////////////////////////////////////////////////////?GUARD
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
////////////////////////////////////////////////////////////////////////////////////////??

@Controller('prompt')
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findById(): Promise<PromptResponse> {
    const prompt = await this.promptsService.findLatest()
    return { message: 'Prompt fetched', prompt }
  }

  @Post('run')
  @UseGuards(JwtAuthGuard)
  async run(@Body() request: RunPromptRequest): Promise<RunPromptResponse> {
    const summary = await this.promptsService.run(request)
    return { summary }
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async update(@Body() request: UpsertPromptRequest): Promise<PromptResponse> {
    const prompt = await this.promptsService.upsert(request)
    return { message: 'Prompt saved', prompt }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string): Promise<PromptResponse> {
    const prompt = await this.promptsService.remove(id)
    return { message: 'Prompt deleted', prompt }
  }
}
