import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ESModule } from '@/shared/database';

import { Issue } from './issue.entity';
import { IssueService } from './issue.service';

@Module({
  imports: [TypeOrmModule.forFeature([Issue]), ESModule],
  providers: [IssueService],
  exports: [IssueService],
})
export class IssueModule {}
