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
import { ClassifiedMessage } from './dto/classified-message.dto'
////////////////////////////////////////////////////////////////////////////////////////??

const TEXT_LIMIT = 500

type ClassificationStatisticsOptions = { since?: Date; limit?: number }

type ClassificationRow = {
  id: string
  threadRootId: string | null
  messageId: string | null
  topic: NonNullable<Message['topic']>
  priority: NonNullable<Message['priority']>
  from: string
  date: Date | null
  seen: boolean
  answered: boolean
  subject: string
  text: string
}

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

  async getClassificationStatistics({ since, limit = 300 }: ClassificationStatisticsOptions = {}): Promise<ClassifiedMessage[]> {
    const query = this.messageRepository
      .createQueryBuilder('message')
      .select([
        'message.id AS id',
        'message.threadRootId AS "threadRootId"',
        'message.messageId AS "messageId"',
        'message.topic AS topic',
        'message.priority AS priority',
        'message.from AS "from"',
        'message.date AS date',
        'message.seen AS seen',
        'message.subject AS subject',
        'message.text AS text',
      ])
      .addSelect(
        `message.answered OR EXISTS (
          SELECT 1 FROM messages reply
          WHERE reply."threadRootId" = message."threadRootId"
            AND message."threadRootId" <> ''
            AND LOWER(reply.mailbox) LIKE '%sent%'
            AND reply.date > message.date
        )`,
        'answered',
      )
      .where('message.topic IS NOT NULL')
      .andWhere('message.priority IS NOT NULL')
      .andWhere('LOWER(message.mailbox) LIKE :inbox', { inbox: '%inbox%' })
      .orderBy(`CASE message.priority WHEN 'urgent' THEN 0 WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END`, 'ASC')
      .addOrderBy('message.date', 'DESC')
      .limit(limit)

    if (since) query.andWhere('message.date >= :since', { since })

    const rows = await query.getRawMany<ClassificationRow>()

    return rows.map((row) => ({
      id: row.id,
      threadId: row.threadRootId || row.messageId || row.id,
      topic: row.topic,
      priority: row.priority,
      from: row.from,
      date: row.date ?? undefined,
      seen: row.seen,
      answered: row.answered,
      subject: row.subject,
      trimmedText: row.text.trim().slice(0, TEXT_LIMIT),
    }))
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
  async updateFlags({
    accountEmail,
    mailbox,
    uid,
    seen,
    answered,
  }: {
    accountEmail: string
    mailbox: string
    uid: number
    seen: boolean
    answered: boolean
  }): Promise<void> {
    await this.messageRepository.update({ accountEmail, mailbox, uid }, { seen, answered })
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
