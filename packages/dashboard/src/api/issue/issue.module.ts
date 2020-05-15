import { Module } from '@nestjs/common';

import { DashboardKafkaModule } from '@ohbug-server/common';

import { ProjectModule } from '@/api/project/project.module';

import { IssueController } from './issue.controller';
import { IssueService } from './issue.service';

@Module({
  imports: [DashboardKafkaModule, ProjectModule],
  controllers: [IssueController],
  providers: [IssueService],
  exports: [IssueService],
})
export class IssueModule {}
