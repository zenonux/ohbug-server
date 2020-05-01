import { Injectable } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';

import {
  ForbiddenException,
  TOPIC_SCHEDULER_LOGSTASH_EVENT_ERROR,
  TOPIC_SCHEDULER_LOGSTASH_EVENT_MESSAGE,
  TOPIC_SCHEDULER_LOGSTASH_EVENT_FEEDBACK,
  TOPIC_SCHEDULER_LOGSTASH_EVENT_VIEW,
  TOPIC_SCHEDULER_LOGSTASH_PERFORMANCE,
} from '@ohbug-server/common';
import type { OhbugEventLikeWithIpAdress } from '@ohbug-server/common';
import { IssueService } from '@/issue/issue.service';

@Injectable()
export class EventService {
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

  /**
   * 1. 分类后传递到 elk
   *
   * @param value
   */
  async passToLogstash(value: OhbugEventLikeWithIpAdress) {
    try {
      const keyMap = [
        // event
        {
          category: 'error',
          key: TOPIC_SCHEDULER_LOGSTASH_EVENT_ERROR,
        },
        { category: 'message', key: TOPIC_SCHEDULER_LOGSTASH_EVENT_MESSAGE },
        { category: 'feedback', key: TOPIC_SCHEDULER_LOGSTASH_EVENT_FEEDBACK },
        { category: 'view', key: TOPIC_SCHEDULER_LOGSTASH_EVENT_VIEW },
        // performance
        { category: 'performance', key: TOPIC_SCHEDULER_LOGSTASH_PERFORMANCE },
      ];
      const key = keyMap.find(
        (item) => item.category === value?.event?.category,
      )?.key;
      if (key) {
        return await this.logstashClient
          .emit(key, {
            key,
            value,
          })
          .toPromise();
      }
      throw new Error(
        `传入 logstash 失败，请确认 category 是否为指定内容: 'error', 'message', 'feedback', 'view', 'performance'
        ${JSON.stringify(value)}
        `,
      );
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
    await this.passToLogstash(value);
    if (value.event.category === 'error') {
      await this.passEventToScheduler(value);
    }
  }
}
