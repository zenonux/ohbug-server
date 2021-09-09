import { Module } from '@nestjs/common'

import { EventModule } from '../event/event.module'
import { IssueModule } from '../issue/issue.module'

import { MessageController } from './message.controller'

@Module({
  imports: [EventModule, IssueModule],
  controllers: [MessageController],
})
export class MessageModule {}
