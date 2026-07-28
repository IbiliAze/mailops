////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Controller, Get, Post, Body, Param, Delete, Query, Put, UseGuards } from '@nestjs/common'
////////////////////////////////////////////////////////////////////////////////??SERVICES
import { MessagesService } from './messages.service'
////////////////////////////////////////////////////////////////////////////////////??DTOS
import { CreateMessageRequest } from './dto/create-message.dto'
import { UpdateMessageRequest } from './dto/update-message.dto'
import { MessageFilters } from './dto/message-filters.dto'
import { MessageResponse, MessagesResponse, SubjectsResponse } from './dto/message-response.dto'
////////////////////////////////////////////////////////////////////////////////////?GUARD
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
////////////////////////////////////////////////////////////////////////////////////////??

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Query() filters: MessageFilters): Promise<MessagesResponse> {
    const { limit, messages, page, total } = await this.messagesService.findAll(filters)
    return { limit, messages, page, total, message: 'Messages fetched successfully' }
  }

  @Get('subjects')
  @UseGuards(JwtAuthGuard)
  async findSubjects(@Query() filters: MessageFilters): Promise<SubjectsResponse> {
    const subjects = await this.messagesService.findSubjects(filters)
    return { subjects, message: 'Subjects fetched' }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string): Promise<MessageResponse> {
    const message = await this.messagesService.findById(id)
    return { emailMessage: message, message: 'Message fetched' }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() request: CreateMessageRequest): Promise<MessageResponse> {
    const message = await this.messagesService.create(request)
    return { emailMessage: message, message: 'Message created' }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() request: UpdateMessageRequest): Promise<MessageResponse> {
    const message = await this.messagesService.update(id, request)
    return { emailMessage: message, message: 'Message updated' }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string): Promise<MessageResponse> {
    const message = await this.messagesService.remove(id)
    return { emailMessage: message, message: 'Message deleted' }
  }
}
