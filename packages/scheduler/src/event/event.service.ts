import { Injectable } from '@nestjs/common';
import type { OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';

import {
  ForbiddenException,
  TOPIC_SCHEDULER_LOGSTASH_EVENT,
} from '@ohbug-server/common';
import type { OhbugEventLikeWithIpAdress } from '@ohbug-server/common';
import { IssueService } from '@/issue/issue.service';

@Injectable()
export class EventService implements OnModuleInit {
  constructor(private readonly issueService: IssueService) {}

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

  async onModuleInit() {
    this.logstashClient.subscribeToResponseOf(TOPIC_SCHEDULER_LOGSTASH_EVENT);
    await this.logstashClient.connect();
  }

  /**
   * 1. 接收到 event 并传递到 elk
   *
   * @param value
   */
  async passEventToLogstash(value: OhbugEventLikeWithIpAdress) {
    try {
      return await this.logstashClient
        .emit(TOPIC_SCHEDULER_LOGSTASH_EVENT, {
          key: `${TOPIC_SCHEDULER_LOGSTASH_EVENT}_KEY`,
          value,
        })
        .toPromise();
    } catch (error) {
      throw new ForbiddenException(4001001, error);
    }
  }

  /**
   * 2. 同时若 category 为 error，准备进行聚合任务
   *
   * @param value
   */
  async passEventToScheduler(value: OhbugEventLikeWithIpAdress) {
    const hash = this.issueService.eventAggregation(value);
    console.log('scheduler', hash);
  }

  /**
   * 接收到 event 并传递到 elk
   * 同时若 category 为 error，准备进行聚合任务
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
