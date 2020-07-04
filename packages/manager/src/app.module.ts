import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [ScheduleModule.forRoot(), CoreModule, SharedModule],
  exports: [CoreModule],
})
export class AppModule {}
