import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { Transport, ClientProxyFactory } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

import {
  ConfigModule,
  MicroserviceNotifierClientModule,
} from '@ohbug-server/common';

import { IssueModule } from '@/core/issue/issue.module';

import { EventService } from './event.service';
import { EventConsumer } from './event.processor';

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
    IssueModule,
  ],
  providers: [
    EventService,
    EventConsumer,
    {
      provide: 'KAFKA_MANAGER_LOGSTASH_CLIENT',
      useFactory: (configService: ConfigService) => {
        const { nodes } = configService.get('database.kafka');
        return ClientProxyFactory.create({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'logstash',
              brokers: nodes,
            },
            consumer: {
              groupId: 'logstash-consumer',
            },
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [EventService],
})
export class EventModule {}
