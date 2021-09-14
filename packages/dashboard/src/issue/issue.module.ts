import { Module } from '@nestjs/common'

import { MicroserviceManagerClientModule } from '@ohbug-server/common'

import { ProjectModule } from '../project/project.module'

import { IssueController } from './issue.controller'
import { IssueService } from './issue.service'

@Module({
  imports: [MicroserviceManagerClientModule, ProjectModule],
  controllers: [IssueController],
  providers: [IssueService],
  exports: [IssueService],
})
export class IssueModule {}
