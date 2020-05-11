import { Injectable } from '@nestjs/common';
import type { OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import type { OhbugEvent } from '@ohbug/types';

import {
  ForbiddenException,
  TOPIC_TRANSFER_LOGSTASH_EVENT_ERROR,
  TOPIC_TRANSFER_LOGSTASH_EVENT_FEEDBACK,
  TOPIC_TRANSFER_LOGSTASH_EVENT_MESSAGE,
  TOPIC_TRANSFER_LOGSTASH_EVENT_VIEW,
  TOPIC_TRANSFER_LOGSTASH_PERFORMANCE,
  TOPIC_TRANSFER_MANAGER_EVENT,
} from '@ohbug-server/common';
import type {
  OhbugEventLike,
  OhbugEventLikeWithIpAdress,
  KafkaEmitCallback,
} from '@ohbug-server/common';

import { formatter } from '@/utils';
import dayjs from 'dayjs';

@Injectable()
export class ReportService implements OnModuleInit {
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
        clientId: 'manager',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'manager-consumer',
      },
    },
  })
  private readonly managerClient: ClientKafka;

  onModuleInit() {
    this.managerClient.subscribeToResponseOf(TOPIC_TRANSFER_MANAGER_EVENT);
  }

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

  getIndexOrKeyByEvent(event: OhbugEvent<any> | OhbugEventLike) {
    const keyMap = [
      // event
      {
        category: 'error',
        key: TOPIC_TRANSFER_LOGSTASH_EVENT_ERROR,
        index: 'ohbug-event-error',
      },
      {
        category: 'message',
        key: TOPIC_TRANSFER_LOGSTASH_EVENT_MESSAGE,
        index: 'ohbug-event-message',
      },
      {
        category: 'feedback',
        key: TOPIC_TRANSFER_LOGSTASH_EVENT_FEEDBACK,
        index: 'ohbug-event-feedback',
      },
      {
        category: 'view',
        key: TOPIC_TRANSFER_LOGSTASH_EVENT_VIEW,
        index: 'ohbug-event-view',
      },
      // performance
      {
        category: 'performance',
        key: TOPIC_TRANSFER_LOGSTASH_PERFORMANCE,
        index: 'ohbug-performance',
      },
    ];
    const { category, key, index } = keyMap.find(
      (item) => item.category === event?.category,
    );
    return {
      category,
      key,
      index: `${index}-${dayjs().format('YYYY.MM.DD')}`,
    };
  }

  /**
   * 1. 分类后传递到 elk
   *
   * @param value
   */
  async passEventToLogstash(
    key: string,
    value: OhbugEventLikeWithIpAdress,
  ): Promise<KafkaEmitCallback> {
    try {
      return await this.logstashClient
        .emit(key, {
          key,
          value,
        })
        .toPromise<KafkaEmitCallback>();
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
   *
   * @param event 通过上报接口拿到的 event
   * @param ip_address 用户 ip
   */
  async handleEvent(event: OhbugEvent<any>, ip_address: string): Promise<void> {
    try {
      const { key, index } = this.getIndexOrKeyByEvent(event);
      const [
        { topicName, partition, baseOffset },
      ] = await this.passEventToLogstash(key, {
        event: this.transferEvent(event),
        ip_address,
      });

      if (topicName && partition !== undefined && baseOffset) {
        const document_id = `${topicName}-${partition}-${baseOffset}`;
        const value = {
          document_id,
          index,
        };
        await this.managerClient
          .send(TOPIC_TRANSFER_MANAGER_EVENT, {
            key: TOPIC_TRANSFER_MANAGER_EVENT,
            value,
          })
          .toPromise();
      }
    } catch (error) {
      throw new ForbiddenException(4001000, error);
    }
  }
}
