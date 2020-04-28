import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';

import { ForbiddenException, KAFKA_TOPIC_LOGSTASH } from '@ohbug-server/common';

@Injectable()
export class EventService implements OnModuleInit {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
    },
  })
  private readonly client: ClientKafka;

  onModuleInit() {
    const requestPatterns = [KAFKA_TOPIC_LOGSTASH];

    requestPatterns.forEach((pattern) => {
      this.client.subscribeToResponseOf(pattern);
    });
  }

  async passEventToES(value: any) {
    try {
      // producer
      const key = `${KAFKA_TOPIC_LOGSTASH}_KEY`;
      return await this.client
        .send(KAFKA_TOPIC_LOGSTASH, {
          key,
          value,
        })
        .toPromise();
    } catch (error) {
      throw new ForbiddenException(4001000, error);
    }
  }
}
