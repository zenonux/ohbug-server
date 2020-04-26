import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectModule } from '@/api/project/project.module';
import { EventModule } from '@/api/event/event.module';
import { ReplayModule } from '@/api/replay/replay.module';
import { SourceMapModule } from '@/api/sourceMap/sourceMap.module';

import { Issue } from './issue.entity';
import { IssueController } from './issue.controller';
import { IssueService } from './issue.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Issue]),
    forwardRef(() => EventModule),
    ReplayModule,
    ProjectModule,
    SourceMapModule,
  ],
  controllers: [IssueController],
  providers: [IssueService],
  exports: [IssueService],
})
export class IssueModule {}
