////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Injectable } from '@nestjs/common'
////////////////////////////////////////////////////////////////////////////////??SERVICES
import { MessagesService } from './messages/messages.service'
////////////////////////////////////////////////////////////////////////////////////??DTOS
import { StatsResponse } from './common/dto/stats-response.dto'
////////////////////////////////////////////////////////////////////////////////////////??

@Injectable()
export class AppService {
  constructor(private readonly messagesService: MessagesService) {}

  async getStats(): Promise<StatsResponse> {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    const total = await this.messagesService.countAllSince({ since })
    const inbox = await this.messagesService.countAllSince({ since, mailbox: 'INBOX' })
    const sent = total - inbox

    return { message: 'Stats fetched', stats: { inbox, sent, total } }
  }
}
