import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';

import {
  ForbiddenException,
  TOPIC_KAFKA_LOGSTASH_EVENT,
  TOPIC_KAFKA_SCHEDULER_ISSUE,
} from '@ohbug-server/common';

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
    const requestPatterns = [
      TOPIC_KAFKA_LOGSTASH_EVENT,
      TOPIC_KAFKA_SCHEDULER_ISSUE,
    ];

    requestPatterns.forEach((pattern) => {
      this.client.subscribeToResponseOf(pattern);
    });

    await this.client.connect();
  }

  async passEventToLogstash(value: any) {
    try {
      // 1. event 传递给 logstash 存入 elasticsearch
      await this.client
        .emit(TOPIC_KAFKA_LOGSTASH_EVENT, {
          key: `${TOPIC_KAFKA_LOGSTASH_EVENT}_KEY`,
          value,
        })
        .toPromise();
      // 2. 发 event 给 scheduler，进行聚合任务生成 issue
      await this.client
        .emit(TOPIC_KAFKA_SCHEDULER_ISSUE, {
          key: `${TOPIC_KAFKA_SCHEDULER_ISSUE}_KEY`,
          value,
        })
        .toPromise();
    } catch (error) {
      throw new ForbiddenException(4001001, error);
    }
  }
}
