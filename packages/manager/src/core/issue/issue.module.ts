import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Issue } from '@ohbug-server/common'

import { EventModule } from '../event/event.module'
import { IssueService } from './issue.service'

@Module({
  imports: [TypeOrmModule.forFeature([Issue]), forwardRef(() => EventModule)],
  providers: [IssueService],
  exports: [IssueService],
})
export class IssueModule {}
