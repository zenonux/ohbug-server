import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'

import { OrmModule, LoggerModule } from '@ohbug-server/common'

@Module({
  imports: [OrmModule, LoggerModule, ScheduleModule.forRoot()],
})
export class SharedModule {}
