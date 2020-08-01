import { Module } from '@nestjs/common';

import { MicroserviceManagerClientModule } from '@ohbug-server/common';
import { SourceMapModule } from '@/api/sourceMap/sourceMap.module';

import { EventController } from './event.controller';
import { EventService } from './event.service';

@Module({
  imports: [MicroserviceManagerClientModule, SourceMapModule],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
