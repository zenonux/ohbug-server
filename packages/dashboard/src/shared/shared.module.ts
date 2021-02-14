import { Module } from '@nestjs/common'

import { ConfigModule } from '@ohbug-server/common'

import { DatabaseModule } from './database/database.module'
import { LoggerModule } from './logger/logger.module'

@Module({
  imports: [ConfigModule, DatabaseModule, LoggerModule],
})
export class SharedModule {}
