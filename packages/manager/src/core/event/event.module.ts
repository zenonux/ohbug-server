import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { ESModule } from '@/shared/database';
import { IssueModule } from '@/core/issue/issue.module';

import { EventService } from './event.service';
import { EventProcessor } from './event.processor';

@Module({
  imports: [
    ESModule,
    BullModule.registerQueue({
      name: 'document',
    }),
    IssueModule,
  ],
  providers: [EventService, EventProcessor],
  exports: [EventService],
})
export class EventModule {}
