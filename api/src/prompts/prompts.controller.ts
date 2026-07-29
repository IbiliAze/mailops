////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common'
////////////////////////////////////////////////////////////////////////////////??SERVICES
import { PromptsService } from './prompts.service'
////////////////////////////////////////////////////////////////////////////////////??DTOS
import { UpsertPromptRequest } from './dto/upsert-prompt.dto'
import { ClassifyMessagesResponse, RunPromptRequest, RunPromptResponse } from './dto/run-prompt.dto'
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

  @Post('classify')
  @UseGuards(JwtAuthGuard)
  async classify(): Promise<ClassifyMessagesResponse> {
    const result = await this.promptsService.classifyMessages()

    const summary = `Classified ${result.classified} messages, remaining: ${result.remaining}, skipped: ${result.skipped}.`
    const failure = result.errors.length > 0 ? ` First failure: ${result.errors[0]}` : ''

    return { message: `${summary}${failure}` }
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
