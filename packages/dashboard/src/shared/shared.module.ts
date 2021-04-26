import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'

import { ConfigModule } from '@ohbug-server/common'

import { DatabaseModule } from './database/database.module'
import { LoggerModule } from './logger/logger.module'

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    LoggerModule,
    ScheduleModule.forRoot(),
  ],
})
export class SharedModule {}
