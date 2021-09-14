import { Module } from '@nestjs/common'

import { EventModule } from '../event/event.module'
import { IssueModule } from '../issue/issue.module'

import { ScheduleService } from './schedule.service'

@Module({
  imports: [EventModule, IssueModule],
  providers: [ScheduleService],
  exports: [ScheduleService],
})
export class ScheduleModule {}
