import { Module } from '@nestjs/common';

import { ProjectModule } from '@/api/project/project.module';

import { IssueController } from './issue.controller';
import { IssueService } from './issue.service';

@Module({
  imports: [ProjectModule],
  controllers: [IssueController],
  providers: [IssueService],
  exports: [IssueService],
})
export class IssueModule {}
