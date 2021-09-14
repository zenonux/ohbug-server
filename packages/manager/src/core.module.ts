import { Module } from '@nestjs/common'

import { MessageModule } from './message/message.module'
import { EventModule } from './event/event.module'
import { IssueModule } from './issue/issue.module'
import { ScheduleModule } from './schedule/schedule.module'

@Module({
  imports: [MessageModule, EventModule, IssueModule, ScheduleModule],
})
export class CoreModule {}
