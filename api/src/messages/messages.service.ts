////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Injectable, NotFoundException } from '@nestjs/common'
import { FindOptionsOrder, FindOptionsWhere, MoreThanOrEqual, Raw, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
////////////////////////////////////////////////////////////////////////////////??ENTITIES
import { Message } from './entities/message.entity'
////////////////////////////////////////////////////////////////////////////////////??DTOS
import { CreateMessageRequest } from './dto/create-message.dto'
import { UpdateMessageRequest } from './dto/update-message.dto'
import { MessageFilters } from './dto/message-filters.dto'
import { MESSAGE_SORT_FIELDS, type MessageSortField } from './dto/sort.dto'
////////////////////////////////////////////////////////////////////////////////////////??

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async findAll(filters: MessageFilters): Promise<{ messages: Message[]; total: number; page: number; limit: number }> {
    const where: FindOptionsWhere<Message> = {}

    if (filters.subject) where.subject = filters.subject
    if (filters.accountEmail) where.accountEmail = filters.accountEmail
    if (filters.dateFrom) where.date = MoreThanOrEqual(filters.dateFrom)

    const order: FindOptionsOrder<Pick<Message, MessageSortField>> = {}

    if (filters.sortBy) {
      const [field, dir] = filters.sortBy.split(':')

      if (MESSAGE_SORT_FIELDS.includes(field as MessageSortField)) {
        order[field as MessageSortField] = dir?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'
      }
    }

    const page = filters.page ?? 1
    const limit = filters.limit ?? 50
    const skip = (page - 1) * limit
    const [messages, total] = await this.messageRepository.findAndCount({ where, order, take: limit, skip })

    return { messages, total, page, limit }
  }

  async findById(id: string): Promise<Message> {
    const message = await this.messageRepository.findOne({ where: { id } })
    if (!message) throw new NotFoundException('Message not found')
    return message
  }

  async findSubjects(filters: MessageFilters): Promise<string[]> {
    const where: FindOptionsWhere<Message> = {}

    if (filters.accountEmail) where.accountEmail = filters.accountEmail

    const messages = await this.messageRepository.find({ where, order: { date: 'DESC' } })
    return [...new Set(messages.map((m) => m.subject?.trim()).filter(Boolean))]
  }

  async exists(filters: MessageFilters): Promise<boolean> {
    const where: FindOptionsWhere<Message> = {}

    if (filters.accountEmail) where.accountEmail = filters.accountEmail
    if (filters.uid) where.uid = filters.uid
    if (filters.mailbox) where.mailbox = filters.mailbox

    return await this.messageRepository.exists({ where })
  }

  async countAllSince({ since, mailbox }: { since: Date; mailbox?: string }): Promise<number> {
    const where: FindOptionsWhere<Message> = { date: MoreThanOrEqual(since) }

    if (mailbox) {
      where.mailbox = Raw((alias) => `LOWER(${alias}) LIKE LOWER(:mailbox)`, { mailbox: `%${mailbox}%` })
    }

    return await this.messageRepository.count({ where })
  }
  async create(request: CreateMessageRequest): Promise<Message> {
    return await this.messageRepository.save(request)
  }

  async update(id: string, request: UpdateMessageRequest): Promise<Message> {
    const message = await this.messageRepository.findOne({ where: { id } })
    if (!message) throw new NotFoundException('Message not found')
    Object.assign(message, request)
    return await this.messageRepository.save(message)
  }

  async remove(id: string): Promise<Message> {
    const message = await this.messageRepository.findOne({ where: { id } })
    if (!message) throw new NotFoundException('Message not found')
    await this.messageRepository.delete({ id })
    return message
  }
}
