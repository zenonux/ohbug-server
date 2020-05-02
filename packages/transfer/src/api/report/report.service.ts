import { Injectable } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import type { OhbugEvent } from '@ohbug/types';

import {
  ForbiddenException,
  TOPIC_TRANSFER_LOGSTASH_EVENT_ERROR,
  TOPIC_TRANSFER_LOGSTASH_EVENT_FEEDBACK,
  TOPIC_TRANSFER_LOGSTASH_EVENT_MESSAGE,
  TOPIC_TRANSFER_LOGSTASH_EVENT_VIEW,
  TOPIC_TRANSFER_LOGSTASH_PERFORMANCE,
  TOPIC_TRANSFER_SCHEDULER_EVENT,
} from '@ohbug-server/common';
import type {
  OhbugEventLike,
  OhbugEventLikeWithIpAdress,
  KafkaEmitCallback,
} from '@ohbug-server/common';

import { formatter } from '@/utils';

@Injectable()
export class ReportService {
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

  /**
   * 将可能会变的字段转为 string
   * error: `detail` `state` `actions`
   * performance: `data`
   *
   * @param event
   */
  transferEvent(event: OhbugEvent<any>): OhbugEventLike {
    return formatter<OhbugEventLike>(event, [
      'detail',
      'state',
      'actions',
      'data',
    ]);
  }

  /**
   * 1. 分类后传递到 elk
   *
   * @param value
   */
  async passEventToLogstash(
    value: OhbugEventLikeWithIpAdress,
  ): Promise<KafkaEmitCallback> {
    try {
      const keyMap = [
        // event
        {
          category: 'error',
          key: TOPIC_TRANSFER_LOGSTASH_EVENT_ERROR,
        },
        { category: 'message', key: TOPIC_TRANSFER_LOGSTASH_EVENT_MESSAGE },
        { category: 'feedback', key: TOPIC_TRANSFER_LOGSTASH_EVENT_FEEDBACK },
        { category: 'view', key: TOPIC_TRANSFER_LOGSTASH_EVENT_VIEW },
        // performance
        { category: 'performance', key: TOPIC_TRANSFER_LOGSTASH_PERFORMANCE },
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
          .toPromise<KafkaEmitCallback>();
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
   * 对 event 进行预处理后通过 kafka 传递到 logstash
   * 接收到 kafka 的回调后通过 kafka 传递到 scheduler
   *
   * @param event 通过上报接口拿到的 event
   * @param ip_address 用户 ip
   */
  async handleEvent(event: OhbugEvent<any>, ip_address: string): Promise<void> {
    try {
      // producer
      const value = {
        event: this.transferEvent(event),
        ip_address,
      };
      const kafkaCallback = await this.passEventToLogstash(value);
      if (kafkaCallback && kafkaCallback.length) {
        const key = TOPIC_TRANSFER_SCHEDULER_EVENT;
        await this.schedulerClient
          .emit(TOPIC_TRANSFER_SCHEDULER_EVENT, {
            key,
            value,
          })
          .toPromise<KafkaEmitCallback>();
      }
    } catch (error) {
      throw new ForbiddenException(4001000, error);
    }
  }
}
