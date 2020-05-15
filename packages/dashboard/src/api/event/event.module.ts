import { Module } from '@nestjs/common';

import { DashboardKafkaModule } from '@ohbug-server/common';

import { EventController } from './event.controller';
import { EventService } from './event.service';

@Module({
  imports: [DashboardKafkaModule],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
