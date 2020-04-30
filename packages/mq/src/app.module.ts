import { Module } from '@nestjs/common';

import { MessageModule } from './message/message.module';
import { EventModule } from './event/event.module';

@Module({
  imports: [MessageModule, EventModule],
})
export class AppModule {}
