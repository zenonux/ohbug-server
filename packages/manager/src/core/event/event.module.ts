import { Module } from '@nestjs/common';

import { ESModule } from '@/shared/database';

import { EventService } from './event.service';

@Module({
  imports: [ESModule],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
