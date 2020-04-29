import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';

import { ForbiddenException, KAFKA_TOPIC_LOGSTASH } from '@ohbug-server/common';

@Injectable()
export class EventService implements OnModuleInit {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'logstash',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'logstash',
      },
    },
  })
  private readonly client: ClientKafka;

  async onModuleInit() {
    const requestPatterns = [KAFKA_TOPIC_LOGSTASH];

    requestPatterns.forEach((pattern) => {
      this.client.subscribeToResponseOf(pattern);
    });

    await this.client.connect();
  }

  async passEventToLogstash(value: any) {
    try {
      // producer
      const key = `${KAFKA_TOPIC_LOGSTASH}_KEY`;
      return await this.client
        .emit(KAFKA_TOPIC_LOGSTASH, {
          key,
          value,
        })
        .toPromise();
    } catch (error) {
      throw new ForbiddenException(4001001, error);
    }
  }
}
