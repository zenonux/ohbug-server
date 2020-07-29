import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { Transport, ClientProxyFactory } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

import { MicroserviceNotifierClientModule } from '@ohbug-server/common';

import { IssueModule } from '@/core/issue/issue.module';

import { EventService } from './event.service';
import { EventProcessor } from './event.processor';

@Module({
  imports: [
    MicroserviceNotifierClientModule,
    BullModule.registerQueue({
      name: 'document',
    }),
    IssueModule,
  ],
  providers: [
    EventService,
    EventProcessor,
    {
      provide: 'KAFKA_MANAGER_LOGSTASH_CLIENT',
      useFactory: (configService: ConfigService) => {
        const { node } = configService.get('database.logstash');
        return ClientProxyFactory.create({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'logstash',
              brokers: [node],
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
