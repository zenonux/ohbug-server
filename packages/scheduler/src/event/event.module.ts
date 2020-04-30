import { Module } from '@nestjs/common';

import { IssueModule } from '@/issue/issue.module';
import { EventService } from './event.service';

@Module({
  imports: [IssueModule],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
