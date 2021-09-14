import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'
import { ConfigService } from '@nestjs/config'

import { ConfigModule } from '@ohbug-server/common'

import { ReportController } from './report.controller'
import { ReportService } from './report.service'

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: 'document',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: configService.get('database.redis'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
