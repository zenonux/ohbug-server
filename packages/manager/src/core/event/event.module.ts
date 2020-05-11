import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { ESModule } from '@/shared/database';

import { EventService } from './event.service';
import { EventProcessor } from './event.processor';

@Module({
  imports: [
    ESModule,
    BullModule.registerQueue({
      name: 'document',
    }),
  ],
  providers: [EventService, EventProcessor],
  exports: [EventService],
})
export class EventModule {}
