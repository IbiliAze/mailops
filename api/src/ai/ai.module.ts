////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
////////////////////////////////////////////////////////////////////////////////??SERVICES
import { AiService } from './ai.service'
import { ModelService } from './models.service'
import { ClassificationService } from './classification.service'
//////////////////////////////////////////////////////////////////////////////////?MODULES
import { MessagesModule } from 'src/messages/messages.module'
import { SummariesModule } from 'src/summaries/summary.module'
////////////////////////////////////////////////////////////////////////////////??ENTITIES
import { Message } from 'src/messages/entities/message.entity'
////////////////////////////////////////////////////////////////////////////////////////??

@Module({
  imports: [MessagesModule, SummariesModule, ConfigModule, TypeOrmModule.forFeature([Message])],
  providers: [AiService, ModelService, ClassificationService],
  exports: [AiService, ClassificationService],
})
export class AiModule {}
