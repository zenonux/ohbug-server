import { Module } from '@nestjs/common';

import { MicroserviceManagerClientModule } from '@ohbug-server/common';

import { EventController } from './event.controller';
import { EventService } from './event.service';

@Module({
  imports: [MicroserviceManagerClientModule],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
