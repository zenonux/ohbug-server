import { Module } from '@nestjs/common';

import { MicroserviceClientModule } from '@ohbug-server/common';

import { EventController } from './event.controller';
import { EventService } from './event.service';

@Module({
  imports: [MicroserviceClientModule],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
