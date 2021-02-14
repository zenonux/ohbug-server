import { forwardRef, Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'

import {
  ConfigModule,
  MicroserviceNotifierClientModule,
} from '@ohbug-server/common'

import { IssueModule } from '@/core/issue/issue.module'

import { EventService } from './event.service'
import { EventConsumer } from './event.processor'
import { Event } from './event.entity'

@Module({
  imports: [
    MicroserviceNotifierClientModule,
    BullModule.registerQueueAsync({
      name: 'document',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: configService.get('database.redis'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Event]),
    forwardRef(() => IssueModule),
  ],
  providers: [EventService, EventConsumer],
  exports: [EventService],
})
export class EventModule {}
