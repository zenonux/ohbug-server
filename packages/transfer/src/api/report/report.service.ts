import { Injectable } from '@nestjs/common';
import type { OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import type { OhbugEvent } from '@ohbug/types';

import {
  ForbiddenException,
  TOPIC_TRANSFER_SCHEDULER_EVENT,
} from '@ohbug-server/common';
import type { OhbugEventLike } from '@ohbug-server/common';

import { formatter } from '@/utils';

@Injectable()
export class ReportService implements OnModuleInit {
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
    this.schedulerClient.subscribeToResponseOf(TOPIC_TRANSFER_SCHEDULER_EVENT);
    await this.schedulerClient.connect();
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

  /**
   * 对 event 进行预处理后传入 scheduler
   *
   * @param event 通过上报接口拿到的 event
   * @param ip_address 用户 ip
   */
  async handleEvent(event: OhbugEvent<any>, ip_address: string) {
    try {
      // producer
      const key = TOPIC_TRANSFER_SCHEDULER_EVENT;
      const value = JSON.stringify({
        event: this.transferEvent(event),
        ip_address,
      });
      await this.schedulerClient
        .send(TOPIC_TRANSFER_SCHEDULER_EVENT, {
          key,
          value,
        })
        .toPromise();
    } catch (error) {
      throw new ForbiddenException(4001000, error);
    }
  }
}
