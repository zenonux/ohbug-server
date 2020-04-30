import { Injectable } from '@nestjs/common';
import type { OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';

import {
  ForbiddenException,
  TOPIC_KAFKA_LOGSTASH_EVENT,
  TOPIC_KAFKA_SCHEDULER_ISSUE,
} from '@ohbug-server/common';
import type { OhbugEventLikeWithIpAdress } from '@ohbug-server/common';

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
  private readonly logstashClient: ClientKafka;
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'scheduler',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'scheduler-consumer',
      },
    },
  })
  private readonly schedulerClient: ClientKafka;

  async onModuleInit() {
    this.logstashClient.subscribeToResponseOf(TOPIC_KAFKA_LOGSTASH_EVENT);
    await this.logstashClient.connect();

    this.schedulerClient.subscribeToResponseOf(TOPIC_KAFKA_SCHEDULER_ISSUE);
    await this.schedulerClient.connect();
  }

  /**
   * 1. event 传递给 logstash 存入 elasticsearch
   *
   * @param value
   */
  async passEventToLogstash(value: OhbugEventLikeWithIpAdress) {
    try {
      return await this.logstashClient
        .emit(TOPIC_KAFKA_LOGSTASH_EVENT, {
          key: `${TOPIC_KAFKA_LOGSTASH_EVENT}_KEY`,
          value,
        })
        .toPromise();
    } catch (error) {
      throw new ForbiddenException(4001001, error);
    }
  }

  /**
   * 2. 发 event 给 scheduler，进行聚合任务生成 issue (只有 category 为 error 时执行此任务)
   *
   * @param value
   */
  async passEventToScheduler(value: OhbugEventLikeWithIpAdress) {
    try {
      return await this.schedulerClient
        .emit(TOPIC_KAFKA_SCHEDULER_ISSUE, {
          key: `${TOPIC_KAFKA_SCHEDULER_ISSUE}_KEY`,
          value,
        })
        .toPromise();
    } catch (error) {
      throw new ForbiddenException(4001002, error);
    }
  }

  /**
   * 接收到 event 并传递到 es 存储
   * 若 category 为 error，es 返回存储成功的消息后传消息给 controller，进行聚合
   *
   * @param value
   */
  async handleEvent(value: OhbugEventLikeWithIpAdress) {
    await this.passEventToLogstash(value);
    if (value.event.category === 'error') {
      await this.passEventToScheduler(value);
    }
  }
}
