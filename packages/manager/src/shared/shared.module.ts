import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { databaseModules } from './database';

@Module({
  imports: [...databaseModules, ScheduleModule.forRoot()],
})
export class SharedModule {}
