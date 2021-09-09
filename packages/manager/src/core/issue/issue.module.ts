import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { EventModule } from '../event/event.module'
import { Issue } from './issue.entity'
import { IssueService } from './issue.service'

@Module({
  imports: [TypeOrmModule.forFeature([Issue]), forwardRef(() => EventModule)],
  providers: [IssueService],
  exports: [IssueService],
})
export class IssueModule {}
