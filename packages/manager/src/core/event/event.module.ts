import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { MicroserviceNotifierClientModule } from '@ohbug-server/common';

import { IssueModule } from '@/core/issue/issue.module';

import { EventService } from './event.service';
import { EventProcessor } from './event.processor';

@Module({
  imports: [
    MicroserviceNotifierClientModule,
    ClientsModule.register([
      {
        name: 'KAFKA_MANAGER_LOGSTASH_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'logstash',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'logstash-consumer',
          },
        },
      },
    ]),
    BullModule.registerQueue({
      name: 'document',
    }),
    IssueModule,
  ],
  providers: [EventService, EventProcessor],
  exports: [EventService],
})
export class EventModule {}
